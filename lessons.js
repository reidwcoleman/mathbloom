/* ============================================================
   MathBloom — curriculum content
   Wake County Math 6 Plus (Open Up Resources / Illustrative Math)
   Unit 4: Scale Drawings        (IM Grade 7, Unit 1)
   Unit 8: Introducing Proportional Relationships (IM G7, Unit 2)
   Unit 9: Proportional Relationships & Percentages (IM G7, Unit 4)
   ============================================================ */

// ---------- tiny helpers ----------
const ri = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = arr => arr[ri(0, arr.length - 1)];
const money = n => "$" + (Math.round(n * 100) / 100).toFixed(2);
const clean = n => {
  const r = Math.round(n * 100) / 100;
  return Number.isInteger(r) ? String(r) : String(r);
};

// ---------- SVG builders ----------

function svgScaledRects(w, h, f) {
  const u = 14;
  const W1 = w * u, H1 = h * u, W2 = w * f * u, H2 = h * f * u;
  const gap = 46;
  const totalW = W1 + gap + W2 + 80;
  const totalH = Math.max(H1, H2) + 64;
  const y1 = totalH - 34 - H1, y2 = totalH - 34 - H2;
  return `
  <svg viewBox="0 0 ${totalW} ${totalH}" width="${Math.min(totalW, 440)}" role="img" aria-label="Two rectangles, A and B">
    <rect x="30" y="${y1}" width="${W1}" height="${H1}" rx="6" fill="#DCE9DD" stroke="#3E6B4F" stroke-width="2.5"/>
    <text x="${30 + W1 / 2}" y="${y1 + H1 / 2 + 5}" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="800" font-size="16" fill="#2E4036">A</text>
    <text x="${30 + W1 / 2}" y="${totalH - 12}" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="700" font-size="13" fill="#5C6F62">${clean(w)} cm</text>
    <text x="${18}" y="${y1 + H1 / 2 + 4}" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="700" font-size="13" fill="#5C6F62" transform="rotate(-90 18 ${y1 + H1 / 2})">${clean(h)} cm</text>
    <rect x="${30 + W1 + gap}" y="${y2}" width="${W2}" height="${H2}" rx="6" fill="#FBE3D4" stroke="#C9703F" stroke-width="2.5"/>
    <text x="${30 + W1 + gap + W2 / 2}" y="${y2 + H2 / 2 + 5}" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="800" font-size="16" fill="#2E4036">B</text>
    <text x="${30 + W1 + gap + W2 / 2}" y="${totalH - 12}" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="700" font-size="13" fill="#5C6F62">${clean(w * f)} cm</text>
    <text x="${30 + W1 + gap - 12}" y="${y2 + H2 / 2 + 4}" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="700" font-size="13" fill="#5C6F62" transform="rotate(-90 ${30 + W1 + gap - 12} ${y2 + H2 / 2})">${clean(h * f)} cm</text>
  </svg>`;
}

function svgMap(d, placeA, placeB) {
  return `
  <svg viewBox="0 0 380 130" width="360" role="img" aria-label="Map showing two places">
    <rect x="4" y="4" width="372" height="122" rx="14" fill="#FBF0D2" stroke="#F6D88C" stroke-width="2"/>
    <path d="M 60 86 Q 140 30 200 64 T 320 52" fill="none" stroke="#7FA98A" stroke-width="3" stroke-dasharray="7 7" stroke-linecap="round"/>
    <circle cx="60" cy="86" r="8" fill="#3E6B4F"/>
    <circle cx="320" cy="52" r="8" fill="#C9703F"/>
    <text x="60" y="112" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="800" font-size="13" fill="#2E4036">${placeA}</text>
    <text x="320" y="32" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="800" font-size="13" fill="#2E4036">${placeB}</text>
    <text x="190" y="24" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="800" font-size="14" fill="#5C6F62">${d} cm on the map</text>
  </svg>`;
}

function svgGraph(k, px) {
  // 0..10 axes, 240px plot, line y = kx, highlighted point at (px, k*px)
  const S = 26, OX = 44, OY = 252, plot = 240;
  const X = x => OX + x * (plot / 10);
  const Y = y => OY - y * (plot / 10);
  const yEnd = Math.min(10, 10 * k) ;
  const xEnd = k >= 1 ? 10 / k : 10;
  let grid = "";
  for (let i = 0; i <= 10; i += 2) {
    grid += `<line x1="${X(i)}" y1="${Y(0)}" x2="${X(i)}" y2="${Y(10)}" stroke="#EDE6D6" stroke-width="1"/>
             <line x1="${X(0)}" y1="${Y(i)}" x2="${X(10)}" y2="${Y(i)}" stroke="#EDE6D6" stroke-width="1"/>
             <text x="${X(i)}" y="${OY + 18}" text-anchor="middle" font-size="11" font-family="Nunito,sans-serif" fill="#5C6F62">${i}</text>
             <text x="${OX - 10}" y="${Y(i) + 4}" text-anchor="end" font-size="11" font-family="Nunito,sans-serif" fill="#5C6F62">${i}</text>`;
  }
  return `
  <svg viewBox="0 0 330 290" width="320" role="img" aria-label="Graph of a proportional relationship">
    ${grid}
    <line x1="${X(0)}" y1="${Y(0)}" x2="${X(10)}" y2="${Y(0)}" stroke="#2E4036" stroke-width="2"/>
    <line x1="${X(0)}" y1="${Y(0)}" x2="${X(0)}" y2="${Y(10)}" stroke="#2E4036" stroke-width="2"/>
    <line x1="${X(0)}" y1="${Y(0)}" x2="${X(xEnd)}" y2="${Y(xEnd * k)}" stroke="#3E6B4F" stroke-width="3" stroke-linecap="round"/>
    <circle cx="${X(px)}" cy="${Y(px * k)}" r="7" fill="#F2A07B" stroke="#C9703F" stroke-width="2.5"/>
    <text x="${X(px) + 12}" y="${Y(px * k) - 10}" font-size="14" font-weight="800" font-family="Nunito,sans-serif" fill="#C9703F">(${clean(px)}, ${clean(px * k)})</text>
    <text x="${X(5)}" y="${OY + 36}" text-anchor="middle" font-size="12" font-weight="800" font-family="Nunito,sans-serif" fill="#5C6F62">x</text>
    <text x="${OX - 30}" y="${Y(5)}" text-anchor="middle" font-size="12" font-weight="800" font-family="Nunito,sans-serif" fill="#5C6F62">y</text>
  </svg>`;
}

