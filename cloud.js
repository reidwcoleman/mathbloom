/* ============================================================
   MathBloom — cloud saves on Firebase ("garden codes")
   Backed by the famsync-62653 Realtime Database (anonymous auth).
   Local-first: localStorage stays the source of truth on-device;
   the cloud copy lets one garden follow you anywhere in the world,
   and a live listener keeps every linked device in sync in real time.

   The garden code (e.g. "fern-tulip-482") is the per-garden secret.
   Data lives at  mathbloom_gardens/{code}  and holds BOTH the lesson
   garden (progress) and the "before next session" recap progress.

   RTDB rule (DEPLOYED 2026-06-22): mathbloom_gardens/$code allows
   read+write for authenticated (anonymous) users, living alongside
   cham_rooms (Hue & Seek). If cloud writes ever fail with "permission
   denied," confirm that rule still exists in
   famsync-62653 → Realtime Database → Rules. If the cloud is unreachable
   for any reason, MathBloom just stays local — nothing is lost.
   ============================================================ */

const CLOUD_PATH = "mathbloom_gardens";
const SYNC_KEY = "mathbloom-sync-code";

const CODE_WORDS = [
  "fern", "tulip", "daisy", "clover", "maple", "willow", "poppy", "petal",
  "moss", "brook", "acorn", "robin", "sunny", "meadow", "berry", "cedar",
  "lily", "rose", "sage", "hazel", "birch", "bloom", "sprout", "pebble",
  "honey", "apple", "peach", "plum", "olive", "ivy", "basil", "mint",
  "dewy", "leafy", "seed", "twig", "root", "vine", "garden", "sunbeam"
];

let syncCode = localStorage.getItem(SYNC_KEY) || null;
let syncStatus = syncCode ? "idle" : "off"; // off | idle | syncing | synced | error
let pushTimer = null;

// ---------- Firebase plumbing ----------
let _db = null, _authReady = null, _liveRef = null;

function initFirebase() {
  if (_authReady) return _authReady;
  if (typeof firebase === "undefined" || !window.FIREBASE_CONFIG) {
    _authReady = Promise.reject(new Error("firebase-unavailable"));
    return _authReady;
  }
  try {
    if (!firebase.apps || !firebase.apps.length) firebase.initializeApp(window.FIREBASE_CONFIG);
    _db = firebase.database();
    _authReady = firebase.auth().signInAnonymously().then(() => true);
  } catch (e) {
    _authReady = Promise.reject(e);
  }
  return _authReady;
}

function gardenRef(code) { return _db.ref(`${CLOUD_PATH}/${code}`); }

function genGardenCode() {
  const w = () => CODE_WORDS[Math.floor(Math.random() * CODE_WORDS.length)];
  let a = w(), b = w();
  while (b === a) b = w();
  return `${a}-${b}-${100 + Math.floor(Math.random() * 900)}`;
}

// ---------- the full garden = lesson progress + recap progress ----------
function gatherState() {
  return {
    progress: progress,
    review: (typeof window.reviewExport === "function") ? window.reviewExport() : {}
  };
}

// merge a remote garden into ours — progress can only ever grow
function mergeProgress(a, b) {
  const out = defaultProgress();
  const ids = new Set([...Object.keys(a.lessons || {}), ...Object.keys(b.lessons || {})]);
  for (const id of ids) {
    const la = (a.lessons || {})[id] || {}, lb = (b.lessons || {})[id] || {};
    out.lessons[id] = {
      stars: Math.max(la.stars || 0, lb.stars || 0),
      learned: !!(la.learned || lb.learned),
      attempts: Math.max(la.attempts || 0, lb.attempts || 0),
      correct: Math.max(la.correct || 0, lb.correct || 0),
      learnPage: Math.max(la.learnPage || 0, lb.learnPage || 0)
    };
    if (out.lessons[id].learned) out.lessons[id].learnPage = 0;
  }
  out.totals = {
    answered: Math.max((a.totals || {}).answered || 0, (b.totals || {}).answered || 0),
    correct: Math.max((a.totals || {}).correct || 0, (b.totals || {}).correct || 0)
  };
  out.bestStreak = Math.max(a.bestStreak || 0, b.bestStreak || 0);
  out.lastLesson = a.lastLesson || b.lastLesson || null;
  return out;
}

