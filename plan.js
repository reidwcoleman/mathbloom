/* ============================================================
   MathBloom — Summer Math Plan (parent-coach lesson plan)
   Math 6 Plus Preview • Units 4, 8 & 9 • Jun 15 – Aug 21, 2026

   This file holds the *fully built-out* first two weeks (Unit 4,
   IM Grade 7 lessons 1–9 across 6 sessions) plus a light preview
   of weeks 3–10. renderPlan() in app.js turns it into the in-app
   Summer Plan view and wires each session to its MathBloom practice.

   IM student lesson URL pattern (verified):
     https://im.kendallhunt.com/MS/students/2/{unit}/{lesson}/index.html
     (Grade 7 = course "2"; WCPSS Unit 4 = IM Unit 1)
   ============================================================ */

const IM = (unit, lesson, title) => ({
  code: `IM 7.${unit}.${lesson}`,
  num: `Lesson ${lesson}`,
  title,
  url: `https://im.kendallhunt.com/MS/students/2/${unit}/${lesson}/index.html`,
});

const SUMMER_PLAN = {
  title: "Summer Math Plan",
  subtitle: "Math 6 Plus Preview · Units 4, 8 & 9",
  range: "June 15 – August 21, 2026",
  cadence: "2–3 sessions a week · 30–45 min each",
  intro:
    "Two weeks, six sessions, one big idea: scale. Each session pairs the official Illustrative Math lesson with hands-on work and a MathBloom practice garden to bloom. No timers, no grades — the goal is for these to feel <em>familiar</em> next year, not perfect now.",

  // weeks fully built out
  weeks: [
    {
      n: 1,
      dates: "Jun 15 – 19",
      focus: "Unit 4 — Scaled Copies",
      canDo: "Find a scale factor and use corresponding parts.",
      sessions: [
        {
          id: "w1s1",
          label: "S1",
          day: "Mon · Jun 15",
          title: "What is a scaled copy?",
          minutes: "35–45 min",
          lessonId: "u4l1",
          im: [
            IM(1, 1, "What are Scaled Copies?"),
            IM(1, 2, "Corresponding Parts and Scale Factors"),
          ],
          objective:
            "Understand what makes a copy truly “scaled,” match up corresponding parts, and find a scale factor by dividing a copy length by its matching original length.",
          steps: [
            {
              kind: "warmup",
              time: "3 min",
              label: "Warm up",
              body:
                "Pinch-zoom a photo on your phone all the way in, then back out. Ask: <em>what stays the same about the picture, and what changes?</em> (The shape stays; the size changes — that's scaling.)",
            },
            {
              kind: "learn",
              time: "15 min",
              label: "Learn",
              body:
                "Work IM Lesson 1 on paper — the portraits, the letter-F drawings, the polygon matching — deciding which figures are real scaled copies and which are just stretched. Then IM Lesson 2: line up corresponding sides, and compute <strong>scale factor = copy ÷ original</strong>. Read both lesson summaries at the bottom of the page.",
            },
            {
              kind: "practice",
              time: "15 min",
              label: "Practice",
              body:
                "Open the MathBloom <strong>“Scaled Copies &amp; Scale Factors”</strong> lesson below — do the Learn walk-through, then bloom the Practice garden (5 correct).",
            },
            {
              kind: "check",
              time: "2 min",
              label: "Exit check",
              body:
                "<em>Rectangle A is 4 cm wide; its scaled copy B is 10 cm wide. What's the scale factor?</em> &nbsp;→&nbsp; 10 ÷ 4 = <strong>2.5</strong>.",
            },
          ],
          coach:
            "The one habit that carries all week: always divide <em>copy ÷ original</em>, and confirm every pair of corresponding sides gives the <em>same</em> number — that's what makes it a scaled copy.",
        },
        {
          id: "w1s2",
          label: "S2",
          day: "Wed · Jun 17",
          title: "Make your own scaled copy",
          minutes: "30–40 min",
          lessonId: "u4l1",
          im: [IM(1, 3, "Making Scaled Copies")],
          objective:
            "Build a scaled copy yourself by multiplying every length by a chosen scale factor — a hands-on, grid-paper session.",
          steps: [
            {
              kind: "warmup",
              time: "3 min",
              label: "Warm up",
              body:
                "On grid paper, draw any simple shape — an “L”, a rectangle, a little house — using whole-number grid lengths. This is the original.",
            },
            {
              kind: "learn",
              time: "20 min",
              label: "Build it",
              body:
                "Work IM Lesson 3: redraw your shape with a scale factor of <strong>2</strong> (count each side's grid squares, double it, redraw), then again with <strong>½</strong>. This is a drawing session, not a worksheet — pencil and graph paper are the whole point.",
            },
            {
              kind: "practice",
              time: "10 min",
              label: "Practice",
              body:
                "Pop back into the MathBloom <strong>“Scaled Copies &amp; Scale Factors”</strong> Practice for a few more reps if the flower isn't bloomed yet — the “find the missing side” questions reinforce exactly this.",
            },
            {
              kind: "check",
              time: "2 min",
              label: "Exit check",
              body:
                "<em>You scale a 3-by-5 rectangle by a factor of 2. What are the new side lengths?</em> &nbsp;→&nbsp; <strong>6 by 10</strong>.",
            },
          ],
          coach:
            "No app screen beats actually drawing it. Keep the original right next to the copy so corresponding sides are easy to line up and compare.",
        },
        {
          id: "w1s3",
          label: "S3",
          day: "Fri · Jun 19",
          title: "What changes, what stays the same",
          minutes: "35–45 min",
          lessonId: "u4l1",
          im: [
            IM(1, 4, "Scaled Relationships"),
            IM(1, 5, "The Size of the Scale Factor"),
          ],
          objective:
            "See that angles stay equal in a scaled copy (only lengths scale), and predict from the scale factor alone whether a copy grows, shrinks, or stays the same.",
          steps: [
            {
              kind: "warmup",
              time: "3 min",
              label: "Warm up",
              body:
                "Quick predictions: <em>“If the scale factor is 1, what does the copy look like?”</em> (Identical.) <em>“If it's ½?”</em> (Half-size.)",
            },
            {
              kind: "learn",
              time: "18 min",
              label: "Learn",
              body:
                "IM Lesson 4 — corresponding <strong>angles stay equal</strong>; all lengths use the same factor; even distances between points scale. IM Lesson 5 — factor &gt; 1 enlarges, between 0 and 1 shrinks, exactly 1 stays the same size. Read both summaries.",
            },
            {
              kind: "practice",
              time: "12 min",
              label: "Practice",
              body:
                "MathBloom <strong>“Scaled Copies &amp; Scale Factors”</strong> Practice — the bigger/smaller comparison questions hit Lesson 5 directly. Keep the flower bloomed at 5/5.",
            },
            {
              kind: "check",
              time: "2 min",
              label: "Exit check",
              body:
                "<em>Scale factor ¾ — bigger, smaller, or same? Do the angles change?</em> &nbsp;→&nbsp; <strong>smaller; angles don't change</strong>.",
            },
          ],
          coach:
            "Week-1 goal lands here: find a scale factor and use corresponding parts. A little shaky is totally fine — this is a <em>preview</em>, not a test.",
        },
      ],
    },
    {
      n: 2,
      dates: "Jun 22 – 26",
      focus: "Unit 4 — Scaling Area & Scale Drawings",
      canDo: "Know that area scales by (scale factor)², and read a map scale.",
      sessions: [
        {
          id: "w2s1",
          label: "S1",
          day: "Mon · Jun 22",
          title: "The area surprise",
          minutes: "35–45 min",
          lessonId: "u4l3",
          im: [IM(1, 6, "Scaling and Area")],
          objective:
            "Discover the big twist of Unit 4: when lengths scale by a factor k, area scales by k² — not by k.",
          steps: [
            {
              kind: "warmup",
              time: "3 min",
              label: "Warm up",
              body:
                "Ask, and let them guess: <em>“If you double every side of a square, does the area double?”</em> Most kids say yes. (It quadruples — that's the hook.)",
            },
            {
              kind: "learn",
              time: "18 min",
              label: "Learn",
              body:
                "IM Lesson 6: build a shape, scale it by 2, count the squares — area went up <strong>×4</strong>. Try factor 3 → <strong>×9</strong>. Try ½ → <strong>×¼</strong>. The summary nails it: <strong>area scale factor = (length scale factor)²</strong>.",
            },
            {
              kind: "practice",
              time: "12 min",
              label: "Practice",
              body:
                "MathBloom <strong>“Scaling &amp; Area”</strong> — do the Learn walk-through, then bloom the Practice garden.",
            },
            {
              kind: "check",
              time: "2 min",
              label: "Exit check",
              body:
                "<em>A figure is scaled by factor 3. The original area is 5 cm². New area?</em> &nbsp;→&nbsp; 5 × 3² = <strong>45 cm²</strong>.",
            },
          ],
          coach:
            "This is the single most-tested idea in Unit 4. If the squaring move feels shaky, spend a few extra minutes here before the next session — it pays off.",
        },
        {
          id: "w2s2",
          label: "S2",
          day: "Wed · Jun 24",
          title: "Maps & scale drawings",
          minutes: "40–45 min",
          lessonId: "u4l2",
          im: [
            IM(1, 7, "Scale Drawings"),
            IM(1, 8, "Scale Drawings and Maps"),
          ],
          objective:
            "Use a scale like “1 cm represents 5 km” to move between a drawing/map and real life — multiply out to the world, divide back to the page.",
          steps: [
            {
              kind: "warmup",
              time: "3 min",
              label: "Warm up",
              body:
                "Pull up a real map on your phone and hunt for the little <strong>scale bar</strong> in the corner. That bar is exactly what this lesson is about.",
            },
            {
              kind: "learn",
              time: "15 min",
              label: "Learn",
              body:
                "IM Lesson 7 — what a scale actually means. IM Lesson 8 — using a map's scale to find real distances. The summary habit: <strong>drawing → real = multiply; real → drawing = divide</strong>.",
            },
            {
              kind: "practice",
              time: "15 min",
              label: "Practice",
              body:
                "MathBloom <strong>“Scale Drawings &amp; Maps”</strong> (with Wake County town pairs) — Learn, then bloom the Practice garden.",
            },
            {
              kind: "check",
              time: "2 min",
              label: "Exit check",
              body:
                "<em>Map scale 1 cm = 5 km. Two towns are 4 cm apart on the map. Real distance?</em> &nbsp;→&nbsp; 4 × 5 = <strong>20 km</strong>.",
            },
          ],
          coach:
            "The classic slip is <em>adding</em> instead of multiplying (4 + 5 = 9). The app's built-in sense-check — “should my answer be bigger or smaller?” — catches it every time. Point that habit out.",
        },
        {
          id: "w2s3",
          label: "S3",
          day: "Fri · Jun 26",
          title: "Draw your room to scale",
          minutes: "35–45 min",
          lessonId: "u4l2",
          im: [IM(1, 9, "Creating Scale Drawings")],
          objective:
            "Make your own scale drawing of a real space — a room, a desk, the yard — by measuring real lengths and dividing by a scale you choose.",
          steps: [
            {
              kind: "warmup",
              time: "3 min",
              label: "Warm up",
              body:
                "Pick a room. Pace it off or eyeball it: <em>“About how many feet long is this wall?”</em> Estimates are fine — you're just getting a feel for the real sizes.",
            },
            {
              kind: "learn",
              time: "22 min",
              label: "Build it",
              body:
                "IM Lesson 9: choose a scale (say <em>1 inch = 2 feet</em>), measure or estimate the real lengths of a small room or a desk, divide each by the scale, and draw it to scale on paper. A tape measure makes it feel real.",
            },
            {
              kind: "practice",
              time: "8 min",
              label: "Practice",
              body:
                "A couple more reps in MathBloom <strong>“Scale Drawings &amp; Maps”</strong> Practice — the real-life → drawing questions match today exactly.",
            },
            {
              kind: "check",
              time: "2 min",
              label: "Exit check",
              body:
                "<em>A real wall is 12 ft. Scale: 1 in = 4 ft. How long on the drawing?</em> &nbsp;→&nbsp; 12 ÷ 4 = <strong>3 in</strong>.",
            },
          ],
          coach:
            "End-of-Week-2 goal: area scales by the square, and your kid can read and use a map scale. This drawing is the keepsake — stick it on the fridge. Next week opens Unit 8 (proportional relationships).",
        },
      ],
    },
  ],

  // light preview of the rest of summer (weeks 3–10)
  upcoming: [
    { n: 3, dates: "Jun 29 – Jul 3", focus: "Unit 4 — Changing scales + wrap-up", unit: "u4" },
    { n: 4, dates: "Jul 6 – 10", focus: "Unit 8 — Proportional relationships in tables", unit: "u8" },
    { n: 5, dates: "Jul 13 – 17", focus: "Unit 8 — Equations; proportional or not?", unit: "u8" },
    { n: 6, dates: "Jul 20 – 24", focus: "Unit 8 — Graphs + wrap-up", unit: "u8" },
    { n: 7, dates: "Jul 27 – 31", focus: "Unit 9 — Rates with fractions", unit: "u9" },
    { n: 8, dates: "Aug 3 – 7", focus: "Unit 9 — Percent increase & decrease", unit: "u9" },
    { n: 9, dates: "Aug 10 – 14", focus: "Unit 9 — Applying percentages", unit: "u9" },
    { n: 10, dates: "Aug 17 – 21", focus: "Unit 9 wrap-up + cumulative review", unit: "u9" },
  ],

  resources: [
    {
      label: "IM Grade 7 student lessons",
      note: "the actual course content, lesson by lesson",
      url: "https://im.kendallhunt.com/MS/students/2/index.html",
    },
    {
      label: "Khan Academy 7th grade (IM-aligned)",
      note: "videos + auto-graded practice for car rides & rainy days",
      url: "https://www.khanacademy.org/math/7th-grade-illustrative-math",
    },
    {
      label: "WCPSS Math 6 Plus course page",
      note: "overview videos, vocabulary, and extra-practice checkpoints",
      url: "https://sites.google.com/wcpss.net/k-12mathematics/middle-school-math-courses/math-6-plus",
    },
  ],
};
