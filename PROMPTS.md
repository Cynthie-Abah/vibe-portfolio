# Personal Portfolio — Vibe-Engineering Prompt Log

**ENSG AI Class · Assignment 2** · Cynthia Ojoma Abah — software Engineer

**Files in this folder**

- `index.html` — the one-page site (semantic HTML + hand-authored CSS + vanilla JS, self-contained, opens offline)
- `Cynthia_Ojoma_Abah_CV.pdf` — ATS-compliant CV linked from the hero (`.docx` source included)
- `PROMPTS.md` — this log

---

## Vibe engineering vs. vibe coding

**Vibe coding** = type one prompt, accept whatever falls out.
**Vibe engineering** = drive the AI like a teammate under review. Every prompt below is
_scoped_ to one section, carries _constraints_ (exact hex codes, sticky behaviour,
accessibility + ATS rules) and _acceptance criteria_ I can check, and is followed by a
_review pass_ where I refactor the draft before moving on. The three refactors I kept are
shown as real diffs in the on-page **Refactor Log** and summarised at the end of this file.

The condensed version of each prompt is also embedded as a comment banner above its
section in `index.html`, and rendered in the site's **Prompts** section — so the loop is
visible in the code, on the page, and here.

---

## Design tokens (locked in P0)

| Role                    | Token               | Value                     |
| ----------------------- | ------------------- | ------------------------- |
| Ink (text / dark bands) | `--ink`             | `#231733` aubergine       |
| Primary                 | `--iris`            | `#5A3BE0` electric iris   |
| Success / "ship"        | `--mint`            | `#12B5A5`                 |
| Paper                   | `--paper`           | `#FAF8FD` cool near-white |
| Diff add / delete       | `--add` / `--del`   | `#12805A` / `#C23A44`     |
| Display type            | Bricolage Grotesque | headings                  |
| Body type               | Manrope             | prose                     |
| Utility / code          | JetBrains Mono      | §spec labels, diffs       |

**Signature element:** the git-diff _Refactor Log_ + the mono `§section` spec labels — a
"living style-guide" look appropriate to a frontend engineer who ships reusable components.

---

## P0 — Brief, palette & type

> "You're my front-end pair. Build a one-page portfolio for Cynthia Ojoma Abah, a software
> engineer, from her CV. Before any code, give me a design plan in a 'living style-guide'
> voice: a named 4–6 colour palette that is NOT the usual AI cream + serif + terracotta, a
> display / body / mono type trio with real character, and one signature element the page
> is remembered by. Single offline HTML file — no framework, no CDN."

**Why:** locking tokens first stops every later section from drifting.
**Accepted:** palette + type + signature above.
**Iteration:** first pass drifted toward the default cream/serif look — rejected and
re-prompted for an aubergine/iris/mint system that reads "modern web," not "AI template."

## P1 — Sticky menu bar

> "Build only the header: sticky, blurred, monogram + name on the left, anchor nav on the
> right (About / Projects / Refactor Log / Prompts / Contact) plus a filled 'Download CV'
> button that opens the ATS PDF. On mobile the nav becomes a horizontal scroll strip.
> Visible focus rings, WCAG-AA contrast, nothing else touched."

**Accepted:** pinned while scrolling ✔ · CV reachable from every viewport ✔ · keyboard focus visible ✔.

## P2 — Hero with photo + CV link

