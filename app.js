/* ============================================================
   MathBloom v2 — app engine
   ============================================================ */

const GOAL = 5; // correct answers for a lesson to bloom
const STORE_KEY = "mathbloom-progress-v1";

// ---------- progress (localStorage, with v1 migration) ----------
function defaultProgress() {
  return { lessons: {}, totals: { answered: 0, correct: 0 }, lastLesson: null, bestStreak: 0 };
}
function loadProgress() {
  let raw;
  try { raw = JSON.parse(localStorage.getItem(STORE_KEY)); } catch { raw = null; }
  if (!raw) return defaultProgress();
  if (!raw.lessons) { // migrate v1 shape: { id: {stars} }
    const p = defaultProgress();
    for (const [id, v] of Object.entries(raw)) {
      if (v && typeof v.stars === "number") p.lessons[id] = { stars: v.stars, learned: false, attempts: 0, correct: v.stars };
    }
    return p;
  }
  if (!raw.totals) raw.totals = { answered: 0, correct: 0 };
  return raw;
}
function saveProgress() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(progress)); }
  catch (e) { console.warn("save failed", e); }
}
let progress = loadProgress();
saveProgress(); // persist any v1→v2 migration immediately

// extra safety: flush on tab hide/close
addEventListener("pagehide", saveProgress);
addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") saveProgress(); });

// gentle "saved" toast
function toast(msg) {
  document.querySelectorAll(".toast").forEach(t => t.remove());
  const t = document.createElement("div");
  t.className = "toast";
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2300);
}

// smooth view transitions
let navLock = false;
function go(fn) {
  if (navLock) { fn(); return; }
  navLock = true;
  view.style.opacity = "0";
  setTimeout(() => { fn(); view.style.opacity = "1"; navLock = false; }, 160);
}

function lessonState(id) {
  if (!progress.lessons[id]) progress.lessons[id] = { stars: 0, learned: false, attempts: 0, correct: 0 };
  return progress.lessons[id];
}
const lessonStars = id => Math.min(GOAL, (progress.lessons[id] && progress.lessons[id].stars) || 0);
const isBloomed = id => lessonStars(id) >= GOAL;
const isLearned = id => !!(progress.lessons[id] && progress.lessons[id].learned);
const growthStage = id => { // 0 seed, 1 sprout, 2 bud, 3 bloom
  const s = lessonStars(id);
  if (s >= GOAL) return 3;
  if (s >= 3) return 2;
  if (s >= 1 || isLearned(id)) return 1;
  return 0;
};

// ---------- flower art ----------
const FLOWER_COLORS = [
  ["#F2A07B", "#C9703F"], ["#E9A0A8", "#C76A74"], ["#C9B8E8", "#9A82C9"],
  ["#F6D88C", "#C9A23D"], ["#8FBFD9", "#5E93B5"], ["#F2A07B", "#C9703F"],
  ["#C9B8E8", "#9A82C9"], ["#E9A0A8", "#C76A74"], ["#F6D88C", "#C9A23D"]
];
function hashIdx(id) { let h = 0; for (const c of id) h += c.charCodeAt(0); return h % FLOWER_COLORS.length; }

function flowerHead(cx, cy, colorIdx, typeIdx) {
  const [petal, edge] = FLOWER_COLORS[colorIdx % FLOWER_COLORS.length];
  const t = typeIdx % 3;
  if (t === 0) { // classic 6-petal
    let petals = "";
    for (let a = 0; a < 360; a += 60) {
      petals += `<ellipse cx="${cx}" cy="${cy - 8}" rx="4.5" ry="9.5" fill="${petal}" stroke="${edge}" stroke-width=".8" transform="rotate(${a} ${cx} ${cy})"/>`;
    }
    return `<g class="flower-head">${petals}<circle cx="${cx}" cy="${cy}" r="5" fill="#F6D88C" stroke="#C9A23D" stroke-width="1"/></g>`;
  }
  if (t === 1) { // daisy, 10 thin petals
    let petals = "";
    for (let a = 0; a < 360; a += 36) {
      petals += `<ellipse cx="${cx}" cy="${cy - 9}" rx="2.6" ry="9.5" fill="${petal}" stroke="${edge}" stroke-width=".6" transform="rotate(${a} ${cx} ${cy})"/>`;
    }
    return `<g class="flower-head">${petals}<circle cx="${cx}" cy="${cy}" r="4.4" fill="#C9A23D"/></g>`;
  }
  // tulip
  return `<g class="flower-head">
    <path d="M ${cx - 9} ${cy + 4} C ${cx - 11} ${cy - 10} ${cx - 5} ${cy - 14} ${cx} ${cy - 6}
             C ${cx + 5} ${cy - 14} ${cx + 11} ${cy - 10} ${cx + 9} ${cy + 4}
             C ${cx + 6} ${cy + 9} ${cx - 6} ${cy + 9} ${cx - 9} ${cy + 4} Z"
          fill="${petal}" stroke="${edge}" stroke-width="1"/>
    <path d="M ${cx - 4} ${cy - 9} L ${cx} ${cy - 3} L ${cx + 4} ${cy - 9}" fill="none" stroke="${edge}" stroke-width="1" stroke-linecap="round"/>
  </g>`;
}

