/* ============================================================
   MathBloom — Summer Math Plan (parent-coach lesson plan)
   Math 6 Plus Preview • Units 4, 8 & 9 • Jun 15 – Aug 21, 2026

   The first two weeks are fully built out as FOUR complete,
   hour-long MathBloom lessons (Unit 4, IM Grade 7 lessons 1–9),
   two sessions a week. Each session is a full lesson with three
   parts in the app: Learn → Work it through (guided) → Practice.
   Weeks 3–10 are a light preview. renderPlan() in app.js renders
   this and wires each session to its lesson.

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
  cadence: "2 sessions a week · about 1 hour each",
  intro:
    "Two weeks, four hour-long lessons, one big idea: scale. Each session is a complete MathBloom lesson with three parts — <strong>Learn</strong> it, <strong>Work it through</strong> together one step at a time, then <strong>Practice</strong> until the flower blooms. No timers, no grades — the goal is for these to feel <em>familiar</em> next year, not perfect now.",

  // weeks fully built out — 2 sessions/week, ~1 hour each
  weeks: [
    {
      n: 1,
      dates: "Jun 15 – 19",
      focus: "Unit 4 — Scaled Copies",
      canDo: "Find a scale factor, use corresponding parts, and tell what the factor's size means.",
      sessions: [
        {
          id: "w1s1",
          label: "S1",
          day: "Mon · Jun 15",
          title: "Scaled Copies & Scale Factors",
          minutes: "~60 min",
          lessonId: "u4l1",
          im: [
            IM(1, 1, "What are Scaled Copies?"),
            IM(1, 2, "Corresponding Parts and Scale Factors"),
            IM(1, 3, "Making Scaled Copies"),
          ],
          objective:
            "Understand what makes a copy “scaled,” find a scale factor by dividing copy ÷ original, use it to find missing sides, and build a scaled copy yourself.",
          steps: [
            { kind: "warmup", time: "5 min", label: "Warm up", body: "Pinch-zoom a photo on your phone all the way in and back out. Ask: <em>what stays the same about the picture, and what changes?</em> (The shape stays; the size changes — that's scaling.)" },
            { kind: "learn", time: "20 min", label: "Learn it", body: "Open the lesson below and read the five <strong>🌱 Learn</strong> pages — same shape/new size, reading a scale factor, the scaled-copy test, and making your own — answering the two quick checkpoints as you go." },
            { kind: "work", time: "20 min", label: "Work it through", body: "Tap <strong>🪴 Work it through</strong> and do the three guided examples one step at a time: find a scale factor, use it to find a missing side, and test whether a figure is a true scaled copy." },
            { kind: "practice", time: "15 min", label: "Practice &amp; bloom", body: "Open <strong>🌸 Practice</strong> and answer until the flower blooms (5 petals). Hints and “show me the steps” are always free and never cost anything." },
            { kind: "check", time: "—", label: "Exit check", body: "Away from the screen: <em>Rectangle A is 4 cm wide; its scaled copy B is 10 cm wide. Scale factor?</em> &nbsp;→&nbsp; 10 ÷ 4 = <strong>2.5</strong>." },
          ],
          coach:
            "The habit that carries all of Unit 4: divide <em>copy ÷ original</em>, and check that every pair of corresponding sides gives the same number. The in-app guided phase drills exactly this.",
        },
        {
          id: "w1s2",
          label: "S2",
          day: "Thu · Jun 18",
          title: "Scaled Relationships & the Size of the Scale Factor",
          minutes: "~60 min",
          lessonId: "u4l2",
          im: [
            IM(1, 4, "Scaled Relationships"),
            IM(1, 5, "The Size of the Scale Factor"),
          ],
          objective:
            "See that angles never change when scaling, that every length shares one factor, what the factor's size tells you, and how to run the relationship backwards.",
          steps: [
            { kind: "warmup", time: "5 min", label: "Warm up", body: "Quick predictions: <em>“If the scale factor is 1, what does the copy look like?”</em> (Identical.) <em>“If it's ½?”</em> (Half-size.)" },
            { kind: "learn", time: "20 min", label: "Learn it", body: "Read the five <strong>🌱 Learn</strong> pages: angles don't move, every length uses one factor, what the factor's size means, and going backwards (the reciprocal). Do both checkpoints." },
            { kind: "work", time: "20 min", label: "Work it through", body: "<strong>🪴 Work it through</strong>: keep an angle fixed while a length scales, read the size of a few factors, then reverse a copy back to its original — one step at a time." },
            { kind: "practice", time: "15 min", label: "Practice &amp; bloom", body: "<strong>🌸 Practice</strong> until it blooms — predicting bigger/smaller/same, matching angles, and finding sides in both directions." },
            { kind: "check", time: "—", label: "Exit check", body: "<em>Scale factor ¾ — bigger, smaller, or same? Do the angles change?</em> &nbsp;→&nbsp; <strong>smaller; angles don't change</strong>." },
          ],
          coach:
            "End-of-week-1 goal lands here. “Angles stay, lengths scale, and the factor's size tells the story” is the whole idea — a little shaky is fine, this is a preview, not a test.",
        },
      ],
    },
    {
      n: 2,
      dates: "Jun 22 – 26",
      focus: "Unit 4 — Area & Scale Drawings",
      canDo: "Know that area scales by (scale factor)², and read or make a scale drawing or map.",
      sessions: [
        {
          id: "w2s1",
          label: "S1",
          day: "Mon · Jun 22",
          title: "Scaling & Area",
          minutes: "~60 min",
          lessonId: "u4l3",
          im: [IM(1, 6, "Scaling and Area")],
          objective:
            "Discover the big twist of Unit 4: when lengths scale by k, area scales by k² — and use that rule both forward and backward.",
          steps: [
            { kind: "warmup", time: "5 min", label: "Warm up", body: "Ask, and let them guess: <em>“If you double every side of a square, does the area double?”</em> Most kids say yes. (It quadruples — that's the hook.)" },
            { kind: "learn", time: "20 min", label: "Learn it", body: "Read the five <strong>🌱 Learn</strong> pages: area breaks the pattern, why it's squared, shrinking too (½ → ¼), and using the rule both ways. Do both checkpoints." },
            { kind: "work", time: "20 min", label: "Work it through", body: "<strong>🪴 Work it through</strong>: count the squares to see area grow ×4, apply s² forward (area × 9), then “un-square” an area factor back to a length factor." },
            { kind: "practice", time: "15 min", label: "Practice &amp; bloom", body: "<strong>🌸 Practice</strong> until it blooms — finding new areas, area multipliers, and recovering the length factor from an area." },
            { kind: "check", time: "—", label: "Exit check", body: "<em>A figure is scaled by factor 3. Original area 5 cm². New area?</em> &nbsp;→&nbsp; 5 × 3² = <strong>45 cm²</strong>." },
          ],
          coach:
            "This is the single most-tested idea in Unit 4. If the squaring move feels shaky, replay the guided “count it for yourself” example before moving on — it's worth it.",
        },
        {
          id: "w2s2",
          label: "S2",
          day: "Thu · Jun 25",
          title: "Scale Drawings & Maps",
          minutes: "~60 min",
          lessonId: "u4l4",
          im: [
            IM(1, 7, "Scale Drawings"),
            IM(1, 8, "Scale Drawings and Maps"),
            IM(1, 9, "Creating Scale Drawings"),
          ],
          objective:
            "Use a scale to move between a map/drawing and real life — multiply out to the world, divide back to the page — and make your own scale drawing.",
          steps: [
            { kind: "warmup", time: "5 min", label: "Warm up", body: "Pull up a real map on your phone and hunt for the little <strong>scale bar</strong> in the corner — that bar is exactly what this lesson is about." },
            { kind: "learn", time: "20 min", label: "Learn it", body: "Read the six <strong>🌱 Learn</strong> pages: what a scale means, the two directions, the sense-check habit, reading a real map, and drawing a room to scale. Do both checkpoints." },
            { kind: "work", time: "20 min", label: "Work it through", body: "<strong>🪴 Work it through</strong>: convert map cm → real km, real → drawing (divide), then create a scale drawing of a room — one measurement at a time. Grab a tape measure and try it for real after." },
            { kind: "practice", time: "15 min", label: "Practice &amp; bloom", body: "<strong>🌸 Practice</strong> until it blooms — Wake County map distances both directions, floor plans, and finding a map's scale." },
            { kind: "check", time: "—", label: "Exit check", body: "<em>Map scale 1 cm = 5 km; two towns 4 cm apart. Real distance?</em> &nbsp;→&nbsp; 4 × 5 = <strong>20 km</strong>." },
          ],
          coach:
            "The classic slip is <em>adding</em> instead of multiplying (4 + 5 = 9). The app's built-in sense-check — “should my answer be bigger or smaller?” — catches it. End-of-week-2 goal: area scales by the square, and your kid can read and make a scale drawing.",
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
      note: "the official source these lessons are built from, lesson by lesson",
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
