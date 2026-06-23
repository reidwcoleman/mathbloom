/* ============================================================
   MathBloom — automatic worldwide cloud sync (no codes, no login)
   Backed by the famsync-62653 Realtime Database (anonymous auth).

   There is ONE shared garden for everyone — at  mathbloom_gardens/global.
   Every device, anywhere in the world, reads and writes that same garden
   automatically on load: progress just appears, with nothing to set up or
   save. A live onValue listener keeps every open device in sync in real
   time. localStorage is still the on-device cache so it works offline; the
   merge only ever grows progress, never erases it.

   RTDB rule (DEPLOYED 2026-06-22): mathbloom_gardens/$code allows
   read+write for authenticated (anonymous) users. The fixed id "global"
   matches $code, so no extra rule is needed.

   Note: because there's no identity, the garden is shared by anyone who
   opens the site — perfect for one family across devices; not private per
   visitor. (To go per-user later, swap GARDEN_ID for a synced code.)
   ============================================================ */

const CLOUD_PATH = "mathbloom_gardens";
const GARDEN_ID = "global"; // one garden, the same on every device worldwide

let syncStatus = "idle"; // idle | syncing | synced | error
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

function gardenRef() { return _db.ref(`${CLOUD_PATH}/${GARDEN_ID}`); }

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

async function cloudPush() {
  await initFirebase();
  await gardenRef().set({
    ...gatherState(),
    updated_at: firebase.database.ServerValue.TIMESTAMP
  });
}

// ---------- live, real-time sync across every device ----------
function attachLive() {
  if (!_db) return;
  detachLive();
  _liveRef = gardenRef();
  _liveRef.on("value", snap => {
    if (applyRemote(snap.val())) {
      _localSave();
      // only redraw if the garden home is on screen (don't yank a student
      // out of a lesson mid-thought)
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
    btn.textContent = s === "syncing" ? "⏳" : s === "error" ? "☁️" : "☁️✓";
    btn.title = s === "syncing" ? "Syncing…"
      : s === "error" ? "Offline — your progress is safe on this device and will sync when you're back online"
      : "Synced — the same on every device";
  }
  const stat = document.getElementById("syncStatusLine");
  if (stat) stat.textContent = s === "syncing" ? "Syncing…"
    : s === "synced" ? "✓ Synced — the same on every device, everywhere"
    : s === "error" ? "Offline right now — everything is saved on this device and will sync automatically when you're back online."
    : "Your garden syncs automatically. Nothing to set up.";
}

function scheduleCloudPush() {
  clearTimeout(pushTimer);
  setSyncStatus("syncing");
  pushTimer = setTimeout(async () => {
    try { await cloudPush(); setSyncStatus("synced"); }
    catch (e) { console.warn("cloud push failed", e); setSyncStatus("error"); }
  }, 1000);
}
// let review.js trigger a push when recap progress changes
window.scheduleCloudPush = scheduleCloudPush;

// hook into the app's save — every local save also schedules a cloud save
const _localSave = saveProgress;
saveProgress = function () {
  _localSave();
  scheduleCloudPush();
};

// ---------- sync panel UI (informational — there's nothing to configure) ----------
const syncOverlay = document.getElementById("syncOverlay");
const syncBody = document.getElementById("syncBody");

function renderSyncPanel() {
  syncBody.innerHTML = `
    <p class="calm-sub" style="margin-top:0">Your garden saves to the cloud and is <strong>the same on every device, anywhere in the world</strong> — automatically. No code, no sign-in, nothing to remember. Just open MathBloom and keep growing. 🌱</p>
    <p class="sync-note" id="syncStatusLine"></p>`;
  setSyncStatus(syncStatus);
}

document.getElementById("syncBtn").addEventListener("click", () => {
  syncOverlay.hidden = false;
  renderSyncPanel();
});
document.getElementById("syncClose").addEventListener("click", () => { syncOverlay.hidden = true; });
syncOverlay.addEventListener("click", e => { if (e.target === syncOverlay) syncOverlay.hidden = true; });
addEventListener("keydown", e => { if (e.key === "Escape" && !syncOverlay.hidden) syncOverlay.hidden = true; });

// ---------- boot: pull the shared garden, merge, push, and go live ----------
(async function bootSync() {
  setSyncStatus("syncing");
  try {
    await initFirebase();
    const snap = await gardenRef().once("value");
    if (applyRemote(snap.val())) {
      _localSave();
      if (typeof renderHome === "function") renderHome();
    }
    await cloudPush();   // seed/merge this device's progress into the shared garden
    attachLive();        // real-time from here on
    setSyncStatus("synced");
  } catch (e) {
    console.warn("cloud sync unavailable", e);
    setSyncStatus("error");
  }
})();
