/* ============================================================
   MathBloom — "Lessons to work on before next session"
   Two practice lessons that live right under the hero:
     1. Times Tables (×1–12)  — a 15-minute timed drill
     2. Week 3 Recap          — 15 mixed problems from
                                u8l1 (Tables & k) + u8l2 (y = kx)
   Self-contained: reuses the app's CSS + the global go()/view/renderHome.
   ============================================================ */

(function () {
  "use strict";

  const RKEY = "mathbloom-review-v3";

  // ---- progress (only the recap tracks per-question progress) ----
  function loadReview() {
    try { return JSON.parse(localStorage.getItem(RKEY)) || {}; }
    catch { return {}; }
  }
  function saveReview(r) {
    try { localStorage.setItem(RKEY, JSON.stringify(r)); } catch (e) {}
  }
  let rdone = loadReview(); // { lessonKey: { "p3": true, ... } }

  function markDone(key, qid) {
    if (!rdone[key]) rdone[key] = {};
    rdone[key][qid] = true;
    saveReview(rdone);
  }
  function doneCount(key) {
    return rdone[key] ? Object.keys(rdone[key]).length : 0;
  }

  function parseNum(raw) {
    let s = String(raw).trim().replace(/[$,%]/g, "").replace(/\s+/g, "");
    if (!s) return NaN;
    if (s.includes("/")) {
      const [a, b] = s.split("/").map(Number);
      if (!isNaN(a) && !isNaN(b) && b !== 0) return a / b;
      return NaN;
    }
    return Number(s);
  }

  const PRAISE = ["Correct!", "Yes!", "Nailed it.", "Beautiful.", "That's it.", "Right on.", "Lovely work."];
  function pickPraise() { return PRAISE[Math.floor(Math.random() * PRAISE.length)]; }

  function goHome() {
    if (typeof go === "function") go(renderHome); else renderHome();
  }

  // ============================================================
  //  1) TIMES TABLES — a 15-minute timed drill (×1–12)
  // ============================================================
  const DRILL = {
    sessionMin: 15,      // total practice time
    perQuestionSec: 15,  // time limit per question
    bankSize: 1000,      // size of the question word bank
    maxFactor: 12,       // factors 1 … 12
  };

  // Build a word bank of 1000 questions, each a pair of factors 1–12.
  function buildBank() {
    const bank = [];
    for (let i = 0; i < DRILL.bankSize; i++) {
      const a = 1 + Math.floor(Math.random() * DRILL.maxFactor);
      const b = 1 + Math.floor(Math.random() * DRILL.maxFactor);
      bank.push([a, b]);
    }
    return bank;
  }

  function fmtClock(ms) {
    const s = Math.max(0, Math.round(ms / 1000));
    const m = Math.floor(s / 60);
    return m + ":" + String(s % 60).padStart(2, "0");
  }

  // module-scoped timers so navigating away can never leave one ticking
  let drillQTimer = null, drillSessTimer = null;
  function clearDrillTimers() {
    if (drillQTimer) { clearInterval(drillQTimer); drillQTimer = null; }
    if (drillSessTimer) { clearInterval(drillSessTimer); drillSessTimer = null; }
  }

  function renderTimesDrill() {
    clearDrillTimers();
    const view = document.getElementById("view");
    const bank = buildBank();

    let idx = 0;
    let attempted = 0, firstTry = 0;
    let qLeft = DRILL.perQuestionSec;
    let cur = null;
    let phase = "ask"; // ask → fix → done
    const sessionEndAt = Date.now() + DRILL.sessionMin * 60 * 1000;

    view.innerHTML = `
      <nav class="crumbs rise"><a href="#" data-home>← My garden</a> <span>/ Before next session</span> <span>/ Times Tables</span></nav>

      <header class="drill-hero rise d1">
        <span class="hero-kicker">Practice 1 · timed drill · ×1–12</span>
        <h1>✖️ Times Tables Drill</h1>
        <p class="lede">Fifteen minutes of quick facts, fifteen seconds each. Miss one and you'll type the right answer before moving on — that's how it locks in. 🌱</p>
        <div class="drill-stats">
          <span class="drill-stat"><span class="ds-label">Time left</span><span class="ds-val" id="drillClock">${DRILL.sessionMin}:00</span></span>
          <span class="drill-stat"><span class="ds-label">Answered</span><span class="ds-val" id="drillAnswered">0</span></span>
          <span class="drill-stat"><span class="ds-label">First-try&nbsp;✓</span><span class="ds-val" id="drillCorrect">0</span></span>
          <button class="drill-finish" id="drillFinish">Finish early</button>
        </div>
      </header>

      <section class="drill-card rise d2">
        <div class="drill-timer">
          <span class="drill-timer-num" id="drillTimerNum">${DRILL.perQuestionSec}s</span>
          <span class="drill-timer-track"><span class="drill-timer-bar" id="drillTimerBar"></span></span>
        </div>
        <div class="drill-question" id="drillQ">— × —</div>
        <div class="answer-row drill-answer">
          <input class="answer-input" id="drillInput" type="text" inputmode="numeric" pattern="[0-9]*"
            placeholder="answer" autocomplete="off" aria-label="Your answer">
          <button class="btn btn-primary" id="drillSubmit">Check</button>
          <button class="btn btn-primary" id="drillContinue" style="display:none">Continue →</button>
        </div>
        <div class="drill-feedback" id="drillFeedback"></div>
        <p class="drill-bankline">Drawing from a 1,000-question times-table bank.</p>
      </section>`;

    const el = id => document.getElementById(id);
    const els = {
      clock: el("drillClock"), answered: el("drillAnswered"), correct: el("drillCorrect"),
      q: el("drillQ"), timerNum: el("drillTimerNum"), timerBar: el("drillTimerBar"),
      input: el("drillInput"), submit: el("drillSubmit"), cont: el("drillContinue"),
      feedback: el("drillFeedback"),
    };
    const answerOf = () => cur[0] * cur[1];
    const aliveOrStop = () => {
      if (document.body.contains(els.clock)) return true;
      clearDrillTimers(); // we've navigated away — stop ticking
      return false;
    };

    // ---- session countdown (whole drill) ----
    drillSessTimer = setInterval(() => {
      if (!aliveOrStop()) return;
      const left = sessionEndAt - Date.now();
      els.clock.textContent = fmtClock(left);
      if (left <= 0) endSession();
    }, 250);

    function drawTimer() {
      els.timerNum.textContent = qLeft + "s";
      els.timerBar.style.width = (qLeft / DRILL.perQuestionSec * 100) + "%";
      els.timerBar.classList.toggle("is-low", qLeft <= 5);
    }
    function startQTimer() {
      if (drillQTimer) clearInterval(drillQTimer);
      drillQTimer = setInterval(() => {
        if (!aliveOrStop()) return;
        qLeft--;
        drawTimer();
        if (qLeft <= 0) { clearInterval(drillQTimer); drillQTimer = null; timeUp(); }
      }, 1000);
    }

    function nextQuestion() {
      if (Date.now() >= sessionEndAt) return endSession();
      cur = bank[idx % bank.length]; idx++;
      phase = "ask";
      qLeft = DRILL.perQuestionSec;
      els.q.textContent = cur[0] + " × " + cur[1];
      els.input.value = "";
      els.input.disabled = false;
      els.input.placeholder = "answer";
      els.submit.style.display = "";
      els.submit.disabled = false;
      els.cont.style.display = "none";
      els.feedback.className = "drill-feedback";
      els.feedback.textContent = "";
      drawTimer();
      startQTimer();
      els.input.focus();
    }

    function submit() {
      if (phase === "ask") {
        const val = parseInt(els.input.value, 10);
        if (isNaN(val)) {
          els.feedback.className = "drill-feedback gentle";
          els.feedback.textContent = "Type a number, then Check.";
          els.input.focus();
          return;
        }
        if (drillQTimer) { clearInterval(drillQTimer); drillQTimer = null; }
        attempted++;
        if (val === answerOf()) { firstTry++; markRight(); }
        else enterFix(false);
      } else if (phase === "fix") {
        const val = parseInt(els.input.value, 10);
        if (val === answerOf()) reachedFixed();
        else {
          els.feedback.className = "drill-feedback try";
          els.feedback.innerHTML = `Almost — type <strong>${answerOf()}</strong> to keep going.`;
          els.input.select();
        }
      }
    }

    function timeUp() {
      if (phase !== "ask") return;
      attempted++;
      enterFix(true);
    }

    function markRight() {
      phase = "done";
      els.feedback.className = "drill-feedback good";
      els.feedback.innerHTML = `<strong>${pickPraise()}</strong> &nbsp;${cur[0]} × ${cur[1]} = ${answerOf()} 🌸`;
      showContinue();
    }

    function enterFix(timedOut) {
      phase = "fix";
      const a = answerOf();
      els.feedback.className = "drill-feedback fix";
      els.feedback.innerHTML = `${timedOut ? "⏰ Time's up! " : "Not quite. "}<strong>${cur[0]} × ${cur[1]} = ${a}</strong>. Type <strong>${a}</strong> to continue.`;
      els.input.value = "";
      els.input.disabled = false;
      els.input.placeholder = "type " + a;
      els.input.focus();
      els.timerBar.classList.remove("is-low");
    }

    function reachedFixed() {
      phase = "done";
      els.feedback.className = "drill-feedback good";
      els.feedback.innerHTML = `Got it — ${cur[0]} × ${cur[1]} = ${answerOf()}. That one's sticking now. 🌱`;
      showContinue();
    }

    function showContinue() {
      els.input.disabled = true;
      els.submit.style.display = "none";
      els.cont.style.display = "";
      els.answered.textContent = attempted;
      els.correct.textContent = firstTry;
      els.cont.focus();
    }

    function endSession() {
      clearDrillTimers();
      const pct = attempted ? Math.round(firstTry / attempted * 100) : 0;
      view.innerHTML = `
        <nav class="crumbs rise"><a href="#" data-home>← My garden</a> <span>/ Before next session</span> <span>/ Times Tables</span></nav>
        <header class="review-hero rise d1">
          <span class="hero-kicker">Practice 1 · complete</span>
          <h1>✖️ Nice drilling!</h1>
          <p class="lede">Your fifteen minutes are up — every fact you typed out is one that's sticking.</p>
        </header>
        <section class="recap-card rise d2 drill-summary">
          <p class="ds-big">${firstTry} / ${attempted}</p>
          <p class="ds-sub">first-try correct${attempted ? ` &nbsp;·&nbsp; ${pct}%` : ""}</p>
          <div class="drill-summary-actions">
            <button class="btn btn-primary" id="drillAgain">Practice again</button>
            <button class="btn btn-ghost" id="drillBack">← Back to my garden</button>
          </div>
        </section>`;
      const home = view.querySelector("[data-home]");
      if (home) home.addEventListener("click", e => { e.preventDefault(); goHome(); });
      const again = view.querySelector("#drillAgain");
      if (again) again.addEventListener("click", () => {
        if (typeof go === "function") go(renderTimesDrill); else renderTimesDrill();
      });
      const back = view.querySelector("#drillBack");
      if (back) back.addEventListener("click", goHome);
      window.scrollTo({ top: 0 });
    }

    // ---- wire ----
    view.querySelector("[data-home]").addEventListener("click", e => {
      e.preventDefault(); clearDrillTimers(); goHome();
    });
    els.submit.addEventListener("click", submit);
    els.cont.addEventListener("click", nextQuestion);
    els.input.addEventListener("keydown", e => {
      if (e.key !== "Enter") return;
      e.preventDefault();
      if (phase === "done") nextQuestion(); else submit();
    });
    el("drillFinish").addEventListener("click", endSession);

    nextQuestion();
    window.scrollTo({ top: 0 });
  }

  // ============================================================
  //  2) WEEK 3 RECAP — 15 mixed problems (u8l1 + u8l2)
  //  Each problem: { prompt, answer, unit?, hint, steps }
  // ============================================================
  const LESSONS = {
    w3recap: {
      key: "w3recap",
      emoji: "🔁",
      title: "Week 3 Recap",
      blurb: "Fifteen mixed problems from Tables & the Constant of Proportionality and Equations y = kx.",
      intro: `A quick mixed set from this week's two lessons — finding <span class="math">k</span> from tables, what <span class="math">k</span> means, filling gaps, and running the equation <span class="math">y = kx</span> forward and backward. Type your answer and press Check. Hints and steps are always free. 🌱`,
      practice: [
        { prompt: `5 movie tickets cost <strong>$20</strong>. What is <span class="math">k</span>, the cost of one ticket?`,
          answer: 4, unit: "$",
          hint: `k = total ÷ how many = 20 ÷ 5.`,
          steps: [`k = y ÷ x = 20 ÷ 5 = <strong>4</strong>.`, `Each ticket costs $4.`] },
        { prompt: `Apples cost a steady price: <strong>3 pounds for $9</strong>. What is <span class="math">k</span> (dollars per pound)?`,
          answer: 3, unit: "$/lb",
          hint: `Divide cost ÷ pounds.`,
          steps: [`k = 9 ÷ 3 = <strong>3</strong>.`, `Apples are $3 a pound.`] },
        { prompt: `Smoothies are <strong>$3 each</strong>. What do <strong>7</strong> smoothies cost?`,
          answer: 21, unit: "$",
          hint: `Multiply the price of one by how many: 3 × 7.`,
          steps: [`Total = k × x = 3 × 7 = <strong>21</strong>.`] },
        { prompt: `A car drives a steady speed: <strong>60 miles in 2 hours</strong>. What is <span class="math">k</span> (miles per hour)?`,
          answer: 30, unit: "mph",
          hint: `k = miles ÷ hours.`,
          steps: [`k = 60 ÷ 2 = <strong>30</strong> miles per hour.`] },
        { prompt: `At <strong>30 miles per hour</strong>, how far do you go in <strong>5 hours</strong>?`,
          answer: 150, unit: "miles",
          hint: `Distance = speed × time = 30 × 5.`,
          steps: [`y = kx = 30 × 5 = <strong>150 miles</strong>.`] },
        { prompt: `A proportional table shows <strong>4 → 12</strong>. What value is paired with <strong>9</strong>?`,
          answer: 27,
          hint: `First find k = 12 ÷ 4, then multiply by 9.`,
          steps: [`k = 12 ÷ 4 = 3.`, `9 × 3 = <strong>27</strong>.`] },
        { prompt: `Use the equation <span class="math">y = 6x</span>. Find <span class="math">y</span> when <span class="math">x = 8</span>.`,
          answer: 48,
          hint: `Forward direction — multiply.`,
          steps: [`y = 6 × 8 = <strong>48</strong>.`] },
        { prompt: `Use <span class="math">y = 4x</span>. If <span class="math">y = 36</span>, find <span class="math">x</span>.`,
          answer: 9,
          hint: `Backward direction — divide: 36 ÷ 4.`,
          steps: [`36 = 4x, so x = 36 ÷ 4 = <strong>9</strong>.`] },
        { prompt: `A printer prints <strong>6 pages a minute</strong>, so <span class="math">y = 6x</span>. How many pages in <strong>9 minutes</strong>?`,
          answer: 54, unit: "pages",
          hint: `Forward — multiply 6 × 9.`,
          steps: [`y = 6 × 9 = <strong>54 pages</strong>.`] },
        { prompt: `<strong>8 markers</strong> cost <strong>$24</strong>. What is <span class="math">k</span>, the cost of one marker?`,
          answer: 3, unit: "$",
          hint: `k = 24 ÷ 8.`,
          steps: [`k = 24 ÷ 8 = <strong>3</strong>. Each marker is $3.`] },
        { prompt: `Maria reads <strong>90 words in 3 minutes</strong>. What is <span class="math">k</span> (words per minute)?`,
          answer: 30, unit: "wpm",
          hint: `k = words ÷ minutes = 90 ÷ 3.`,
          steps: [`k = 90 ÷ 3 = <strong>30</strong> words per minute.`] },
        { prompt: `At <strong>30 words per minute</strong>, how many words in <strong>10 minutes</strong>?`,
          answer: 300, unit: "words",
          hint: `Multiply 30 × 10.`,
          steps: [`y = kx = 30 × 10 = <strong>300 words</strong>.`] },
        { prompt: `A proportional table shows <strong>2 → 10</strong>. What is <span class="math">k</span>?`,
          answer: 5,
          hint: `k = y ÷ x = 10 ÷ 2.`,
          steps: [`k = 10 ÷ 2 = <strong>5</strong>.`] },
        { prompt: `Tacos are <strong>$4 each</strong> (<span class="math">y = 4x</span>). You spent <strong>$36</strong>. How many tacos?`,
          answer: 9, unit: "tacos",
          hint: `Backward — divide: 36 ÷ 4.`,
          steps: [`36 = 4x, so x = 36 ÷ 4 = <strong>9 tacos</strong>.`] },
        { prompt: `Use <span class="math">y = 7x</span>. Find <span class="math">y</span> when <span class="math">x = 6</span>.`,
          answer: 42,
          hint: `Forward — multiply 7 × 6.`,
          steps: [`y = 7 × 6 = <strong>42</strong>.`] },
      ],
    },
  };

  function qCardHTML(l, q, qid, label) {
    const solved = !!(rdone[l.key] && rdone[l.key][qid]);
    return `
      <div class="rq ${solved ? "is-solved" : ""}" data-qid="${qid}">
        <div class="rq-head">
          <span class="rq-label">${label}</span>
          ${solved ? `<span class="rq-check">✓ solved</span>` : ""}
        </div>
        <p class="rq-prompt">${q.prompt}</p>
        <div class="answer-row">
          <input class="answer-input" type="text" inputmode="decimal" placeholder="your answer"
            autocomplete="off" aria-label="Your answer"${solved ? " disabled" : ""}>
          ${q.unit ? `<span class="answer-unit">${q.unit}</span>` : ""}
          <button class="btn btn-primary rq-check-btn"${solved ? " disabled" : ""}>Check</button>
        </div>
        <div class="rq-tools">
          ${q.hint ? `<button class="stuck-chip rq-hint">💡 hint</button>` : ""}
          <button class="stuck-chip rq-steps">🌿 see the steps</button>
        </div>
        <div class="rq-feedback"></div>
      </div>`;
  }

  function renderReview(key) {
    const l = LESSONS[key];
    if (!l) { if (typeof renderHome === "function") return renderHome(); return; }
    const view = document.getElementById("view");
    const warmups = l.warmups || [];
    const total = warmups.length + l.practice.length;

    view.innerHTML = `
      <nav class="crumbs rise"><a href="#" data-home>← My garden</a> <span>/ Before next session</span> <span>/ ${l.title}</span></nav>

      <header class="review-hero rise d1">
        <span class="hero-kicker">Practice 2 · before next session</span>
        <h1>${l.emoji} ${l.title}</h1>
        <p class="lede">${l.blurb}</p>
        <div class="review-progress">
          <span class="rp-bar"><span class="rp-fill" id="rpFill"></span></span>
          <span class="rp-text" id="rpText"></span>
        </div>
      </header>

      ${l.intro ? `<section class="recap-card rise d2"><span class="recap-tag">📖 What this covers</span><p>${l.intro}</p></section>` : ""}

      ${warmups.length ? `
      <section class="qgroup rise d3">
        <h2 class="qgroup-title">🌱 Warm-ups <span>ease in — these are gentle</span></h2>
        ${warmups.map((q, i) => qCardHTML(l, q, "w" + i, "Warm-up " + (i + 1))).join("")}
      </section>` : ""}

      <section class="qgroup rise d4">
        <h2 class="qgroup-title">🌸 Practice <span>${l.practice.length} problems to grow on</span></h2>
        ${l.practice.map((q, i) => qCardHTML(l, q, "p" + i, "Problem " + (i + 1))).join("")}
      </section>

      <div class="review-foot rise" id="reviewFoot"></div>`;

    view.querySelector("[data-home]").addEventListener("click", e => { e.preventDefault(); goHome(); });

    const all = [...warmups.map((q, i) => ["w" + i, q]), ...l.practice.map((q, i) => ["p" + i, q])];
    all.forEach(([qid, q]) => {
      const row = view.querySelector(`.rq[data-qid="${qid}"]`);
      if (!row) return;
      const input = row.querySelector(".answer-input");
      const fb = row.querySelector(".rq-feedback");
      const checkBtn = row.querySelector(".rq-check-btn");
      const stepsBtn = row.querySelector(".rq-steps");
      const hintBtn = row.querySelector(".rq-hint");

      const finish = () => {
        row.classList.add("is-solved");
        input.disabled = true;
        checkBtn.disabled = true;
        if (!row.querySelector(".rq-check")) {
          const c = document.createElement("span");
          c.className = "rq-check";
          c.textContent = "✓ solved";
          row.querySelector(".rq-head").appendChild(c);
        }
        markDone(l.key, qid);
        updateProgress();
      };

      const check = () => {
        if (row.classList.contains("is-solved")) return;
        const val = parseNum(input.value);
        if (isNaN(val)) {
          fb.className = "rq-feedback gentle";
          fb.innerHTML = `I couldn't read that as a number — try something like <strong>12</strong>, <strong>3.5</strong>, or <strong>1/2</strong>.`;
          input.focus();
          return;
        }
        if (Math.abs(val - q.answer) < 0.011) {
          fb.className = "rq-feedback good";
          fb.innerHTML = `<strong>${pickPraise()}</strong> 🌸`;
          finish();
          if (typeof smallConfetti === "function") { try { smallConfetti(); } catch (e) {} }
        } else {
          fb.className = "rq-feedback try";
          fb.innerHTML = `Not yet — give it another try, or peek at a hint. Mistakes are how flowers grow. 🌱`;
          input.select();
        }
      };

      if (input) input.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); check(); } });
      checkBtn.addEventListener("click", check);
      stepsBtn.addEventListener("click", () => {
        fb.className = "rq-feedback steps";
        fb.innerHTML = `<span class="steps-tag">Steps</span><ol>${q.steps.map(s => `<li>${s}</li>`).join("")}</ol>`;
      });
      if (hintBtn) hintBtn.addEventListener("click", () => {
        fb.className = "rq-feedback hint";
        fb.innerHTML = `<span class="steps-tag">Hint</span>${q.hint}`;
      });
    });

    function updateProgress() {
      const done = doneCount(l.key);
      const pct = Math.round((done / total) * 100);
      const fill = view.querySelector("#rpFill");
      const txt = view.querySelector("#rpText");
      if (fill) fill.style.width = pct + "%";
      if (txt) txt.textContent = `${done} of ${total} solved`;
      const foot = view.querySelector("#reviewFoot");
      if (foot && done >= total) {
        foot.innerHTML = `
          <div class="review-done">
            <p class="rd-title">🌷 Recap complete!</p>
            <p>You worked through all ${total} problems from this week's lessons. You're ready for next session.</p>
            <button class="btn btn-primary" id="rdHome">← Back to my garden</button>
          </div>`;
        const h = foot.querySelector("#rdHome");
        if (h) h.addEventListener("click", goHome);
        if (typeof confettiBurst === "function") { try { confettiBurst(); } catch (e) {} }
      }
    }

    updateProgress();
    window.scrollTo({ top: 0 });
  }

  // ============================================================
  //  HOME CARD — injected under the hero
  // ============================================================
  function homeCardHTML() {
    const recap = LESSONS.w3recap;
    const rTotal = recap.practice.length;
    const rDone = doneCount("w3recap");
    const rPct = Math.round((rDone / rTotal) * 100);
    const rComplete = rDone >= rTotal;
    return `
      <section class="review-home rise d1" aria-label="Lessons to work on before next session">
        <div class="review-home-head">
          <h2>Lessons to work on before next session</h2>
          <p>Two ways to get sharp: drill your times tables, then recap Week 3. No rush. 🌱</p>
        </div>
        <div class="review-cards">
          <button class="review-card" data-drill="times">
            <span class="rc-emoji">✖️</span>
            <span class="rc-body">
              <span class="rc-kicker">Practice 1 · timed drill</span>
              <h3>Times Tables (×1–12)</h3>
              <p>Fifteen minutes of quick facts — 15 seconds each, type the answer, fix any you miss.</p>
              <span class="rc-count">⏱️ 15 min · 15s per question · 1,000-question bank</span>
            </span>
            <span class="rc-go">→</span>
          </button>
          <button class="review-card ${rComplete ? "is-complete" : ""}" data-review="w3recap">
            <span class="rc-emoji">🔁</span>
            <span class="rc-body">
              <span class="rc-kicker">Practice 2 · Week 3 recap${rComplete ? " • done 🌸" : ""}</span>
              <h3>Week 3 Recap</h3>
              <p>Mixed problems from Tables &amp; the Constant of Proportionality and Equations y = kx.</p>
              <span class="rc-bar"><span class="rc-bar-fill" style="width:${rPct}%"></span></span>
              <span class="rc-count">${rDone} / ${rTotal} done</span>
            </span>
            <span class="rc-go">→</span>
          </button>
        </div>
      </section>`;
  }

  function wireHome(root) {
    root.querySelectorAll("[data-drill]").forEach(b =>
      b.addEventListener("click", () => {
        if (typeof go === "function") go(renderTimesDrill); else renderTimesDrill();
      }));
    root.querySelectorAll("[data-review]").forEach(b =>
      b.addEventListener("click", () => {
        const key = b.dataset.review;
        if (typeof go === "function") go(() => renderReview(key)); else renderReview(key);
      }));
  }

  // ---- expose to the app ----
  window.reviewHomeCardHTML = homeCardHTML;
  window.wireReviewHome = wireHome;
  window.renderReview = renderReview;
  window.renderTimesDrill = renderTimesDrill;
})();