function plantArt(x, gy, stage, colorIdx, typeIdx) {
  const mound = `<ellipse cx="${x}" cy="${gy}" rx="15" ry="4.5" fill="#D9C9A4" opacity=".8"/>`;
  if (stage === 0) {
    return `${mound}<ellipse cx="${x}" cy="${gy - 3}" rx="3.4" ry="4.6" fill="#B79A6B"/><path d="M ${x} ${gy - 7} q 3 -4 6 -4" stroke="#8FB996" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
  }
  if (stage === 1) {
    return `${mound}
      <path d="M ${x} ${gy} L ${x} ${gy - 20}" stroke="#7FA98A" stroke-width="2.6" stroke-linecap="round"/>
      <path d="M ${x} ${gy - 12} C ${x - 10} ${gy - 14} ${x - 13} ${gy - 22} ${x - 11} ${gy - 27} C ${x - 3} ${gy - 24} ${x} ${gy - 18} ${x} ${gy - 12} Z" fill="#8FB996"/>
      <path d="M ${x} ${gy - 16} C ${x + 9} ${gy - 18} ${x + 12} ${gy - 25} ${x + 10} ${gy - 30} C ${x + 3} ${gy - 27} ${x} ${gy - 22} ${x} ${gy - 16} Z" fill="#A8CCA8"/>`;
  }
  if (stage === 2) {
    const [petal, edge] = FLOWER_COLORS[colorIdx % FLOWER_COLORS.length];
    return `${mound}
      <path d="M ${x} ${gy} L ${x} ${gy - 30}" stroke="#7FA98A" stroke-width="2.6" stroke-linecap="round"/>
      <ellipse cx="${x - 7}" cy="${gy - 14}" rx="7" ry="3.2" fill="#8FB996" transform="rotate(-30 ${x - 7} ${gy - 14})"/>
      <ellipse cx="${x + 7}" cy="${gy - 19}" rx="7" ry="3.2" fill="#A8CCA8" transform="rotate(30 ${x + 7} ${gy - 19})"/>
      <ellipse cx="${x}" cy="${gy - 36}" rx="6" ry="8.5" fill="${petal}" stroke="${edge}" stroke-width="1"/>
      <path d="M ${x - 5} ${gy - 31} Q ${x} ${gy - 26} ${x + 5} ${gy - 31}" fill="#8FB996"/>`;
  }
  return `${mound}
    <path d="M ${x} ${gy} L ${x} ${gy - 38}" stroke="#7FA98A" stroke-width="2.8" stroke-linecap="round"/>
    <ellipse cx="${x - 8}" cy="${gy - 16}" rx="8" ry="3.4" fill="#8FB996" transform="rotate(-28 ${x - 8} ${gy - 16})"/>
    <ellipse cx="${x + 8}" cy="${gy - 22}" rx="8" ry="3.4" fill="#A8CCA8" transform="rotate(28 ${x + 8} ${gy - 22})"/>
    ${flowerHead(x, gy - 46, colorIdx, typeIdx)}`;
}

// small inline plant icon for lesson rows
function plantIcon(id, size = 48) {
  const stage = growthStage(id);
  return `<svg viewBox="0 0 60 60" width="${size}" height="${size}" aria-hidden="true">
    ${plantArt(30, 52, stage, hashIdx(id), hashIdx(id))}
  </svg>`;
}

// ---------- garden scene ----------
function gardenSceneSVG() {
  const lessons = UNITS.flatMap(u => u.lessons);
  const blooms = lessons.filter(l => isBloomed(l.id)).length;
  const W = 1000, H = 280;
  const plantXs = lessons.map((_, i) => 92 + i * ((W - 184) / (lessons.length - 1)));
  const groundYFor = i => 222 + (i % 2 === 0 ? 8 : -6) + (i % 3 === 0 ? 4 : 0);

  const plants = lessons.map((l, i) => {
    const gy = groundYFor(i);
    const stage = growthStage(l.id);
    const stageName = ["a seed — visit to start growing", "a sprout — keep practicing", "a bud — almost there", "in full bloom — tap to revisit"][stage];
    return `<g class="plant" data-plant="${l.id}" tabindex="0" role="button" aria-label="${l.title}: ${stageName}">
      <title>${l.title} — ${stageName}</title>
      <g class="plant-art">${plantArt(plantXs[i], gy, stage, i, i)}</g>
    </g>`;
  }).join("");

  const butterflies = blooms >= 3 ? `
    <g class="butterfly" transform="translate(180,110)">
      <g class="wing"><ellipse cx="-5" cy="0" rx="6" ry="8" fill="#C9B8E8"/><ellipse cx="5" cy="0" rx="6" ry="8" fill="#C9B8E8"/></g>
      <rect x="-1.4" y="-7" width="2.8" height="14" rx="1.4" fill="#5C4A78"/>
    </g>` + (blooms >= 6 ? `
    <g class="butterfly b2" transform="translate(620,90)">
      <g class="wing"><ellipse cx="-5" cy="0" rx="6" ry="8" fill="#F2A07B"/><ellipse cx="5" cy="0" rx="6" ry="8" fill="#F2A07B"/></g>
      <rect x="-1.4" y="-7" width="2.8" height="14" rx="1.4" fill="#7A4A30"/>
    </g>` : "") : "";

  const rainbow = blooms >= lessons.length ? `
    <g opacity=".55">
      <path d="M 560 200 A 240 240 0 0 1 1040 200" fill="none" stroke="#E9A0A8" stroke-width="13"/>
      <path d="M 573 200 A 227 227 0 0 1 1027 200" fill="none" stroke="#F6D88C" stroke-width="13"/>
      <path d="M 586 200 A 214 214 0 0 1 1014 200" fill="none" stroke="#A8CCA8" stroke-width="13"/>
      <path d="M 599 200 A 201 201 0 0 1 1001 200" fill="none" stroke="#C9B8E8" stroke-width="13"/>
    </g>` : "";

  return `
  <svg class="garden-scene" viewBox="0 0 ${W} ${H}" role="img" aria-label="Your garden: ${blooms} of ${lessons.length} flowers in bloom">
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#CDE4EC"/><stop offset="70%" stop-color="#F2EEDC"/><stop offset="100%" stop-color="#F6EFDF"/>
      </linearGradient>
      <linearGradient id="hillBack" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#B5D1B0"/><stop offset="100%" stop-color="#A3C49E"/>
      </linearGradient>
      <linearGradient id="hillFront" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#9CC49B"/><stop offset="100%" stop-color="#86B287"/>
      </linearGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#sky)"/>
    ${rainbow}
    <g transform="translate(900,58)">
      <g class="sunrays">${Array.from({ length: 8 }, (_, i) => `<rect x="-2" y="-52" width="4" height="14" rx="2" fill="#F6D88C" transform="rotate(${i * 45})"/>`).join("")}</g>
      <circle r="28" fill="#F6D88C"/><circle r="22" fill="#FAE6A8"/>
    </g>
    <g class="cloud"><ellipse cx="150" cy="62" rx="42" ry="16" fill="#FFFFFF" opacity=".85"/><ellipse cx="185" cy="54" rx="30" ry="13" fill="#FFFFFF" opacity=".85"/><ellipse cx="120" cy="54" rx="24" ry="11" fill="#FFFFFF" opacity=".85"/></g>
    <g class="cloud c2"><ellipse cx="430" cy="40" rx="34" ry="12" fill="#FFFFFF" opacity=".6"/><ellipse cx="458" cy="34" rx="22" ry="9" fill="#FFFFFF" opacity=".6"/></g>
    <path d="M 0 190 Q 250 130 520 178 T ${W} 168 L ${W} ${H} L 0 ${H} Z" fill="url(#hillBack)"/>
    <path d="M 0 226 Q 300 186 600 222 T ${W} 212 L ${W} ${H} L 0 ${H} Z" fill="url(#hillFront)"/>
    ${Array.from({ length: 14 }, (_, i) => {
      const gx = 40 + i * 72, gyy = 244 + (i % 3) * 8;
      return `<path d="M ${gx} ${gyy} q 2 -9 4 0 M ${gx + 5} ${gyy} q 2 -7 4 0" stroke="#6E9B72" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
    }).join("")}
    ${plants}
    ${butterflies}
  </svg>`;
}

// ---------- view helpers ----------
const view = document.getElementById("view");

function findLesson(lid) {
  for (const u of UNITS) for (const l of u.lessons) if (l.id === lid) return { unit: u, lesson: l };
  return null;
}
function unitProgress(u) {
  const total = u.lessons.length * GOAL;
  const got = u.lessons.reduce((a, l) => a + lessonStars(l.id), 0);
  return { got, total, pct: total ? got / total : 0 };
}
function wireGarden(scope) {
  scope.querySelectorAll("[data-plant]").forEach(g => {
    const visit = () => {
      const id = g.dataset.plant;
      go(() => renderLesson(id, growthStage(id) >= 1 ? "practice" : "learn"));
    };
    g.addEventListener("click", visit);
    g.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); visit(); } });
  });
}

