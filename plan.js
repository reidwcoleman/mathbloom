/* ============================================================
   MathBloom — Summer Math Plan (parent-coach lesson plan)
   Math 6 Plus Preview • Units 4, 8 & 9 • Jun 15 – Aug 21, 2026

   The first FOUR weeks are fully built out as eight complete,
   hour-long MathBloom lessons, two per week, each week a
   clearly distinct concept:
     Week 1 — Scaling Shapes (scale factors + area)
     Week 2 — Scale Drawings & Maps (real-world application)
     Week 3 — Proportional Relationships: Tables & Equations (Unit 8)
     Week 4 — Proportional Relationships: Graphs & Spotting Them (Unit 8)
   Every session runs Learn → Work it through (guided) →
   Practice — six Learn pages and four guided examples each.
   Weeks 5–10 are a light preview. renderPlan() in app.js renders this.

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
    "Four weeks, eight hour-long lessons. <strong>Weeks 1–2</strong> are the geometry of scaling — scale factors, how area grows, and reading &amp; making scale drawings. <strong>Weeks 3–4</strong> open Unit 8, proportional relationships — the constant of proportionality in tables, the equation <span class=\"math\">y = kx</span>, graphs through the origin, and telling proportional from not. Each session is a complete MathBloom lesson: <strong>Learn</strong> it, <strong>Work it through</strong> together one step at a time, then <strong>Practice</strong> until the flower blooms. No timers, no grades — the goal is for these to feel <em>familiar</em> next year, not perfect now.",

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
    {
      n: 3,
      dates: "Jun 29 – Jul 3",
      focus: "Week 3 — Proportional Relationships: Tables & Equations",
      canDo: "Find the constant of proportionality k from a table (k = y ÷ x), test a table by checking every row, and write and use the equation y = kx forward and backward.",
      sessions: [
        {
          id: "w3s1",
          label: "S1",
          day: "Mon · Jun 29",
          title: "Tables & the Constant of Proportionality",
          minutes: "~60 min",
          lessonId: "u8l1",
          im: [
            IM(2, 1, "One of These Things Is Not Like the Others"),
            IM(2, 2, "Introducing Proportional Relationships with Tables"),
            IM(2, 3, "More about Constant of Proportionality"),
          ],
          objective:
            "Meet proportional relationships: find the constant of proportionality k by dividing y ÷ x in any row, use it to fill in a missing value, test a whole table by checking every row, and say what k means as a “per one” amount.",
          steps: [
            { kind: "warmup", time: "5 min", label: "Warm up", body: "Quick back-and-forth: <em>“If one muffin costs $2, what do 3 cost? What about 5?”</em> Notice you multiply by the same 2 every time — that steady multiplier is the whole idea this week." },
            { kind: "learn", time: "20 min", label: "Learn it", body: "Open the lesson below and read the six <strong>🌱 Learn</strong> pages — two things growing together, meet k the steady multiplier, finding k by dividing (<span class=\"math\">k = y ÷ x</span>), k as a “per one” amount, the missing-number trick, and the every-row test — answering the two checkpoints as you go." },
            { kind: "work", time: "20 min", label: "Work it through", body: "Tap <strong>🪴 Work it through</strong> and do the four guided examples one step at a time: find k from an apple-price table, fill a missing value on a pool-filling table, turn k into a reading speed and use it, then test a table that turns out <em>not</em> to be proportional." },
            { kind: "practice", time: "15 min", label: "Practice &amp; bloom", body: "Open <strong>🌸 Practice</strong> and answer until the flower blooms (5 petals) — finding k, filling a missing value, deciding whether a table is proportional, and reading k as a “per one” amount. Hints and “show me the steps” are always free." },
            { kind: "check", time: "—", label: "Exit check", body: "Away from the screen: <em>A proportional table shows x = 3 → y = 12. Find y when x = 7.</em> &nbsp;→&nbsp; k = 12 ÷ 3 = 4, so y = 7 × 4 = <strong>28</strong>." },
          ],
          coach:
            "The one habit behind all of Unit 8: divide <em>y ÷ x</em> to get k, then check it's the same in every row — one row that disagrees means it isn't proportional. The guided <strong>Work it through</strong> step drills exactly this with real tables before the practice garden.",
        },
        {
          id: "w3s2",
          label: "S2",
          day: "Thu · Jul 2",
          title: "Equations of the Form y = kx",
          minutes: "~60 min",
          lessonId: "u8l2",
          im: [
            IM(2, 4, "Proportional Relationships and Equations"),
            IM(2, 5, "Two Equations for Each Relationship"),
            IM(2, 6, "Using Equations to Solve Problems"),
          ],
          objective:
            "Capture a whole proportional relationship in one tiny equation, y = kx — then use it forward (know x, multiply) and backward (know y, divide), and spot the real proportional equation with the x = 0 test.",
          steps: [
            { kind: "warmup", time: "5 min", label: "Warm up", body: "Ask: <em>“Tacos are $4 each — what's the total for 7? For 100?”</em> Then the hook: <em>“Could you write ONE rule that handles any number of tacos?”</em> (That rule is y = 4x.)" },
            { kind: "learn", time: "20 min", label: "Learn it", body: "Read the six <strong>🌱 Learn</strong> pages: one rule for the whole table, what <span class=\"math\">y = kx</span> is really saying, going forward (multiply) and backward (divide), spotting a proportional equation, and the sneaky fraction case — answering the two checkpoints." },
            { kind: "work", time: "20 min", label: "Work it through", body: "Tap <strong>🪴 Work it through</strong> for the four guided examples: write a smoothie's equation, solve a printer problem forward, solve a taco problem backward, and pick the proportional equation out of a lineup with the zero test." },
            { kind: "practice", time: "15 min", label: "Practice &amp; bloom", body: "<strong>🌸 Practice</strong> until it blooms — choosing the equation that fits a story, solving forward (find y), solving backward (find x), and recovering k from a single pair of numbers." },
            { kind: "check", time: "—", label: "Exit check", body: "<em>Ari bikes y = 12x miles in x hours. How long is a 36-mile ride?</em> &nbsp;→&nbsp; backward, so divide: 36 ÷ 12 = <strong>3 hours</strong>." },
          ],
          coach:
            "Two slogans carry this lesson: <em>forward questions multiply, backward questions divide</em>, and a true proportional equation always passes the <strong>zero test</strong> (x = 0 must give y = 0, so “y = x + 4” is out). End-of-week-3 goal: read a table for k and write its equation y = kx.",
        },
      ],
    },
    {
      n: 4,
      dates: "Jul 6 – 10",
      focus: "Week 4 — Proportional Relationships: Graphs & Spotting Them",
      canDo: "Recognize a proportional graph (a straight line through the origin), read k off any point, explain what a point means in (x, y) order, and tell proportional from non-proportional in a table, equation, or graph.",
      sessions: [
        {
          id: "w4s1",
          label: "S1",
          day: "Mon · Jul 6",
          title: "Graphs of Proportional Relationships",
          minutes: "~60 min",
          lessonId: "u8l3",
          im: [
            IM(2, 10, "Introducing Graphs of Proportional Relationships"),
            IM(2, 11, "Interpreting Graphs of Proportional Relationships"),
          ],
          objective:
            "See that every proportional relationship graphs as a straight line through (0, 0), read the constant k off any point with k = y ÷ x (the point (1, k) is the shortcut), and turn any point into a real-world sentence in (x, y) order.",
          steps: [
            { kind: "warmup", time: "5 min", label: "Warm up", body: "Before opening anything, ask them to picture it: <em>“If strawberries are $3 a pound, what does a graph of cost vs. pounds look like — straight or curved? Where does it start?”</em> (Straight, beginning at (0, 0).)" },
            { kind: "learn", time: "20 min", label: "Learn it", body: "Read the six <strong>🌱 Learn</strong> pages: every proportional graph looks the same, why it starts at (0, 0), steeper means a bigger k, reading <span class=\"math\">k</span> off any point (<span class=\"math\">k = y ÷ x</span>), every point is a sentence in (x, y) order, and a recap — answering the two checkpoints." },
            { kind: "work", time: "20 min", label: "Work it through", body: "Tap <strong>🪴 Work it through</strong> for the four guided graphs: find k from a point on a gas-cost graph, do the origin check, read what a runner's point means, then predict a new point from the line's pattern." },
            { kind: "practice", time: "15 min", label: "Practice &amp; bloom", body: "<strong>🌸 Practice</strong> until it blooms — finding k from a labeled point, picking the point every proportional graph shares ((0, 0)), reading what a point means, and predicting a new y from the line's pattern." },
            { kind: "check", time: "—", label: "Exit check", body: "<em>A proportional graph passes through (5, 20). What is k?</em> &nbsp;→&nbsp; k = y ÷ x = 20 ÷ 5 = <strong>4</strong> (not 20 − 5)." },
          ],
          coach:
            "The big connection: it's the <em>same k</em> three ways now — in a table it's y ÷ x in a row, in an equation it's the number in front of x, and on a graph it's the steepness (read from any point as y ÷ x, easiest at (1, k)). The classic slip is subtracting instead of dividing — the in-app steps catch it.",
        },
        {
          id: "w4s2",
          label: "S2",
          day: "Thu · Jul 9",
          title: "Proportional or Not? — Unit 8 Wrap-Up",
          minutes: "~60 min",
          lessonId: "u8l4",
          im: [
            IM(2, 7, "Comparing Relationships with Tables"),
            IM(2, 8, "Comparing Relationships with Equations"),
            IM(2, 9, "Solving Problems about Proportional Relationships"),
          ],
          objective:
            "Tie the whole unit together: decide whether a relationship is proportional from a table, an equation, OR a graph, spot the imposters (anything that adds or subtracts, or a graph that misses the origin), then find k and solve a real problem with y = kx.",
          steps: [
            { kind: "warmup", time: "5 min", label: "Warm up", body: "See if they can list the three tells from memory: <em>same k in every row · the equation is y = kx · a straight line through the origin.</em> Fill in any they miss together." },
            { kind: "learn", time: "20 min", label: "Learn it", body: "Read the six <strong>🌱 Learn</strong> pages: one idea in three costumes, the table tell, the equation tell, the graph tell, meeting the imposters, and the find-k-then-finish routine — answering the two checkpoints." },
            { kind: "work", time: "20 min", label: "Work it through", body: "Tap <strong>🪴 Work it through</strong> for the four guided examples: judge a table, judge the equation <span class=\"math\">y = 2x + 1</span> with the zero test, judge a graph, then find k and solve a real gas-mileage problem." },
            { kind: "practice", time: "15 min", label: "Practice &amp; bloom", body: "<strong>🌸 Practice</strong> until it blooms — judging tables, judging equations, and real two-step problems (find k, then use y = kx). If any earlier lesson felt shaky, replay its Practice first — re-blooming is the best review there is." },
            { kind: "check", time: "—", label: "Exit check", body: "<em>Is y = x + 5 proportional? Why or why not?</em> &nbsp;→&nbsp; <strong>No</strong> — it adds 5, so x = 0 gives y = 5 (not 0); the graph would miss the origin." },
          ],
          coach:
            "This is the unit's payoff — recognizing proportionality in any form and knowing the imposters on sight. Narrating <em>why</em> each one is or isn't proportional out loud is the real test. Next up: Unit 9 — percentages (percent increase &amp; decrease).",
        },
      ],
    },
  ],

  // light preview of the rest of summer (weeks 5–10)
  upcoming: [
    { n: 5, dates: "Jul 13 – 17", focus: "Unit 9 — Percent increase & decrease", unit: "u9" },
    { n: 6, dates: "Jul 20 – 24", focus: "Unit 9 — Tax, tip & discount", unit: "u9" },
    { n: 7, dates: "Jul 27 – 31", focus: "Unit 9 — Finding the percent & percent error", unit: "u9" },
    { n: 8, dates: "Aug 3 – 7", focus: "Unit 9 — Applying percentages", unit: "u9" },
    { n: 9, dates: "Aug 10 – 14", focus: "Mixed review — scaling & proportional relationships", unit: "u8" },
    { n: 10, dates: "Aug 17 – 21", focus: "Cumulative review + ready for fall", unit: "u9" },
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
