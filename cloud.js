/* ============================================================
   MathBloom — cloud saves ("garden codes")
   Local-first: localStorage stays the source of truth on-device;
   the cloud copy lets one garden follow you across devices.
   The publishable key below is designed to be public (RLS guards
   the table; the unguessable code is the per-garden secret).
   ============================================================ */

const CLOUD_URL = "https://dlbknbupznjxuunzzstc.supabase.co/rest/v1/mathbloom_gardens";
const CLOUD_KEY = "sb_publishable_uxPMgjmN1MwyMJKheSSf2g_73PBSvAC";
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

function genGardenCode() {
  const w = () => CODE_WORDS[Math.floor(Math.random() * CODE_WORDS.length)];
  let a = w(), b = w();
  while (b === a) b = w();
  return `${a}-${b}-${100 + Math.floor(Math.random() * 900)}`;
}

function cloudHeaders() {
  return {
    apikey: CLOUD_KEY,
    Authorization: `Bearer ${CLOUD_KEY}`,
    "Content-Type": "application/json"
  };
}

async function cloudFetch(code) {
  const res = await fetch(`${CLOUD_URL}?code=eq.${encodeURIComponent(code)}&select=data,updated_at`, {
    headers: cloudHeaders()
  });
  if (!res.ok) throw new Error("fetch " + res.status);
  const rows = await res.json();
  return rows[0] || null;
}

async function cloudPush(code, data) {
  const res = await fetch(CLOUD_URL, {
    method: "POST",
    headers: { ...cloudHeaders(), Prefer: "resolution=merge-duplicates" },
    body: JSON.stringify([{ code, data, updated_at: new Date().toISOString() }])
  });
  if (!res.ok) throw new Error("push " + res.status);
}

// take the best of both worlds — progress can only ever grow
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
    : s === "synced" ? "✓ Saved to the cloud just now"
    : s === "error" ? "Couldn't reach the cloud — will retry automatically. Everything is still saved on this device."
    : "Cloud save is on. Your garden saves here automatically.";
}

function scheduleCloudPush() {
  if (!syncCode) return;
  clearTimeout(pushTimer);
  setSyncStatus("syncing");
  pushTimer = setTimeout(async () => {
    try {
      await cloudPush(syncCode, progress);
      setSyncStatus("synced");
    } catch (e) {
      console.warn("cloud push failed", e);
      setSyncStatus("error");
    }
  }, 1500);
}

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
      <p class="calm-sub" style="margin-top:0">Right now your garden lives in this browser only. A <strong>garden code</strong> saves it to the cloud, so you can open it on your phone, a school computer — anywhere.</p>
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
      <p class="calm-sub" style="margin-top:0">This is your garden code. Type it into MathBloom on any device and your whole garden — blooms, petals, everything — appears there too.</p>
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
      syncCode = null;
      localStorage.removeItem(SYNC_KEY);
      setSyncStatus("off");
      renderSyncPanel();
      toast("Cloud save off — progress stays on this device");
    });
  }
}

async function createGarden() {
  const btn = syncBody.querySelector("#makeCode");
  btn.disabled = true;
  btn.textContent = "Planting your code…";
  try {
    let code = genGardenCode();
    // avoid the (rare) case the code is taken
    for (let i = 0; i < 3 && (await cloudFetch(code)); i++) code = genGardenCode();
    await cloudPush(code, progress);
    syncCode = code;
    localStorage.setItem(SYNC_KEY, code);
    setSyncStatus("synced");
    renderSyncPanel();
    smallConfetti();
  } catch (e) {
    console.warn(e);
    btn.disabled = false;
    btn.textContent = "🌱 Create my garden code";
    syncBody.insertAdjacentHTML("beforeend", `<p class="sync-note" style="color:var(--amber)">Hmm, couldn't reach the cloud — check the internet and try again. Your progress is safe on this device either way.</p>`);
  }
}

async function loadGarden() {
  const input = syncBody.querySelector("#codeInput");
  const msg = syncBody.querySelector("#loadMsg");
  const code = input.value.trim().toLowerCase().replace(/\s+/g, "");
  if (!code) { msg.textContent = "Type your code first — like fern-tulip-482."; return; }
  msg.textContent = "Looking for your garden…";
  try {
    const row = await cloudFetch(code);
    if (!row) { msg.textContent = "No garden found with that code — double-check the spelling and dashes."; return; }
    progress = mergeProgress(loadProgress(), row.data || defaultProgress());
    syncCode = code;
    localStorage.setItem(SYNC_KEY, code);
    saveProgress(); // persists locally + pushes merged garden back up
    renderSyncPanel();
    renderHome();
    toast("Your garden is here 🌸");
    bigConfetti();
  } catch (e) {
    console.warn(e);
    msg.textContent = "Couldn't reach the cloud just now — try again in a moment.";
  }
}

document.getElementById("syncBtn").addEventListener("click", () => {
  syncOverlay.hidden = false;
  renderSyncPanel();
});
document.getElementById("syncClose").addEventListener("click", () => { syncOverlay.hidden = true; });
syncOverlay.addEventListener("click", e => { if (e.target === syncOverlay) syncOverlay.hidden = true; });
addEventListener("keydown", e => { if (e.key === "Escape" && !syncOverlay.hidden) syncOverlay.hidden = true; });

// ---------- boot: pull the cloud garden if this device is linked ----------
(async function bootSync() {
  setSyncStatus(syncCode ? "idle" : "off");
  if (!syncCode) return;
  try {
    setSyncStatus("syncing");
    const row = await cloudFetch(syncCode);
    if (row) {
      const merged = mergeProgress(progress, row.data || defaultProgress());
      if (JSON.stringify(merged) !== JSON.stringify(progress)) {
        progress = merged;
        _localSave();
        renderHome();
      }
    }
    await cloudPush(syncCode, progress);
    setSyncStatus("synced");
  } catch (e) {
    console.warn("boot sync failed", e);
    setSyncStatus("error");
  }
})();