function htmlTable(xs, ys, mysteryIdx = -1, headX = "x", headY = "y") {
  let rows = "";
  for (let i = 0; i < xs.length; i++) {
    const yCell = i === mysteryIdx
      ? `<td class="mystery">?</td>`
      : `<td>${clean(ys[i])}</td>`;
    rows += `<tr><td>${clean(xs[i])}</td>${yCell}</tr>`;
  }
  return `<table class="q-table"><tr><th>${headX}</th><th>${headY}</th></tr>${rows}</table>`;
}

// fraction display for scale factors under 1
const fracName = { 0.5: "½", 0.25: "¼", 0.75: "¾", 1.5: "1½" };
const fshow = f => fracName[f] || clean(f);

/* ============================================================
   LESSONS
   Each: id, title, blurb, teach (HTML string), generate() -> question
   question: { prompt, visual?, type: 'numeric'|'choice', answer,
               unit?, choices?, correctIndex?, hints[], steps[] }
   ============================================================ */

const UNITS = [
  {
    id: "u4",
    num: "Unit 4",
    title: "Scale Drawings",
    tint: "tint-peach",
    blurb: "Scaled copies, scale factors, maps, and how scaling changes area.",
    lessons: [
      // ---------------- U4 L1 ----------------
      {
        id: "u4l1",
        title: "Scaled Copies & Scale Factors",
        blurb: "What makes a copy 'scaled', and the one number that controls it all.",
        teach: `
        <div class="teach-card">
          <h2>What is a scaled copy?</h2>
          <p>A <strong>scaled copy</strong> is a figure that's the same shape as the original — just a different size. Every length gets multiplied by the <em>same</em> number. That number is the <strong>scale factor</strong>.</p>
          <div class="key-idea"><span class="tag">Key idea</span>
            scale factor = <span class="math">side in the copy ÷ matching side in the original</span>
          </div>
          <ul>
            <li>Scale factor <strong>greater than 1</strong> → the copy is <strong>bigger</strong> (like 2, 3, or 1½).</li>
            <li>Scale factor <strong>between 0 and 1</strong> → the copy is <strong>smaller</strong> (like ½ or ¾).</li>
            <li>Scale factor <strong>exactly 1</strong> → same size, identical twin.</li>
          </ul>
        </div>
        <div class="teach-card">
          <h2>Worked example</h2>
          <div class="example"><span class="tag">Example</span>
            <p>Rectangle A is 4 cm wide. Its scaled copy, Rectangle B, is 12 cm wide.</p>
            <p><strong>Step 1.</strong> Match up corresponding sides: the two widths.</p>
            <p><strong>Step 2.</strong> Divide copy ÷ original: <span class="math">12 ÷ 4 = 3</span>.</p>
            <p><strong>Step 3.</strong> The scale factor is <strong>3</strong> — so <em>every</em> side of B is 3 times as long as the matching side of A.</p>
          </div>
          <p>One friendly check: in a true scaled copy, every pair of corresponding sides gives the <em>same</em> scale factor. If one pair gives 2 and another gives 3, it's not a scaled copy — it's just stretched.</p>
        </div>`,
        generate() {
          const v = ri(1, 3);
          if (v === 1) {
            const w = ri(2, 5), h = ri(2, 4);
            const f = pick([2, 3, 0.5, 1.5]);
            return {
              prompt: `Rectangle <strong>B</strong> is a scaled copy of Rectangle <strong>A</strong>. What is the <strong>scale factor</strong> from A to B?`,
              visual: svgScaledRects(w, h, f),
              type: "numeric", answer: f,
              hints: [
                "Pick one pair of corresponding sides — for example, the bottom side of A and the bottom side of B.",
                `Scale factor = copy ÷ original. Try ${clean(w * f)} ÷ ${clean(w)}.`
              ],
              steps: [
                `Corresponding widths: A is ${clean(w)} cm and B is ${clean(w * f)} cm.`,
                `Scale factor = ${clean(w * f)} ÷ ${clean(w)} = <strong>${clean(f)}</strong>.`,
                `Check with the heights: ${clean(h * f)} ÷ ${clean(h)} = ${clean(f)}. Same number — that's what makes it a scaled copy. ✓`
              ]
            };
          }
          if (v === 2) {
            const f = pick([2, 3, 4, 0.5]);
            const s = f === 0.5 ? pick([4, 6, 8, 10, 12]) : ri(3, 9);
            return {
              prompt: `An artist makes a scaled copy of a drawing using a scale factor of <span class="math">${fshow(f)}</span>. One side of the original is <span class="math">${s} cm</span> long. How long is the corresponding side in the copy?`,
              type: "numeric", answer: s * f, unit: "cm",
              hints: [
                "The scale factor tells you what to multiply every original length by.",
                `Multiply: ${s} × ${fshow(f)}.`
              ],
              steps: [
                `Every length in the copy = original length × scale factor.`,
                `${s} × ${fshow(f)} = <strong>${clean(s * f)} cm</strong>.`
              ]
            };
          }
          const f = pick([0.5, 0.75, 2, 3, 1]);
          const correct = f < 1 ? 1 : (f === 1 ? 2 : 0);
          return {
            prompt: `A scaled copy is made with a scale factor of <span class="math">${fshow(f)}</span>. How does the copy compare to the original?`,
            type: "choice",
            choices: ["The copy is larger than the original", "The copy is smaller than the original", "The copy is exactly the same size"],
            correctIndex: correct,
            hints: [
              "Compare the scale factor to 1.",
              "Greater than 1 → grows. Between 0 and 1 → shrinks. Exactly 1 → same size."
            ],
            steps: [
              `The scale factor is ${fshow(f)}, which is ${f < 1 ? "between 0 and 1, so every length shrinks — the copy is <strong>smaller</strong>" : f === 1 ? "exactly 1, so every length stays the same — the copy is the <strong>same size</strong>" : "greater than 1, so every length grows — the copy is <strong>larger</strong>"}.`
            ]
          };
        }
      },
      // ---------------- U4 L2 ----------------
      {
        id: "u4l2",
        title: "Scale Drawings & Maps",
        blurb: "Turn map centimeters into real-world kilometers (and back again).",
        teach: `
        <div class="teach-card">
          <h2>Reading a scale</h2>
          <p>A <strong>scale drawing</strong> shows something real at a different size — a map, a floor plan, a blueprint. The <strong>scale</strong> tells you how drawing lengths and real lengths match up, like:</p>
          <div class="key-idea"><span class="tag">A scale looks like</span>
            "1 cm represents 5 km" &nbsp;or&nbsp; "1 inch represents 4 feet"
          </div>
          <ul>
            <li><strong>Drawing → real life:</strong> multiply by the scale.</li>
            <li><strong>Real life → drawing:</strong> divide by the scale.</li>
          </ul>
        </div>
        <div class="teach-card">
          <h2>Worked example</h2>
          <div class="example"><span class="tag">Example — map to real life</span>
            <p>A map of North Carolina uses the scale <em>1 cm represents 25 km</em>. Raleigh and Durham are about 1.5 cm apart on the map.</p>
            <p><strong>Step 1.</strong> Each map centimeter is worth 25 real kilometers.</p>
            <p><strong>Step 2.</strong> Multiply: <span class="math">1.5 × 25 = 37.5</span>.</p>
            <p><strong>Step 3.</strong> The real distance is about <strong>37.5 km</strong>.</p>
          </div>
          <div class="example"><span class="tag">Example — real life to drawing</span>
            <p>A wall is 12 feet long. The floor plan's scale is <em>1 inch represents 4 feet</em>. How long is the wall on the plan?</p>
            <p>Divide: <span class="math">12 ÷ 4 = 3</span> → draw it <strong>3 inches</strong> long.</p>
          </div>
        </div>`,
        generate() {
          const v = ri(1, 3);
          const towns = [["Raleigh", "Cary"], ["Apex", "Durham"], ["Wake Forest", "Garner"], ["Holly Springs", "Knightdale"], ["Morrisville", "Zebulon"]];
          if (v === 1) {
            const k = pick([2, 5, 10, 25, 50]);
            const d = pick([2, 3, 4, 5, 6, 2.5, 3.5]);
            const [a, b] = pick(towns);
            return {
              prompt: `A map uses the scale <strong>1 cm represents ${k} km</strong>. On the map, ${a} and ${b} are <span class="math">${clean(d)} cm</span> apart. What is the real distance between them?`,
              visual: svgMap(clean(d), a, b),
              type: "numeric", answer: d * k, unit: "km",
              hints: [
                `Every 1 cm on the map stands for ${k} real kilometers.`,
                `Multiply the map distance by the scale: ${clean(d)} × ${k}.`
              ],
              steps: [
                `Going from the map to real life means multiplying by the scale.`,
                `${clean(d)} cm × ${k} km per cm = <strong>${clean(d * k)} km</strong>.`
              ]
            };
          }
          if (v === 2) {
            const k = pick([2, 4, 5, 10, 25]);
            const d = pick([2, 3, 4, 5, 6]);
            const real = d * k;
            const [a, b] = pick(towns);
            return {
              prompt: `${a} and ${b} are really <span class="math">${real} km</span> apart. A map uses the scale <strong>1 cm represents ${k} km</strong>. How far apart should they be <em>on the map</em>?`,
              type: "numeric", answer: d, unit: "cm",
              hints: [
                "This time you're going from real life back to the map — so the distance gets smaller.",
                `Divide the real distance by the scale: ${real} ÷ ${k}.`
              ],
              steps: [
                `Going from real life to the map means dividing by the scale.`,
                `${real} km ÷ ${k} km per cm = <strong>${d} cm</strong>.`
              ]
            };
          }
          const k = pick([2, 4, 8]);
          const d = pick([2, 3, 4, 5, 2.5]);
          const rooms = ["bedroom wall", "kitchen counter", "garage door", "classroom whiteboard", "bookshelf"];
          return {
            prompt: `A floor plan uses the scale <strong>1 inch represents ${k} feet</strong>. A ${pick(rooms)} is <span class="math">${clean(d)} inches</span> long on the plan. How long is it in real life?`,
            type: "numeric", answer: d * k, unit: "feet",
            hints: [
              `Each inch on the plan is worth ${k} real feet.`,
              `Multiply: ${clean(d)} × ${k}.`
            ],
            steps: [
              `Plan → real life: multiply by the scale.`,
              `${clean(d)} inches × ${k} feet per inch = <strong>${clean(d * k)} feet</strong>.`
            ]
          };
        }
      },
      // ---------------- U4 L3 ----------------
      {
        id: "u4l3",
        title: "Scaling & Area",
        blurb: "The sneaky squared rule: scale lengths by 3, and area grows by 9.",
        teach: `
        <div class="teach-card">
          <h2>Area plays by its own rule</h2>
          <p>When you scale a figure, the lengths and the <strong>area</strong> don't grow by the same amount. Lengths multiply by the scale factor — but area multiplies by the scale factor <em>squared</em>.</p>
          <div class="key-idea"><span class="tag">Key idea</span>
            scale factor <span class="math">s</span> → area is multiplied by <span class="math">s × s = s²</span>
          </div>
          <p>Why? Area is two lengths multiplied together (like width × height). Scale <em>both</em> by <span class="math">s</span>, and you've multiplied the area by <span class="math">s</span> twice.</p>
        </div>
        <div class="teach-card">
          <h2>Worked example</h2>
          <div class="example"><span class="tag">Example</span>
            <p>A 2 cm × 3 cm rectangle has area 6 cm². Scale it by a factor of 3.</p>
            <p><strong>New sides:</strong> 6 cm × 9 cm.</p>
            <p><strong>New area:</strong> <span class="math">6 × 9 = 54 cm²</span>.</p>
            <p><strong>Check the rule:</strong> old area × s² = <span class="math">6 × 3² = 6 × 9 = 54</span>. ✓</p>
          </div>
          <p>Shrinking works the same way: a scale factor of ½ makes the area <span class="math">½ × ½ = ¼</span> as big. Quarter the area, not half!</p>
        </div>`,
        generate() {
          const v = ri(1, 3);
          if (v === 1) {
            const s = pick([2, 3, 4, 5]);
            const A = ri(3, 9);
            return {
              prompt: `A figure has an area of <span class="math">${A} cm²</span>. A scaled copy is made with a scale factor of <span class="math">${s}</span>. What is the area of the copy?`,
              type: "numeric", answer: A * s * s, unit: "cm²",
              hints: [
                `Lengths multiply by ${s}, but area multiplies by ${s}² .`,
                `Area of copy = ${A} × ${s} × ${s}.`
              ],
              steps: [
                `Scale factor ${s} → area multiplies by ${s}² = ${s * s}.`,
                `${A} × ${s * s} = <strong>${A * s * s} cm²</strong>.`
              ]
            };
          }
          if (v === 2) {
            const s = pick([2, 3, 4, 5, 10]);
            return {
              prompt: `Every side of a figure is scaled by a factor of <span class="math">${s}</span>. The area of the copy is how many times the area of the original?`,
              type: "numeric", answer: s * s,
              hints: [
                "Area uses two dimensions, so the scale factor gets applied twice.",
                `Compute ${s} × ${s}.`
              ],
              steps: [
                `Area multiplies by the scale factor squared.`,
                `${s}² = ${s} × ${s} = <strong>${s * s}</strong> times the original area.`
              ]
            };
          }
          const A = pick([8, 12, 16, 20, 24, 40]);
          return {
            prompt: `A poster has an area of <span class="math">${A} in²</span>. A mini version is printed at a scale factor of <span class="math">½</span>. What is the area of the mini poster?`,
            type: "numeric", answer: A / 4, unit: "in²",
            hints: [
              "With a scale factor of ½, area is multiplied by ½ × ½ = ¼.",
              `Find one quarter of ${A}.`
            ],
            steps: [
              `Scale factor ½ → area multiplies by (½)² = ¼.`,
              `${A} × ¼ = <strong>${clean(A / 4)} in²</strong>.`
            ]
          };
        }
      }
    ]
  },

  {
    id: "u8",
    num: "Unit 8",
    title: "Introducing Proportional Relationships",
    tint: "tint-sage",
    blurb: "Tables, the constant of proportionality, equations y = kx, and graphs through the origin.",
    lessons: [
      // ---------------- U8 L1 ----------------
      {
        id: "u8l1",
        title: "Tables & the Constant of Proportionality",
        blurb: "Spot the one number hiding in every proportional table.",
        teach: `
        <div class="teach-card">
          <h2>What makes a relationship proportional?</h2>
          <p>Two quantities are in a <strong>proportional relationship</strong> when one is always the <em>same multiple</em> of the other. That multiple is called the <strong>constant of proportionality</strong>, and we usually name it <span class="math">k</span>.</p>
          <div class="key-idea"><span class="tag">Key idea</span>
            In every row of the table: <span class="math">k = y ÷ x</span> — and it's the <em>same k every time</em>.
          </div>
        </div>
        <div class="teach-card">
          <h2>Worked example</h2>
          <div class="example"><span class="tag">Example</span>
            <p>A smoothie recipe table:</p>
            <p>2 bananas → 6 strawberries &nbsp;•&nbsp; 4 bananas → 12 strawberries &nbsp;•&nbsp; 5 bananas → 15 strawberries</p>
            <p><strong>Check each row:</strong> 6÷2 = 3, &nbsp;12÷4 = 3, &nbsp;15÷5 = 3.</p>
            <p>Same answer every time, so it's proportional with <span class="math">k = 3</span>: every banana brings 3 strawberries along.</p>
          </div>
          <p>If even <em>one</em> row gives a different answer, the relationship is <strong>not proportional</strong>. That's the whole test — no tricks.</p>
        </div>`,
        generate() {
          const v = ri(1, 3);
          const makeXs = () => {
            const start = ri(2, 4);
            return [start, start + ri(1, 2), start + ri(3, 4), start + ri(5, 6)];
          };
          if (v === 1) {
            const k = pick([2, 3, 4, 5, 1.5, 2.5]);
            const xs = makeXs();
            const ys = xs.map(x => x * k);
            return {
              prompt: `The table shows a proportional relationship. What is the <strong>constant of proportionality</strong>, <span class="math">k</span>?`,
              visual: htmlTable(xs, ys),
              type: "numeric", answer: k,
              hints: [
                "Pick any row and divide y by x.",
                `Try the first row: ${clean(ys[0])} ÷ ${clean(xs[0])}.`
              ],
              steps: [
                `k = y ÷ x using any row.`,
                `Row 1: ${clean(ys[0])} ÷ ${clean(xs[0])} = <strong>${clean(k)}</strong>.`,
                `Double-check with row 2: ${clean(ys[1])} ÷ ${clean(xs[1])} = ${clean(k)}. Same — proportional. ✓`
              ]
            };
          }
          if (v === 2) {
            const k = pick([2, 3, 4, 5, 1.5]);
            const xs = makeXs();
            const ys = xs.map(x => x * k);
            const m = ri(1, 3);
            return {
              prompt: `The table shows a proportional relationship. What number goes in place of the <strong style="color:#C9703F">?</strong>`,
              visual: htmlTable(xs, ys, m),
              type: "numeric", answer: ys[m],
              hints: [
                `First find k from a complete row, like ${clean(ys[0])} ÷ ${clean(xs[0])} = ${clean(k)}.`,
                `Then multiply: ${clean(xs[m])} × ${clean(k)}.`
              ],
              steps: [
                `From row 1: k = ${clean(ys[0])} ÷ ${clean(xs[0])} = ${clean(k)}.`,
                `Missing value = x × k = ${clean(xs[m])} × ${clean(k)} = <strong>${clean(ys[m])}</strong>.`
              ]
            };
          }
          const proportional = Math.random() < 0.5;
          const k = pick([2, 3, 4]);
          const xs = makeXs();
          let ys = xs.map(x => x * k);
          let brokenRow = -1;
          if (!proportional) {
            brokenRow = ri(1, 3);
            ys[brokenRow] += pick([1, 2, -1]);
          }
          return {
            prompt: `Look at the table. Is <span class="math">y</span> proportional to <span class="math">x</span>?`,
            visual: htmlTable(xs, ys),
            type: "choice",
            choices: ["Yes — y ÷ x is the same in every row", "No — y ÷ x changes between rows"],
            correctIndex: proportional ? 0 : 1,
            hints: [
              "Divide y by x in each row and compare the answers.",
              `Row 1 gives ${clean(ys[0] / xs[0])}. Do the other rows match?`
            ],
            steps: proportional
              ? [
                  `Every row: ${xs.map((x, i) => `${clean(ys[i])}÷${clean(x)} = ${clean(ys[i] / x)}`).join(", &nbsp;")}.`,
                  `All the same, so <strong>yes — it's proportional</strong> with k = ${k}.`
                ]
              : [
                  `Most rows give ${k}, but row ${brokenRow + 1} gives ${clean(ys[brokenRow] / xs[brokenRow])} (${clean(ys[brokenRow])} ÷ ${clean(xs[brokenRow])}).`,
                  `The quotient isn't constant, so <strong>no — it's not proportional</strong>.`
                ]
          };
        }
      },
      // ---------------- U8 L2 ----------------
      {
        id: "u8l2",
        title: "Equations of the Form y = kx",
        blurb: "One tiny equation that describes the whole relationship.",
        teach: `
        <div class="teach-card">
          <h2>From table to equation</h2>
          <p>Once you know the constant of proportionality <span class="math">k</span>, you can describe the <em>entire</em> relationship with one equation:</p>
          <div class="key-idea"><span class="tag">Key idea</span>
            <span class="math">y = kx</span> &nbsp;— "to get y, multiply x by k."
          </div>
          <p>That equation works for every single pair of values — even ones not in your table.</p>
        </div>
        <div class="teach-card">
          <h2>Worked example</h2>
          <div class="example"><span class="tag">Example</span>
            <p>A food truck sells tacos for $4 each. Let <span class="math">x</span> = number of tacos and <span class="math">y</span> = total cost.</p>
            <p><strong>Equation:</strong> <span class="math">y = 4x</span></p>
            <p><strong>Use it forward:</strong> 7 tacos → y = 4 × 7 = <strong>$28</strong>.</p>
            <p><strong>Use it backward:</strong> spent $36 → 36 = 4x → x = 36 ÷ 4 = <strong>9 tacos</strong>.</p>
          </div>
          <p>Forward questions multiply. Backward questions divide. The equation handles both directions.</p>
        </div>`,
        generate() {
          const v = ri(1, 3);
          const contexts = [
            { story: k => `A bakery sells muffins for $${k} each. Let x be the number of muffins and y be the total cost in dollars.`, ks: [2, 3, 4, 5] },
            { story: k => `Jordan reads ${k} pages every minute. Let x be the minutes spent reading and y be the pages read.`, ks: [2, 3, 4] },
            { story: k => `A recipe uses ${k} cups of flour for every batch of cookies. Let x be the number of batches and y be the cups of flour.`, ks: [2, 3, 4, 5] },
            { story: k => `A garden hose fills ${k} gallons every minute. Let x be the minutes and y be the gallons of water.`, ks: [2, 3, 5] }
          ];
          const c = pick(contexts);
          const k = pick(c.ks);
          if (v === 1) {
            const choices = [`y = ${k}x`, `y = x + ${k}`, `y = x ÷ ${k}`, `x = ${k} + y`];
            // shuffle while tracking the right one
            const order = [0, 1, 2, 3].sort(() => Math.random() - 0.5);
            return {
              prompt: `${c.story(k)} Which equation describes this relationship?`,
              type: "choice",
              choices: order.map(i => choices[i]),
              correctIndex: order.indexOf(0),
              hints: [
                "Proportional relationships always look like y = (some constant) × x.",
                `Here, each x brings ${k} along with it — so the constant is ${k}.`
              ],
              steps: [
                `The constant of proportionality is k = ${k}.`,
                `A proportional relationship is always y = kx, so the equation is <strong>y = ${k}x</strong>.`,
                `Adding (y = x + ${k}) or dividing (y = x ÷ ${k}) describe different, non-proportional patterns.`
              ]
            };
          }
          if (v === 2) {
            const x = ri(3, 9);
            return {
              prompt: `${c.story(k)} The relationship is <span class="math">y = ${k}x</span>. Find <span class="math">y</span> when <span class="math">x = ${x}</span>.`,
              type: "numeric", answer: k * x,
              hints: [
                "Substitute the value of x into the equation.",
                `y = ${k} × ${x}.`
              ],
              steps: [
                `Replace x with ${x}: y = ${k} × ${x}.`,
                `y = <strong>${k * x}</strong>.`
              ]
            };
          }
          const x = ri(4, 9);
          const y = k * x;
          return {
            prompt: `${c.story(k)} The relationship is <span class="math">y = ${k}x</span>. Find <span class="math">x</span> when <span class="math">y = ${y}</span>.`,
            type: "numeric", answer: x,
            hints: [
              "This time you know y and want x — so you'll divide.",
              `Solve ${y} = ${k}x by computing ${y} ÷ ${k}.`
            ],
            steps: [
              `${y} = ${k}x — divide both sides by ${k}.`,
              `x = ${y} ÷ ${k} = <strong>${x}</strong>.`
            ]
          };
        }
      },
      // ---------------- U8 L3 ----------------
      {
        id: "u8l3",
        title: "Graphs of Proportional Relationships",
        blurb: "A straight line through (0, 0) — and what its points are telling you.",
        teach: `
        <div class="teach-card">
          <h2>What the graph looks like</h2>
          <p>Graph a proportional relationship and you always get the same picture:</p>
          <ul>
            <li>A perfectly <strong>straight line</strong>…</li>
            <li>…that passes through the <strong>origin (0, 0)</strong> — zero of one thing means zero of the other.</li>
          </ul>
          <div class="key-idea"><span class="tag">Key idea</span>
            The point <span class="math">(1, k)</span> is on every proportional graph — when x is 1, y shows you the constant of proportionality.
          </div>
        </div>
        <div class="teach-card">
          <h2>Worked example</h2>
          <div class="example"><span class="tag">Example</span>
            <p>A graph of strawberry cost passes through the point (4, 12), where x = pounds and y = dollars.</p>
            <p><strong>Find k:</strong> k = y ÷ x = 12 ÷ 4 = <strong>3</strong>. Strawberries cost $3 per pound.</p>
            <p><strong>Meaning of the point:</strong> "(4, 12)" simply says: <em>4 pounds cost $12</em>.</p>
            <p><strong>Equation:</strong> y = 3x.</p>
          </div>
          <p>Any point on the line works for finding k — they all give the same answer. Pick whichever has the friendliest numbers.</p>
        </div>`,
        generate() {
          const v = ri(1, 3);
          if (v === 1) {
            const k = pick([1, 2, 3, 0.5, 1.5]);
            const px = pick([2, 4]);
            return {
              prompt: `The graph shows a proportional relationship. Use the labeled point to find the <strong>constant of proportionality</strong>, <span class="math">k</span>.`,
              visual: svgGraph(k, px),
              type: "numeric", answer: k,
              hints: [
                "Read the labeled point as (x, y).",
                `k = y ÷ x = ${clean(px * k)} ÷ ${clean(px)}.`
              ],
              steps: [
                `The labeled point is (${clean(px)}, ${clean(px * k)}).`,
                `k = y ÷ x = ${clean(px * k)} ÷ ${clean(px)} = <strong>${clean(k)}</strong>.`,
                `So the equation of this line is y = ${clean(k)}x.`
              ]
            };
          }
          if (v === 2) {
            const order = [0, 1, 2, 3].sort(() => Math.random() - 0.5);
            const pts = ["(0, 0)", "(1, 1)", "(0, 1)", "(1, 0)"];
            return {
              prompt: `Which point is on the graph of <strong>every</strong> proportional relationship?`,
              type: "choice",
              choices: order.map(i => pts[i]),
              correctIndex: order.indexOf(0),
              hints: [
                "Think: if you buy zero pounds of strawberries, what do you pay?",
                "Zero of x always gives zero of y in a proportional relationship."
              ],
              steps: [
                `In y = kx, plugging in x = 0 gives y = k × 0 = 0 — no matter what k is.`,
                `So every proportional graph passes through <strong>(0, 0)</strong>, the origin.`,
                `(1, 1) is only on the graph when k happens to equal 1.`
              ]
            };
          }
          const k = pick([2, 3, 4, 5]);
          const a = ri(2, 5);
          const b = a * k;
          const correct = `${a} pounds of strawberries cost $${b}`;
          const wrongs = [
            `${b} pounds of strawberries cost $${a}`,
            `Each pound of strawberries costs $${a}`,
            `${a} pounds of strawberries cost $${a * k + k}`
          ];
          const all = [correct, ...wrongs];
          const order = [0, 1, 2, 3].sort(() => Math.random() - 0.5);
          return {
            prompt: `A graph shows the cost of strawberries, where <span class="math">x</span> = pounds and <span class="math">y</span> = dollars. The point <span class="math">(${a}, ${b})</span> is on the graph. What does this point mean?`,
            type: "choice",
            choices: order.map(i => all[i]),
            correctIndex: order.indexOf(0),
            hints: [
              "The first coordinate is always x (pounds), the second is y (dollars).",
              `So the point says: ${a} of the x-thing goes with ${b} of the y-thing.`
            ],
            steps: [
              `(x, y) = (${a}, ${b}) → x = ${a} pounds, y = $${b}.`,
              `Meaning: <strong>${a} pounds cost $${b}</strong>.`,
              `Bonus: k = ${b} ÷ ${a} = ${k}, so strawberries are $${k} per pound.`
            ]
          };
        }
      }
    ]
  },

  {
    id: "u9",
    num: "Unit 9",
    title: "Proportional Relationships & Percentages",
    tint: "tint-lav",
    blurb: "Percent increase and decrease, tax, tips, discounts, and percent error.",
    lessons: [
      // ---------------- U9 L1 ----------------
      {
        id: "u9l1",
        title: "Percent Increase & Decrease",
        blurb: "Grow it or shrink it by a percent — in one single multiplication.",
        teach: `
        <div class="teach-card">
          <h2>One multiplication does it all</h2>
          <p>To change a number by a percent, you <em>could</em> find the percent and then add or subtract. But there's a smoother way — one multiplication:</p>
          <div class="key-idea"><span class="tag">Key idea</span>
            Increase by p%: multiply by <span class="math">(1 + p/100)</span> &nbsp;•&nbsp; Decrease by p%: multiply by <span class="math">(1 − p/100)</span>
          </div>
          <ul>
            <li>Increase by 25% → multiply by <span class="math">1.25</span></li>
            <li>Decrease by 20% → multiply by <span class="math">0.80</span></li>
            <li>Increase by 5% → multiply by <span class="math">1.05</span></li>
          </ul>
        </div>
        <div class="teach-card">
          <h2>Worked examples</h2>
          <div class="example"><span class="tag">Example — increase</span>
            <p>A puppy weighed 40 pounds and its weight increased by 25%.</p>
            <p><span class="math">40 × 1.25 = 50</span> → the puppy now weighs <strong>50 pounds</strong>.</p>
            <p><em>Check the long way:</em> 25% of 40 is 10, and 40 + 10 = 50. ✓</p>
          </div>
          <div class="example"><span class="tag">Example — finding the percent</span>
            <p>A video had 50 views yesterday and 60 views today. What's the percent increase?</p>
            <p><strong>Change:</strong> 60 − 50 = 10. &nbsp;<strong>Divide by the original:</strong> 10 ÷ 50 = 0.20 = <strong>20% increase</strong>.</p>
            <p>Always divide by the <em>original</em> (starting) amount — that's the most common slip, and now you know it!</p>
          </div>
        </div>`,
        generate() {
          const v = ri(1, 3);
          if (v === 1) {
            const base = pick([20, 40, 50, 60, 80, 120, 200]);
            const p = pick([5, 10, 20, 25, 50]);
            const things = ["plant grew", "savings account grew", "puppy's weight increased", "team's score increased", "follower count increased"];
            return {
              prompt: `A ${pick(things)} from <span class="math">${base}</span> by <span class="math">${p}%</span>. What is the new amount?`,
              type: "numeric", answer: base * (1 + p / 100),
              hints: [
                `Increasing by ${p}% means multiplying by ${clean(1 + p / 100)}.`,
                `Or step by step: ${p}% of ${base} is ${clean(base * p / 100)} — then add it on.`
              ],
              steps: [
                `${p}% of ${base} = ${clean(base * p / 100)}.`,
                `New amount = ${base} + ${clean(base * p / 100)} = <strong>${clean(base * (1 + p / 100))}</strong>.`,
                `One-step version: ${base} × ${clean(1 + p / 100)} = ${clean(base * (1 + p / 100))}. ✓`
              ]
            };
          }
          if (v === 2) {
            const base = pick([20, 40, 50, 60, 80, 120, 200]);
            const p = pick([5, 10, 20, 25, 50]);
            const things = ["water level dropped", "phone battery dropped", "ticket price dropped", "temperature reading dropped", "puzzle pieces remaining dropped"];
            return {
              prompt: `A ${pick(things)} from <span class="math">${base}</span> by <span class="math">${p}%</span>. What is the new amount?`,
              type: "numeric", answer: base * (1 - p / 100),
              hints: [
                `Decreasing by ${p}% means multiplying by ${clean(1 - p / 100)}.`,
                `Or: ${p}% of ${base} is ${clean(base * p / 100)} — subtract that from ${base}.`
              ],
              steps: [
                `${p}% of ${base} = ${clean(base * p / 100)}.`,
                `New amount = ${base} − ${clean(base * p / 100)} = <strong>${clean(base * (1 - p / 100))}</strong>.`,
                `One-step version: ${base} × ${clean(1 - p / 100)} = ${clean(base * (1 - p / 100))}. ✓`
              ]
            };
          }
          const base = pick([20, 25, 40, 50, 80]);
          const p = pick([10, 20, 25, 50]);
          const up = Math.random() < 0.5;
          const next = up ? base * (1 + p / 100) : base * (1 - p / 100);
          return {
            prompt: `A number changed from <span class="math">${base}</span> to <span class="math">${clean(next)}</span>. By what <strong>percent</strong> did it ${up ? "increase" : "decrease"}?`,
            type: "numeric", answer: p, unit: "%",
            hints: [
              `First find the change: ${up ? `${clean(next)} − ${base}` : `${base} − ${clean(next)}`} = ${clean(Math.abs(next - base))}.`,
              `Then divide the change by the <em>original</em>: ${clean(Math.abs(next - base))} ÷ ${base}.`
            ],
            steps: [
              `Change = ${clean(Math.abs(next - base))}.`,
              `Change ÷ original = ${clean(Math.abs(next - base))} ÷ ${base} = ${clean(p / 100)}.`,
              `${clean(p / 100)} = <strong>${p}%</strong> ${up ? "increase" : "decrease"}.`
            ]
          };
        }
      },
      // ---------------- U9 L2 ----------------
      {
        id: "u9l2",
        title: "Tax, Tip & Discount",
        blurb: "Real-life percents: restaurant bills, sales tax, and that 30%-off sign.",
        teach: `
        <div class="teach-card">
          <h2>Percents you'll actually use this weekend</h2>
          <p>Tax, tips, and discounts are all just percent increase or decrease wearing different outfits:</p>
          <ul>
            <li><strong>Sales tax</strong> — added to the price → percent <em>increase</em>. (NC's sales tax is about 7.25% in Wake County!)</li>
            <li><strong>Tip</strong> — added to a restaurant bill → percent <em>increase</em>.</li>
            <li><strong>Discount</strong> — taken off the price → percent <em>decrease</em>.</li>
          </ul>
          <div class="key-idea"><span class="tag">Key idea</span>
            total with tax/tip = price × (1 + rate) &nbsp;•&nbsp; sale price = price × (1 − discount)
          </div>
        </div>
        <div class="teach-card">
          <h2>Worked examples</h2>
          <div class="example"><span class="tag">Example — tip</span>
            <p>Dinner costs $40 and you leave a 15% tip.</p>
            <p>Tip = 15% of 40 = <span class="math">0.15 × 40 = $6</span>. Total = 40 + 6 = <strong>$46</strong>.</p>
          </div>
          <div class="example"><span class="tag">Example — discount</span>
            <p>Sneakers cost $80 and they're 25% off.</p>
            <p>You pay 75% of the price: <span class="math">80 × 0.75 = $60</span>.</p>
          </div>
          <p>Friendly mental-math trick: 10% is easy (move the decimal once). 15% = 10% + half of that. 20% = 10% doubled.</p>
        </div>`,
        generate() {
          const v = ri(1, 3);
          if (v === 1) {
            const price = pick([20, 40, 60, 80, 120]);
            const rate = pick([5, 10, 7.5]);
            const items = ["skateboard", "video game", "backpack", "pair of headphones", "board game"];
            const adjPrice = rate === 7.5 ? pick([40, 80, 120]) : price;
            return {
              prompt: `A ${pick(items)} costs <span class="math">${money(adjPrice)}</span> and sales tax is <span class="math">${rate}%</span>. What is the <strong>total cost</strong> with tax?`,
              type: "numeric", answer: adjPrice * (1 + rate / 100), unit: "dollars",
              hints: [
                `Tax = ${rate}% of ${money(adjPrice)} — multiply ${adjPrice} × ${rate / 100}.`,
                `Then add the tax to the original price.`
              ],
              steps: [
                `Tax = ${adjPrice} × ${rate / 100} = ${money(adjPrice * rate / 100)}.`,
                `Total = ${money(adjPrice)} + ${money(adjPrice * rate / 100)} = <strong>${money(adjPrice * (1 + rate / 100))}</strong>.`,
                `One step: ${adjPrice} × ${clean(1 + rate / 100)} = ${money(adjPrice * (1 + rate / 100))}. ✓`
              ]
            };
          }
          if (v === 2) {
            const bill = pick([20, 30, 40, 50, 60, 80]);
            const tip = pick([10, 15, 20]);
            return {
              prompt: `A restaurant bill is <span class="math">${money(bill)}</span> and your family leaves a <span class="math">${tip}%</span> tip. What is the <strong>total</strong> including the tip?`,
              type: "numeric", answer: bill * (1 + tip / 100), unit: "dollars",
              hints: [
                `Start with 10% of ${money(bill)} = ${money(bill * 0.1)} — then build ${tip}% from there.`,
                `Tip = ${bill} × ${tip / 100} = ${money(bill * tip / 100)}. Add it to the bill.`
              ],
              steps: [
                `Tip = ${bill} × ${tip / 100} = ${money(bill * tip / 100)}.`,
                `Total = ${money(bill)} + ${money(bill * tip / 100)} = <strong>${money(bill * (1 + tip / 100))}</strong>.`
              ]
            };
          }
          const price = pick([25, 40, 50, 60, 80]);
          const off = pick([10, 20, 25, 30, 50]);
          const items = ["hoodie", "pair of sneakers", "wireless speaker", "art set", "soccer ball"];
          return {
            prompt: `A ${pick(items)} costs <span class="math">${money(price)}</span> and it's on sale for <span class="math">${off}% off</span>. What is the <strong>sale price</strong>?`,
            type: "numeric", answer: price * (1 - off / 100), unit: "dollars",
            hints: [
              `${off}% off means you pay ${100 - off}% of the price.`,
              `Multiply: ${price} × ${clean(1 - off / 100)}.`
            ],
            steps: [
              `Discount = ${price} × ${off / 100} = ${money(price * off / 100)}.`,
              `Sale price = ${money(price)} − ${money(price * off / 100)} = <strong>${money(price * (1 - off / 100))}</strong>.`,
              `One step: ${price} × ${clean(1 - off / 100)} = ${money(price * (1 - off / 100))}. ✓`
            ]
          };
        }
      },
      // ---------------- U9 L3 ----------------
      {
        id: "u9l3",
        title: "Finding the Percent & Percent Error",
        blurb: "Work backwards: what percent is it, and how far off was the guess?",
        teach: `
        <div class="teach-card">
          <h2>Finding the percent (working backwards)</h2>
          <p>Sometimes you know both numbers and need the <em>percent</em> connecting them. The recipe never changes:</p>
          <div class="key-idea"><span class="tag">Key idea</span>
            percent = <span class="math">part ÷ whole × 100</span>
          </div>
          <div class="example"><span class="tag">Example</span>
            <p>You got 45 out of 50 free throws. <span class="math">45 ÷ 50 = 0.90</span> → <strong>90%</strong>. Nice shooting.</p>
          </div>
        </div>
        <div class="teach-card">
          <h2>Percent error</h2>
          <p><strong>Percent error</strong> measures how far off a guess or measurement was — as a percent of the <em>actual</em> value:</p>
          <div class="key-idea"><span class="tag">Key idea</span>
            percent error = <span class="math">|measured − actual| ÷ actual × 100</span>
          </div>
          <div class="example"><span class="tag">Example</span>
            <p>Sam estimated the jar had 40 marbles. It actually had 50.</p>
            <p><strong>Error:</strong> |40 − 50| = 10. &nbsp;<strong>Divide by actual:</strong> 10 ÷ 50 = 0.20 → <strong>20% error</strong>.</p>
            <p>Always divide by the <em>actual</em> value, not the guess — and the answer is never negative (the bars |&nbsp;| take care of that).</p>
          </div>
        </div>`,
        generate() {
          const v = ri(1, 3);
          if (v === 1) {
            const whole = pick([20, 25, 40, 50, 80, 200]);
            const p = pick([5, 10, 20, 25, 50, 75]);
            const part = whole * p / 100;
            const stories = [
              [`${clean(part)} of the ${whole} students in the cafeteria brought lunch from home`, "students"],
              [`A team made ${clean(part)} of its ${whole} free throws`, "free throws"],
              [`${clean(part)} of the ${whole} books on a shelf are graphic novels`, "books"]
            ];
            return {
              prompt: `${pick(stories)[0]}. What <strong>percent</strong> is that?`,
              type: "numeric", answer: p, unit: "%",
              hints: [
                "percent = part ÷ whole × 100.",
                `Compute ${clean(part)} ÷ ${whole} first, then multiply by 100.`
              ],
              steps: [
                `part ÷ whole = ${clean(part)} ÷ ${whole} = ${clean(p / 100)}.`,
                `${clean(p / 100)} × 100 = <strong>${p}%</strong>.`
              ]
            };
          }
          if (v === 2) {
            const actual = pick([20, 25, 40, 50, 80]);
            const p = pick([5, 10, 20, 25]);
            const up = Math.random() < 0.5;
            const measured = actual * (1 + (up ? p : -p) / 100);
            const stories = [
              ["guessed the jar held", "marbles", "it actually held"],
              ["estimated the hallway was", "feet long", "it actually measured"],
              ["predicted the recipe needed", "ounces of flour", "it actually needed"]
            ];
            const s = pick(stories);
            return {
              prompt: `A student ${s[0]} <span class="math">${clean(measured)}</span> ${s[1]}, but ${s[2]} <span class="math">${actual}</span>. What is the <strong>percent error</strong>?`,
              type: "numeric", answer: p, unit: "%",
              hints: [
                `First find the size of the error: |${clean(measured)} − ${actual}| = ${clean(Math.abs(measured - actual))}.`,
                `Divide the error by the <em>actual</em> value (${actual}), then multiply by 100.`
              ],
              steps: [
                `Error = |${clean(measured)} − ${actual}| = ${clean(Math.abs(measured - actual))}.`,
                `Error ÷ actual = ${clean(Math.abs(measured - actual))} ÷ ${actual} = ${clean(p / 100)}.`,
                `Percent error = <strong>${p}%</strong>.`
              ]
            };
          }
          const whole = pick([20, 40, 50, 60, 80, 200]);
          const p = pick([10, 20, 25, 50]);
          const part = whole * p / 100;
          return {
            prompt: `<span class="math">${p}%</span> of a number is <span class="math">${clean(part)}</span>. What is the number?`,
            type: "numeric", answer: whole,
            hints: [
              `Think of it as: ${p}% × (the number) = ${clean(part)}.`,
              `Divide: ${clean(part)} ÷ ${clean(p / 100)}.`
            ],
            steps: [
              `${p}% as a decimal is ${clean(p / 100)}.`,
              `number = ${clean(part)} ÷ ${clean(p / 100)} = <strong>${whole}</strong>.`,
              `Check: ${p}% of ${whole} = ${clean(part)}. ✓`
            ]
          };
        }
      }
    ]
  }
];
