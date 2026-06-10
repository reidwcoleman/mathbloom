/* ============================================================
   MathBloom v2 — curriculum content
   Wake County Math 6 Plus (Open Up Resources / Illustrative Math)
   Unit 4: Scale Drawings        (IM Grade 7, Unit 1)
   Unit 8: Introducing Proportional Relationships (IM G7, Unit 2)
   Unit 9: Proportional Relationships & Percentages (IM G7, Unit 4)

   Lesson shape:
     pages: [{ title, html, checkpoint?: {q, options[], correct, why} }]
     generate(): random practice question
   ============================================================ */

// ---------- tiny helpers ----------
const ri = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = arr => arr[ri(0, arr.length - 1)];
const money = n => "$" + (Math.round(n * 100) / 100).toFixed(2);
const clean = n => String(Math.round(n * 100) / 100);
const shuffle = arr => {
  const order = arr.map((_, i) => i).sort(() => Math.random() - 0.5);
  return { items: order.map(i => arr[i]), indexOf: i => order.indexOf(i) };
};

// fraction display for scale factors under 1
const fracName = { 0.5: "½", 0.25: "¼", 0.75: "¾", 1.5: "1½" };
const fshow = f => fracName[f] || clean(f);

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
    <text x="${30 + W1 / 2}" y="${totalH - 12}" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="700" font-size="13" fill="#728A78">${clean(w)} cm</text>
    <text x="${18}" y="${y1 + H1 / 2 + 4}" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="700" font-size="13" fill="#728A78" transform="rotate(-90 18 ${y1 + H1 / 2})">${clean(h)} cm</text>
    <rect x="${30 + W1 + gap}" y="${y2}" width="${W2}" height="${H2}" rx="6" fill="#FBE3D4" stroke="#C9703F" stroke-width="2.5"/>
    <text x="${30 + W1 + gap + W2 / 2}" y="${y2 + H2 / 2 + 5}" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="800" font-size="16" fill="#2E4036">B</text>
    <text x="${30 + W1 + gap + W2 / 2}" y="${totalH - 12}" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="700" font-size="13" fill="#728A78">${clean(w * f)} cm</text>
    <text x="${30 + W1 + gap - 12}" y="${y2 + H2 / 2 + 4}" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="700" font-size="13" fill="#728A78" transform="rotate(-90 ${30 + W1 + gap - 12} ${y2 + H2 / 2})">${clean(h * f)} cm</text>
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
    <text x="190" y="24" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="800" font-size="14" fill="#9A8650">${d} cm on the map</text>
  </svg>`;
}

function svgGraph(k, px) {
  const OX = 44, OY = 252, plot = 240;
  const X = x => OX + x * (plot / 10);
  const Y = y => OY - y * (plot / 10);
  const xEnd = k >= 1 ? 10 / k : 10;
  let grid = "";
  for (let i = 0; i <= 10; i += 2) {
    grid += `<line x1="${X(i)}" y1="${Y(0)}" x2="${X(i)}" y2="${Y(10)}" stroke="#E3DCC9" stroke-width="1"/>
             <line x1="${X(0)}" y1="${Y(i)}" x2="${X(10)}" y2="${Y(i)}" stroke="#E3DCC9" stroke-width="1"/>
             <text x="${X(i)}" y="${OY + 18}" text-anchor="middle" font-size="11" font-family="Nunito,sans-serif" fill="#8A9684">${i}</text>
             <text x="${OX - 10}" y="${Y(i) + 4}" text-anchor="end" font-size="11" font-family="Nunito,sans-serif" fill="#8A9684">${i}</text>`;
  }
  return `
  <svg viewBox="0 0 330 290" width="320" role="img" aria-label="Graph of a proportional relationship" style="background:#FFFDF7;border-radius:14px">
    ${grid}
    <line x1="${X(0)}" y1="${Y(0)}" x2="${X(10)}" y2="${Y(0)}" stroke="#2E4036" stroke-width="2"/>
    <line x1="${X(0)}" y1="${Y(0)}" x2="${X(0)}" y2="${Y(10)}" stroke="#2E4036" stroke-width="2"/>
    <line x1="${X(0)}" y1="${Y(0)}" x2="${X(xEnd)}" y2="${Y(xEnd * k)}" stroke="#3E6B4F" stroke-width="3" stroke-linecap="round"/>
    <circle cx="${X(px)}" cy="${Y(px * k)}" r="7" fill="#F2A07B" stroke="#C9703F" stroke-width="2.5"/>
    <text x="${X(px) + 12}" y="${Y(px * k) - 10}" font-size="14" font-weight="800" font-family="Nunito,sans-serif" fill="#C9703F">(${clean(px)}, ${clean(px * k)})</text>
    <text x="${X(5)}" y="${OY + 36}" text-anchor="middle" font-size="12" font-weight="800" font-family="Nunito,sans-serif" fill="#8A9684">x</text>
    <text x="${OX - 30}" y="${Y(5)}" text-anchor="middle" font-size="12" font-weight="800" font-family="Nunito,sans-serif" fill="#8A9684">y</text>
  </svg>`;
}

function svgPercentBar(p, label) {
  const W = 320, H = 64, bw = 280;
  const fill = Math.max(0, Math.min(100, p)) / 100 * bw;
  return `
  <svg viewBox="0 0 ${W} ${H}" width="${W}" role="img" aria-label="Percent bar showing ${p} percent">
    <rect x="20" y="18" width="${bw}" height="24" rx="12" fill="#F0E9D8" stroke="#E0D6BC" stroke-width="1.5"/>
    <rect x="20" y="18" width="${fill}" height="24" rx="12" fill="#F2A07B"/>
    <text x="${20 + bw / 2}" y="12" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="800" font-size="12" fill="#8A9684">0% ─────────── 100%</text>
    <text x="${20 + fill}" y="58" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="800" font-size="13" fill="#C9703F">${label}</text>
  </svg>`;
}

function htmlTable(xs, ys, mysteryIdx = -1, headX = "x", headY = "y") {
  let rows = "";
  for (let i = 0; i < xs.length; i++) {
    const yCell = i === mysteryIdx ? `<td class="mystery">?</td>` : `<td>${clean(ys[i])}</td>`;
    rows += `<tr><td>${clean(xs[i])}</td>${yCell}</tr>`;
  }
  return `<table class="q-table"><tr><th>${headX}</th><th>${headY}</th></tr>${rows}</table>`;
}

/* ============================================================ */

const UNITS = [
  {
    id: "u4",
    num: "Unit 4",
    title: "Scale Drawings",
    tint: "tint-peach",
    blurb: "Scaled copies, scale factors, maps, and how scaling changes area.",
    lessons: [
      // ================ U4 L1 ================
      {
        id: "u4l1",
        title: "Scaled Copies & Scale Factors",
        blurb: "What makes a copy 'scaled', and the one number that controls it all.",
        pages: [
          {
            title: "Same shape, new size",
            html: `
              <p>A <strong>scaled copy</strong> is a figure that's the same shape as the original — just a different size. Think of zooming a photo on your phone: nothing gets squished or stretched weirdly, the whole picture grows or shrinks <em>together</em>.</p>
              <div class="teach-visual">${svgScaledRects(3, 2, 2)}</div>
              <p>Rectangle B is a scaled copy of Rectangle A. Both sides doubled: 3 → 6 and 2 → 4. That "doubling number" has a name…</p>
              <div class="key-idea"><span class="tag">Key idea</span>
                The <strong>scale factor</strong> is the number every length gets multiplied by.<br>
                scale factor = <span class="math">side in the copy ÷ matching side in the original</span>
              </div>`
          },
          {
            title: "Reading the scale factor",
            html: `
              <p>The scale factor instantly tells you what happened:</p>
              <ul>
                <li><strong>Greater than 1</strong> (like 2, 3, or 1½) → the copy got <strong>bigger</strong>.</li>
                <li><strong>Between 0 and 1</strong> (like ½ or ¾) → the copy got <strong>smaller</strong>.</li>
                <li><strong>Exactly 1</strong> → identical twin, same size.</li>
              </ul>
              <div class="example"><span class="tag">Worked example</span>
                <p>Rectangle A is 4 cm wide. Its scaled copy, Rectangle B, is 12 cm wide.</p>
                <p><strong>Step 1.</strong> Match up corresponding sides — the two widths.</p>
                <p><strong>Step 2.</strong> Divide copy ÷ original: <span class="math">12 ÷ 4 = 3</span>.</p>
                <p><strong>Step 3.</strong> Scale factor = <strong>3</strong>. Every side of B is 3 times the matching side of A.</p>
              </div>`,
            checkpoint: {
              q: "A copy is made with a scale factor of ¾. Will the copy be bigger or smaller than the original?",
              options: ["Bigger", "Smaller", "Exactly the same size"],
              correct: 1,
              why: "¾ is between 0 and 1, so every length shrinks a little — the copy is smaller. (And no worries if you guessed differently — that's exactly what this checkpoint is for.)"
            }
          },
          {
            title: "The scaled-copy test",
            html: `
              <p>How do you know if a figure really is a scaled copy? Check <em>every</em> pair of corresponding sides:</p>
              <div class="key-idea"><span class="tag">The test</span>
                In a true scaled copy, every pair of corresponding sides gives the <strong>same</strong> scale factor.
              </div>
              <div class="example"><span class="tag">Spot the fake</span>
                <p>A 2×4 rectangle becomes a 4×12 rectangle. Scaled copy?</p>
                <p>Widths: 4 ÷ 2 = <strong>2</strong>. &nbsp;Lengths: 12 ÷ 4 = <strong>3</strong>.</p>
                <p>Different numbers → <strong>not</strong> a scaled copy. It got stretched, not scaled.</p>
              </div>
              <p>That's the whole lesson: one number, multiplied everywhere, checked everywhere. You're ready to practice. 🌸</p>`
          }
        ],
        generate() {
          const v = ri(1, 4);
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
            const ctx = pick(["drawing", "logo", "poster design", "comic panel"]);
            return {
              prompt: `An artist makes a scaled copy of a ${ctx} using a scale factor of <span class="math">${fshow(f)}</span>. One side of the original is <span class="math">${s} cm</span> long. How long is the corresponding side in the copy?`,
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
          if (v === 3) {
            const f = pick([2, 3, 4]);
            const orig = ri(3, 8);
            const copySide = orig * f;
            return {
              prompt: `A scaled copy was made with a scale factor of <span class="math">${f}</span>. A side of the <em>copy</em> measures <span class="math">${copySide} cm</span>. How long is the corresponding side of the <em>original</em>?`,
              type: "numeric", answer: orig, unit: "cm",
              hints: [
                "This is the reverse direction — the copy is bigger, so the original must be smaller.",
                `Divide the copy's side by the scale factor: ${copySide} ÷ ${f}.`
              ],
              steps: [
                `Copy = original × ${f}, so original = copy ÷ ${f}.`,
                `${copySide} ÷ ${f} = <strong>${orig} cm</strong>.`,
                `Check: ${orig} × ${f} = ${copySide}. ✓`
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
      // ================ U4 L2 ================
      {
        id: "u4l2",
        title: "Scale Drawings & Maps",
        blurb: "Turn map centimeters into real-world kilometers (and back again).",
        pages: [
          {
            title: "What a scale tells you",
            html: `
              <p>A <strong>scale drawing</strong> shows something real at a different size — a map, a floor plan, a blueprint. The <strong>scale</strong> is the translation rule between the drawing and reality:</p>
              <div class="key-idea"><span class="tag">A scale looks like</span>
                "1 cm represents 5 km" &nbsp;•&nbsp; "1 inch represents 4 feet"
              </div>
              <div class="teach-visual">${svgMap("3", "Raleigh", "Wake Forest")}</div>
              <p>If this map's scale is <em>1 cm represents 10 km</em>, then those 3 map-centimeters stand for 30 real kilometers. Every centimeter "carries" 10 km.</p>`
          },
          {
            title: "Two directions, two operations",
            html: `
              <p>Scale problems only ever go two ways, and each has its own operation:</p>
              <ul>
                <li><strong>Drawing → real life:</strong> <span class="math">multiply</span> by the scale (real life is bigger).</li>
                <li><strong>Real life → drawing:</strong> <span class="math">divide</span> by the scale (the drawing is smaller).</li>
              </ul>
              <div class="example"><span class="tag">Worked example — map to real life</span>
                <p>Scale: <em>1 cm represents 25 km</em>. Raleigh and Durham are 1.5 cm apart on the map.</p>
                <p><span class="math">1.5 × 25 = 37.5</span> → about <strong>37.5 km</strong> in real life.</p>
              </div>
              <div class="example"><span class="tag">Worked example — real life to drawing</span>
                <p>A wall is 12 feet long. The floor plan's scale is <em>1 inch represents 4 feet</em>.</p>
                <p><span class="math">12 ÷ 4 = 3</span> → draw it <strong>3 inches</strong> long.</p>
              </div>`,
            checkpoint: {
              q: "A map's scale is 1 cm represents 5 km. Two parks are 4 cm apart on the map. How far apart are they really?",
              options: ["9 km", "20 km", "1.25 km"],
              correct: 1,
              why: "Map → real life means multiply: 4 cm × 5 km per cm = 20 km. (Adding 4 + 5 = 9 is the classic mix-up — scales multiply, they don't add.)"
            }
          },
          {
            title: "A quick sense-check habit",
            html: `
              <p>Before you answer a scale question, ask yourself one tiny question: <em>"Should my answer be bigger or smaller than the number I started with?"</em></p>
              <ul>
                <li>Going to <strong>real life</strong>? Real things are big — expect a <strong>bigger</strong> number.</li>
                <li>Going to <strong>the drawing</strong>? Drawings are small — expect a <strong>smaller</strong> number.</li>
              </ul>
              <div class="key-idea"><span class="tag">Why it helps</span>
                If you multiply when you meant to divide, this habit catches it instantly — before any stress can sneak in.
              </div>
              <p>That's it. Multiply out to the world, divide back to the page. Ready to try? 🗺️</p>`
          }
        ],
        generate() {
          const v = ri(1, 4);
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
                `Map → real life means multiply: ${clean(d)} × ${k}.`
              ],
              steps: [
                `Going from the map to real life means multiplying by the scale.`,
                `${clean(d)} cm × ${k} km per cm = <strong>${clean(d * k)} km</strong>.`,
                `Sense-check: real life should be the bigger number. ${clean(d * k)} > ${clean(d)}. ✓`
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
                "You're going from real life back to the map — so the answer should be a smaller number.",
                `Divide the real distance by the scale: ${real} ÷ ${k}.`
              ],
              steps: [
                `Going from real life to the map means dividing by the scale.`,
                `${real} km ÷ ${k} km per cm = <strong>${d} cm</strong>.`,
                `Sense-check: the map number should be smaller. ${d} < ${real}. ✓`
              ]
            };
          }
          if (v === 3) {
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
          const d = pick([2, 3, 4, 5]);
          const k = pick([5, 10, 20, 25]);
          const real = d * k;
          const [a, b] = pick(towns);
          return {
            prompt: `On a map, ${a} and ${b} are <span class="math">${d} cm</span> apart. In real life they are <span class="math">${real} km</span> apart. What is the map's scale — <strong>1 cm represents how many km</strong>?`,
            type: "numeric", answer: k, unit: "km",
            hints: [
              `The scale is how many real km fit into each map cm.`,
              `Divide real by map: ${real} ÷ ${d}.`
            ],
            steps: [
              `Scale = real distance ÷ map distance.`,
              `${real} ÷ ${d} = <strong>${k}</strong>, so the scale is 1 cm represents ${k} km.`,
              `Check: ${d} cm × ${k} = ${real} km. ✓`
            ]
          };
        }
      },
      // ================ U4 L3 ================
      {
        id: "u4l3",
        title: "Scaling & Area",
        blurb: "The sneaky squared rule: scale lengths by 3, and area grows by 9.",
        pages: [
          {
            title: "Area breaks the pattern",
            html: `
              <p>Here's a fun surprise. Scale a 2 × 3 rectangle by a factor of 2:</p>
              <div class="teach-visual">${svgScaledRects(3, 2, 2)}</div>
              <p>The sides doubled… but count the space inside. The original holds <span class="math">2 × 3 = 6</span> squares. The copy holds <span class="math">4 × 6 = 24</span> squares. The area didn't double — it got <strong>4 times</strong> bigger!</p>
              <div class="key-idea"><span class="tag">Key idea</span>
                scale factor <span class="math">s</span> → area is multiplied by <span class="math">s × s = s²</span>
              </div>`
          },
          {
            title: "Why squared?",
            html: `
              <p>Area is two lengths multiplied together — like width × height. When you scale, <em>both</em> of those lengths get multiplied by <span class="math">s</span>:</p>
              <div class="example"><span class="tag">See it happen</span>
                <p>new area = (w × s) × (h × s) = (w × h) × <strong>s × s</strong></p>
                <p>The scale factor sneaks in twice. That's the whole secret.</p>
              </div>
              <div class="example"><span class="tag">Worked example</span>
                <p>A 2 cm × 3 cm rectangle (area 6 cm²) is scaled by 3.</p>
                <p>New sides: 6 cm × 9 cm. New area: <span class="math">6 × 9 = 54 cm²</span>.</p>
                <p>Rule check: 6 × 3² = 6 × 9 = 54. ✓</p>
              </div>`,
            checkpoint: {
              q: "Every side of a sticker is scaled by 4 to make a poster. The poster's area is how many times the sticker's?",
              options: ["4 times", "8 times", "16 times"],
              correct: 2,
              why: "Area multiplies by the scale factor squared: 4² = 16. (Doubling to 8 is a really common first instinct — the squared rule takes a little while to feel natural.)"
            }
          },
          {
            title: "Shrinking squares too",
            html: `
              <p>The squared rule works for shrinking just the same:</p>
              <ul>
                <li>Scale factor <span class="math">½</span> → area is multiplied by <span class="math">½ × ½ = ¼</span>. Quarter, not half!</li>
                <li>Scale factor <span class="math">⅓</span> → area becomes <span class="math">⅑</span> of the original.</li>
              </ul>
              <div class="key-idea"><span class="tag">Going backwards</span>
                If the <em>area</em> got multiplied by 9, the scale factor was <span class="math">3</span> — ask "what number times itself gives 9?"
              </div>
              <p>Lengths once, areas twice. You've got the whole rule now. 📐</p>`
          }
        ],
        generate() {
          const v = ri(1, 4);
          if (v === 1) {
            const s = pick([2, 3, 4, 5]);
            const A = ri(3, 9);
            return {
              prompt: `A figure has an area of <span class="math">${A} cm²</span>. A scaled copy is made with a scale factor of <span class="math">${s}</span>. What is the area of the copy?`,
              type: "numeric", answer: A * s * s, unit: "cm²",
              hints: [
                `Lengths multiply by ${s}, but area multiplies by ${s}².`,
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
          if (v === 3) {
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
          const s = pick([2, 3, 4, 5]);
          const A = pick([2, 3, 4, 5]);
          return {
            prompt: `A small garden plot has an area of <span class="math">${A} m²</span>. A scaled-up plot has an area of <span class="math">${A * s * s} m²</span>. What was the <strong>scale factor</strong> for the side lengths?`,
            type: "numeric", answer: s,
            hints: [
              `First find what the area was multiplied by: ${A * s * s} ÷ ${A} = ${s * s}.`,
              `Now ask: what number times itself gives ${s * s}?`
            ],
            steps: [
              `Area multiplier = ${A * s * s} ÷ ${A} = ${s * s}.`,
              `Area multiplies by s², so s² = ${s * s} → s = <strong>${s}</strong>.`,
              `Check: ${s} × ${s} = ${s * s}. ✓`
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
      // ================ U8 L1 ================
      {
        id: "u8l1",
        title: "Tables & the Constant of Proportionality",
        blurb: "Spot the one number hiding in every proportional table.",
        pages: [
          {
            title: "The hidden multiplier",
            html: `
              <p>Two quantities are in a <strong>proportional relationship</strong> when one is always the <em>same multiple</em> of the other. That multiple is the <strong>constant of proportionality</strong> — we call it <span class="math">k</span>.</p>
              <div class="teach-visual">${htmlTable([2, 4, 5], [6, 12, 15], -1, "bananas", "strawberries")}</div>
              <p>Check each row: 6 ÷ 2 = 3, &nbsp;12 ÷ 4 = 3, &nbsp;15 ÷ 5 = 3. Same answer every time — every banana brings exactly 3 strawberries along.</p>
              <div class="key-idea"><span class="tag">Key idea</span>
                In every row: <span class="math">k = y ÷ x</span> — and it's the <em>same k every time</em>.
              </div>`
          },
          {
            title: "The one-row trick & the every-row test",
            html: `
              <p>Two superpowers come from this:</p>
              <ul>
                <li><strong>Finding k:</strong> pick <em>any one row</em> (the friendliest numbers!) and divide y ÷ x.</li>
                <li><strong>Testing proportionality:</strong> check <em>every row</em>. If even one row gives a different quotient, it's <strong>not</strong> proportional.</li>
              </ul>
              <div class="example"><span class="tag">Worked example — filling a gap</span>
                <p>A proportional table shows x = 3 → y = 12, and x = 7 → y = ?</p>
                <p><strong>Step 1.</strong> Find k from the complete row: k = 12 ÷ 3 = 4.</p>
                <p><strong>Step 2.</strong> Use it: y = 7 × 4 = <strong>28</strong>.</p>
              </div>`,
            checkpoint: {
              q: "A table shows x = 2 → y = 10 and x = 6 → y = 30. Is it proportional so far?",
              options: ["Yes — both rows give k = 5", "No — the y values are different", "Can't tell without a graph"],
              correct: 0,
              why: "10 ÷ 2 = 5 and 30 ÷ 6 = 5. Same quotient → proportional so far. The y values being different is totally fine — it's the *ratio* that has to stay the same."
            }
          },
          {
            title: "What k actually means",
            html: `
              <p>k isn't just a number to compute — it always <em>means</em> something in the story:</p>
              <ul>
                <li>Cost vs. pounds → k is the <strong>price per pound</strong>.</li>
                <li>Pages vs. minutes → k is the <strong>reading speed</strong>.</li>
                <li>Strawberries vs. bananas → k is <strong>strawberries per banana</strong>.</li>
              </ul>
              <div class="key-idea"><span class="tag">Friendly translation</span>
                k = "how much y you get for <em>one</em> x." It's the per-one number.
              </div>
              <p>When a problem feels confusing, find k and say it out loud as a "per" sentence. The fog usually clears. 🌤️</p>`
          }
        ],
        generate() {
          const v = ri(1, 4);
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
          if (v === 3) {
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
          const k = pick([2, 3, 4, 5]);
          const ctx = pick([
            { x: "pounds of apples", y: "cost in dollars", meaning: "dollars per pound" },
            { x: "minutes", y: "pages read", meaning: "pages per minute" },
            { x: "batches", y: "cups of sugar", meaning: "cups per batch" }
          ]);
          const xs = [2, 4, 6];
          const ys = xs.map(x => x * k);
          return {
            prompt: `The table relates ${ctx.x} (<span class="math">x</span>) to ${ctx.y} (<span class="math">y</span>). What is <span class="math">k</span> — the ${ctx.meaning}?`,
            visual: htmlTable(xs, ys, -1, ctx.x, ctx.y),
            type: "numeric", answer: k,
            hints: [
              `k is the "per one" number — how much y for a single x.`,
              `Any row works: ${clean(ys[0])} ÷ ${clean(xs[0])}.`
            ],
            steps: [
              `k = y ÷ x = ${clean(ys[0])} ÷ ${clean(xs[0])} = <strong>${k}</strong>.`,
              `Meaning: ${k} ${ctx.meaning}.`
            ]
          };
        }
      },
      // ================ U8 L2 ================
      {
        id: "u8l2",
        title: "Equations of the Form y = kx",
        blurb: "One tiny equation that describes the whole relationship.",
        pages: [
          {
            title: "From table to equation",
            html: `
              <p>Once you know <span class="math">k</span>, you can capture the <em>entire</em> relationship — every possible pair of values, forever — in one tiny equation:</p>
              <div class="key-idea"><span class="tag">Key idea</span>
                <span class="math">y = kx</span> &nbsp;— "to get y, multiply x by k."
              </div>
              <div class="example"><span class="tag">Example</span>
                <p>A food truck sells tacos for $4 each. Let x = tacos, y = total cost.</p>
                <p>Equation: <span class="math">y = 4x</span>. Done. That one line knows the price of 1 taco, 7 tacos, 100 tacos…</p>
              </div>`
          },
          {
            title: "Forward and backward",
            html: `
              <p>The equation works in both directions:</p>
              <div class="example"><span class="tag">Forward — know x, want y</span>
                <p>y = 4x, and you buy 7 tacos: y = 4 × 7 = <strong>$28</strong>. Just multiply.</p>
              </div>
              <div class="example"><span class="tag">Backward — know y, want x</span>
                <p>y = 4x, and you spent $36: 36 = 4x → x = 36 ÷ 4 = <strong>9 tacos</strong>. Just divide.</p>
              </div>
              <div class="key-idea"><span class="tag">Memory hook</span>
                Forward questions <strong>multiply</strong>. Backward questions <strong>divide</strong>.
              </div>`,
            checkpoint: {
              q: "Ari bikes 12 miles every hour, so y = 12x (x hours, y miles). How long does a 36-mile ride take?",
              options: ["3 hours", "48 hours", "432 hours"],
              correct: 0,
              why: "You know y (36 miles) and want x — that's the backward direction, so divide: 36 ÷ 12 = 3 hours."
            }
          },
          {
            title: "Spotting the right equation",
            html: `
              <p>On tests, you'll often pick the equation from a lineup. Here's how to spot the real one:</p>
              <ul>
                <li>Proportional equations are <em>always</em> <span class="math">y = (number) × x</span>. Nothing added, nothing subtracted.</li>
                <li><span class="math">y = x + 4</span>? That's adding — not proportional.</li>
                <li><span class="math">y = x ÷ 4</span>? Sneaky! That IS proportional — it's the same as y = ¼x. The k is just a fraction.</li>
              </ul>
              <div class="key-idea"><span class="tag">The test</span>
                Plug in x = 0. A proportional equation must give y = 0. Zero tacos, zero dollars.
              </div>
              <p>Multiply forward, divide backward, and check with zero. That's the whole toolkit. 🧰</p>`
          }
        ],
        generate() {
          const v = ri(1, 4);
          const contexts = [
            { story: k => `A bakery sells muffins for $${k} each. Let x be the number of muffins and y be the total cost in dollars.`, ks: [2, 3, 4, 5] },
            { story: k => `Jordan reads ${k} pages every minute. Let x be the minutes spent reading and y be the pages read.`, ks: [2, 3, 4] },
            { story: k => `A recipe uses ${k} cups of flour for every batch of cookies. Let x be the number of batches and y be the cups of flour.`, ks: [2, 3, 4, 5] },
            { story: k => `A garden hose fills ${k} gallons every minute. Let x be the minutes and y be the gallons of water.`, ks: [2, 3, 5] }
          ];
          const c = pick(contexts);
          const k = pick(c.ks);
          if (v === 1) {
            const opts = [`y = ${k}x`, `y = x + ${k}`, `y = x ÷ ${k}`, `x = ${k} + y`];
            const sh = shuffle(opts);
            return {
              prompt: `${c.story(k)} Which equation describes this relationship?`,
              type: "choice",
              choices: sh.items,
              correctIndex: sh.indexOf(0),
              hints: [
                "Proportional relationships always look like y = (some constant) × x.",
                `Here, each x brings ${k} along with it — so the constant is ${k}.`
              ],
              steps: [
                `The constant of proportionality is k = ${k}.`,
                `A proportional relationship is always y = kx, so the equation is <strong>y = ${k}x</strong>.`,
                `Quick test: x = 0 should give y = 0 — and it does. Equations that add (y = x + ${k}) fail that test.`
              ]
            };
          }
          if (v === 2) {
            const x = ri(3, 9);
            return {
              prompt: `${c.story(k)} The relationship is <span class="math">y = ${k}x</span>. Find <span class="math">y</span> when <span class="math">x = ${x}</span>.`,
              type: "numeric", answer: k * x,
              hints: [
                "Forward direction — you know x, you want y. Multiply.",
                `y = ${k} × ${x}.`
              ],
              steps: [
                `Replace x with ${x}: y = ${k} × ${x}.`,
                `y = <strong>${k * x}</strong>.`
              ]
            };
          }
          if (v === 3) {
            const x = ri(4, 9);
            const y = k * x;
            return {
              prompt: `${c.story(k)} The relationship is <span class="math">y = ${k}x</span>. Find <span class="math">x</span> when <span class="math">y = ${y}</span>.`,
              type: "numeric", answer: x,
              hints: [
                "Backward direction — you know y, you want x. Divide.",
                `Solve ${y} = ${k}x by computing ${y} ÷ ${k}.`
              ],
              steps: [
                `${y} = ${k}x — divide both sides by ${k}.`,
                `x = ${y} ÷ ${k} = <strong>${x}</strong>.`
              ]
            };
          }
          const n = ri(3, 6);
          const pairs = [
            { item: "movie tickets", unit: "dollars" },
            { item: "smoothies", unit: "dollars" },
            { item: "raffle tickets", unit: "dollars" }
          ];
          const pr = pick(pairs);
          return {
            prompt: `${n} ${pr.item} cost <span class="math">$${n * k}</span>, and the cost is proportional to the number bought. If the equation is <span class="math">y = kx</span>, what is <span class="math">k</span>?`,
            type: "numeric", answer: k,
            hints: [
              `k is the cost of just one — the "per one" number.`,
              `Divide total by count: ${n * k} ÷ ${n}.`
            ],
            steps: [
              `k = y ÷ x = ${n * k} ÷ ${n} = <strong>${k}</strong>.`,
              `So the equation is y = ${k}x — each one costs $${k}.`
            ]
          };
        }
      },
      // ================ U8 L3 ================
      {
        id: "u8l3",
        title: "Graphs of Proportional Relationships",
        blurb: "A straight line through (0, 0) — and what its points are telling you.",
        pages: [
          {
            title: "The picture is always the same",
            html: `
              <p>Graph any proportional relationship and you get the same picture every single time:</p>
              <ul>
                <li>A perfectly <strong>straight line</strong>…</li>
                <li>…through the <strong>origin (0, 0)</strong> — because zero of one thing means zero of the other.</li>
              </ul>
              <div class="teach-visual">${svgGraph(2, 3)}</div>
              <p>This line is <span class="math">y = 2x</span>. Steeper lines have bigger k; gentler lines have smaller k.</p>`
          },
          {
            title: "Reading k off the graph",
            html: `
              <p>Any point on the line will hand you k — just divide:</p>
              <div class="key-idea"><span class="tag">Key idea</span>
                For any point on the line: <span class="math">k = y ÷ x</span>. The point <span class="math">(1, k)</span> is the shortcut — when x is 1, y <em>is</em> k.
              </div>
              <div class="example"><span class="tag">Worked example</span>
                <p>A strawberry-cost graph passes through (4, 12) — x in pounds, y in dollars.</p>
                <p><strong>Find k:</strong> 12 ÷ 4 = <strong>3</strong> → strawberries cost $3 per pound.</p>
                <p><strong>Equation:</strong> y = 3x. <strong>Meaning of (4, 12):</strong> "4 pounds cost $12." That's it!</p>
              </div>`,
            checkpoint: {
              q: "A proportional graph passes through (5, 20). What is k?",
              options: ["4", "15", "100"],
              correct: 0,
              why: "k = y ÷ x = 20 ÷ 5 = 4. (Subtracting 20 − 5 = 15 is a common slip — k is a quotient, not a difference.)"
            }
          },
          {
            title: "Points are sentences",
            html: `
              <p>Every point on a real-world graph is secretly a sentence. The first coordinate is x's quantity, the second is y's:</p>
              <ul>
                <li>(3, 12) on a cost-vs-pounds graph → "3 pounds cost $12."</li>
                <li>(2, 8) on a distance-vs-hours graph → "in 2 hours, 8 miles."</li>
                <li>(0, 0) on every proportional graph → "none of x, none of y."</li>
              </ul>
              <div class="key-idea"><span class="tag">Order matters</span>
                It's always (x, y) — across the hall first, then up the stairs. Mixing the order flips the meaning.
              </div>
              <p>Straight line, through the origin, every point a sentence. You can read graphs now. 📈</p>`
          }
        ],
        generate() {
          const v = ri(1, 4);
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
            const pts = ["(0, 0)", "(1, 1)", "(0, 1)", "(1, 0)"];
            const sh = shuffle(pts);
            return {
              prompt: `Which point is on the graph of <strong>every</strong> proportional relationship?`,
              type: "choice",
              choices: sh.items,
              correctIndex: sh.indexOf(0),
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
          if (v === 3) {
            const k = pick([2, 3, 4, 5]);
            const a = ri(2, 5);
            const b = a * k;
            const correct = `${a} pounds of strawberries cost $${b}`;
            const opts = [
              correct,
              `${b} pounds of strawberries cost $${a}`,
              `Each pound of strawberries costs $${a}`,
              `${a} pounds of strawberries cost $${b + k}`
            ];
            const sh = shuffle(opts);
            return {
              prompt: `A graph shows the cost of strawberries, where <span class="math">x</span> = pounds and <span class="math">y</span> = dollars. The point <span class="math">(${a}, ${b})</span> is on the graph. What does this point mean?`,
              type: "choice",
              choices: sh.items,
              correctIndex: sh.indexOf(0),
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
          const k = pick([1.5, 2, 3]);
          const px = 2;
          const tx = pick([6, 8]);
          return {
            prompt: `The graph shows a proportional relationship with the point <span class="math">(${px}, ${clean(px * k)})</span> labeled. Use the graph's pattern to find <span class="math">y</span> when <span class="math">x = ${tx}</span>.`,
            visual: svgGraph(k, px),
            type: "numeric", answer: tx * k,
            hints: [
              `First find k from the labeled point: ${clean(px * k)} ÷ ${px} = ${clean(k)}.`,
              `Then multiply: y = ${clean(k)} × ${tx}.`
            ],
            steps: [
              `From (${px}, ${clean(px * k)}): k = ${clean(px * k)} ÷ ${px} = ${clean(k)}.`,
              `Equation: y = ${clean(k)}x.`,
              `y = ${clean(k)} × ${tx} = <strong>${clean(tx * k)}</strong>.`
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
      // ================ U9 L1 ================
      {
        id: "u9l1",
        title: "Percent Increase & Decrease",
        blurb: "Grow it or shrink it by a percent — in one single multiplication.",
        pages: [
          {
            title: "One multiplication does it all",
            html: `
              <p>To change a number by a percent, you <em>could</em> find the percent and then add or subtract. But there's a smoother way — a single multiplication:</p>
              <div class="key-idea"><span class="tag">Key idea</span>
                Increase by p% → multiply by <span class="math">(1 + p/100)</span><br>
                Decrease by p% → multiply by <span class="math">(1 − p/100)</span>
              </div>
              <ul>
                <li>Increase by 25% → × <span class="math">1.25</span></li>
                <li>Decrease by 20% → × <span class="math">0.80</span> (you keep 80%)</li>
                <li>Increase by 5% → × <span class="math">1.05</span></li>
              </ul>
              <div class="teach-visual">${svgPercentBar(80, "decrease by 20% → keep 80%")}</div>`
          },
          {
            title: "Both directions, worked out",
            html: `
              <div class="example"><span class="tag">Worked example — increase</span>
                <p>A puppy weighed 40 pounds and its weight increased by 25%.</p>
                <p><span class="math">40 × 1.25 = 50</span> → the puppy now weighs <strong>50 pounds</strong>.</p>
                <p><em>Long way check:</em> 25% of 40 is 10, and 40 + 10 = 50. ✓</p>
              </div>
              <div class="example"><span class="tag">Worked example — decrease</span>
                <p>A $60 game is reduced by 30%.</p>
                <p>You keep 70%: <span class="math">60 × 0.70 = 42</span> → new price <strong>$42</strong>.</p>
              </div>`,
            checkpoint: {
              q: "Which multiplication increases a number by 30%?",
              options: ["× 0.30", "× 1.30", "× 30"],
              correct: 1,
              why: "Increasing by 30% means keeping the whole thing (the 1) and adding 30% more (the 0.30): × 1.30. Multiplying by 0.30 would shrink it to less than a third!"
            }
          },
          {
            title: "Finding the percent of change",
            html: `
              <p>Sometimes you know both numbers and want the percent. The recipe:</p>
              <div class="key-idea"><span class="tag">Key idea</span>
                percent change = <span class="math">change ÷ original × 100</span>
              </div>
              <div class="example"><span class="tag">Worked example</span>
                <p>A video had 50 views yesterday and 60 today.</p>
                <p><strong>Change:</strong> 60 − 50 = 10. <strong>Divide by the original:</strong> 10 ÷ 50 = 0.20 → <strong>20% increase</strong>.</p>
              </div>
              <p>The most common slip in all of percent-land: dividing by the <em>new</em> number instead of the <em>original</em>. Now you know the trap, so it can't catch you. 🪤</p>`
          }
        ],
        generate() {
          const v = ri(1, 4);
          if (v === 1) {
            const base = pick([20, 40, 50, 60, 80, 120, 200]);
            const p = pick([5, 10, 20, 25, 50]);
            const things = ["plant's height grew", "savings account grew", "puppy's weight increased", "team's score increased", "follower count increased"];
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
            const things = ["water level dropped", "phone battery dropped", "ticket price dropped", "temperature reading dropped", "number of empty seats dropped"];
            return {
              prompt: `A ${pick(things)} from <span class="math">${base}</span> by <span class="math">${p}%</span>. What is the new amount?`,
              type: "numeric", answer: base * (1 - p / 100),
              hints: [
                `Decreasing by ${p}% means multiplying by ${clean(1 - p / 100)} — you keep ${100 - p}%.`,
                `Or: ${p}% of ${base} is ${clean(base * p / 100)} — subtract that from ${base}.`
              ],
              steps: [
                `${p}% of ${base} = ${clean(base * p / 100)}.`,
                `New amount = ${base} − ${clean(base * p / 100)} = <strong>${clean(base * (1 - p / 100))}</strong>.`,
                `One-step version: ${base} × ${clean(1 - p / 100)} = ${clean(base * (1 - p / 100))}. ✓`
              ]
            };
          }
          if (v === 3) {
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
          const p = pick([10, 20, 25, 30, 40]);
          const up = Math.random() < 0.5;
          const mult = up ? 1 + p / 100 : 1 - p / 100;
          const opts = [
            `× ${clean(mult)}`,
            `× ${clean(p / 100)}`,
            `× ${clean(up ? 1 - p / 100 : 1 + p / 100)}`
          ];
          const sh = shuffle(opts);
          return {
            prompt: `Which single multiplication ${up ? "increases" : "decreases"} a number by <span class="math">${p}%</span>?`,
            type: "choice",
            choices: sh.items,
            correctIndex: sh.indexOf(0),
            hints: [
              up ? "Keep the whole thing (1) and add the extra percent on top." : `Decreasing by ${p}% means you keep ${100 - p}% of it.`,
              `As a decimal, that's ${clean(mult)}.`
            ],
            steps: [
              up
                ? `Increase by ${p}% → multiply by 1 + ${p}/100 = <strong>${clean(mult)}</strong>.`
                : `Decrease by ${p}% → keep ${100 - p}% → multiply by <strong>${clean(mult)}</strong>.`,
              `Multiplying by ${clean(p / 100)} alone would give you only the ${p}% piece, not the new total.`
            ]
          };
        }
      },
      // ================ U9 L2 ================
      {
        id: "u9l2",
        title: "Tax, Tip & Discount",
        blurb: "Real-life percents: restaurant bills, sales tax, and that 30%-off sign.",
        pages: [
          {
            title: "Three costumes, one idea",
            html: `
              <p>Tax, tips, and discounts are all just percent increase or decrease wearing different outfits:</p>
              <ul>
                <li><strong>Sales tax</strong> — added to the price → percent <em>increase</em>. (Wake County's sales tax is about 7.25%!)</li>
                <li><strong>Tip</strong> — added to a restaurant bill → percent <em>increase</em>.</li>
                <li><strong>Discount</strong> — taken off the price → percent <em>decrease</em>.</li>
              </ul>
              <div class="key-idea"><span class="tag">Key idea</span>
                total with tax or tip = price × (1 + rate)<br>
                sale price = price × (1 − discount)
              </div>`
          },
          {
            title: "At the restaurant & at the store",
            html: `
              <div class="example"><span class="tag">Worked example — tip</span>
                <p>Dinner costs $40 and you leave a 15% tip.</p>
                <p>Tip = 0.15 × 40 = <span class="math">$6</span>. Total = 40 + 6 = <strong>$46</strong>.</p>
              </div>
              <div class="example"><span class="tag">Worked example — discount</span>
                <p>Sneakers cost $80 and they're 25% off.</p>
                <p>You pay 75%: <span class="math">80 × 0.75 = $60</span>.</p>
              </div>
              <div class="teach-visual">${svgPercentBar(75, "25% off → you pay 75%")}</div>`,
            checkpoint: {
              q: "A $50 jacket is 20% off. What do you pay?",
              options: ["$10", "$40", "$30"],
              correct: 1,
              why: "20% off means you pay 80%: 50 × 0.80 = $40. The $10 is the discount amount — the question asks what you pay."
            }
          },
          {
            title: "Mental math superpowers",
            html: `
              <p>You can do most tips and discounts in your head with one trick — <strong>start from 10%</strong>:</p>
              <ul>
                <li><strong>10%</strong> = move the decimal one spot. 10% of $48 → $4.80.</li>
                <li><strong>5%</strong> = half of 10%. → $2.40.</li>
                <li><strong>15%</strong> = 10% + 5%. → $7.20.</li>
                <li><strong>20%</strong> = 10% doubled. → $9.60.</li>
              </ul>
              <div class="key-idea"><span class="tag">Read the question twice</span>
                Some questions want the <em>tip amount</em>; others want the <em>total</em>. Some want the <em>discount</em>; others want the <em>sale price</em>. Five seconds of checking saves the whole answer.
              </div>
              <p>Next time your family's at a restaurant, you get to be the tip calculator. 🧾</p>`
          }
        ],
        generate() {
          const v = ri(1, 4);
          if (v === 1) {
            const rate = pick([5, 10, 7.5]);
            const price = rate === 7.5 ? pick([40, 80, 120]) : pick([20, 40, 60, 80, 120]);
            const items = ["skateboard", "video game", "backpack", "pair of headphones", "board game"];
            return {
              prompt: `A ${pick(items)} costs <span class="math">${money(price)}</span> and sales tax is <span class="math">${rate}%</span>. What is the <strong>total cost</strong> with tax?`,
              type: "numeric", answer: price * (1 + rate / 100), unit: "dollars",
              hints: [
                `Tax = ${rate}% of ${money(price)} — multiply ${price} × ${rate / 100}.`,
                `Then add the tax to the original price.`
              ],
              steps: [
                `Tax = ${price} × ${rate / 100} = ${money(price * rate / 100)}.`,
                `Total = ${money(price)} + ${money(price * rate / 100)} = <strong>${money(price * (1 + rate / 100))}</strong>.`,
                `One step: ${price} × ${clean(1 + rate / 100)} = ${money(price * (1 + rate / 100))}. ✓`
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
          if (v === 3) {
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
          const price = pick([20, 30, 40, 50, 60, 80]);
          const off = pick([10, 20, 25, 30, 50]);
          const items = ["hoodie", "graphic novel set", "water bottle", "desk lamp", "puzzle"];
          return {
            prompt: `A ${pick(items)} costs <span class="math">${money(price)}</span> and is marked <span class="math">${off}% off</span>. How much money do you <strong>save</strong>?`,
            type: "numeric", answer: price * off / 100, unit: "dollars",
            hints: [
              `This one asks for the discount itself — the amount taken off.`,
              `Compute ${off}% of ${price}: multiply ${price} × ${off / 100}.`
            ],
            steps: [
              `Savings = ${off}% of ${money(price)}.`,
              `${price} × ${off / 100} = <strong>${money(price * off / 100)}</strong> saved.`,
              `(The sale price would be ${money(price * (1 - off / 100))} — different question, also nice to know.)`
            ]
          };
        }
      },
      // ================ U9 L3 ================
      {
        id: "u9l3",
        title: "Finding the Percent & Percent Error",
        blurb: "Work backwards: what percent is it, and how far off was the guess?",
        pages: [
          {
            title: "Part, whole, percent",
            html: `
              <p>Every percent question has three characters: the <strong>part</strong>, the <strong>whole</strong>, and the <strong>percent</strong>. Know two of them, and you can always find the third:</p>
              <div class="key-idea"><span class="tag">The triangle</span>
                percent = <span class="math">part ÷ whole × 100</span><br>
                part = <span class="math">whole × percent/100</span><br>
                whole = <span class="math">part ÷ (percent/100)</span>
              </div>
              <div class="example"><span class="tag">Worked example</span>
                <p>You made 45 of 50 free throws. <span class="math">45 ÷ 50 = 0.90</span> → <strong>90%</strong>. Nice shooting.</p>
              </div>
              <div class="teach-visual">${svgPercentBar(90, "45 out of 50 = 90%")}</div>`
          },
          {
            title: "Finding the mysterious whole",
            html: `
              <p>The trickiest direction is finding the <em>whole</em> when you know the part. Turn the words into an equation:</p>
              <div class="example"><span class="tag">Worked example</span>
                <p>"25% of what number is 12?"</p>
                <p><strong>Translate:</strong> 0.25 × (the number) = 12.</p>
                <p><strong>Solve:</strong> the number = 12 ÷ 0.25 = <strong>48</strong>.</p>
                <p><strong>Check:</strong> 25% of 48 = 12. ✓</p>
              </div>
              <div class="key-idea"><span class="tag">Sense-check</span>
                If 12 is only <em>part</em> of the number (25% of it), the whole number must be <em>bigger</em> than 12. If your answer came out smaller — flip the division.
              </div>`,
            checkpoint: {
              q: "50% of what number is 30?",
              options: ["15", "60", "1,500"],
              correct: 1,
              why: "If 30 is only half the number, the number is 30 × 2 = 60. Or formally: 30 ÷ 0.50 = 60."
            }
          },
          {
            title: "Percent error",
            html: `
              <p><strong>Percent error</strong> measures how far off a guess or measurement was — as a percent of the <em>actual</em> value:</p>
              <div class="key-idea"><span class="tag">Key idea</span>
                percent error = <span class="math">|measured − actual| ÷ actual × 100</span>
              </div>
              <div class="example"><span class="tag">Worked example</span>
                <p>Sam estimated the jar had 40 marbles. It actually had 50.</p>
                <p><strong>Error:</strong> |40 − 50| = 10. <strong>Divide by actual:</strong> 10 ÷ 50 = 0.20 → <strong>20% error</strong>.</p>
              </div>
              <p>Two friendly reminders: divide by the <em>actual</em> value (not the guess), and percent error is never negative — the |&nbsp;| bars take care of that. Being "off" isn't bad; measuring how off is just… science. 🔬</p>`
          }
        ],
        generate() {
          const v = ri(1, 4);
          if (v === 1) {
            const whole = pick([20, 25, 40, 50, 80, 200]);
            const p = pick([5, 10, 20, 25, 50, 75]);
            const part = whole * p / 100;
            const stories = [
              `${clean(part)} of the ${whole} students in the cafeteria brought lunch from home`,
              `A team made ${clean(part)} of its ${whole} free throws`,
              `${clean(part)} of the ${whole} books on a shelf are graphic novels`
            ];
            return {
              prompt: `${pick(stories)}. What <strong>percent</strong> is that?`,
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
          if (v === 3) {
            const whole = pick([20, 40, 50, 60, 80, 200]);
            const p = pick([10, 20, 25, 50]);
            const part = whole * p / 100;
            return {
              prompt: `<span class="math">${p}%</span> of a number is <span class="math">${clean(part)}</span>. What is the number?`,
              type: "numeric", answer: whole,
              hints: [
                `Translate: ${clean(p / 100)} × (the number) = ${clean(part)}.`,
                `Divide: ${clean(part)} ÷ ${clean(p / 100)}.`
              ],
              steps: [
                `${p}% as a decimal is ${clean(p / 100)}.`,
                `number = ${clean(part)} ÷ ${clean(p / 100)} = <strong>${whole}</strong>.`,
                `Sense-check: ${clean(part)} is just part of the number, so the answer should be bigger than ${clean(part)}. ✓`
              ]
            };
          }
          const whole = pick([20, 40, 60, 80, 120, 200]);
          const p = pick([5, 10, 25, 50, 75]);
          const stories = [
            `A class survey found that ${p}% of ${whole} students walk to school. How many students walk?`,
            `${p}% of the ${whole} seats in a theater are filled. How many seats are filled?`,
            `A game is downloaded ${whole} times, and ${p}% of players finish level one. How many finish?`
          ];
          return {
            prompt: pick(stories),
            visual: svgPercentBar(p, `${p}% of ${whole}`),
            type: "numeric", answer: whole * p / 100,
            hints: [
              `This time you want the part: part = whole × percent.`,
              `Multiply: ${whole} × ${clean(p / 100)}.`
            ],
            steps: [
              `part = whole × percent/100 = ${whole} × ${clean(p / 100)}.`,
              `= <strong>${clean(whole * p / 100)}</strong>.`
            ]
          };
        }
      }
    ]
  }
];
