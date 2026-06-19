/* ============================================================
   MathBloom — "Lessons to work on before next session"
   Two focused review lessons that live right under the hero:
     1. Multiplication  (multi-digit, decimals, fractions)
     2. Division        (whole numbers, decimals, fractions)
   Each lesson = a clear recap + 3 warm-ups + 10 practice problems.
   Self-contained: reuses the app's CSS + the global go()/view/renderHome.
   ============================================================ */

(function () {
  "use strict";

  const RKEY = "mathbloom-review-v2";

  // display order / numbering for the two lessons
  const LNUM = { mult: 1, div: 2 };

  // ---- progress for the review section (separate from lesson garden) ----
  function loadReview() {
    try { return JSON.parse(localStorage.getItem(RKEY)) || {}; }
    catch { return {}; }
  }
  function saveReview(r) {
    try { localStorage.setItem(RKEY, JSON.stringify(r)); } catch (e) {}
  }
  let rdone = loadReview(); // { lessonKey: { "w0":true, "p3":true, ... } }

  function markDone(key, qid) {
    if (!rdone[key]) rdone[key] = {};
    rdone[key][qid] = true;
    saveReview(rdone);
  }
  function doneCount(key) {
    return rdone[key] ? Object.keys(rdone[key]).length : 0;
  }

  // ---- array model: rows × cols squares -> a product (multiplication recap) ----
  function svgArrayModel(rows, cols) {
    const u = 24, padL = 16, padT = 14;
    const gridW = cols * u, gridH = rows * u;
    const totalW = padL * 2 + gridW;
    const totalH = padT + gridH + 30;
    let cells = "";
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      cells += `<rect x="${padL + c * u + 2}" y="${padT + r * u + 2}" width="${u - 4}" height="${u - 4}" rx="4" fill="#FBE3D4" stroke="#C9703F" stroke-width="1.5"/>`;
    }
    return `
    <svg viewBox="0 0 ${totalW} ${totalH}" width="${Math.min(totalW, 300)}" role="img" aria-label="${rows} rows of ${cols} squares make ${rows * cols} in all">
      ${cells}
      <text x="${totalW / 2}" y="${totalH - 8}" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="800" font-size="13" fill="#3E6B4F">${rows} × ${cols} = ${rows * cols}</text>
    </svg>`;
  }

  // ---- groups model: a total shared into equal groups (division recap) ----
  function svgGroupsModel(total, groups) {
    const per = total / groups;
    const r = 7, gap = 6, padX = 14, padY = 14, cols = 2;
    const rows = Math.ceil(per / cols);
    const groupW = cols * (2 * r + gap) + 8;
    const groupH = rows * (2 * r + gap) + 8;
    const totalW = padX + groups * (groupW + 12);
    const totalH = padY + groupH + 28;
    let g = "";
    for (let gi = 0; gi < groups; gi++) {
      const gx = padX + gi * (groupW + 12);
      g += `<rect x="${gx}" y="${padY}" width="${groupW}" height="${groupH}" rx="12" fill="#EEF4EE" stroke="#3E6B4F" stroke-width="1.6"/>`;
      for (let d = 0; d < per; d++) {
        const dc = d % cols, dr = Math.floor(d / cols);
        const cx = gx + 4 + r + dc * (2 * r + gap);
        const cy = padY + 4 + r + dr * (2 * r + gap);
        g += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#FBE3D4" stroke="#C9703F" stroke-width="1.4"/>`;
      }
    }
    return `
    <svg viewBox="0 0 ${totalW} ${totalH}" width="${Math.min(totalW, 340)}" role="img" aria-label="${total} shared into ${groups} groups of ${per}">
      ${g}
      <text x="${totalW / 2}" y="${totalH - 7}" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="800" font-size="13" fill="#3E6B4F">${total} ÷ ${groups} = ${per}</text>
    </svg>`;
  }

  // ============================================================
  //  DATA — two lessons
  //  Each problem: { prompt, answer, unit?, hint, steps }
  // ============================================================
  const LESSONS = {
    mult: {
      key: "mult",
      emoji: "✖️",
      title: "Multiplication",
      blurb: "Multi-digit, decimals, and fractions — the same moves, every time.",
      recap: `
        <p><strong>Multiplication</strong> is fast repeated adding — equal groups joined together. The
        array below is 4 rows of 6, the same as 6 + 6 + 6 + 6 = <strong>24</strong>.</p>
        <div class="recap-visual">${svgArrayModel(4, 6)}</div>
        <p>For bigger whole numbers, split each one into its place values, multiply the parts, and add them:
        <span class="math">14 × 5 = (10 × 5) + (4 × 5) = 50 + 20 = 70</span>. The two cases people forget are
        decimals and fractions — so here they are, step by step.</p>

        <h3 class="recap-sub">🔢 Multiplying with decimals</h3>
        <p>The trick: multiply as if the points weren't there, then put the point back at the very end.</p>
        <div class="recap-walk">
          <span class="rw-head">Three steps</span>
          <ol>
            <li>Ignore the decimal points and multiply the numbers like ordinary whole numbers.</li>
            <li>Count how many digits sit <strong>after</strong> a point — in <strong>both</strong> numbers, added together.</li>
            <li>Put that many decimal places in your answer, counting from the right.</li>
          </ol>
        </div>
        <div class="recap-eg"><span class="rr-tag">Worked example — 0.6 × 0.4</span>
          <strong>Step 1:</strong> 6 × 4 = 24. <strong>Step 2:</strong> 0.6 has 1 digit after the point and
          0.4 has 1, so 2 in all. <strong>Step 3:</strong> count 2 places from the right of 24 →
          <strong>0.24</strong>.</div>
        <p class="recap-tip">Sense check: multiplying by a number <em>less than 1</em> makes the result
        smaller than what you started with. 0.4 is less than 1, and sure enough 0.24 is smaller than 0.6. ✓</p>

        <h3 class="recap-sub">🍰 Multiplying with fractions</h3>
        <p>Fractions are friendlier than they look here — no common denominator needed. Just go straight across.</p>
        <div class="recap-walk">
          <span class="rw-head">Two steps</span>
          <ol>
            <li>Multiply the <strong>tops</strong> (the numerators) to get the new top.</li>
            <li>Multiply the <strong>bottoms</strong> (the denominators) to get the new bottom — then simplify.</li>
          </ol>
        </div>
        <p>A whole number is just a fraction over 1, so <span class="math">8 = 8/1</span>. And the word
        <strong>“of”</strong> means multiply — <em>½ of 8</em> is <span class="math">½ × 8 = 4</span>.</p>
        <div class="recap-eg"><span class="rr-tag">Worked example — ¾ × 8</span>
          Write 8 as 8/1. <strong>Tops:</strong> 3 × 8 = 24. <strong>Bottoms:</strong> 4 × 1 = 4.
          That gives 24/4, and 24 ÷ 4 = <strong>6</strong>.</div>`,
      warmups: [
        { prompt: `What is <strong>7 × 8</strong>?`,
          answer: 56,
          hint: `Seven groups of eight — or just recall the times table.`,
          steps: [`7 × 8 = <strong>56</strong>.`] },
        { prompt: `What is <strong>23 × 3</strong>?`,
          answer: 69,
          hint: `Split it: 20 × 3 and 3 × 3, then add.`,
          steps: [`20 × 3 = 60 and 3 × 3 = 9.`, `60 + 9 = <strong>69</strong>.`] },
        { prompt: `What is <strong>0.2 × 4</strong>?`,
          answer: 0.8,
          hint: `Multiply 2 × 4, then place one decimal point.`,
          steps: [`Ignore the point: 2 × 4 = 8.`, `One decimal place → <strong>0.8</strong>.`] },
      ],
      practice: [
        { prompt: `What is <strong>14 × 5</strong>?`,
          answer: 70,
          hint: `10 × 5 and 4 × 5, then add.`,
          steps: [`10 × 5 = 50 and 4 × 5 = 20.`, `50 + 20 = <strong>70</strong>.`] },
        { prompt: `What is <strong>26 × 4</strong>?`,
          answer: 104,
          hint: `20 × 4 and 6 × 4.`,
          steps: [`20 × 4 = 80 and 6 × 4 = 24.`, `80 + 24 = <strong>104</strong>.`] },
        { prompt: `What is <strong>13 × 12</strong>?`,
          answer: 156,
          hint: `13 × 10, then 13 × 2.`,
          steps: [`13 × 10 = 130 and 13 × 2 = 26.`, `130 + 26 = <strong>156</strong>.`] },
        { prompt: `What is <strong>0.3 × 7</strong>?`,
          answer: 2.1,
          hint: `3 × 7 = 21, then one decimal place.`,
          steps: [`3 × 7 = 21.`, `One decimal place → <strong>2.1</strong>.`] },
        { prompt: `What is <strong>0.6 × 0.4</strong>?`,
          answer: 0.24,
          hint: `6 × 4 = 24, then count the decimal places.`,
          steps: [`6 × 4 = 24.`, `Two decimal places in all → <strong>0.24</strong>.`] },
        { prompt: `What is <strong>2.5 × 4</strong>?`,
          answer: 10,
          hint: `25 × 4 = 100, then place one decimal point.`,
          steps: [`25 × 4 = 100.`, `One decimal place → 10.0 = <strong>10</strong>.`] },
        { prompt: `What is <strong>1.2 × 1.5</strong>?`,
          answer: 1.8,
          hint: `12 × 15 = 180, then two decimal places.`,
          steps: [`12 × 15 = 180.`, `Two decimal places → <strong>1.8</strong>.`] },
        { prompt: `What is <strong>¾ × 8</strong>?`,
          answer: 6,
          hint: `Top × top over bottom: (3 × 8) ÷ 4.`,
          steps: [`¾ × 8 = (3 × 8)/4 = 24/4.`, `24 ÷ 4 = <strong>6</strong>.`] },
        { prompt: `What is <strong>⅔ × 9</strong>?`,
          answer: 6,
          hint: `(2 × 9) ÷ 3.`,
          steps: [`⅔ × 9 = 18/3.`, `18 ÷ 3 = <strong>6</strong>.`] },
        { prompt: `What is <strong>125 × 8</strong>?`,
          answer: 1000,
          hint: `A classic: 125 × 8 fills out to a round number.`,
          steps: [`125 × 8 = <strong>1000</strong>.`] },
      ],
    },

    div: {
      key: "div",
      emoji: "➗",
      title: "Division",
      blurb: "Split into equal groups — and flip when you divide by a fraction.",
      recap: `
        <p><strong>Division</strong> splits an amount into equal groups, and it always <em>undoes</em>
        multiplication: 12 ÷ 3 = 4 because 4 × 3 = 12. Below, 12 dots share evenly into 3 groups of 4.</p>
        <div class="recap-visual">${svgGroupsModel(12, 3)}</div>
        <p>The number being split (12) is the <strong>dividend</strong>; the number you divide by (3) is the
        <strong>divisor</strong>. Two cases trip people up — decimals and fractions — so here they are in full.</p>

        <h3 class="recap-sub">🔢 Dividing with decimals</h3>
        <p>If only the number being split has a decimal, just divide and keep the point lined up:
        <span class="math">4.8 ÷ 2 = 2.4</span>. The tricky case is dividing <strong>by</strong> a decimal — fix
        it by turning the divisor into a whole number first.</p>
        <div class="recap-walk">
          <span class="rw-head">Three steps</span>
          <ol>
            <li>Slide the divisor's point to the right until it's a whole number — count how many places.</li>
            <li>Slide the dividend's point to the right the <strong>same</strong> number of places.</li>
            <li>Divide. The answer is unchanged, because you scaled both numbers the same way.</li>
          </ol>
        </div>
        <div class="recap-eg"><span class="rr-tag">Worked example — 7.2 ÷ 0.8</span>
          The divisor 0.8 needs <strong>1</strong> slide to become 8. Slide 7.2 once too → 72.
          Now <span class="math">72 ÷ 8 = 9</span>.</div>
        <p class="recap-tip">Sense check: dividing by a number <em>less than 1</em> makes the answer
        bigger. 7.2 ÷ 0.8 = 9, which is larger than 7.2. ✓</p>

        <h3 class="recap-sub">🍰 Dividing by a fraction — “keep · change · flip”</h3>
        <p>You can't divide by a fraction directly, so you multiply by its <strong>reciprocal</strong> (its flip).
        Picture it: dividing by ½ asks “how many halves fit?” Halves are small, so lots of them fit — that's
        why the answer gets bigger, not smaller.</p>
        <div class="recap-walk">
          <span class="rw-head">Keep · change · flip</span>
          <ol>
            <li><strong>Keep</strong> the first fraction exactly as it is.</li>
            <li><strong>Change</strong> the ÷ sign into a × sign.</li>
            <li><strong>Flip</strong> the second fraction upside down — then multiply tops and bottoms.</li>
          </ol>
        </div>
        <p>A whole number flips too — <span class="math">8 = 8/1</span> flips to <span class="math">1/8</span>.</p>
        <div class="recap-eg"><span class="rr-tag">Worked example — ¾ ÷ ⅛</span>
          Keep ¾. Change ÷ to ×. Flip ⅛ → 8/1. Now ¾ × 8 = 24/4 = <strong>6</strong>.
          (It checks out: ¾ is the same as 6 eighths, so exactly 6 eighths fit.)</div>`,
      warmups: [
        { prompt: `What is <strong>24 ÷ 6</strong>?`,
          answer: 4,
          hint: `What number times 6 makes 24?`,
          steps: [`6 × 4 = 24, so 24 ÷ 6 = <strong>4</strong>.`] },
        { prompt: `What is <strong>56 ÷ 7</strong>?`,
          answer: 8,
          hint: `What number times 7 makes 56?`,
          steps: [`7 × 8 = 56, so 56 ÷ 7 = <strong>8</strong>.`] },
        { prompt: `What is <strong>4.8 ÷ 2</strong>?`,
          answer: 2.4,
          hint: `Halve it. 48 ÷ 2 = 24, then place the point.`,
          steps: [`48 ÷ 2 = 24.`, `Keep one decimal place → <strong>2.4</strong>.`] },
      ],
      practice: [
        { prompt: `What is <strong>72 ÷ 8</strong>?`,
          answer: 9,
          hint: `8 × ? = 72.`,
          steps: [`8 × 9 = 72, so <strong>9</strong>.`] },
        { prompt: `What is <strong>84 ÷ 6</strong>?`,
          answer: 14,
          hint: `60 ÷ 6 and 24 ÷ 6.`,
          steps: [`60 ÷ 6 = 10 and 24 ÷ 6 = 4.`, `10 + 4 = <strong>14</strong>.`] },
        { prompt: `What is <strong>96 ÷ 4</strong>?`,
          answer: 24,
          hint: `80 ÷ 4 and 16 ÷ 4.`,
          steps: [`80 ÷ 4 = 20 and 16 ÷ 4 = 4.`, `20 + 4 = <strong>24</strong>.`] },
        { prompt: `What is <strong>144 ÷ 12</strong>?`,
          answer: 12,
          hint: `12 × ? = 144.`,
          steps: [`12 × 12 = 144, so <strong>12</strong>.`] },
        { prompt: `What is <strong>6.5 ÷ 5</strong>?`,
          answer: 1.3,
          hint: `65 ÷ 5 = 13, then place the point.`,
          steps: [`65 ÷ 5 = 13.`, `Keep one decimal place → <strong>1.3</strong>.`] },
        { prompt: `What is <strong>9.6 ÷ 3</strong>?`,
          answer: 3.2,
          hint: `96 ÷ 3 = 32, then place the point.`,
          steps: [`96 ÷ 3 = 32.`, `One decimal place → <strong>3.2</strong>.`] },
        { prompt: `What is <strong>7.2 ÷ 0.8</strong>?`,
          answer: 9,
          hint: `Slide both points one place: 72 ÷ 8.`,
          steps: [`Make the divisor whole: 7.2 ÷ 0.8 = 72 ÷ 8.`, `72 ÷ 8 = <strong>9</strong>.`] },
        { prompt: `What is <strong>½ ÷ ¼</strong>?`,
          answer: 2,
          hint: `Keep · change · flip: ½ × 4.`,
          steps: [`½ ÷ ¼ = ½ × 4/1 = 4/2.`, `4 ÷ 2 = <strong>2</strong>.`] },
        { prompt: `What is <strong>¾ ÷ ⅛</strong>?`,
          answer: 6,
          hint: `Keep ¾, flip ⅛ to 8, then multiply.`,
          steps: [`¾ ÷ ⅛ = ¾ × 8 = 24/4.`, `24 ÷ 4 = <strong>6</strong>.`] },
        { prompt: `What is <strong>100 ÷ 8</strong>?`,
          answer: 12.5,
          hint: `8 × 12 = 96, with 4 left over → a half.`,
          steps: [`8 × 12 = 96, remainder 4.`, `4 ÷ 8 = 0.5, so <strong>12.5</strong>.`] },
      ],
    },
  };

  // ============================================================
  //  HOME CARD — injected under the hero
  // ============================================================
  function homeCardHTML() {
    const card = (l) => {
      const total = l.warmups.length + l.practice.length;
      const done = doneCount(l.key);
      const pct = Math.round((done / total) * 100);
      const complete = done >= total;
      return `
        <button class="review-card ${complete ? "is-complete" : ""}" data-review="${l.key}">
          <span class="rc-emoji">${l.emoji}</span>
          <span class="rc-body">
            <span class="rc-kicker">Lesson ${LNUM[l.key]}${complete ? " • done 🌸" : ""}</span>
            <h3>${l.title}</h3>
            <p>${l.blurb}</p>
            <span class="rc-bar"><span class="rc-bar-fill" style="width:${pct}%"></span></span>
            <span class="rc-count">${done} / ${total} done · recap + ${l.warmups.length} warm-ups + ${l.practice.length} practice</span>
          </span>
          <span class="rc-go">→</span>
        </button>`;
    };
    return `
      <section class="review-home rise d1" aria-label="Lessons to work on before next session">
        <div class="review-home-head">
          <h2>Lessons to work on before next session</h2>
          <p>Two quick refreshers. Read the recap, ease in with the warm-ups, then grow through the practice. No rush. 🌱</p>
        </div>
        <div class="review-cards">
          ${card(LESSONS.mult)}
          ${card(LESSONS.div)}
        </div>
      </section>`;
  }

  function wireHome(root) {
    root.querySelectorAll("[data-review]").forEach(b =>
      b.addEventListener("click", () => {
        if (typeof go === "function") go(() => renderReview(b.dataset.review));
        else renderReview(b.dataset.review);
      }));
  }

  // ============================================================
  //  LESSON PAGE
  // ============================================================
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
    const total = l.warmups.length + l.practice.length;

    view.innerHTML = `
      <nav class="crumbs rise"><a href="#" data-home>← My garden</a> <span>/ Before next session</span> <span>/ ${l.title}</span></nav>

      <header class="review-hero rise d1">
        <span class="hero-kicker">Lesson ${LNUM[key]} • before next session</span>
        <h1>${l.emoji} ${l.title}</h1>
        <p class="lede">${l.blurb}</p>
        <div class="review-progress">
          <span class="rp-bar"><span class="rp-fill" id="rpFill"></span></span>
          <span class="rp-text" id="rpText"></span>
        </div>
      </header>

      <section class="recap-card rise d2">
        <span class="recap-tag">📖 Recap — how to find it</span>
        ${l.recap}
      </section>

      <section class="qgroup rise d3">
        <h2 class="qgroup-title">🌱 Warm-ups <span>ease in — these are gentle</span></h2>
        ${l.warmups.map((q, i) => qCardHTML(l, q, "w" + i, "Warm-up " + (i + 1))).join("")}
      </section>

      <section class="qgroup rise d4">
        <h2 class="qgroup-title">🌸 Practice <span>10 problems to grow on</span></h2>
        ${l.practice.map((q, i) => qCardHTML(l, q, "p" + i, "Practice " + (i + 1))).join("")}
      </section>

      <div class="review-foot rise" id="reviewFoot"></div>`;

    // back home
    view.querySelector("[data-home]").addEventListener("click", e => {
      e.preventDefault();
      if (typeof go === "function") go(renderHome); else renderHome();
    });

    // wire each question
    const all = [...l.warmups.map((q, i) => ["w" + i, q]), ...l.practice.map((q, i) => ["p" + i, q])];
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
          // gentle confetti if available
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
            <p class="rd-title">🌷 Lesson complete!</p>
            <p>You worked through every warm-up and all ten practice problems. You're ready for next session.</p>
            <button class="btn btn-primary" id="rdHome">← Back to my garden</button>
          </div>`;
        const h = foot.querySelector("#rdHome");
        if (h) h.addEventListener("click", () => { if (typeof go === "function") go(renderHome); else renderHome(); });
        if (typeof confettiBurst === "function") { try { confettiBurst(); } catch (e) {} }
      }
    }

    updateProgress();
    window.scrollTo({ top: 0 });
  }

  const PRAISE = ["Correct!", "Yes!", "Nailed it.", "Beautiful.", "That's it.", "Right on.", "Lovely work."];
  function pickPraise() { return PRAISE[Math.floor(Math.random() * PRAISE.length)]; }

  // ---- expose to the app ----
  window.reviewHomeCardHTML = homeCardHTML;
  window.wireReviewHome = wireHome;
  window.renderReview = renderReview;
})();
