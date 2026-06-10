/* ============================================================
   MathBloom — app engine
   ============================================================ */

const GOAL = 5; // correct answers for a lesson to bloom
const STORE_KEY = "mathbloom-progress-v1";

// ---------- progress (localStorage) ----------
function loadProgress() {
  try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; }
  catch { return {}; }
}
function saveProgress(p) { localStorage.setItem(STORE_KEY, JSON.stringify(p)); }
let progress = loadProgress();
const lessonStars = id => Math.min(GOAL, (progress[id] && progress[id].stars) || 0);
const isBloomed = id => lessonStars(id) >= GOAL;

// ---------- flower SVG ----------
const FLOWER_COLORS = [
  ["#F2A07B", "#C9703F"], ["#E9A0A8", "#C76A74"], ["#C9B8E8", "#9A82C9"],
  ["#F6D88C", "#C9A23D"], ["#8FBFD9", "#5E93B5"]
];
function flowerSVG(size = 44, colorIdx = 0, withStem = true) {
  const [petal, edge] = FLOWER_COLORS[colorIdx % FLOWER_COLORS.length];
  const stem = withStem
    ? `<rect x="22.5" y="30" width="3" height="16" rx="1.5" fill="#7FA98A"/>
       <ellipse cx="17" cy="40" rx="5" ry="2.6" fill="#7FA98A" transform="rotate(-28 17 40)"/>`
    : "";
  return `
  <svg viewBox="0 0 48 48" width="${size}" height="${size}" class="garden-flower" aria-hidden="true">
    ${stem}
    <g>
      <ellipse cx="24" cy="13" rx="5.5" ry="9" fill="${petal}" stroke="${edge}" stroke-width="1"/>
      <ellipse cx="24" cy="29" rx="5.5" ry="9" fill="${petal}" stroke="${edge}" stroke-width="1"/>
      <ellipse cx="16" cy="21" rx="9" ry="5.5" fill="${petal}" stroke="${edge}" stroke-width="1"/>
      <ellipse cx="32" cy="21" rx="9" ry="5.5" fill="${petal}" stroke="${edge}" stroke-width="1"/>
    </g>
    <circle cx="24" cy="21" r="5.5" fill="#F6D88C" stroke="#C9A23D" stroke-width="1"/>
  </svg>`;
}
function seedSVG(size = 30) {
  return `
  <svg viewBox="0 0 48 48" width="${size}" height="${size}" aria-hidden="true">
    <path d="M24 40 C 20 32 20 26 24 20 C 28 26 28 32 24 40 Z" fill="#B9CBB0"/>
    <circle cx="24" cy="42" r="3.5" fill="#C9B79A"/>
  </svg>`;
}
function sproutSVG(size = 34) {
  return `
  <svg viewBox="0 0 48 48" width="${size}" height="${size}" aria-hidden="true">
    <rect x="22.5" y="24" width="3" height="20" rx="1.5" fill="#7FA98A"/>
    <path d="M24 26 C 16 24 12 17 13 10 C 21 11 25 18 24 26 Z" fill="#8FB996"/>
    <path d="M24 30 C 31 28 35 22 34 16 C 27 17 23 23 24 30 Z" fill="#A8CCA8"/>
  </svg>`;
}

// progress flower for lesson rows: seed → sprout → flower
function lessonFlower(id) {
  const s = lessonStars(id);
  if (s >= GOAL) return flowerSVG(46, hashIdx(id));
  if (s >= 2) return sproutSVG(40);
  return seedSVG(36);
}
function hashIdx(id) { let h = 0; for (const c of id) h += c.charCodeAt(0); return h % FLOWER_COLORS.length; }

// ---------- view helpers ----------
const view = document.getElementById("view");
const esc = s => s; // content is trusted (authored in lessons.js)

function findLesson(lid) {
  for (const u of UNITS) for (const l of u.lessons) if (l.id === lid) return { unit: u, lesson: l };
  return null;
}
function unitProgress(u) {
  const total = u.lessons.length * GOAL;
  const got = u.lessons.reduce((a, l) => a + lessonStars(l.id), 0);
  return { got, total, pct: total ? got / total : 0 };
}

