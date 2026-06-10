# MathBloom 🌸

Calm, joyful math practice for **Wake County Math 6 Plus** — a DeltaMath alternative designed
for students with math anxiety. Lessons "bloom" into flowers as you master them.

## Units & lessons

Built on the WCPSS / Open Up Resources (Illustrative Mathematics) curriculum:

| Unit | Lessons |
|---|---|
| **Unit 4 — Scale Drawings** | Scaled Copies & Scale Factors • Scale Drawings & Maps • Scaling & Area |
| **Unit 8 — Introducing Proportional Relationships** | Tables & the Constant of Proportionality • Equations y = kx • Graphs of Proportional Relationships |
| **Unit 9 — Proportional Relationships & Percentages** | Percent Increase & Decrease • Tax, Tip & Discount • Finding the Percent & Percent Error |

Each lesson has a **Learn** tab (key ideas + worked examples) and a **Practice** tab with
randomly generated questions (numeric entry and multiple choice, with SVG diagrams,
maps, tables, and graphs).

## Anxiety-friendly by design

- **No timers, no grades, no penalties** — progress only ever goes up
- Wrong answers get warm, encouraging feedback (never red X's)
- **Progressive hints** are always free; after two tries, a full **"show me the steps"** walkthrough
- **Skip any question** with no cost ("Try a different one")
- A **"Take a breath"** button opens a guided box-breathing overlay
- Mastery = 5 correct answers ("petals"), any number of attempts, any pace
- Answers accept fractions (`1/2`), decimals, `$`, and `%`

## Running it

No build step, no dependencies, no accounts. Progress saves in the browser via localStorage.

```bash
cd ~/MathBloom
python3 -m http.server 8642
# open http://localhost:8642
```

Or just double-click `index.html`.

## Files

- `index.html` — shell, breathing overlay, confetti canvas
- `styles.css` — cozy garden theme (Fraunces + Nunito, cream/sage/peach palette)
- `lessons.js` — curriculum content + randomized question generators
- `app.js` — router, practice engine, progress, petal confetti