> "Two-column hero. Left: mono eyebrow of specialities, a big display name with one role
> word highlighted, a positioning line drawn from the CV summary, two CTAs (Download CV →
> the ATS PDF, See my work → #projects) and a three-stat trust row. Right: my photo as a
> labelled 'component specimen' card — a CA monogram by default that auto-swaps to
> `/img/cynthia.jpg` via an onload hook so the page is presentable before the real
> photo exists."

**Accepted:** photo in hero ✔ · CV linked in hero ✔ · graceful no-photo state ✔ (this is Refactor #1).

## P3 — About, skills & experience

> "Two columns: a 3-paragraph first-person bio built from the CV summary, and a 'toolbox'
> that groups my stack into labelled rows (Languages / Frameworks / Testing / Backend /
> Tools). Under it, a compact experience timeline of my real roles. Use only what's in the
> CV — invent nothing."

**Accepted:** no fabricated skills or roles ✔ · scannable chip groups ✔.

## P4 — Project cards

> "A card grid — each project in its own box. Every card must show (1) the PROBLEM it set
> out to solve, then a labelled Design → Code → Delivery track, a stack chip row, and
> links. Pull the four projects straight from my CV; keep the stacks exactly as listed."

**Why:** the brief requires each card to summarise the problem and the design→code→delivery path.
**Accepted:** 4 cards, each with problem + three-step track + real stack ✔.

## P5 — Refactor Log (engineering the vibe code)

> "Show, as real git-style diffs, three places where I did NOT accept the AI's first
> output. Each block: the file, the naive 'vibe' line (red −), my engineered version
> (green +), and a one-line rationale. This is exactly what separates vibe engineering
> from vibe coding."

**Accepted:** three diffs rendered (see summary below) ✔.

## P6 — Sticky footer, JS & QA

> "Sticky footer with contact + all social links + back-to-top and a copy-email button
> (aria-live toast). Then ~40 lines of commented vanilla JS doing only three jobs
> (copy-email, scroll-spy nav highlight, progressive enhancement). Finish with a QA pass:
> contrast, prefers-reduced-motion, HTML tag-balance, `node --check` on the script, and a
> mobile check down to 360px."

**Accepted:** header AND footer sticky ✔ · reduced-motion honoured ✔ · HTML + JS validated ✔.

---

## Refactor Log — the engineering done on the vibe code

1. **Broken-image guard (hero photo).** Draft: bare `<img src="…cynthia.jpg">`.
   Engineered: styled monogram fallback + `onload` class-swap → never renders a broken
   image, upgrades automatically when the real photo is dropped in.
2. **Semantic, accessible nav.** Draft: `<div onclick="scrollTo(...)">`.
   Engineered: real `<a href="#…">` anchors (focusable, keyboard-usable, announced by
   assistive tech, work without JS) + `scroll-margin-top` so the sticky header never
   covers a heading.
3. **Honest CV metric.** Draft carried a self-flagged `~25% [verify]` figure.
   Engineered: kept the real achievement, dropped the unverified number. Reinstate only
   if it can be confirmed.

---

## Appendix A — Photo & assets

The build environment can't reach image sites, so the hero ships with a styled **CA**
monogram that auto-upgrades. To add the real photo: create `assets/img/` beside
`index.html`, save a portrait as **`cynthia.jpg`** (portrait 4:5, ~800×1000, ≤200 KB) and
it fades in on load — no code change needed. Replace the four `#` social links in the
footer, and the project `#` demo/repo links, with real URLs before publishing.

## Appendix B — Requirement traceability

| Brief requirement                                                | Where                                            |
| ---------------------------------------------------------------- | ------------------------------------------------ |
| Multiple prompts + vibe engineering                              | This log · per-section banners · on-page Prompts |
| Photo in the hero                                                | `.specimen` figure, hero                         |
| One-pager                                                        | Single `index.html`, anchor nav                  |
| ATS-compliant CV linked from hero                                | `Cynthia_Ojoma_Abah_CV.pdf`, hero CTA + menu     |
| Display the prompts used                                         | `#prompts` section + banners                     |
| Show engineering on the vibe code                                | `#refactor` git-diff log                         |
| Comments in code                                                 | throughout, tagged `[build-note]`                |
| Projects in card boxes, each with problem + design→code→delivery | `#projects`, 4 cards                             |
| Footer                                                           | `.site-foot`                                     |
| Sticky menu bar AND footer                                       | both `position: sticky`                          |
