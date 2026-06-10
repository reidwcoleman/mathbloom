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

Each lesson has a **Learn** walk-through (bite-sized pages with worked examples, visuals,
and ungraded "quick check" checkpoints) and a **Practice** tab with randomly generated
questions (numeric entry and multiple choice, with SVG diagrams, maps, tables, graphs,
and percent bars). Finishing the Learn pages marks the lesson **✓ learned**; five correct
practice answers makes it **bloom** — both saved permanently.

## The garden

The home page is an illustrated meadow scene. Each lesson is a plant that grows through
stages — seed → sprout → bud → bloom — as you practice. Butterflies arrive at 3 blooms,
a second at 6, and a rainbow appears when all 9 lessons bloom. Tap any plant to jump to
its lesson. A "continue where you left off" card and progress stats round out the home page.

## Anxiety-friendly by design

- **No timers, no grades, no penalties** — progress only ever goes up, and is never lost
- Wrong answers get warm, encouraging feedback (never red X's)
- **"Need anything?" row** on every question: a hint, see the steps, a different question, or a calm minute
- **Progressive hints** are always free; after two tries, a full **"show me the steps"** walkthrough
- **Calm corner** with three tools: box breathing, 5-4-3-2-1 grounding ("Notice"), and kind-words cards
- **Dusk mode** — a soft evening palette for low-light or low-stimulation studying
- Checkpoints in lessons are explicitly "just for you, never graded"
- Mastery = 5 correct answers ("petals"), any number of attempts, any pace
- Answers accept fractions (`1/2`), decimals, `$`, and `%`

## Saving

Progress saves automatically in the browser (localStorage) — no account needed to start.
For cross-device saves, the ☁️ **Cloud save** panel creates a friendly **garden code**
(like `fern-tulip-482`) — no email or password. Enter the code on any device and the
gardens merge (progress only ever grows). Backed by a Supabase table
(`mathbloom_gardens`: code / jsonb data / updated_at) with RLS — the unguessable code
is the per-garden secret; there is no delete policy. Sync is local-first: cloud pushes
are debounced after each save, fetched + merged on boot, and failures fall back
silently to local with auto-retry on the next save.

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