// apply a remote garden locally; returns true if anything actually changed
function applyRemote(remote) {
  if (!remote) return false;
  let changed = false;
  const mergedP = mergeProgress(progress, remote.progress || defaultProgress());
  if (JSON.stringify(mergedP) !== JSON.stringify(progress)) { progress = mergedP; changed = true; }
  if (remote.review && typeof window.reviewImport === "function") {
    if (window.reviewImport(remote.review)) changed = true;
  }
  return changed;
}

async function cloudFetch(code) {
  await initFirebase();
  const snap = await gardenRef(code).once("value");
  return snap.val();
}
async function cloudPush(code) {
  await initFirebase();
  await gardenRef(code).set({
    ...gatherState(),
    updated_at: firebase.database.ServerValue.TIMESTAMP
  });
}

// ---------- live, real-time sync across every linked device ----------
function attachLive(code) {
  if (!_db || !code) return;
  detachLive();
  _liveRef = gardenRef(code);
  _liveRef.on("value", snap => {
    const changed = applyRemote(snap.val());
    if (changed) {
      _localSave();
      // only redraw if the garden home is what's on screen (don't yank a
      // student out of a lesson mid-thought)
      if (document.querySelector(".review-home") && typeof renderHome === "function") renderHome();
    }
  }, () => setSyncStatus("error"));
}
function detachLive() {
  if (_liveRef) { try { _liveRef.off(); } catch (e) {} _liveRef = null; }
}

function setSyncStatus(s) {
  syncStatus = s;
  const btn = document.getElementById("syncBtn");
  if (btn) {
    btn.textContent = s === "off" ? "☁️" : s === "syncing" ? "⏳" : s === "error" ? "☁️" : "☁️✓";
    btn.title = s === "off" ? "Cloud save — set up a garden code"
      : s === "syncing" ? "Saving to the cloud…"
      : s === "error" ? "Cloud save: will retry — your progress is safe on this device"
      : `Cloud save on (${syncCode})`;
  }
  const stat = document.getElementById("syncStatusLine");
  if (stat) stat.textContent = s === "syncing" ? "Saving to the cloud…"
    : s === "synced" ? "✓ Saved to the cloud — synced everywhere"
    : s === "error" ? "Couldn't reach the cloud — will retry automatically. Everything is still saved on this device."
    : "Cloud save is on. Your garden syncs across your devices automatically.";
}

function scheduleCloudPush() {
  if (!syncCode) return;
  clearTimeout(pushTimer);
  setSyncStatus("syncing");
  pushTimer = setTimeout(async () => {
    try {
      await cloudPush(syncCode);
      setSyncStatus("synced");
    } catch (e) {
      console.warn("cloud push failed", e);
      setSyncStatus("error");
    }
  }, 1200);
}
// let review.js trigger a push when recap progress changes
window.scheduleCloudPush = scheduleCloudPush;

// hook into the app's save — every local save also schedules a cloud save
const _localSave = saveProgress;
saveProgress = function () {
  _localSave();
  scheduleCloudPush();
};

// ---------- sync panel UI ----------
const syncOverlay = document.getElementById("syncOverlay");
const syncBody = document.getElementById("syncBody");

function renderSyncPanel() {
  if (!syncCode) {
    syncBody.innerHTML = `
      <p class="calm-sub" style="margin-top:0">Right now your garden lives in this browser only. A <strong>garden code</strong> saves it to the cloud, so it's the same on your phone, a school computer — anywhere in the world.</p>
      <div class="sync-block">
        <button class="btn btn-primary" id="makeCode">🌱 Create my garden code</button>
        <p class="sync-note">No email, no password, nothing to sign up for.</p>
      </div>
      <div class="sync-divider"><span>or</span></div>
      <div class="sync-block">
        <p class="sync-label">Already have a code from another device?</p>
        <div class="answer-row" style="justify-content:center">
          <input class="answer-input sync-input" id="codeInput" placeholder="fern-tulip-482" autocomplete="off" autocapitalize="none">
        </div>
        <button class="btn btn-soft" id="loadCode" style="margin-top:10px">Load my garden</button>
        <p class="sync-note" id="loadMsg"></p>
      </div>`;
    syncBody.querySelector("#makeCode").addEventListener("click", createGarden);
    syncBody.querySelector("#loadCode").addEventListener("click", loadGarden);
    syncBody.querySelector("#codeInput").addEventListener("keydown", e => { if (e.key === "Enter") loadGarden(); });
  } else {
    syncBody.innerHTML = `
      <p class="calm-sub" style="margin-top:0">This is your garden code. Type it into MathBloom on any device and your whole garden — blooms, petals, recap progress, everything — appears there too, live.</p>
      <div class="sync-code" id="syncCodeBox">${syncCode}</div>
      <p class="sync-note" id="syncStatusLine"></p>
      <div class="q-actions" style="justify-content:center">
        <button class="btn btn-primary" id="copyCode">Copy my code</button>
        <button class="btn btn-ghost" id="unlink">Stop cloud save on this device</button>
      </div>
      <p class="sync-note">Tip: write it somewhere safe, like the inside of a notebook. 📓</p>`;
    setSyncStatus(syncStatus === "off" ? "idle" : syncStatus);
    syncBody.querySelector("#copyCode").addEventListener("click", async () => {
      try { await navigator.clipboard.writeText(syncCode); toast("Code copied ✓"); }
      catch { toast("Select and copy the code above"); }
    });
    syncBody.querySelector("#unlink").addEventListener("click", () => {
      detachLive();
      syncCode = null;
      localStorage.removeItem(SYNC_KEY);
      setSyncStatus("off");
      renderSyncPanel();
      toast("Cloud save off — progress stays on this device");
    });
  }
}