// ---------- HOME ----------
function renderHome() {
  const lessons = UNITS.flatMap(u => u.lessons);
  const blooms = lessons.filter(l => isBloomed(l.id)).length;
  const learned = lessons.filter(l => isLearned(l.id)).length;
  const last = progress.lastLesson && findLesson(progress.lastLesson);
  const showContinue = last && !isBloomed(progress.lastLesson);
  const returning = progress.totals.answered > 0 || learned > 0;

  view.innerHTML = `
    <section class="hero rise">
      <span class="hero-kicker">Math 6 Plus • Units 4, 8 &amp; 9</span>
      <h1>${returning ? "Welcome back to <em>your garden</em>" : "Math practice that <em>grows</em> with you"}</h1>
      <p class="lede">${returning
        ? "Everything you grew last time is still here. Pick up wherever feels good today."
        : "Pick a lesson, learn at your own pace, and watch your garden bloom. Every mistake is just a seed that hasn't sprouted yet."}</p>
      <div class="promise-row">
        <span class="promise">🌿 No timers</span>
        <span class="promise">🌼 No grades</span>
        <span class="promise">🌱 Unlimited tries</span>
        <span class="promise">💛 Hints whenever you want</span>
      </div>
      ${showContinue ? `
      <button class="continue-card" id="continueBtn">
        <span style="flex:0 0 auto">${plantIcon(progress.lastLesson, 46)}</span>
        <span class="cc-text">
          <span class="cc-kicker">Continue where you left off</span>
          <h3>${last.lesson.title}</h3>
          <p>${last.unit.num} • ${lessonStars(progress.lastLesson)}/${GOAL} petals so far</p>
        </span>
        <span class="cc-go">→</span>
      </button>` : ""}
    </section>

    <button class="plan-cta rise d1b" id="planCta">
      <span class="plan-cta-emoji">🗓️</span>
      <span class="plan-cta-text">
        <span class="plan-cta-kicker">Your summer roadmap</span>
        <h3>Summer Math Plan — Weeks 1 &amp; 2 are ready</h3>
        <p>Six sessions through Unit 4, each with the lesson, hands-on work, and a garden to bloom.</p>
      </span>
      <span class="plan-cta-go">→</span>
    </button>

    <section class="garden rise d2">
      <div class="garden-head">
        <h2>Your garden</h2>
        <span>${blooms} of ${lessons.length} flowers in bloom${blooms === lessons.length ? " — the whole meadow! 🌈" : ""}</span>
      </div>
      ${gardenSceneSVG()}
      <div class="garden-legend">
        <span>Tap any plant to visit its lesson</span>
        <span>🌰 seed → 🌱 sprout → 🌷 bud → 🌸 bloom</span>
        ${blooms >= 3 ? "<span>🦋 butterflies arrive at 3 blooms</span>" : "<span>🦋 3 blooms invite a butterfly…</span>"}
      </div>
    </section>

    <section class="stats-row rise d3">
      <div class="stat-card"><span class="stat-emoji">🌸</span><div><div class="stat-num">${blooms}<span style="font-size:.9rem;color:var(--ink-soft)">/${lessons.length}</span></div><div class="stat-label">lessons bloomed</div></div></div>
      <div class="stat-card"><span class="stat-emoji">📖</span><div><div class="stat-num">${learned}<span style="font-size:.9rem;color:var(--ink-soft)">/${lessons.length}</span></div><div class="stat-label">lessons learned</div></div></div>
      <div class="stat-card"><span class="stat-emoji">✏️</span><div><div class="stat-num">${progress.totals.correct}</div><div class="stat-label">questions grown (answered right)</div></div></div>
    </section>

    <section class="units">
      ${UNITS.map((u, i) => {
        const p = unitProgress(u);
        const R = 17, C = 2 * Math.PI * R;
        return `
        <button class="unit-card ${u.tint} rise d${i + 4}" data-unit="${u.id}">
          <span class="unit-num">${u.num}</span>
          <h3>${u.title}</h3>
          <p>${u.blurb}</p>
          <div class="unit-dots">
            ${u.lessons.map(l => `<span class="unit-dot ${isBloomed(l.id) ? "done" : lessonStars(l.id) > 0 || isLearned(l.id) ? "some" : ""}"></span>`).join("")}
          </div>
          <div class="unit-meta">
            <span class="count">${u.lessons.filter(l => isBloomed(l.id)).length}/${u.lessons.length} bloomed</span>
            <svg class="ring" width="44" height="44" viewBox="0 0 44 44" aria-hidden="true">
              <circle class="track" cx="22" cy="22" r="${R}" fill="none" stroke-width="5"/>
              <circle class="fill" cx="22" cy="22" r="${R}" fill="none" stroke-width="5"
                stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - p.pct)}"/>
            </svg>
          </div>
        </button>`;
      }).join("")}
    </section>`;

  view.querySelectorAll("[data-unit]").forEach(b =>
    b.addEventListener("click", () => go(() => renderUnit(b.dataset.unit))));
  const cont = view.querySelector("#continueBtn");
  if (cont) cont.addEventListener("click", () => {
    go(() => renderLesson(progress.lastLesson, isLearned(progress.lastLesson) ? "practice" : "learn"));
  });
  view.querySelector("#planCta").addEventListener("click", () => go(renderPlan));
  wireGarden(view);
  window.scrollTo({ top: 0 });
}

// ---------- UNIT ----------
function renderUnit(uid) {
  const u = UNITS.find(x => x.id === uid);
  if (!u) return renderHome();

  view.innerHTML = `
    <nav class="crumbs rise"><a href="#" data-home>← My garden</a> <span>/ ${u.num}</span></nav>
    <header class="unit-hero rise d1">
      <h1>${u.title}</h1>
      <p>${u.blurb} Each lesson has a short, friendly <strong>Learn</strong> walk-through and a <strong>Practice</strong> garden — five correct answers and it blooms, with unlimited tries and zero rush.</p>
    </header>
    <div class="lesson-list">
      ${u.lessons.map((l, i) => `
        <button class="lesson-row ${isBloomed(l.id) ? "is-bloomed" : ""} rise d${i + 2}" data-lesson="${l.id}">
          <span class="lesson-flower">${plantIcon(l.id)}</span>
          <span class="lesson-body">
            <h3>${l.title}</h3>
            <p>${l.blurb}</p>
            <span class="lesson-tags">
              <span class="lesson-petals">
                ${Array.from({ length: GOAL }, (_, j) =>
                  `<span class="petal-pip ${j < lessonStars(l.id) ? "full" : ""}"></span>`).join("")}
              </span>
              <span class="mini-tag ${isLearned(l.id) ? "learned" : "todo"}">${isLearned(l.id) ? "✓ learned" : "learn first"}</span>
            </span>
          </span>
          ${isBloomed(l.id) ? `<span class="bloomed-tag">✓ Bloomed</span>` : ""}
          <span class="lesson-go">→</span>
        </button>`).join("")}
    </div>
    <div class="sprout-note rise d5">
      ${plantIcon("note", 34)}
      <p>Already bloomed a lesson? It stays bloomed forever — but you can always come back for extra practice. Gardens love attention.</p>
    </div>`;

  view.querySelector("[data-home]").addEventListener("click", e => { e.preventDefault(); go(renderHome); });
  view.querySelectorAll("[data-lesson]").forEach(b =>
    b.addEventListener("click", () => {
      const id = b.dataset.lesson;
      go(() => renderLesson(id, isLearned(id) ? "practice" : "learn"));
    }));
  window.scrollTo({ top: 0 });
}

