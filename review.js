/* ============================================================
   MathBloom — "Lessons to work on before next session"
   Two focused review lessons that live right under the hero:
     1. Scale factor   (length scaling)
     2. Area factor    (how area grows: scale factor squared)
   Each lesson = a clear recap + 3 warm-ups + 10 practice problems.
   Self-contained: reuses the app's CSS + the global go()/view/renderHome.
   ============================================================ */

(function () {
  "use strict";

  const RKEY = "mathbloom-review-v1";

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

  // ---- a small square-grid visual for the area recap ----
  function svgAreaGrid(k) {
    const u = 26, base = 1; // 1x1 original -> kxk copy
    const W = u * k, pad = 30, gap = 40;
    const totalW = u + gap + W + 70;
    const totalH = W + 44;
    const y1 = totalH - 24 - u, y2 = totalH - 24 - W;
    let cells = "";
    for (let r = 0; r < k; r++) for (let c = 0; c < k; c++) {
      cells += `<rect x="${pad + u + gap + c * u}" y="${y2 + r * u}" width="${u}" height="${u}" fill="#FBE3D4" stroke="#C9703F" stroke-width="1.5"/>`;
    }
    return `
    <svg viewBox="0 0 ${totalW} ${totalH}" width="${Math.min(totalW, 420)}" role="img" aria-label="A unit square and its scaled copy split into ${k * k} unit squares">
      <rect x="${pad}" y="${y1}" width="${u}" height="${u}" rx="3" fill="#DCE9DD" stroke="#3E6B4F" stroke-width="2"/>
      <text x="${pad + u / 2}" y="${y1 + u / 2 + 4}" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="800" font-size="12" fill="#2E4036">1</text>
      <text x="${pad + u / 2}" y="${totalH - 6}" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="700" font-size="12" fill="#728A78">original</text>
      ${cells}
      <text x="${pad + u + gap + W / 2}" y="${totalH - 6}" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="700" font-size="12" fill="#728A78">scale ×${k} → ${k * k} squares</text>
    </svg>`;
  }

  const scaleVisual = (typeof svgScaledRects === "function")
    ? svgScaledRects(3, 2, 2) : "";

  // ============================================================
  //  DATA — two lessons
  //  Each problem: { prompt, answer, unit?, hint, steps }
  // ============================================================
  const LESSONS = {
    scale: {
      key: "scale",
      emoji: "📐",
      title: "Scale Factor",
      blurb: "The one number that turns an original into a scaled copy.",
      recap: `
        <p>A <strong>scale factor</strong> is the number every length gets multiplied by to go from the
        original figure to its scaled copy. It's the single number behind every scaled copy.</p>
        ${scaleVisual ? `<div class="recap-visual">${scaleVisual}</div>` : ""}
        <div class="recap-rules">
          <div class="recap-rule"><span class="rr-tag">Find it</span>
            scale factor = <span class="math">copy length ÷ matching original length</span></div>
          <div class="recap-rule"><span class="rr-tag">Original → copy</span>
            <span class="math">multiply</span> the original length by the scale factor</div>
          <div class="recap-rule"><span class="rr-tag">Copy → original</span>
            <span class="math">divide</span> the copy length by the scale factor</div>
        </div>
        <div class="recap-eg"><span class="rr-tag">Quick example</span>
          A side is <strong>4 cm</strong> in the original and <strong>12 cm</strong> in the copy.
          Scale factor = 12 ÷ 4 = <strong>3</strong>. Bigger than 1 → the copy grew.
          (Below 1, like ½, means it shrank.)</div>`,
      warmups: [
        { prompt: `A side is <strong>4 cm</strong> in the original and <strong>8 cm</strong> in the copy. What is the scale factor?`,
          answer: 2,
          hint: `Scale factor = copy ÷ original. Try 8 ÷ 4.`,
          steps: [`Divide copy ÷ original: 8 ÷ 4.`, `8 ÷ 4 = <strong>2</strong> — every length doubled.`] },
        { prompt: `The scale factor is <strong>3</strong>. The original side is <strong>5 cm</strong>. How long is the matching side of the copy?`,
          answer: 15, unit: "cm",
          hint: `Original → copy means multiply: 5 × 3.`,
          steps: [`Original × scale factor = copy.`, `5 × 3 = <strong>15 cm</strong>.`] },
        { prompt: `The scale factor is <strong>4</strong>. A side of the copy is <strong>20 cm</strong>. How long was the original side?`,
          answer: 5, unit: "cm",
          hint: `Copy → original means divide: 20 ÷ 4.`,
          steps: [`Copy ÷ scale factor = original.`, `20 ÷ 4 = <strong>5 cm</strong>.`] },
      ],
      practice: [
        { prompt: `The original side is <strong>6 cm</strong> and the copy is <strong>18 cm</strong>. What is the scale factor?`,
          answer: 3,
          hint: `Copy ÷ original = 18 ÷ 6.`,
          steps: [`18 ÷ 6 = <strong>3</strong>.`] },
        { prompt: `The original side is <strong>10 cm</strong> and the copy is <strong>5 cm</strong>. What is the scale factor?`,
          answer: 0.5,
          hint: `Copy ÷ original = 5 ÷ 10. The copy is smaller, so the factor is below 1.`,
          steps: [`5 ÷ 10 = <strong>0.5</strong> (½). Below 1 means a reduction.`] },
        { prompt: `Scale factor <strong>2.5</strong>, original side <strong>4 cm</strong>. How long is the copy's side?`,
          answer: 10, unit: "cm",
          hint: `Multiply: 4 × 2.5.`,
          steps: [`4 × 2.5 = <strong>10 cm</strong>.`] },
        { prompt: `Scale factor <strong>½</strong>, original side <strong>14 cm</strong>. How long is the copy's side?`,
          answer: 7, unit: "cm",
          hint: `Multiplying by ½ is the same as halving.`,
          steps: [`14 × ½ = <strong>7 cm</strong>.`] },
        { prompt: `Scale factor <strong>3</strong>, a side of the copy is <strong>24 cm</strong>. How long was the original side?`,
          answer: 8, unit: "cm",
          hint: `Copy → original means divide: 24 ÷ 3.`,
          steps: [`24 ÷ 3 = <strong>8 cm</strong>.`] },
        { prompt: `The original side is <strong>7 cm</strong> and the copy is <strong>21 cm</strong>. What is the scale factor?`,
          answer: 3,
          hint: `21 ÷ 7.`,
          steps: [`21 ÷ 7 = <strong>3</strong>.`] },
        { prompt: `Scale factor <strong>4</strong>, original side <strong>9 cm</strong>. How long is the copy's side?`,
          answer: 36, unit: "cm",
          hint: `Multiply: 9 × 4.`,
          steps: [`9 × 4 = <strong>36 cm</strong>.`] },
        { prompt: `The original side is <strong>12 cm</strong> and the copy is <strong>3 cm</strong>. What is the scale factor?`,
          answer: 0.25,
          hint: `Copy ÷ original = 3 ÷ 12. The copy shrank a lot.`,
          steps: [`3 ÷ 12 = <strong>0.25</strong> (¼).`] },
        { prompt: `Scale factor <strong>6</strong>, a side of the copy is <strong>30 cm</strong>. How long was the original side?`,
          answer: 5, unit: "cm",
          hint: `Divide: 30 ÷ 6.`,
          steps: [`30 ÷ 6 = <strong>5 cm</strong>.`] },
        { prompt: `Scale factor <strong>1.5</strong>, original side <strong>8 cm</strong>. How long is the copy's side?`,
          answer: 12, unit: "cm",
          hint: `8 × 1.5 = 8 + half of 8.`,
          steps: [`8 × 1.5 = <strong>12 cm</strong>.`] },
      ],
    },

    area: {
      key: "area",
      emoji: "🟧",
      title: "Area Factor",
      blurb: "When lengths scale by k, area scales by k × k.",
      recap: `
        <p>Here's the surprise: when you scale a figure, the <strong>area does not grow by the same
        number as the sides</strong>. If every length is multiplied by the scale factor, the area is
        multiplied by the <strong>scale factor squared</strong>.</p>
        <div class="recap-visual">${svgAreaGrid(3)}</div>
        <p>Scaling by 3 makes each side 3× longer — but it takes <strong>3 × 3 = 9</strong> of the
        original squares to fill the copy. That's why the area factor is the square.</p>
        <div class="recap-rules">
          <div class="recap-rule"><span class="rr-tag">Find it</span>
            area factor = <span class="math">(scale factor)²</span> = scale factor × scale factor</div>
          <div class="recap-rule"><span class="rr-tag">New area</span>
            new area = <span class="math">original area × (scale factor)²</span></div>
          <div class="recap-rule"><span class="rr-tag">Go backwards</span>
            scale factor = <span class="math">√(area factor)</span></div>
        </div>
        <div class="recap-eg"><span class="rr-tag">Quick example</span>
          Scale factor <strong>2</strong> → area factor = 2 × 2 = <strong>4</strong>.
          So a 5 cm² shape becomes 5 × 4 = <strong>20 cm²</strong>. Double the sides, quadruple the area.</div>`,
      warmups: [
        { prompt: `The scale factor is <strong>2</strong>. What is the area factor (how many times bigger the area gets)?`,
          answer: 4,
          hint: `Area factor = scale factor × scale factor = 2 × 2.`,
          steps: [`2 × 2 = <strong>4</strong>. Double the sides → 4× the area.`] },
        { prompt: `The scale factor is <strong>3</strong>. What is the area factor?`,
          answer: 9,
          hint: `3 × 3.`,
          steps: [`3 × 3 = <strong>9</strong>.`] },
        { prompt: `The scale factor is <strong>5</strong>. What is the area factor?`,
          answer: 25,
          hint: `5 × 5.`,
          steps: [`5 × 5 = <strong>25</strong>.`] },
      ],
      practice: [
        { prompt: `The scale factor is <strong>4</strong>. What is the area factor?`,
          answer: 16,
          hint: `4 × 4.`,
          steps: [`4 × 4 = <strong>16</strong>.`] },
        { prompt: `The scale factor is <strong>½</strong>. What is the area factor?`,
          answer: 0.25,
          hint: `½ × ½. The area shrinks even more than the sides do.`,
          steps: [`½ × ½ = <strong>¼ (0.25)</strong>. Half the sides → a quarter of the area.`] },
        { prompt: `A shape has area <strong>5 cm²</strong>. It's scaled by a factor of <strong>2</strong>. What is the new area?`,
          answer: 20, unit: "cm²",
          hint: `New area = original × (scale factor)² = 5 × (2 × 2).`,
          steps: [`Area factor = 2 × 2 = 4.`, `5 × 4 = <strong>20 cm²</strong>.`] },
        { prompt: `A shape has area <strong>6 cm²</strong>. It's scaled by a factor of <strong>3</strong>. What is the new area?`,
          answer: 54, unit: "cm²",
          hint: `Area factor = 3 × 3 = 9, then multiply.`,
          steps: [`Area factor = 3 × 3 = 9.`, `6 × 9 = <strong>54 cm²</strong>.`] },
        { prompt: `A scaled copy has <strong>9 times</strong> the area of the original. What was the scale factor?`,
          answer: 3,
          hint: `Scale factor = √(area factor) = √9.`,
          steps: [`√9 = <strong>3</strong>, because 3 × 3 = 9.`] },
        { prompt: `A scaled copy has <strong>16 times</strong> the area of the original. What was the scale factor?`,
          answer: 4,
          hint: `√16.`,
          steps: [`√16 = <strong>4</strong>, because 4 × 4 = 16.`] },
        { prompt: `The scale factor is <strong>10</strong>. What is the area factor?`,
          answer: 100,
          hint: `10 × 10.`,
          steps: [`10 × 10 = <strong>100</strong>.`] },
        { prompt: `A shape has area <strong>8 cm²</strong>. It's scaled by a factor of <strong>½</strong>. What is the new area?`,
          answer: 2, unit: "cm²",
          hint: `Area factor = ½ × ½ = ¼. Then 8 × ¼.`,
          steps: [`Area factor = ½ × ½ = ¼.`, `8 × ¼ = <strong>2 cm²</strong>.`] },
        { prompt: `A drawing is enlarged by a scale factor of <strong>6</strong>. The area is multiplied by what number?`,
          answer: 36,
          hint: `6 × 6.`,
          steps: [`6 × 6 = <strong>36</strong>.`] },
        { prompt: `A scaled copy has <strong>25 times</strong> the area of the original. What was the scale factor?`,
          answer: 5,
          hint: `√25.`,
          steps: [`√25 = <strong>5</strong>, because 5 × 5 = 25.`] },
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
            <span class="rc-kicker">Lesson ${l.key === "scale" ? "1" : "2"}${complete ? " • done 🌸" : ""}</span>
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
          ${card(LESSONS.scale)}
          ${card(LESSONS.area)}
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
        <span class="hero-kicker">Lesson ${key === "scale" ? "1" : "2"} • before next session</span>
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
