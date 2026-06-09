/* ============================================================
   MathBloom — Summer Math Plan (parent-coach lesson plan)
   Math 6 Plus Preview • Units 4, 8 & 9 • Jun 15 – Aug 21, 2026

   The first two weeks are fully built out as FOUR complete,
   hour-long MathBloom lessons, two per week, with each week a
   clearly distinct concept:
     Week 1 — Scaling Shapes (scale factors + area)
     Week 2 — Scale Drawings & Maps (real-world application)
   Each session is a full lesson with three parts in the app:
   Learn → Work it through (guided) → Practice. Weeks 3–10 are a
   light preview. renderPlan() in app.js renders this.

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
    "Two weeks, four hour-long lessons, two distinct concepts. <strong>Week 1</strong> is the geometry of scaling — scale factors and how area grows. <strong>Week 2</strong> takes it into the real world — maps, floor plans, and making your own scale drawings. Each session is a complete MathBloom lesson with three parts: <strong>Learn</strong> it, <strong>Work it through</strong> together one step at a time, then <strong>Practice</strong> until the flower blooms. No timers, no grades — the goal is for these to feel <em>familiar</em> next year, not perfect now.",

  // weeks fully built out — 2 sessions/week, ~1 hour each
  weeks: [
    {
      n: 1,
      dates: "Jun 15 – 19",
      focus: "Week 1 — Scaling Shapes",
      canDo: "Find a scale factor, use corresponding parts, and know that area scales by (scale factor)².",
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
            IM(1, 4, "Scaled Relationships"),
            IM(1, 5, "The Size of the Scale Factor"),
          ],
          objective:
            "Understand what makes a copy “scaled,” find a scale factor (copy ÷ original), read what its size means, see that angles never change, use it to find missing sides, and test a true copy.",
          steps: [
            { kind: "warmup", time: "5 min", label: "Warm up", body: "Pinch-zoom a photo on your phone all the way in and back out. Ask: <em>what stays the same about the picture, and what changes?</em> (The shape stays; the size changes — that's scaling.)" },
            { kind: "learn", time: "20 min", label: "Learn it", body: "Open the lesson below and read the seven <strong>🌱 Learn</strong> pages — scaled copies, corresponding parts, the scale factor, reading its size, angles don't move, making your own, and the scaled-copy test — answering the three quick checkpoints as you go." },
            { kind: "work", time: "20 min", label: "Work it through", body: "Tap <strong>🪴 Work it through</strong> and do the four guided examples one step at a time: find a scale factor, use it to find a missing side, keep an angle fixed while running it backwards, and test whether a figure is a true scaled copy." },
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
          title: "Scaling & Area",
          minutes: "~60 min",
          lessonId: "u4l2",
          im: [IM(1, 6, "Scaling and Area")],
          objective:
            "Discover the big twist of Unit 4: when lengths scale by k, area scales by k² — and use that rule forward (square it), backward (un-square it), and for shrinking too.",
          steps: [
            { kind: "warmup", time: "5 min", label: "Warm up", body: "Ask, and let them guess: <em>“If you double every side of a square, does the area double?”</em> Most kids say yes. (It quadruples — that's the hook.)" },
            { kind: "learn", time: "20 min", label: "Learn it", body: "Read the six <strong>🌱 Learn</strong> pages: area breaks the pattern, why it's squared, build &amp; count the pattern, shrinking too (½ → ¼), and using the rule both ways. Do both checkpoints." },
            { kind: "work", time: "20 min", label: "Work it through", body: "<strong>🪴 Work it through</strong>: count the squares to see area grow ×4, apply s² forward (area × 9), watch shrinking quarter the area, then “un-square” an area factor of 16 back to a length factor." },
            { kind: "practice", time: "15 min", label: "Practice &amp; bloom", body: "<strong>🌸 Practice</strong> until it blooms — finding new areas, area multipliers, recovering the length factor from an area, and computing a scaled rectangle's area." },
            { kind: "check", time: "—", label: "Exit check", body: "<em>A figure is scaled by factor 3. Original area 5 cm². New area?</em> &nbsp;→&nbsp; 5 × 3² = <strong>45 cm²</strong>." },
          ],
          coach:
            "This is the single most-tested idea in Unit 4. If the squaring move feels shaky, replay the guided “count it for yourself” example before moving on — it's worth it. End-of-week-1 goal: scale factors and the area-squared rule.",
        },
      ],
    },
    {
      n: 2,
      dates: "Jun 22 – 26",
      focus: "Week 2 — Scale Drawings & Maps",
      canDo: "Read maps and floor plans, create your own scale drawing, and use scales without units like 1 : 1000.",
      sessions: [
        {
          id: "w2s1",
          label: "S1",
          day: "Mon · Jun 22",
          title: "Scale Drawings & Maps",
          minutes: "~60 min",
          lessonId: "u4l3",
          im: [
            IM(1, 7, "Scale Drawings"),
            IM(1, 8, "Scale Drawings and Maps"),
          ],
          objective:
            "Use a scale to move between a map/floor-plan and real life — multiply out to the world, divide back to the page — and find a scale from a known pair of lengths.",
          steps: [
            { kind: "warmup", time: "5 min", label: "Warm up", body: "Pull up a real map on your phone and hunt for the little <strong>scale bar</strong> in the corner — that bar is exactly what this lesson is about." },
            { kind: "learn", time: "20 min", label: "Learn it", body: "Read the six <strong>🌱 Learn</strong> pages: what a scale means, the two directions, the sense-check habit, reading a real map (km), and floor plans &amp; blueprints (inches-to-feet). Do both checkpoints." },
            { kind: "work", time: "20 min", label: "Work it through", body: "<strong>🪴 Work it through</strong>: convert map cm → real km, real → map (divide), a floor plan → real feet, and find a map's scale from a known distance — one step at a time." },
            { kind: "practice", time: "15 min", label: "Practice &amp; bloom", body: "<strong>🌸 Practice</strong> until it blooms — Wake County map distances both directions, floor plans both directions, and finding a map's scale." },
            { kind: "check", time: "—", label: "Exit check", body: "<em>Map scale 1 cm = 5 km; two towns 4 cm apart. Real distance?</em> &nbsp;→&nbsp; 4 × 5 = <strong>20 km</strong>." },
          ],
          coach:
            "The classic slip is <em>adding</em> instead of multiplying (4 + 5 = 9). The app's built-in sense-check — “should my answer be bigger or smaller?” — catches it. Point that habit out as they practice.",
        },
        {
          id: "w2s2",
          label: "S2",
          day: "Thu · Jun 25",
          title: "Creating Scale Drawings & Scales Without Units",
          minutes: "~60 min",
          lessonId: "u4l4",
          im: [
            IM(1, 9, "Creating Scale Drawings"),
            IM(1, 11, "Scales Without Units"),
            IM(1, 12, "Units in Scale Drawings"),
          ],
          objective:
            "Make your own scale drawing of a real space, choose a sensible scale that fits the page, and crack ratio scales like 1 : 1000 (including converting cm ↔ m).",
          steps: [
            { kind: "warmup", time: "5 min", label: "Warm up", body: "Pick a room. Pace it off or eyeball it: <em>“About how many feet long is this wall?”</em> Estimates are totally fine — you're just getting a feel for real sizes." },
            { kind: "learn", time: "20 min", label: "Learn it", body: "Read the seven <strong>🌱 Learn</strong> pages: drawing the world small, a room step by step, choosing a good scale, scales without units (1 : 1000), using a unit-less scale, and putting it together. Do both checkpoints." },
            { kind: "work", time: "20 min", label: "Work it through", body: "<strong>🪴 Work it through</strong>: draw a room to scale (divide each real length), invent a scale that fits a poster, then use a 1 : 1000 map (drawing → real, with a cm → m conversion) and a 1 : 200 model (real → drawing). Grab a tape measure and try one for real after." },
            { kind: "practice", time: "15 min", label: "Practice &amp; bloom", body: "<strong>🌸 Practice</strong> until it blooms — making drawings, unit-less scales both directions, cm → m conversions, and inventing a scale to fit a page." },
            { kind: "check", time: "—", label: "Exit check", body: "<em>On a 1 : 1000 map a trail is 5 cm. Real length?</em> &nbsp;→&nbsp; 5 × 1000 = 5000 cm = <strong>50 m</strong>." },
          ],
          coach:
            "End-of-week-2 goal: read and make scale drawings, and handle unit-less scales. This is the “real world” payoff — a tape-measured drawing of their own room on the fridge is the best retention check there is. Next week opens Unit 8 (proportional relationships).",
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