function cloudErrorNote(e) {
  return (e && /permission/i.test(String(e.message || e)))
    ? "Cloud save isn't switched on for MathBloom yet (the database needs a one-time rule). Your progress is safe on this device."
    : "Hmm, couldn't reach the cloud — check the internet and try again. Your progress is safe on this device either way.";
}

async function createGarden() {
  const btn = syncBody.querySelector("#makeCode");
  btn.disabled = true;
  btn.textContent = "Planting your code…";
  try {
    let code = genGardenCode();
    // avoid the (rare) case the code is taken
    for (let i = 0; i < 3 && (await cloudFetch(code)); i++) code = genGardenCode();
    syncCode = code;
    await cloudPush(code);
    localStorage.setItem(SYNC_KEY, code);
    setSyncStatus("synced");
    attachLive(code);
    renderSyncPanel();
    smallConfetti();
  } catch (e) {
    console.warn(e);
    syncCode = null;
    btn.disabled = false;
    btn.textContent = "🌱 Create my garden code";
    syncBody.insertAdjacentHTML("beforeend", `<p class="sync-note" style="color:var(--amber)">${cloudErrorNote(e)}</p>`);
  }
}

async function loadGarden() {
  const input = syncBody.querySelector("#codeInput");
  const msg = syncBody.querySelector("#loadMsg");
  const code = input.value.trim().toLowerCase().replace(/\s+/g, "");
  if (!code) { msg.textContent = "Type your code first — like fern-tulip-482."; return; }
  msg.textContent = "Looking for your garden…";
  try {
    const remote = await cloudFetch(code);
    if (!remote) { msg.textContent = "No garden found with that code — double-check the spelling and dashes."; return; }
    applyRemote(remote);
    syncCode = code;
    localStorage.setItem(SYNC_KEY, code);
    saveProgress();   // persists locally + pushes the merged garden back up
    attachLive(code);
    renderSyncPanel();
    renderHome();
    toast("Your garden is here 🌸");
    bigConfetti();
  } catch (e) {
    console.warn(e);
    msg.textContent = cloudErrorNote(e);
  }
}

document.getElementById("syncBtn").addEventListener("click", () => {
  syncOverlay.hidden = false;
  renderSyncPanel();
});
document.getElementById("syncClose").addEventListener("click", () => { syncOverlay.hidden = true; });
syncOverlay.addEventListener("click", e => { if (e.target === syncOverlay) syncOverlay.hidden = true; });
addEventListener("keydown", e => { if (e.key === "Escape" && !syncOverlay.hidden) syncOverlay.hidden = true; });

// ---------- boot: pull the cloud garden + go live if this device is linked ----------
(async function bootSync() {
  setSyncStatus(syncCode ? "idle" : "off");
  if (!syncCode) return;
  try {
    setSyncStatus("syncing");
    const remote = await cloudFetch(syncCode);
    if (applyRemote(remote)) {
      _localSave();
      if (typeof renderHome === "function") renderHome();
    }
    await cloudPush(syncCode);
    attachLive(syncCode);
    setSyncStatus("synced");
  } catch (e) {
    console.warn("boot sync failed", e);
    setSyncStatus("error");
  }
})();