// ---------- LESSON ----------
function renderLesson(lid, tab) {
  const found = findLesson(lid);
  if (!found) return renderHome();
  const { unit, lesson } = found;
  progress.lastLesson = lid;
  saveProgress();

  view.innerHTML = `
    <nav class="crumbs rise">
      <a href="#" data-home>← My garden</a> <span>/</span>
      <a href="#" data-unit>${unit.num}</a> <span>/ ${lesson.title}</span>
    </nav>
    <header class="lesson-head rise d1">
      <h1>${lesson.title}</h1>
      <p class="sub">${lesson.blurb}</p>
      <div class="tabs">
        <button class="tab ${tab === "learn" ? "active" : ""}" data-tab="learn">🌱 Learn${isLearned(lid) ? ' <span class="tab-check">✓</span>' : ""}</button>
        <button class="tab ${tab === "practice" ? "active" : ""}" data-tab="practice">🌸 Practice${isBloomed(lid) ? ' <span class="tab-check">✓</span>' : ""}</button>
      </div>
    </header>
    <div id="panel"></div>
    ${lessonNavHTML(lid)}`;

  view.querySelector("[data-home]").addEventListener("click", e => { e.preventDefault(); go(renderHome); });
  view.querySelector("[data-unit]").addEventListener("click", e => { e.preventDefault(); go(() => renderUnit(unit.id)); });
  view.querySelectorAll("[data-tab]").forEach(b =>
    b.addEventListener("click", () => {
      if (b.dataset.tab === tab) return;
      renderLesson(lid, b.dataset.tab);
    }));
  view.querySelectorAll("[data-nav-lesson]").forEach(b =>
    b.addEventListener("click", () => {
      const id = b.dataset.navLesson;
      go(() => renderLesson(id, isLearned(id) ? "practice" : "learn"));
    }));

  if (tab === "learn") renderLearn(lesson);
  else renderPractice(lesson);
  window.scrollTo({ top: 0 });
}

function lessonNavHTML(lid) {
  const flat = UNITS.flatMap(u => u.lessons);
  const i = flat.findIndex(l => l.id === lid);
  const prev = flat[i - 1], next = flat[i + 1];
  return `
  <div class="lesson-nav-row">
    <button class="lesson-nav-btn" ${prev ? `data-nav-lesson="${prev.id}"` : "disabled"}>
      <span class="ln-kicker">← Previous lesson</span>
      <span class="ln-title">${prev ? prev.title : ""}</span>
    </button>
    <button class="lesson-nav-btn next" ${next ? `data-nav-lesson="${next.id}"` : "disabled"}>
      <span class="ln-kicker">Next lesson →</span>
      <span class="ln-title">${next ? next.title : ""}</span>
    </button>
  </div>`;
}

// ---------- LEARN (paged walk-through) ----------
function renderLearn(lesson) {
  const panel = document.getElementById("panel");
  const pages = lesson.pages;
  const st = lessonState(lesson.id);
  let idx = Math.min(st.learnPage || 0, pages.length - 1); // resume where you left off
  const seen = new Set(Array.from({ length: idx + 1 }, (_, i) => i));
  if (idx > 0) setTimeout(() => toast("Picked up right where you left off 🌿"), 400);

  function setPage(i) {
    idx = i;
    seen.add(i);
    st.learnPage = i;
    saveProgress();
  }

  function drawPage() {
    const page = pages[idx];
    const isLast = idx === pages.length - 1;
    panel.innerHTML = `
      <div class="learn rise">
        <div class="learn-progress">
          ${pages.map((_, i) => `<span class="learn-dot ${i === idx ? "on" : seen.has(i) ? "seen" : ""}"></span>`).join("")}
          <span class="lp-label">${idx + 1} of ${pages.length}</span>
        </div>
        <div class="teach-card">
          <h2>${page.title}</h2>
          ${page.html}
          ${page.checkpoint ? checkpointHTML(page.checkpoint) : ""}
        </div>
        <div class="learn-nav">
          <button class="btn btn-ghost" id="backBtn" ${idx === 0 ? "disabled" : ""}>← Back</button>
          <button class="btn btn-primary" id="nextBtn">${isLast ? (isLearned(lesson.id) ? "Review done — to practice 🌸" : "Finish — I learned this! 🌱") : "Next →"}</button>
        </div>
      </div>`;

    panel.querySelector("#backBtn").addEventListener("click", () => { if (idx > 0) { setPage(idx - 1); drawPage(); } });
    panel.querySelector("#nextBtn").addEventListener("click", () => {
      if (!isLast) { setPage(idx + 1); drawPage(); window.scrollTo({ top: 0, behavior: "smooth" }); }
      else finishLearn();
    });
    wireCheckpoint(panel, page.checkpoint);
  }

  function checkpointHTML(cp) {
    return `
      <div class="checkpoint">
        <span class="tag">Quick check — just for you, never graded</span>
        <p class="cp-q">${cp.q}</p>
        <div class="cp-options">
          ${cp.options.map((o, i) => `<button class="cp-option" data-cp="${i}">${o}</button>`).join("")}
        </div>
        <div class="cp-reveal" id="cpReveal"></div>
      </div>`;
  }

  function wireCheckpoint(scope, cp) {
    if (!cp) return;
    scope.querySelectorAll("[data-cp]").forEach(b =>
      b.addEventListener("click", () => {
        const i = +b.dataset.cp;
        scope.querySelectorAll("[data-cp]").forEach(x => x.classList.remove("cp-right", "cp-soft"));
        const reveal = scope.querySelector("#cpReveal");
        if (i === cp.correct) {
          b.classList.add("cp-right");
          reveal.innerHTML = `🌼 <strong>Exactly right.</strong> ${cp.why}`;
        } else {
          b.classList.add("cp-soft");
          scope.querySelectorAll("[data-cp]")[cp.correct].classList.add("cp-right");
          reveal.innerHTML = `🌿 <strong>Good try — here's the idea:</strong> ${cp.why}`;
        }
      }));
  }

  function finishLearn() {
    const first = !isLearned(lesson.id);
    st.learned = true;
    st.learnPage = 0; // future visits start fresh as a review
    saveProgress();
    toast(first ? "Lesson saved ✓ — it stays learned forever" : "Review saved ✓");
    if (first) smallConfetti();
    panel.innerHTML = `
      <div class="learn rise">
        <div class="learned-banner">
          <div style="font-size:2.4rem">🌱</div>
          <h2>${first ? "Lesson learned — and saved!" : "Nice review!"}</h2>
          <p>${first
            ? "This lesson is now marked ✓ learned in your garden, forever. Whenever you're ready — no rush at all — practice is how it blooms."
            : "Refreshing the roots makes the flower stronger. Practice is waiting whenever you'd like."}</p>
          <div class="q-actions" style="justify-content:center">
            <button class="btn btn-primary" id="toPractice">Practice this lesson 🌸</button>
            <button class="btn btn-ghost" id="toUnit">Back to the unit</button>
          </div>
        </div>
      </div>`;
    panel.querySelector("#toPractice").addEventListener("click", () => go(() => renderLesson(lesson.id, "practice")));
    panel.querySelector("#toUnit").addEventListener("click", () => go(() => renderUnit(findLesson(lesson.id).unit.id)));
  }

  drawPage();
}