// ---------- HOME ----------
function renderHome() {
  const bloomedAll = UNITS.flatMap(u => u.lessons).filter(l => isBloomed(l.id));
  const totalLessons = UNITS.reduce((a, u) => a + u.lessons.length, 0);

  const plots = UNITS.flatMap(u => u.lessons).map((l, i) => `
    <div class="garden-plot">
      ${isBloomed(l.id) ? flowerSVG(56, i) : lessonStars(l.id) >= 2 ? sproutSVG(44) : seedSVG(34)}
    </div>`).join("");

  view.innerHTML = `
    <section class="hero rise">
      <span class="hero-kicker">Math 6 Plus • Units 4, 8 &amp; 9</span>
      <h1>Math practice that <em>grows</em> with you</h1>
      <p class="lede">Pick a lesson, learn at your own pace, and watch your garden bloom.
      Every mistake is just a seed that hasn't sprouted yet.</p>
      <div class="promise-row">
        <span class="promise">🌿 No timers</span>
        <span class="promise">🌼 No grades</span>
        <span class="promise">🌱 Unlimited tries</span>
        <span class="promise">💛 Hints whenever you want</span>
      </div>
    </section>

    <section class="garden rise d2">
      <div class="garden-head">
        <h2>Your garden</h2>
        <span>${bloomedAll.length} of ${totalLessons} lessons in bloom</span>
      </div>
      <div class="garden-row">${plots}</div>
      <div class="garden-soil"></div>
    </section>

    <section class="units">
      ${UNITS.map((u, i) => {
        const p = unitProgress(u);
        const R = 17, C = 2 * Math.PI * R;
        return `
        <button class="unit-card ${u.tint} rise d${i + 3}" data-unit="${u.id}">
          <span class="unit-num">${u.num}</span>
          <h3>${u.title}</h3>
          <p>${u.blurb}</p>
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
    b.addEventListener("click", () => renderUnit(b.dataset.unit)));
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
      <p>${u.blurb} Tap a lesson to learn the idea first, then practice until it blooms — five correct answers, any number of tries, no rush at all.</p>
    </header>
    <div class="lesson-list">
      ${u.lessons.map((l, i) => `
        <button class="lesson-row rise d${i + 2}" data-lesson="${l.id}">
          <span class="lesson-flower">${lessonFlower(l.id)}</span>
          <span class="lesson-body">
            <h3>${l.title}</h3>
            <p>${l.blurb}</p>
            <span class="lesson-petals">
              ${Array.from({ length: GOAL }, (_, j) =>
                `<span class="petal-pip ${j < lessonStars(l.id) ? "full" : ""}"></span>`).join("")}
            </span>
          </span>
          ${isBloomed(l.id) ? `<span class="bloomed-tag">Bloomed</span>` : ""}
          <span class="lesson-go">→</span>
        </button>`).join("")}
    </div>
    <div class="sprout-note rise d5">
      ${sproutSVG(30)}
      <p>Already bloomed a lesson? You can always come back and practice more — gardens love attention.</p>
    </div>`;

  view.querySelector("[data-home]").addEventListener("click", e => { e.preventDefault(); renderHome(); });
  view.querySelectorAll("[data-lesson]").forEach(b =>
    b.addEventListener("click", () => renderLesson(b.dataset.lesson, "learn")));
  window.scrollTo({ top: 0 });
}

// ---------- LESSON ----------
function renderLesson(lid, tab) {
  const found = findLesson(lid);
  if (!found) return renderHome();
  const { unit, lesson } = found;

  view.innerHTML = `
    <nav class="crumbs rise">
      <a href="#" data-home>← My garden</a> <span>/</span>
      <a href="#" data-unit>${unit.num}</a> <span>/ ${lesson.title}</span>
    </nav>
    <header class="lesson-head rise d1">
      <h1>${lesson.title}</h1>
      <p class="sub">${lesson.blurb}</p>
      <div class="tabs">
        <button class="tab ${tab === "learn" ? "active" : ""}" data-tab="learn">🌱 Learn</button>
        <button class="tab ${tab === "practice" ? "active" : ""}" data-tab="practice">🌸 Practice</button>
      </div>
    </header>
    <div id="panel"></div>`;

  view.querySelector("[data-home]").addEventListener("click", e => { e.preventDefault(); renderHome(); });
  view.querySelector("[data-unit]").addEventListener("click", e => { e.preventDefault(); renderUnit(unit.id); });
  view.querySelectorAll("[data-tab]").forEach(b =>
    b.addEventListener("click", () => renderLesson(lid, b.dataset.tab)));

  if (tab === "learn") renderLearn(lesson);
  else renderPractice(lesson);
  window.scrollTo({ top: 0 });
}

function renderLearn(lesson) {
  const panel = document.getElementById("panel");
  panel.innerHTML = `
    <div class="learn rise d2">
      ${lesson.teach}
      <div class="go-practice">
        <button class="btn btn-primary" id="goPractice">I'm ready to practice 🌸</button>
      </div>
    </div>`;
  panel.querySelector("#goPractice").addEventListener("click", () => renderLesson(lesson.id, "practice"));
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

function renderPractice(lesson) {
  const panel = document.getElementById("panel");
  let q = lesson.generate();
  let attempts = 0;
  let hintIdx = 0;
  let pickedChoice = -1;
  let solved = false;

  function bloomBarHTML() {
    const s = lessonStars(lesson.id);
    return `
      <div class="bloom-bar rise d2">
        <span class="label">${isBloomed(lesson.id) ? "In full bloom — extra practice mode" : "Petals to bloom:"}</span>
        <span class="bloom-petals">
          ${Array.from({ length: GOAL }, (_, j) => `<span class="bloom-petal ${j < s ? "full" : ""}"></span>`).join("")}
        </span>
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
            <button class="btn btn-soft" id="hintBtn">💡 Hint, please</button>
            <button class="btn btn-ghost" id="skipBtn">Try a different one</button>
          </div>
          <div id="feedback"></div>
          <div id="hints"></div>
          <div id="steps"></div>
        </div>
        <div class="sprout-note">
          ${sproutSVG(30)}
          <p>Hints and skips never cost you anything here. Asking for help <em>is</em> a math skill.</p>
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
    panel.querySelector("#skipBtn").addEventListener("click", nextQuestion);
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
    if (correct) onCorrect();
    else onIncorrect();
  }

  function onCorrect() {
    solved = true;
    const earned = !isBloomed(lesson.id);
    progress[lesson.id] = { stars: lessonStars(lesson.id) + (lessonStars(lesson.id) < GOAL ? 1 : 0) };
    saveProgress(progress);

    smallConfetti();
    const fb = panel.querySelector("#feedback");
    fb.innerHTML = `
      <div class="feedback good">
        <p class="fb-title">${PRAISE[ri(0, PRAISE.length - 1)]} 🌸</p>
        <p>${earned && lessonStars(lesson.id) <= GOAL ? "A new petal opens up." : "Extra practice — your garden gets stronger."}</p>
      </div>
      <div class="q-actions">
        <button class="btn btn-primary" id="nextBtn">Next question →</button>
      </div>`;
    refreshPetals();
    panel.querySelector("#checkBtn").disabled = true;

    if (isBloomed(lesson.id) && earned && lessonStars(lesson.id) === GOAL) {
      setTimeout(() => bloomCelebration(), 700);
      return;
    }
    fb.querySelector("#nextBtn").addEventListener("click", nextQuestion);
    fb.querySelector("#nextBtn").focus();
  }

  function onIncorrect() {
    const fb = panel.querySelector("#feedback");
    if (attempts < 2) {
      flashFeedback("gentle", GENTLE[ri(0, GENTLE.length - 1)], "Take another look — or tap <strong>Hint</strong> and we'll figure it out together.");
    } else {
      fb.innerHTML = `
        <div class="feedback gentle">
          <p class="fb-title">${GENTLE[ri(0, GENTLE.length - 1)]}</p>
          <p>Want to see the steps? Watching a solution unfold is real learning — it counts.</p>
        </div>
        <div class="q-actions">
          <button class="btn btn-soft" id="revealBtn">🌿 Show me the steps</button>
        </div>`;
      fb.querySelector("#revealBtn").addEventListener("click", showSteps);
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
        That's every hint for this one — tap <strong>Check</strong> with your best idea, or <strong>Try a different one</strong>. Both are great choices.</div>`);
      panel.querySelector("#hintBtn").disabled = true;
      return;
    }
    box.insertAdjacentHTML("beforeend", `
      <div class="hint-box"><span class="tag">Hint ${hintIdx + 1}</span>${q.hints[hintIdx]}</div>`);
    hintIdx++;
  }

  function showSteps() {
    solved = true;
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
    panel.innerHTML = `
      <div class="practice">
        <div class="bloom-banner">
          <span class="big-flower">${flowerSVG(86, hashIdx(lesson.id))}</span>
          <h2>${lesson.title} just bloomed! </h2>
          <p>Five petals, fully open. You grew this one yourself — hints, retries, breaths and all. It's yours now.</p>
          <div class="q-actions" style="justify-content:center">
            <button class="btn btn-primary" id="backUnit">Back to the unit 🌿</button>
            <button class="btn btn-ghost" id="keepGoing">Keep practicing this lesson</button>
          </div>
        </div>
      </div>`;
    panel.querySelector("#backUnit").addEventListener("click", () => renderUnit(findLesson(lesson.id).unit.id));
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

// ---------- breathing overlay ----------
const breathOverlay = document.getElementById("breathOverlay");
const breathLabel = document.getElementById("breathLabel");
let breathTimer = null;

document.getElementById("breathBtn").addEventListener("click", () => {
  breathOverlay.hidden = false;
  let inhale = true;
  breathLabel.textContent = "breathe in…";
  breathTimer = setInterval(() => {
    inhale = !inhale;
    breathLabel.textContent = inhale ? "breathe in…" : "breathe out…";
  }, 4000);
});
document.getElementById("breathClose").addEventListener("click", () => {
  breathOverlay.hidden = true;
  clearInterval(breathTimer);
});

// ---------- boot ----------
document.getElementById("logoLink").addEventListener("click", e => { e.preventDefault(); renderHome(); });
renderHome();