// ---------- PRACTICE ENGINE ----------
const PRAISE = [
  "Beautiful work!", "That's it exactly.", "You've got this.", "Lovely thinking.",
  "Yes! Right on.", "Petal earned.", "Smooth as can be.", "Your garden approves."
];
const GENTLE = [
  "Not quite yet — and that's completely okay.",
  "Close! Every try teaches your brain something.",
  "Hmm, not this one — want a hint? No pressure.",
  "Not yet, but you're circling the answer.",
  "That's not it — take a breath, look again whenever you're ready."
];
const STREAK_NOTES = ["🌿 Three in a row — you're in a groove.", "🌼 Another one! Steady as sunshine.", "🌸 Look at you go."];

function renderPractice(lesson) {
  const panel = document.getElementById("panel");
  let q = lesson.generate();
  let attempts = 0;
  let hintIdx = 0;
  let pickedChoice = -1;
  let solved = false;
  let streak = 0;

  function bloomBarHTML() {
    const s = lessonStars(lesson.id);
    return `
      <div class="bloom-bar rise">
        <span class="label">${isBloomed(lesson.id) ? "✓ In full bloom — extra practice mode" : "Petals to bloom:"}</span>
        <span class="bloom-petals">
          ${Array.from({ length: GOAL }, (_, j) => `<span class="bloom-petal ${j < s ? "full" : ""}"></span>`).join("")}
        </span>
        <span class="label" style="margin-left:auto;font-size:.74rem;opacity:.75">✓ saves automatically</span>
      </div>`;
  }

  function answerZoneHTML() {
    if (q.type === "choice") {
      return `<div class="choices">
        ${q.choices.map((c, i) => `<button class="choice" data-choice="${i}">${c}</button>`).join("")}
      </div>`;
    }
    return `
      <div class="answer-row">
        <input class="answer-input" id="answerInput" type="text" inputmode="decimal"
          placeholder="your answer" autocomplete="off" aria-label="Your answer">
        ${q.unit ? `<span class="answer-unit">${q.unit}</span>` : ""}
      </div>`;
  }

  function draw() {
    panel.innerHTML = `
      <div class="practice">
        ${bloomBarHTML()}
        <div class="q-card">
          <p class="q-prompt">${q.prompt}</p>
          ${q.visual ? `<div class="q-visual">${q.visual}</div>` : ""}
          <div class="answer-zone">${answerZoneHTML()}</div>
          <div class="q-actions">
            <button class="btn btn-primary" id="checkBtn">Check my answer</button>
          </div>
          <div class="stuck-row">
            <span class="stuck-label">Need anything?</span>
            <button class="stuck-chip" id="hintBtn">💡 a hint</button>
            <button class="stuck-chip" id="stepsChip">🌿 see the steps</button>
            <button class="stuck-chip" id="skipBtn">↻ a different question</button>
            <button class="stuck-chip" id="breatheChip">🌬️ a calm minute</button>
          </div>
          <div id="feedback"></div>
          <div id="hints"></div>
          <div id="steps"></div>
        </div>
        <div class="sprout-note">
          ${plantIcon("note", 30)}
          <p>Hints, steps, and skips never cost you anything here. Asking for help <em>is</em> a math skill.</p>
        </div>
      </div>`;

    const input = panel.querySelector("#answerInput");
    if (input) {
      input.focus();
      input.addEventListener("keydown", e => { if (e.key === "Enter") check(); });
    }
    panel.querySelectorAll("[data-choice]").forEach(b =>
      b.addEventListener("click", () => {
        if (solved) return;
        pickedChoice = +b.dataset.choice;
        panel.querySelectorAll("[data-choice]").forEach(x => x.classList.remove("picked"));
        b.classList.add("picked");
      }));
    panel.querySelector("#checkBtn").addEventListener("click", check);
    panel.querySelector("#hintBtn").addEventListener("click", showHint);
    panel.querySelector("#stepsChip").addEventListener("click", () => showSteps(false));
    panel.querySelector("#skipBtn").addEventListener("click", nextQuestion);
    panel.querySelector("#breatheChip").addEventListener("click", openCalm);
  }

  function parseNumeric(raw) {
    let s = raw.trim().replace(/[$,%]/g, "").replace(/\s+/g, "");
    if (!s) return NaN;
    if (s.includes("/")) {
      const [a, b] = s.split("/").map(Number);
      if (!isNaN(a) && !isNaN(b) && b !== 0) return a / b;
      return NaN;
    }
    return Number(s);
  }

  function check() {
    if (solved) return;
    let correct = false;
    if (q.type === "choice") {
      if (pickedChoice === -1) {
        flashFeedback("gentle", "Pick an answer first", "Choose the option that feels right — you can't lose anything by trying.");
        return;
      }
      correct = pickedChoice === q.correctIndex;
    } else {
      const val = parseNumeric(panel.querySelector("#answerInput").value);
      if (isNaN(val)) {
        flashFeedback("gentle", "I couldn't read that as a number", "Try something like <strong>12</strong>, <strong>3.5</strong>, or <strong>1/2</strong>. Symbols like $ and % are fine too.");
        return;
      }
      correct = Math.abs(val - q.answer) < 0.011;
    }
    attempts++;
    progress.totals.answered++;
    if (correct) onCorrect();
    else { saveProgress(); onIncorrect(); }
  }

  function onCorrect() {
    solved = true;
    streak++;
    progress.totals.correct++;
    const st = lessonState(lesson.id);
    st.correct++;
    const wasBloomed = isBloomed(lesson.id);
    if (st.stars < GOAL) st.stars++;
    if (streak > (progress.bestStreak || 0)) progress.bestStreak = streak;
    saveProgress();

    smallConfetti();
    const fb = panel.querySelector("#feedback");
    fb.innerHTML = `
      <div class="feedback good">
        <p class="fb-title">${PRAISE[ri(0, PRAISE.length - 1)]} 🌸</p>
        <p>${wasBloomed ? "Extra practice — your garden gets stronger." : "A new petal opens up."}</p>
        ${streak >= 3 ? `<p class="streak-note">${STREAK_NOTES[Math.min(streak - 3, STREAK_NOTES.length - 1)]}</p>` : ""}
      </div>
      <div class="q-actions">
        <button class="btn btn-primary" id="nextBtn">Next question →</button>
      </div>`;
    refreshPetals();
    panel.querySelector("#checkBtn").disabled = true;

    if (!wasBloomed && isBloomed(lesson.id)) {
      setTimeout(() => bloomCelebration(), 800);
      return;
    }
    fb.querySelector("#nextBtn").addEventListener("click", nextQuestion);
    fb.querySelector("#nextBtn").focus();
  }

  function onIncorrect() {
    streak = 0;
    const fb = panel.querySelector("#feedback");
    if (attempts < 2) {
      flashFeedback("gentle", GENTLE[ri(0, GENTLE.length - 1)], "Take another look — or tap <strong>💡 a hint</strong> and we'll figure it out together.");
    } else {
      fb.innerHTML = `
        <div class="feedback gentle">
          <p class="fb-title">${GENTLE[ri(0, GENTLE.length - 1)]}</p>
          <p>Want to watch the solution unfold? Seeing the steps is real learning — it counts.</p>
        </div>
        <div class="q-actions">
          <button class="btn btn-soft" id="revealBtn">🌿 Show me the steps</button>
        </div>`;
      fb.querySelector("#revealBtn").addEventListener("click", () => showSteps(true));
    }
  }

  function flashFeedback(kind, title, body) {
    panel.querySelector("#feedback").innerHTML = `
      <div class="feedback ${kind}">
        <p class="fb-title">${title}</p>
        <p>${body}</p>
      </div>`;
  }

  function showHint() {
    const box = panel.querySelector("#hints");
    if (hintIdx >= q.hints.length) {
      box.insertAdjacentHTML("beforeend", `
        <div class="hint-box"><span class="tag">All hints used</span>
        That's every hint for this one — tap <strong>Check</strong> with your best idea, or grab a different question. Both are great choices.</div>`);
      panel.querySelector("#hintBtn").disabled = true;
      return;
    }
    box.insertAdjacentHTML("beforeend", `
      <div class="hint-box"><span class="tag">Hint ${hintIdx + 1}</span>${q.hints[hintIdx]}</div>`);
    hintIdx++;
  }

  function showSteps(fromMiss) {
    solved = true;
    streak = 0;
    panel.querySelector("#steps").innerHTML = `
      <div class="steps-box">
        <span class="tag">Here's how it goes</span>
        ${q.steps.map(s => `<p>${s}</p>`).join("")}
      </div>
      <div class="q-actions">
        <button class="btn btn-primary" id="gotItBtn">Got it — next one →</button>
      </div>`;
    panel.querySelector("#feedback").innerHTML = "";
    panel.querySelector("#checkBtn").disabled = true;
    const b = panel.querySelector("#gotItBtn");
    b.addEventListener("click", nextQuestion);
    b.focus();
  }

  function refreshPetals() {
    const s = lessonStars(lesson.id);
    panel.querySelectorAll(".bloom-petal").forEach((p, j) => p.classList.toggle("full", j < s));
  }

  function nextQuestion() {
    q = lesson.generate();
    attempts = 0; hintIdx = 0; pickedChoice = -1; solved = false;
    draw();
  }

  function bloomCelebration() {
    bigConfetti();
    toast("Bloom saved forever 🌸");
    const flat = UNITS.flatMap(u => u.lessons);
    const allBloomed = flat.every(l => isBloomed(l.id));
    const here = flat.findIndex(l => l.id === lesson.id);
    const nextUp = flat.slice(here + 1).find(l => !isBloomed(l.id)) || flat.find(l => !isBloomed(l.id));
    panel.innerHTML = `
      <div class="practice">
        <div class="bloom-banner">
          <span class="big-flower">
            <svg viewBox="0 0 60 60" width="96" height="96">${plantArt(30, 54, 3, hashIdx(lesson.id), hashIdx(lesson.id))}</svg>
          </span>
          <h2>${lesson.title} just bloomed!</h2>
          <p>Five petals, fully open — and <strong>saved forever</strong>. You never have to redo this lesson; it's yours now. Hints, retries, breaths and all: you grew it yourself.</p>
          ${allBloomed ? `<p style="font-weight:800;color:var(--deep)">🌈 And that's every single lesson — your whole meadow is in bloom. Go look at your garden!</p>` : ""}
          <div class="q-actions" style="justify-content:center">
            ${nextUp ? `<button class="btn btn-primary" id="nextLesson">Next up: ${nextUp.title} →</button>` : ""}
            <button class="btn ${nextUp ? "btn-ghost" : "btn-primary"}" id="seeGarden">See it in my garden 🌷</button>
            <button class="btn btn-ghost" id="keepGoing">Keep practicing</button>
          </div>
        </div>
      </div>`;
    if (nextUp) panel.querySelector("#nextLesson").addEventListener("click", () =>
      go(() => renderLesson(nextUp.id, isLearned(nextUp.id) ? "practice" : "learn")));
    panel.querySelector("#seeGarden").addEventListener("click", () => go(renderHome));
    panel.querySelector("#keepGoing").addEventListener("click", nextQuestion);
  }

  draw();
}

// ---------- petal confetti ----------
const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");
let petals = [];
let confettiRunning = false;

function resizeCanvas() { canvas.width = innerWidth; canvas.height = innerHeight; }
addEventListener("resize", resizeCanvas);
resizeCanvas();

function spawnPetals(n, burst) {
  const colors = ["#F2A07B", "#E9A0A8", "#C9B8E8", "#F6D88C", "#8FB996"];
  for (let i = 0; i < n; i++) {
    petals.push({
      x: burst ? innerWidth / 2 + (Math.random() - 0.5) * 200 : Math.random() * innerWidth,
      y: burst ? innerHeight / 2 + (Math.random() - 0.5) * 80 : -20 - Math.random() * 80,
      vx: (Math.random() - 0.5) * (burst ? 7 : 1.4),
      vy: burst ? -Math.random() * 7 - 2 : Math.random() * 1.2 + 0.8,
      r: Math.random() * 6 + 5,
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.12,
      color: colors[ri(0, colors.length - 1)],
      life: 1
    });
  }
  if (!confettiRunning) { confettiRunning = true; requestAnimationFrame(tickPetals); }
}

function tickPetals() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  petals = petals.filter(p => p.life > 0 && p.y < innerHeight + 40);
  for (const p of petals) {
    p.vy += 0.06; p.vy = Math.min(p.vy, 2.4);
    p.x += p.vx + Math.sin(p.y / 40) * 0.6;
    p.y += p.vy;
    p.rot += p.vr;
    p.life -= 0.004;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.globalAlpha = Math.max(0, Math.min(1, p.life * 1.4));
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.ellipse(0, 0, p.r, p.r * 0.55, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  if (petals.length) requestAnimationFrame(tickPetals);
  else { confettiRunning = false; ctx.clearRect(0, 0, canvas.width, canvas.height); }
}

const smallConfetti = () => spawnPetals(22, true);
const bigConfetti = () => { spawnPetals(60, true); setTimeout(() => spawnPetals(50, false), 350); };

// ---------- calm corner ----------
const calmOverlay = document.getElementById("calmOverlay");
const calmBody = document.getElementById("calmBody");
let calmTimers = [];

const AFFIRMATIONS = [
  "You are allowed to learn slowly. Slow roots grow strong flowers.",
  "A wrong answer is information, not a verdict.",
  "You've figured out hard things before. This is just the next one.",
  "Math is a skill, not a talent — and skills grow with watering.",
  "It's okay to take up time. The problems will wait kindly.",
  "Confused is what learning feels like right before it clicks.",
  "You don't have to be fast. You just have to keep going — gently.",
  "Asking for a hint is wisdom, not weakness.",
  "Your worth was never a test score. Not once. Not ever.",
  "One small problem at a time is exactly how every garden gets planted."
];

const GROUND_STEPS = [
  { n: 5, sense: "things you can see", tip: "Look around slowly. A pencil, a window, your own hands — anything counts." },
  { n: 4, sense: "things you can feel", tip: "Your feet on the floor, the chair beneath you, the air on your skin…" },
  { n: 3, sense: "things you can hear", tip: "Near or far. A hum, a voice, your own breathing." },
  { n: 2, sense: "things you can smell", tip: "Or two smells you like remembering — fresh bread? rain?" },
  { n: 1, sense: "kind thing about yourself", tip: "Just one. You showed up to practice today — that already counts." }
];

function clearCalmTimers() { calmTimers.forEach(t => clearInterval(t)); calmTimers = []; }

function calmBreathe() {
  clearCalmTimers();
  calmBody.innerHTML = `
    <div class="breathe-tool">
      <div class="breath-circle grow" id="breathCircle">
        <span><span id="breathLabel">breathe in…</span><span class="breath-count" id="breathCount">4</span></span>
      </div>
      <div class="phase-dots">${[0, 1, 2, 3].map(i => `<span class="phase-dot ${i === 0 ? "on" : ""}"></span>`).join("")}</div>
      <p>Box breathing: in for 4 — hold — out for 4 — hold.<br>Follow the circle and the count. Around and around, as long as you like.</p>
    </div>`;
  const circle = document.getElementById("breathCircle");
  const label = document.getElementById("breathLabel");
  const count = document.getElementById("breathCount");
  const phases = [
    { text: "breathe in…", cls: "grow" },
    { text: "hold…", cls: "grow" },
    { text: "breathe out…", cls: "shrink" },
    { text: "hold…", cls: "shrink" }
  ];
  let t = 0; // seconds, 0..15 looping
  calmTimers.push(setInterval(() => {
    t = (t + 1) % 16;
    const ph = Math.floor(t / 4);
    count.textContent = 4 - (t % 4);
    if (t % 4 === 0) {
      label.textContent = phases[ph].text;
      circle.classList.remove("grow", "shrink");
      circle.classList.add(phases[ph].cls);
      calmBody.querySelectorAll(".phase-dot").forEach((d, i) => d.classList.toggle("on", i === ph));
    }
  }, 1000));
}

// rain sounds — soft brown noise through a low-pass filter (no files needed)
let rainCtx = null, rainGain = null, rainOn = false;
function ensureRain() {
  if (rainCtx) return;
  rainCtx = new (window.AudioContext || window.webkitAudioContext)();
  const seconds = 4;
  const buffer = rainCtx.createBuffer(1, seconds * rainCtx.sampleRate, rainCtx.sampleRate);
  const data = buffer.getChannelData(0);
  let last = 0;
  for (let i = 0; i < data.length; i++) {
    const white = Math.random() * 2 - 1;
    last = (last + 0.02 * white) / 1.02;
    data[i] = last * 3.5;
  }
  const src = rainCtx.createBufferSource();
  src.buffer = buffer;
  src.loop = true;
  const filter = rainCtx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 850;
  rainGain = rainCtx.createGain();
  rainGain.gain.value = 0;
  src.connect(filter); filter.connect(rainGain); rainGain.connect(rainCtx.destination);
  src.start();
}
function setRain(on) {
  ensureRain();
  rainCtx.resume();
  rainOn = on;
  const t = rainCtx.currentTime;
  rainGain.gain.cancelScheduledValues(t);
  rainGain.gain.setValueAtTime(rainGain.gain.value, t);
  rainGain.gain.linearRampToValueAtTime(on ? 0.45 : 0, t + 1.2);
  const btn = document.getElementById("rainToggle");
  if (btn) btn.textContent = on ? "⏸ Pause the rain" : "▶ Start the rain";
}
function calmRain() {
  clearCalmTimers();
  calmBody.innerHTML = `
    <div class="rain-tool">
      <svg class="rain-art" viewBox="0 0 160 90" width="170" aria-hidden="true">
        <ellipse cx="70" cy="28" rx="38" ry="17" fill="#B9C9D6"/>
        <ellipse cx="100" cy="22" rx="30" ry="14" fill="#C9D6E0"/>
        <ellipse cx="45" cy="22" rx="24" ry="12" fill="#C9D6E0"/>
        <g stroke="#8FB6CC" stroke-width="3" stroke-linecap="round">
          <line class="rain-drop"    x1="45" y1="44" x2="42" y2="54"/>
          <line class="rain-drop r2" x1="70" y1="46" x2="67" y2="56"/>
          <line class="rain-drop r3" x1="95" y1="44" x2="92" y2="54"/>
          <line class="rain-drop r4" x1="120" y1="42" x2="117" y2="52"/>
          <line class="rain-drop r5" x1="58" y1="42" x2="55" y2="52"/>
        </g>
      </svg>
      <p>Soft, steady rain — generated right here, no internet needed.<br>Lots of people find it easier to focus with a little weather.</p>
      <button class="btn btn-primary rain-toggle" id="rainToggle">${rainOn ? "⏸ Pause the rain" : "▶ Start the rain"}</button>
      <p class="rain-note">🌧️ The rain keeps falling even after you close this panel — practice to it, if you like. Come back here to pause it.</p>
    </div>`;
  document.getElementById("rainToggle").addEventListener("click", () => setRain(!rainOn));
}

function calmGround() {
  clearCalmTimers();
  let step = 0;
  function drawStep() {
    if (step >= GROUND_STEPS.length) {
      calmBody.innerHTML = `
        <div class="ground-tool">
          <div class="ground-step">
            <div style="font-size:2rem">🌳</div>
            <p class="g-sense">You're here. Fully here.</p>
            <p>That's the whole exercise — five senses, one steady you. Head back whenever you're ready.</p>
          </div>
          <button class="btn btn-ghost" id="gAgain">Do it again</button>
        </div>`;
      calmBody.querySelector("#gAgain").addEventListener("click", () => { step = 0; drawStep(); });
      return;
    }
    const g = GROUND_STEPS[step];
    calmBody.innerHTML = `
      <div class="ground-tool">
        <div class="g-progress">${GROUND_STEPS.map((_, i) => `<span class="g-dot ${i <= step ? "on" : ""}"></span>`).join("")}</div>
        <div class="ground-step">
          <div class="g-num">${g.n}</div>
          <p class="g-sense">${g.sense}</p>
          <p>${g.tip}</p>
        </div>
        <button class="btn btn-primary" id="gNext">${step === GROUND_STEPS.length - 1 ? "Done 🌿" : "Found them → next"}</button>
      </div>`;
    calmBody.querySelector("#gNext").addEventListener("click", () => { step++; drawStep(); });
  }
  drawStep();
}

function calmWords() {
  clearCalmTimers();
  let last = -1;
  function drawCard() {
    let i;
    do { i = ri(0, AFFIRMATIONS.length - 1); } while (i === last && AFFIRMATIONS.length > 1);
    last = i;
    calmBody.innerHTML = `
      <div class="words-tool">
        <div class="affirm-card"><p>“${AFFIRMATIONS[i]}”</p></div>
        <button class="btn btn-primary" id="anotherWord">Another one 🌼</button>
      </div>`;
    calmBody.querySelector("#anotherWord").addEventListener("click", drawCard);
  }
  drawCard();
}

const CALM_TOOLS = { breathe: calmBreathe, ground: calmGround, words: calmWords, rain: calmRain };

let lastCalmTab = localStorage.getItem("mathbloom-calmtab") || "breathe";
if (!CALM_TOOLS[lastCalmTab]) lastCalmTab = "breathe";

function openCalm() {
  calmOverlay.hidden = false;
  document.querySelectorAll(".calm-tab").forEach(t => t.classList.toggle("active", t.dataset.calm === lastCalmTab));
  CALM_TOOLS[lastCalmTab]();
}
document.getElementById("calmBtn").addEventListener("click", openCalm);
document.getElementById("calmClose").addEventListener("click", () => { calmOverlay.hidden = true; clearCalmTimers(); });
calmOverlay.addEventListener("click", e => { if (e.target === calmOverlay) { calmOverlay.hidden = true; clearCalmTimers(); } });
addEventListener("keydown", e => { if (e.key === "Escape" && !calmOverlay.hidden) { calmOverlay.hidden = true; clearCalmTimers(); } });
document.querySelectorAll(".calm-tab").forEach(t =>
  t.addEventListener("click", () => {
    document.querySelectorAll(".calm-tab").forEach(x => x.classList.remove("active"));
    t.classList.add("active");
    lastCalmTab = t.dataset.calm;
    localStorage.setItem("mathbloom-calmtab", lastCalmTab);
    CALM_TOOLS[lastCalmTab]();
  }));

// ---------- dusk mode ----------
const duskBtn = document.getElementById("duskBtn");
function applyDusk(on) {
  document.body.classList.toggle("dusk", on);
  duskBtn.textContent = on ? "☀️" : "🌙";
  duskBtn.title = on ? "Daylight mode" : "Dusk mode";
  localStorage.setItem("mathbloom-dusk", on ? "1" : "0");
}
duskBtn.addEventListener("click", () => applyDusk(!document.body.classList.contains("dusk")));
applyDusk(localStorage.getItem("mathbloom-dusk") === "1");

// ---------- SUMMER PLAN ----------
const STEP_META = {
  warmup:   { icon: "☀️", cls: "step-warmup" },
  learn:    { icon: "📖", cls: "step-learn" },
  practice: { icon: "🌸", cls: "step-practice" },
  check:    { icon: "✓",  cls: "step-check" },
};

// a session counts as "grown" once its MathBloom practice has bloomed
const sessionDone = s => !!(s.lessonId && isBloomed(s.lessonId));

function planSessionHTML(s) {
  const done = sessionDone(s);
  const imChips = s.im.map(l =>
    `<a class="im-chip" href="${l.url}" target="_blank" rel="noopener">${l.code} · ${l.title} ↗</a>`).join("");
  const steps = s.steps.map(st => {
    const m = STEP_META[st.kind];
    return `
      <li class="plan-step ${m.cls}">
        <span class="step-icon" aria-hidden="true">${m.icon}</span>
        <div class="step-text">
          <span class="step-head"><strong>${st.label}</strong> <span class="step-time">${st.time}</span></span>
          <p>${st.body}</p>
        </div>
      </li>`;
  }).join("");
  const practiceBtn = s.lessonId
    ? `<button class="plan-go-btn" data-plan-lesson="${s.lessonId}">${done ? "🌸 Revisit practice" : "Open practice in MathBloom"} →</button>`
    : "";
  return `
    <article class="plan-session ${done ? "is-done" : ""}">
      <header class="ps-head">
        <span class="ps-label">${s.label}</span>
        <div class="ps-titles">
          <span class="ps-day">${s.day} · ${s.minutes}</span>
          <h4>${s.title}${done ? ' <span class="ps-grown">✓ grown</span>' : ""}</h4>
        </div>
      </header>
      <p class="ps-objective">${s.objective}</p>
      <div class="im-chips">${imChips}</div>
      <ol class="plan-steps">${steps}</ol>
      <div class="ps-coach"><span class="coach-tag">💛 Coach note</span> ${s.coach}</div>
      ${practiceBtn ? `<div class="ps-actions">${practiceBtn}</div>` : ""}
    </article>`;
}

function planWeekHTML(w, i) {
  const total = w.sessions.length;
  const done = w.sessions.filter(sessionDone).length;
  return `
    <section class="plan-week rise d${i + 2}">
      <header class="pw-head">
        <span class="pw-num">Week ${w.n}</span>
        <div class="pw-meta">
          <h3>${w.focus}</h3>
          <span class="pw-dates">${w.dates} · ${done}/${total} sessions grown</span>
        </div>
        <span class="pw-progress">${done === total && total ? "🌈" : `${done}/${total}`}</span>
      </header>
      <div class="pw-cando"><span class="cando-tag">🎯 Can-do goal</span> ${w.canDo}</div>
      <div class="pw-sessions">
        ${w.sessions.map(planSessionHTML).join("")}
      </div>
    </section>`;
}

function renderPlan() {
  const P = SUMMER_PLAN;
  const allSessions = P.weeks.flatMap(w => w.sessions);
  const grown = allSessions.filter(sessionDone).length;

  view.innerHTML = `
    <nav class="crumbs rise"><a href="#" data-home>← My garden</a> <span>/ Summer plan</span></nav>
    <header class="plan-hero rise d1">
      <span class="hero-kicker">${P.subtitle}</span>
      <h1>${P.title} <em>· Weeks 1–2</em></h1>
      <div class="plan-facts">
        <span class="plan-fact">🗓️ ${P.range}</span>
        <span class="plan-fact">⏱️ ${P.cadence}</span>
        <span class="plan-fact">🌸 ${grown}/${allSessions.length} sessions grown</span>
      </div>
      <p class="plan-intro">${P.intro}</p>
    </header>

    ${P.weeks.map(planWeekHTML).join("")}

    <section class="plan-rest rise d4">
      <h3>The rest of summer</h3>
      <p class="plan-rest-sub">Weeks 3–10 unlock the same way: Unit 4 wraps up, then proportional relationships (Unit 8), then percentages (Unit 9). We'll build these out as you reach them.</p>
      <div class="rest-grid">
        ${P.upcoming.map(u => `
          <button class="rest-card tint-${u.unit === "u4" ? "peach" : u.unit === "u8" ? "lilac" : "honey"}" data-plan-unit="${u.unit}">
            <span class="rest-num">Week ${u.n}</span>
            <span class="rest-dates">${u.dates}</span>
            <span class="rest-focus">${u.focus}</span>
          </button>`).join("")}
      </div>
    </section>

    <section class="plan-resources rise d5">
      <h3>Free resources</h3>
      <div class="res-list">
        ${P.resources.map(r => `
          <a class="res-row" href="${r.url}" target="_blank" rel="noopener">
            <span class="res-label">${r.label} ↗</span>
            <span class="res-note">${r.note}</span>
          </a>`).join("")}
      </div>
      <p class="plan-footnote">Previewing means exposure, not mastery — the goal is that these units feel familiar next year. It's fine to leave a few rough edges. 🌱</p>
    </section>`;

  view.querySelector("[data-home]").addEventListener("click", e => { e.preventDefault(); go(renderHome); });
  view.querySelectorAll("[data-plan-lesson]").forEach(b =>
    b.addEventListener("click", () => {
      const id = b.dataset.planLesson;
      go(() => renderLesson(id, isLearned(id) ? "practice" : "learn"));
    }));
  view.querySelectorAll("[data-plan-unit]").forEach(b =>
    b.addEventListener("click", () => go(() => renderUnit(b.dataset.planUnit))));
  window.scrollTo({ top: 0 });
}

// ---------- boot ----------
document.getElementById("planBtn").addEventListener("click", () => { location.hash = "plan"; go(renderPlan); });
document.getElementById("logoLink").addEventListener("click", e => { e.preventDefault(); if (location.hash) location.hash = ""; go(renderHome); });
if (location.hash === "#plan") renderPlan(); else renderHome();
