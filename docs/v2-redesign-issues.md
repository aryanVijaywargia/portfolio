# v2 redesign — issue log

Tracking list for the signal/graphite skins. Prod = the live v1 portfolio, which
is the reference for anything marked "match prod".

| # | Issue | Status | How it was settled |
|---|-------|--------|--------------------|
| 1 | More space between the hero and About, so the navbar has room to pop up | done | Hero is `min-h-[100svh]`, and `calc(100svh+5rem)` from 1000px — the 5rem is exactly the header height it travels through. About gained `pt-[var(--v2-section-pt)]` (128px at desktop). |
| 2 | Navbar brand icon should match the prod one | done | Same path data already; aligned stroke to 2.4, box to 40px, and restored prod's `-translate-y-0.5` hover lift. Crossbar stays on the variant accent. |
| 3 | Identity chips must sit on one line | done | Row is `flex` + `overflow-x-auto`, chips `shrink-0` at prod's `px-2 py-[3px] text-[11px]`. Verified: 5 chips, 1 distinct row top. |
| 4 | Terminal dimensions should match prod's | done | Dropped the v2-only `height: 30rem` override; it now inherits prod's `22/24/27rem`. Measured 432px = 27rem at desktop. |
| 5 | Landing should fill the whole viewport, as prod does | done | Same change as #1. Agreed with the reasoning: the header's reveal is driven by hero height, so a short hero makes it pop instantly. |
| 6 | About needs a white text headline, like the other sections | done | Added `V2_SECTION_HEADINGS.about = "About Me"` (prod's copy) and rendered it via `V2Heading`. |
| 7 | Quiz: after dodging twice, prod offers a way out | done | Ported `warningCount`; at >= 2 the warning shows "I give up, I'm a cheater", which fires `quiz:confessed-cheat` and resets to the intro. |
| 8 | Navbar must carry every option prod's navbar has | done | Header gained the Byte button and GitHub link (prod's ProfileNav set: Byte, GitHub, resume, theme). Mobile sheet gained Home. |

## Carried over from the recovery

| # | Issue | Status | How it was settled |
|---|-------|--------|--------------------|
| R1 | Per-company colour ramp in the experience gantt (`--v2-co-*`) | done | Survived the replay after all — ramp is in the token layer and `companyColor()` is wired through the gantt. |
| R2 | Hero full-stop glue (`whitespace-nowrap`) | done | Also survived the replay; the suffix and accent period are one non-breaking unit. |
| R3 | Audit the reverted files for silently lost uncommitted work | partial | Found and fixed: the `v2sm/v2md/v2lg` breakpoints in `tailwind.config.js`, and the `@import "v2-theme.css"`. Space Grotesk verified safe. `typography.scss`, `_document.tsx` and the v1 nav files not yet audited. |
| R4 | Duplicated blocks in the recovered `v2-theme.css` | done | Removed doubled "prose" and "interactive terminal skin" blocks (the later copy was the superset). |
| 9 | About photo tooltip did not update when the image changed | done | Root cause was the event, not the store: react-tooltip binds `mouseenter`, and v1's `new Event("mouseover")` is both non-bubbling and the wrong type, so it was silently ignored. Now dispatches a bubbling `mouseenter`, sent twice so a remount that is not listening on the first frame still catches it. |
| 10 | Theme toggle icon should match prod's | done | Prod draws thin outlined sun/moon (`components/darkmode-icon`); the v2 toggle used solid glyphs. Swapped in the same path data, sized for the v2 knob. |
| 11 | Rick should follow the variant theme | done | The intro reel paints its ASCII art from styled-jsx and the status strip/window buttons carry literal hexes, so none were reachable by the utility remapping. Added a Rick/terminal-chrome block to the token layer. |
| 12 | Nav clicks should scroll smoothly, as prod does | done | Extracted v1's eased scroll into `lib/smooth-scroll.ts` (duration scales with distance, 400–800ms, honours prefers-reduced-motion) and wired the v2 header's desktop pills and mobile sheet to it. |
| 13 | The URL hash did not update while scrolling | done | The scroll-spy now mirrors the section in view into the address bar via `replaceState` — not the router, which would fill history with every section passed, and not a real hash change, which would trigger the browser's native jump. Suppressed while a nav click animates so intermediate sections do not flash. |
| 14 | About stat tooltips missing | done | The stats used `title=` (the browser's own tooltip) instead of `data-tip=`, so react-tooltip never saw them. |
| 15 | Header controls should match prod's look | done | Controls are now bare icons (`rounded p-2`, 20px glyphs, no border or fill) in prod's order — Byte, theme, GitHub, Resume — with Resume keeping a button silhouette as the one call to action. The sliding-knob switch is gone; the theme toggle is a plain outlined sun/moon button. Scoped to the header only — see #18. |
| 16 | Terminal sub-windows (games, Byte, radio, scratchpad, editor) were not themed | done | Every mode renders inside `.terminal-window`, so the whole family is remapped from one block instead of component by component. Families map by the job they do — accent, sage, brass, clay, umber, plus two neutral tiers — so the games keep the contrast they use to tell pieces apart. Also covers styled-jsx syntax tokens, the achievement display, arbitrary `[background:...]` chips, and the `primary` palette. |
| 17 | Medium and small screens | done | Audited 390/500/680/820/900/1024/1280 in both variants: no horizontal overflow anywhere, chips stay on one row (scrolling rather than wrapping below 500px), the terminal fits at every width, and the hero switches from `100svh` to `100svh + 5rem` at the 1000px breakpoint as intended. The mobile notice's status dot was still blue — it uses the `primary` palette, which no sky/blue probe reached. |
| 18 | The hero rail and the header must NOT share a control style | done | Correcting my own error on #15: I unified them, but the v1 site deliberately draws them differently. The hero's action bar is round ringed buttons over a blurred surface, each with its own hover colour, plus a track-and-knob switch; the header is bare icons plus a Resume button. Restored both, with `useThemeSwitch` sharing only the state between the two presentations. |
| 19 | Hero heading must always be three lines | done | The three lines are now authored and `nowrap`, so a longer role changes the type size rather than adding a line. Size is `min(var(--v2-h1-size), 10.5cqw)` — the design size capped by what the column can hold. Copy column widened to `1.15fr` so less shrinking is needed (55px at 1280, not ~47px). |
| 20 | Ambient text landing on cards and panels | done | The blocker list was class-name probes (`rounded-xl`, `terminal-window`, ...) that went stale the moment a section was restyled — the v2 cards matched none of them. Now decided from computed style: an element blocks if it paints (fill, border, shadow, media) or carries its own text, with full-width layout wrappers skipped. And when no clean spot exists it now returns null and waits, instead of placing the message anyway — that fallback was the actual cause. |
| 21 | "PRs Merged" was hardcoded and stale | done | It said `200+`; GitHub reports 232 merged. Now fetched live via `/api/github-stats` (cached an hour) with the authored value as fallback. Rounded down so it never overstates. Commits is still authored — counting across private repos needs a token. |
| 22 | Git commits also hardcoded | done | `1K+` with a tooltip claiming 1,875 — no way to stay true. Now fetched alongside PRs from GitHub's commit search (1,085 public today). The tooltip is generated too, and states its scope, so it cannot go stale the way an authored figure did. `GITHUB_TOKEN` widens both counts to private repos. |
| 23 | Project cards to the new design | done | The `featuredImage` files are per-project brand cards; the old card pushed them through `grayscale(1)` and `mix-blend-mode: luminosity`, discarding the artwork. They now show as drawn, with a `mix-blend-mode: color` overlay in the card's hue so cover and chrome agree. Body restructured to eyebrow / title / tech chips / description / footer with year, repo and a hue-tinted CTA, over a per-hue glow. |
| 24 | Placeholders looked like typed text | done | There was no placeholder styling at all, so they inherited the input colour — at full brightness in the contact form's code editor they read as entered text. Set at the token layer for every v2 input, with `opacity: 1` because Firefox dims placeholders on top of the colour. |
| 25 | Blue focus box on form fields | done | `@tailwindcss/forms` paints its focus ring with a `box-shadow`, which `outline-none` does not remove. Cleared for every v2 control (its selectors are attribute-based, so the marker is doubled to outrank them), and replaced rather than deleted — the field's own underline takes the accent so focus stays visible. |
| 26 | Terminal proportions should match prod's | done | Heights already agreed (432px = 27rem); the difference was width — prod 512, ours 460, so ours read squarer. The hero grid had been tilted toward the copy column to ease the heading fit (#19); rebalanced to `1fr / 1.08fr` with a 40px gap. Terminal is now 519x432, ratio 1.20 against prod's 1.19. The heading gives up ~5px at 1280 for it. |
| 27 | Resume and other shared pages should follow the theme | done | `/resume` is shared with "/", so it cannot carry a skin of its own — a `?theme=` on the v2 header's link opts it in, leaving the bare URL byte-identical to production. The v1 `--color-*` tokens are repointed at v2 equivalents inside the scope, so pages built on them follow whichever skin is active without being restyled. |

## Verification

Driven in real headless Chrome over CDP (`scratchpad/cdp.js` + `test-tooltip.js`),
because the in-app browser pane runs backgrounded — every element measures 0x0
there, so hover, hit-testing and animation cannot be exercised.

- Photo tooltip: hover, then three clicks; caption tracks the photo. Two consecutive passing runs.
- Rick: computed colours read per variant, plus a screenshot of each.
- Hash sync: scrolled 0 → 4200px, recorded `#about → #experience → #portfolio → #contact`.
- Eased scroll: clicking a nav pill produced 20 distinct scroll positions (an
  instant jump gives 1–2) and landed within 8px of the section top.
- Stat tooltips: hovered three stats, each showed its own caption.
- Terminal modes: drove `help`, `game`, `radio`, `scratchpad`, `chatbot` and
  `code` in both variants and scanned every computed colour inside the window
  against the token set. All six report on-palette.
- Responsive: seven widths x two variants, measuring overflow, chip rows,
  terminal fit and hero height.
- Heading: measured with the longest role forced in at 8 widths x 2 variants —
  3 lines and zero overflow everywhere.
- Ambient: parked in each section and sampled every message, hit-testing its own
  box against anything that paints or holds text. 6 sampled, none overlapping.
- Stats: read live from the page — commits `1K+` ("1,085 authored commits
  across public repositories"), PRs `230+` ("232 pull requests merged ...").
- Cards: cover reports `filter: none`, and screenshots confirm cover and chrome
  share a hue per card.
- Placeholders: input text `rgb(244,244,246)` vs placeholder
  `rgba(132,132,140,0.55)`.
- Focus: clicking a field reports `box-shadow: none` with the underline at
  `rgb(142,208,138)` — the accent. Note programmatic `el.focus()` gave a
  misleading reading here; only a dispatched click is trustworthy for this.
- Terminal: measured on `/`, `/signal` and `/graphite` at the same viewport.
- Resume: `/resume` unmarked and unchanged; `?theme=` variants report the skin
  on <html>/<body>, the accent CTA and an accent-tinted canvas.
- Controls: both variants report border `0px`, transparent background, 20px
  icons, no `role="switch"` knob, and the order Byte / theme / GitHub / Resume —
  in the header and in the hero rail alike.

Note: substring class probes (`[class*="bg-sky-"]`) also match variant forms
like `a:bg-sky-500`, which is a ::after underline — remapping it painted a solid
block behind the link. Anchor with `^=` plus `*=" "` so only unprefixed
utilities match, and target pseudo-element rules explicitly.

Note: a colour audit cannot see contrast. The game menu's selected row passed
the palette scan while being accent-on-accent and unreadable — caught only by
looking at the screenshot. Both checks are needed.

Note: react-tooltip mounts with `delayHide={500}`, so a test that moves between
two tipped elements has to dwell longer than that off-target or the second show
is swallowed. That cost one false failure before the dwell was raised.

## Carried over from the recovery (cont.)

| # | Issue | Status | How it was settled |
|---|-------|--------|--------------------|
| R5 | **Commit the v2 tree** — it has never been committed, which is what made two accidents destructive | open | |

## Small-screen navigation (28–29)

| # | Issue | Status | How it was settled |
|---|-------|--------|--------------------|
| 28 | Mobile menu animation was a plain sheet drop; prod's blinds wipe wanted instead | done | `components/v2/sections/header.mobile-nav.tsx` — 18 staggered columns, rows flying in from both edges, dashed rules, Email Me CTA. Structure copied from `components/layout/header.mobile-nav.tsx`, coloured from v2 tokens. |
| 29 | Nav clicks landed ~790px short of the section on small screens | done | `lib/smooth-scroll.ts` re-measures the target every frame. The intervening sections carry `content-visibility: auto`, so they swap reserved height for real height as the viewport nears and the page grows under a target measured once. |

Verification (390×844, deviceScaleFactor 2, both variants, both modes):

- Blinds: 18 columns, all at `top: 0` when settled, `-844` when closed;
  mid-animation sampled at 120ms shows them partway (`-517 / -742 / -844`),
  confirming the stagger rather than a single fade.
- Rows: six (home, about, experience, projects, contact, resume), each with its
  aside; left edges at `-145 / -170 / -296` at 120ms and all at `20` settled.
- Burger: bars take `--v2-fg-2`, the active X takes `--v2-accent` —
  `rgb(217,242,75)` signal, `rgb(142,208,138)` graphite.
- Landing: contact reports `top: 0` after the click on both variants (was 796).
- `/` unchanged: no v2 markers, burger still `rgb(100,116,139)` → `rgb(14,165,233)`,
  its own menu opens normally.

Note: the panel must be a sibling of the header bar, not a child of the control
row. Nested inside it, the bar's own brand and icons fell inside the panel's
painting order and were covered — the first screenshot showed only the close X.
Bar `relative z-50`, panel `z-40`.

## Hero order and the project rail (30–31)

| # | Issue | Status | How it was settled |
|---|-------|--------|--------------------|
| 30 | On small screens the terminal sat below the prose and the buttons; it should follow the language stack | done | The hero is authored in the small-screen reading order — lede, terminal, prose — and wide screens put the two copy blocks back in one column with `grid-template-areas` (`styles/v2-theme.css`). `order` cannot do this: it reorders within a track, not across columns. |
| 31 | Projects were a static grid; prod's gallery scrolls left/right | done | `components/v2/scroll-rail.tsx` — snap-mandatory rail, edge-bleeding gutters, prev/next steps reusing `utils/scroll-to`'s `scrollToX`. |

Verification (both variants, 390 / 768 / 1440):

- Hero order at 390: lede top 64 → stack 285 → terminal 402 → chips 770 → prose 831.
  At 1440 the two-column layout is unchanged: copy at x=200 w=481, terminal at
  x=721 w=519, heading still three lines. No horizontal overflow at any width.
- Rail: `overflow-x: auto`, `scroll-snap-type: x mandatory`, cards equal height
  (495 mobile / 501 desktop), first card aligned with the heading at every width
  (20 / 28 / 200, matching the h2's own left edge).
- Swipe on mobile lands on 340 — one card plus the gap — rather than between cards.
- Filter change returns the rail to 0 and restores snapping.
- Prev/next verified by forcing overflow: `next` stepped 620 (600px item + 20px
  gap), `prev` returned to 0, disabled states tracked both ends, snapping
  restored after each step.

Note: the card width is 330, not a rounder 340, so three cards plus gaps and the
rail's gutters fit inside `--v2-max-w`. At 340 the rail overflowed by 20px on
wide screens — invisible, but enough to make it twitch under a trackpad and to
render a prev/next row that could not usefully move.

Note: `snap-mandatory` re-snaps on every frame a programmatic scroll writes,
which pins the rail in place. The class has to come off for the duration of the
step and go back on afterwards — the same dance the v1 gallery does.

## Section polish (32–35)

| # | Issue | Status | How it was settled |
|---|-------|--------|--------------------|
| 32 | Project filters sat above the display heading | done | Moved below it, as a control on the list rather than a competitor to the eyebrow rule. |
| 33 | Description length control did not match the v1 site | done | v1's two forms restored: a centred `S / M / L` row above the text below v2sm, and the dashed column beside it — `justify-between` over a 120px min-height — from v2sm up. Prose line-height dropped to 1.625 to match v1's `leading-relaxed`. |
| 34 | Experience needed the redesigned small-screen form | done | Below v2lg the Gantt column is replaced by a scrollable strip of company tabs (active tab takes the company colour and is scrolled into view on selection), and achievement cards collapse to heading + chips with the summary moving behind `expand`. |
| 35 | The rising header landed on top of the hero CTAs on mobile | done | `--v2-header-h` added; the hero reserves that plus 2.5rem at its foot on small screens. |

Verification (both variants, 390 / 768 / 1024 / 1100 / 1440):

- Projects: heading y always less than the filter row y; eyebrow still first.
- About: `S M L` in a row below v2sm, `brief/standard/detailed` in a column from
  v2sm, active in the variant accent in both.
- Experience: Gantt `display:none` at 390/768/1024 and `flex` at 1100/1440; the
  tab strip is the mirror image. Strip scrollable by 580 at 390, 0 at 1024.
  Selecting a tab off-screen scrolls it into view and repaints the detail panel.
- Header overlap swept the whole hero scroll range at 25px steps, comparing the
  header and CTA rects at every frame where header opacity exceeded 0.02:
  worst overlap went from **+23px** to **−41px** at 390. Desktop unchanged
  (−46px, hero height still 980, padding still 60).

Note: `getComputedStyle` on a section carrying `content-visibility: auto` can
return values that ignore inline styles once the section scrolls out of view —
a tab's accent border read back as the line colour while the screenshot showed
it correctly. Confirm colour on deferred sections from a screenshot, not a
computed-style probe.

## Stats alignment and the terminal intro (36–37)

| # | Issue | Status | How it was settled |
|---|-------|--------|--------------------|
| 36 | About stats were left-aligned in the 2×2 phone layout; the v1 site centres them | done | `justify-items-center` + `text-center` below v2sm, reverting to `start`/`left` once the four sit in a row. |
| 37 | The Rick intro did not fit the terminal below v2md — it opened already scrolled, with the skip hint over the dialogue | done | `[data-v2]`-scoped rules scale the ASCII to 0.34rem and tighten the wrapper padding under 1000px. |

Verification:

- Stats at 390: `text-align: center`, figures at x 64 / 248 / 56 / 263 — matching
  `/`'s 59 / 250 / 52 / 265. At 768 back to `left` with the four in a row.
- Intro overflow (`scrollHeight - clientHeight`) by width, before → after:
  390 **62 → 0**, 430 **62 → 0**, 680 **30 → 0**, 768 **30 → 0**, 1440 0 → 0.
  The art is 238px at 1440 (untouched) and 171px below v2md.
- `/` unaffected: no v2 marker, intro padding still 24px, art still 7.2px / 238px.

Note: the stats tooltip looks cut off at the right edge on a phone, but its
right edge measures exactly at the viewport edge on `/` as well as on the v2
routes — react-tooltip is clamping, and both designs sit flush. Not a v2 defect,
so it was left alone.

## Hero heading line count (38)

| # | Issue | Status | How it was settled |
|---|-------|--------|--------------------|
| 38 | The heading broke to three lines on small screens; the name should sit on one line with the role beneath | done | Below v2md the two authored name spans run inline and the fit cap drops from 10.5cqw to 9.6cqw, so the heading is two lines there and three from v2md up. |

The name spans carry a trailing space that is inert while they are blocks — a
space at the end of a line collapses — and becomes the word gap once the
narrow-screen rule makes them inline. No duplicated markup, one source of text.

Verification — worst-case slack between the rightmost glyph and the column edge,
sampled across all four roles at each width (negative would mean overflow):

| width | lines | font | slack |
|---|---|---|---|
| 320 | 2 | 26.9 | +13 |
| 375 | 2 | 32.2 | +16 |
| 390 | 2 | 33.6 | +17 |
| 430 | 2 | 37.4 | +19 |
| 768 | 2 | 52 | +196 |
| 999 | 2 | 52 | +427 |
| 1000 | 3 | 44.4 | +20 |
| 1440 | 3 | 50.5 | +23 |

Same for graphite (+13 at 320, +17 at 390, +17 at 1440). The longest role,
"a Fullstack Engineer.", is what binds above v2md; the name line binds below it.

Note: measuring a heading's real width needs `Range.getClientRects()` over each
nowrap span. `getBoundingClientRect()` on the block wrapper returns the column
width at every size, which reads as a perfect fit whether or not the text
overflows — it cost one round of false "no clipping" readings.

## Mobile nav typography (39)

| # | Issue | Status | How it was settled |
|---|-------|--------|--------------------|
| 39 | Sheet rows were set in wide-tracked mono caps; the v1 sheet sets them in the page's own face, sentence case | done | Rows now use `--v2-font-display` at 17px/500, `capitalize`, tracking −0.01em, on the v1 row rhythm (24px gap). The CTA follows in the same face rather than mono caps. |

The four repeated class strings (row, label, dashed rule, aside) were hoisted to
constants — the section rows and the resume row had been carrying duplicates.

Verification (both variants, 320 / 390 / 430):

- Labels report `Space Grotesk` 17px, weight 500, `text-transform: capitalize`,
  letter-spacing −0.17px, row gap 24px, row pitch 68px.
- CTA reads "Email Me" in the display face, `text-transform: none`.
- Byte is present and visible in the bar while the sheet is open at every size.
- `/` unchanged: no v2 marker, its own sheet opens with the v1 type.

Note: the taller rows overflow a 320×568 viewport by 88px, so the sheet body
took `overflow-y: auto` with a `100vh − 7rem` cap. Without it the Email Me CTA
would be clipped with no way to reach it. The v1 sheet has the same rhythm and
the same behaviour on a short phone.

## Hero rail (40–42)

| # | Issue | Status | How it was settled |
|---|-------|--------|--------------------|
| 40 | Hero theme control should be a round button **on mobile** | done | Below v2sm the rail uses the icon form; from v2sm up the sliding track is unchanged. `V2ThemeToggle` takes its presentation from the caller, so the header icon, the mobile rail button and the wide-screen track share one hook. |
| 41 | GitHub crowded the rail on phones | done | Hidden below v2sm; the profile link is still in the header and the footer. |
| 42 | The "also:" label indented the chip row away from the gutter on mobile | done | Shown only from v2md, where the row is right-aligned under the terminal and the label leads it. |

Verification (both variants):

- Rail holds 3 controls at 390/430/679 (star, Byte, theme icon) and 4 from 680
  up (star, Byte, GitHub, track). The icon form measures 40×40 — the same box as
  the star and GitHub buttons — and the track stays 64×36.
- Exactly one theme control is laid out at every width: 390, 430, 679, 680, 768,
  1000, 1440. Clicking whichever is visible flips the theme and back, in both
  variants.
- Chip row starts at exactly the heading's left edge below v2md (delta 0 at 390,
  430, 680, 768) and stays right-aligned at 1440 with the label leading.
- Toggling from the hero flips `html` between light and dark and swaps both
  glyphs — hero and header — in both variants, confirmed by screenshot.
- Byte stays in the rail at every width.

Note: `getComputedStyle` on the `[data-v2]` wrapper reported the dark background
while the page was rendering light. Same deferred-subtree trap as the tab
border — the screenshot is the authority for colour on this page.

Note on #40: this was first applied at every width, which changed the wide-screen
rail the user had not asked about. The request was scoped to mobile. Both forms
now render with responsive visibility rather than one replacing the other —
cheaper than a JS breakpoint read, which would also risk a hydration mismatch.

## Stat formatting (43)

| # | Issue | Status | How it was settled |
|---|-------|--------|--------------------|
| 43 | The live commit count rendered as a flat "1K+", indistinguishable from the hardcoded fallback | done | `formatCount` keeps one decimal above 1,000, so the figure moves as the count does. Still always rounds down. |

The counts themselves were already live (issue 17/18): `/api/github-stats` reads
GitHub's `search/issues` and `search/commits`, cached `s-maxage=3600`. Confirmed
against the running app — `{"mergedPullRequests":232,"commits":1085}`.

`formatCount` checked across the buckets, and never overstating at any of them:

| in | out | | in | out |
|---|---|---|---|---|
| 7 | 5+ | | 1000 | 1K+ |
| 47 | 45+ | | 1085 | 1K+ |
| 99 | 95+ | | 1099 | 1K+ |
| 232 | 230+ | | 1900 | **1.9K+** (was 1K+) |
| 999 | 990+ | | 12345 | 12.3K+ |

Note: the fallback string authored in `content/about` is also "1K+", so the live
value and the static one render identically at today's count — which is why the
figure looked hardcoded when it was not. The tooltips are what distinguish them:
v2 reads "1,085 authored commits across public repositories" (generated), `/`
still reads the authored "1,875 authored default-branch commits …".

Still open: both counts are public-only without `GITHUB_TOKEN` (issue R4).

## Window chrome and radio volume (44–45)

| # | Issue | Status | How it was settled |
|---|-------|--------|--------------------|
| 44 | Hovering a traffic light left it muted grey, so the close X read as a smudge | done | Hover and `:focus-visible` restore the real red / amber. Resting chrome is unchanged — two grey dots plus the accent. |
| 45 | The radio opened at full system volume every time | done | `components/interactive-terminal/index.tsx` sets `RADIO_DEFAULT_VOLUME = 0.35` on first entry only; later entries leave the listener's own `volume <0-100>` alone. |

Verification:

- Lights at rest: `rgb(56,56,47)`, `rgb(56,56,47)`, accent. On real CDP mouse
  hover: `rgb(255,95,87)` close, `rgb(254,188,46)` minimize, accent unchanged;
  the glyph reaches opacity 1 in all three. Same on graphite.
- Radio: `audio.volume` was 1 before the fix and reads **0.35** on entry, with
  the status line showing "vol 35%". `volume 80` sets 0.8, and after `exit` then
  `radio` again it is still 0.8 — the default does not stomp the choice.

Note #45 is a change to a component `/` shares, made deliberately: the same
full-volume entry existed there. It is a safety fix rather than a design change,
and confirmed on `/` as well as the v2 routes.

Note: `:hover` cannot be exercised by dispatching synthetic mouse events from
page script — it needs `Input.dispatchMouseEvent` through CDP. A JS-dispatched
`mouseover` leaves the computed style untouched and reads as "hover does
nothing".

## Trophy case, shared chrome and the project rail (46–52)

| # | Issue | Status | How it was settled |
|---|-------|--------|--------------------|
| 46 | The trophy case kept its v1 navy/cyan panel and every trophy read the same grey | done | A blanket `.terminal-line * { color: inherit }` of mine outranked the per-category colours. The case is restyled from v2 tokens with the full `.terminal-line .achievement-case` prefix, and categories take the earth ramp. |
| 47 | Terminal text was pushed off the left edge on a phone | done | `min-w-0` on the input. A flex item defaults to `min-width: auto` and an `<input>` will not shrink past its intrinsic size, so prompt + field overflowed; with the field focused the browser scrolled the container sideways. |
| 48 | Ambient asides still landed on section headings | done | Text is now blocked by its **line boxes**, not its element box. A heading's box spans the column, which both reserved empty space and — being full width — tripped the wrapper-width test, so it was dropped as scaffolding. |
| 49 | The "surprise" line shimmered cyan/blue/violet | done | Repointed to the accent with one hue for movement. |
| 50 | The monogram's crossbar stayed cyan on themed shared pages | done | `header.brand` draws it from `--brand-accent`, defaulting to the v1 cyan; `[data-v2]` repoints it. `/` unchanged. |
| 51 | Resume filter chips stayed blue in dark mode; the mobile footer was a light slab | done | The `d:` dark variant never matched the anchored family probes, and the footer's `--resume-footer-bg` resolves to gray-50 in both modes. Both repointed under `[data-v2]`. |
| 52 | Project cards needed the reference treatment, and the rail lost its arrows | done | Deeper cover well with a softer corner, title clamped to two lines and summary to three so every card is the same shape; prev/next always drawn on wide screens and disabled at the ends, as the v1 gallery does. |

Verification:

- Trophy case: panel, kicker, title, count, progress, plank and note all on v2
  tokens in both variants and both modes; categories paint sage / clay / teal /
  accent with locked trophies on `--v2-fg-4`. `/` still reports the cyan panel.
- Terminal: wrapper `scrollWidth` 486 → 348 at 390, first line's left edge
  −105 → 33. Same fix confirmed on `/` (486 → 358, −100 → 28).
- Ambient: zero glyph or painted-box overlaps at 820, 900 and 1440 across
  repeated placements. Measuring the *element* box instead reports false
  overlaps — the empty half of a heading's box counts as a hit.
- Brand: `rgb(217,242,75)` on `/resume?theme=signal`, `rgb(6,182,212)` on both
  `/resume` and `/`.
- Resume chips in dark: `rgba(12,74,110,0.6)` → `rgba(142,208,138,0.18)`.
  Footer panel `rgb(248,250,252)` → `rgb(17,17,20)`; `/` keeps the light value.
- Rail: prev/next render at 1440 and are correctly disabled when the set fits.

Note: Tailwind's utilities are emitted after this sheet, so an equal-specificity
override loses on source order. `.dark .d\:bg-sky-900\/60` is two classes, which
is why the `d:` remaps need the attribute doubled.

## Terminal type on small screens (53)

| # | Issue | Status | How it was settled |
|---|-------|--------|--------------------|
| 53 | Terminal type was larger on a phone than on a desktop, so every line wrapped | done | The component sets 16px below Tailwind's `sm` and 13px above it. Under v2, small screens now use `min(13px, 3.2vw)`, bounded at 639px where the component's own rule takes over. |

Verification (both variants):

| width | font | welcome line | wrapped help rows |
|---|---|---|---|
| 360 | 11.5px | 1 row (was 2) | 3 (was 6) |
| 390 | 12.5px | 1 row (was 2) | 3 (was 4) |
| 430 | 13px | 1 row | 1 |

The three that still wrap are the longest descriptions — 47 characters or more —
which would need a smaller size than is worth reading. `/` is unchanged at 16px.

## Card body tint (54)

| # | Issue | Status | How it was settled |
|---|-------|--------|--------------------|
| 54 | Card bodies were flat, so each project's colour lived only in its cover art | done | The body carries its hue as a 165° wash fading out down the card, over the surface, with the reference's 3px hue rule along the top edge. |

Taken from the design reference's own card rule:
`border-top: 3px solid rgb(hue)` and
`linear-gradient(165deg, rgba(hue,0.13), rgba(hue,0.03) 62%, transparent)`.

Verified in both variants, light and dark: the wash reads as a tint over the
surface rather than replacing it, and the three cards stay equal height (478px)
with title clamped to 2 lines and summary to 3.

### Still different from the reference — content, not styling

The reference HTML carries different project data from `content/projects`:

| | reference | shipped |
|---|---|---|
| Precursor tech | Python, TensorFlow, **ISRO-NESAC** | Python, TensorFlow |
| Forex tech | Python, TensorFlow, **CNN-LSTM** | Python, TensorFlow |
| Forex CTA | **View on DagsHub** | View repository |
| Precursor title | Earthquake Precursor Detection | Earthquake Precursor Detection **- ISRO-NESAC** |

`content/projects` is the source for the home route as well, so changing any of
it would change `/`. Left alone pending a decision — the alternative is a
v2-only copy override, which reintroduces the duplication the content layer was
built to avoid.

Note: the reference also draws its cover art full-bleed at 118px with
`grayscale(1)` and `mix-blend-mode: luminosity`, and puts tech and year together
as one mono line in the footer instead of chips. Both were deliberately changed
earlier — the grayscale threw away the artwork's own colour — and the shipped
form has been reviewed since, so they were not reverted.

## Card lean and the step controls (55)

| # | Issue | Status | How it was settled |
|---|-------|--------|--------------------|
| 55 | Cards sat square and the step controls were text under the rail | done | Cards rest at an uneven lean and straighten under the pointer; the controls moved up beside the heading as square icon buttons. |

The lean cycles `[-1.1, 0.7, -0.5, 1.2]` degrees rather than alternating evenly —
an even alternation reads as a pattern instead of a stack of things set down.
The rotation is on the rail item, not the card, so the card keeps its own hover
transition for border and shadow, and `transform-origin: 50% 100%` makes a card
pivot on the shelf rather than about its middle.

Rail state moved to `components/v2/use-scroll-rail.ts`, because the controls no
longer sit next to the track and both need the same state.

Verified (both variants, 390 / 768 / 1440):

- Rest tilts read back `-1.1 / 0.7 / -0.5`; hovering the middle card gives
  `-1.1 / 0 / -0.5` with a −4px lift, and leaving restores `0.7`.
- Controls: two 36×36 buttons on the heading's row, disabled when the set fits.
- Rotation is not clipped: rail vertical overflow 0, with 5px above and 21px
  below the leaning corners at every width. No page-level horizontal overflow.
- `prefers-reduced-motion` drops both the lean and the travel.

Note: the design reference HTML has no tilt at all — it is a plain three-column
grid. The lean comes from the later renders, so the reference is not the
authority on this one.

## Step labels and the resume's first heading (56–57)

| # | Issue | Status | How it was settled |
|---|-------|--------|--------------------|
| 56 | The step controls lost their words when they became icon boxes | done | "prev" and "next" are back on the buttons, still beside the heading. |
| 57 | The resume's first heading sat under the fixed header | done | The content had `py-16` — 64px of top padding under an 80px fixed header. Now `pt-28`. |

Issue 57 was not a scroll problem. Measured at `scrollY: 0`, the very top of the
page: "Intro" started at y=68 with the header's bottom edge at y=80, so its top
12px were behind the bar before the reader touched anything.

| | before | after |
|---|---|---|
| themed, 1440 | −12px (hidden) | **+36px clear** |
| plain, 1440 | −13px | +36px |
| themed, 390 | −12px | +35px |

Present on plain `/resume` too, so it is a long-standing page bug rather than
something the skin introduced; fixed at the source, which fixes both.

Note: `pages/resume.tsx:125` reports a pre-existing type error on a `description`
property. It predates this work and is untouched.

## Step controls drawn the way v1 draws them (58)

| # | Issue | Status | How it was settled |
|---|-------|--------|--------------------|
| 58 | The step controls were boxed chips beside the heading, not v1's bare prev/next | done | Rebuilt to match `components/scroll-gallery.tsx`: borderless, lowercase, 14px, long arrows, sitting at either end below the rail. |

What v1 does, and what the v2 controls now do:

| | v1 gallery | v2 rail (now) |
|---|---|---|
| chrome | none — text and arrow | none |
| case / size | lowercase, `text-sm` | lowercase, 14px |
| arrow | `ArrowLong*` at `h-5 w-5` | same |
| place | `absolute bottom-0`, `left-10` / `right-10` | `absolute bottom-0`, `left-0` / `right-0` |
| below md | hidden | hidden below `v2md` |

`left-0` rather than v1's `left-10` because the v2 rail breaks its own gutter
(`-mx-[var(--v2-gutter)]` with the padding added back), so the wrapper's edges
already sit on the content column — the first card's left edge and the last
card's right edge.

Colours come from the theme tokens, not v1's fixed grays: `--v2-fg-4` enabled,
the same at 40% disabled. Measured `rgb(138 138 128)` on signal dark and
`rgb(102 102 110)` on graphite light, so both modes track.

The rail's bottom padding is the controls' room — `pb-14` from `v2md`, staying
at `pb-6` below it where the controls are not drawn, so the mobile rail gains no
dead space. Verified: 24px at 390, controls `display: none`.

Note: with three projects the rail does not overflow at 1440, so both controls
are correctly disabled there. Narrow to 1024 to see the enabled state.

Note: `getComputedStyle` read the dark colour on a light page again — the
`content-visibility` trap. A real theme toggle plus a repaint reads correctly;
the token itself (`--v2-fg-4`) had already flipped.

## The experience timeline, against the render (59)

| # | Issue | Status | How it was settled |
|---|-------|--------|--------------------|
| 59a | Rows were spread evenly down the plot instead of a fixed pitch | done | `top = 6 + index * 46`, the scheme both the reference script and the v1 timeline use. Slack now sits under the oldest row. |
| 59b | Inactive bars were hollow outlines | done | Each carries its own colour at 0.2 alpha, so a row reads as a block rather than an empty box. |
| 59c | "Omdena × EnergyHub" was cut to an ellipsis | done | Label column 108 → 144, plot offset 116 → 152. |
| 59d | The plot was always cut on the right | done | The 700px floor never fit the ~570px column, so "now" and the end of the current role sat behind a hidden scrollbar. Floor is now 520. |
| 59e | `'26` printed on top of `now` | done | A year label inside the right-end zone `now` occupies is dropped; its gridline stays. |

Measured after, at 1512 (Chrome, both variants):

| | before | after |
|---|--------|-------|
| row tops | 12 / 65 / 119 / 173 / 226 | 6 / 52 / 98 / 144 / 190 |
| inactive bar fill | `rgba(0,0,0,0)` | `rgb(var(--v2-co-n) / 0.2)` |
| clipped row labels | 1 of 5 | 0 of 5 |
| hidden plot | 134px | 3px (the `now` dot's overhang) |

Note on where the render's numbers come from: the reference HTML sets `gap = 46`
in `wireExperience`, and its own company data stops at "Omdena". Ours reads
"Omdena × EnergyHub", so the design's 116px gutter is too narrow for our
content — the column is sized to the longest label we actually carry, not to
the design's constant.

Note: the current role's bar label still ends in an ellipsis. The design's
arithmetic assumes a ~700px timeline column; the real one is 570 at every
desktop width, because `--v2-max-w` caps the page and the detail panel takes
its `minmax(340px,0.95fr)`. At 570 the bar is 176px against 199px of text, and
that holds at the design's own 116px gutter too (171px) — so this is the
column, not the label width. Fixing it properly means widening the timeline
column against the design's grid; the full text is on the bar's `title`, in the
row list, and in the panel.

## About stack and the commit counter (60–62)

| # | Issue | Status | How it was settled |
|---|-------|--------|--------------------|
| 60 | "click to shuffle" sat under the photo stack | done | Removed, along with its string in `content/v2`. |
| 61 | The photos underneath read as grey slivers, not a stack | done | Every print carries a mount and a shadow, and the deck sits on a blank card leaning the other way — the treatment v1 uses. |
| 62 | Commit count stepped in tenths ("1.1K+") | done | Thousands now step in halves: 1K, 1.5K, 2K. |

What v1 does that v2 was missing:

| | v1 | v2 before | v2 now |
|---|-----|-----------|--------|
| frame | `border-2`, gray-50/80 light, slate-600/80 dark | 1px `--v2-line-2` | `border-2`, `--v2-photo-frame` |
| shadow | `shadow-lg` | none | soft two-layer drop |
| bottom of the deck | `-rotate-6` gray card | none | `-rotate-6`, frame colour |
| corner radius | `rounded-xl` | variant radius | variant radius (kept — signal is square by design) |

`--v2-photo-frame` is defined per *mode*, not per variant: white at 0.22 on
dark, white at 0.92 on light. A mount is a mount in either palette and only its
lightness has to flip, so two rules cover all four combinations.

The backdrop card is `z-index: 0`, not negative. The images stack above it at
`length - index`; a negative index would drop it behind the section's own
background, which is the same trap the image z-indices already carry a note
about.

`formatCount` steps: 1085 → "1K+", 1499 → "1K+", 1500 → "1.5K+", 2000 → "2K+",
12300 → "12K+". Still floored, so the figure never overstates.

Note: `getComputedStyle` reported the dark frame colour on a light page again —
the `content-visibility` trap. Reading the custom property off the element that
carries `data-v2` gives the true value; note that element is `body` on
`/signal` and a wrapper `div` on `/graphite`.

## The shimmer line painted as a solid bar (63)

| # | Issue | Status | How it was settled |
|---|-------|--------|--------------------|
| 63 | The ambient "surprise" line rendered as a solid accent bar with no text | done | The v2 override used the `background` shorthand, which also resets `background-clip`. Switched to `background-image`. |

The line is painted through its own glyphs: styled-jsx sets `background-clip:
text` with `-webkit-text-fill-color: transparent`. The v2 override
(`[data-v2][data-v2] .ambient-surprise__shimmer`, 0,3,0) beat that rule's
(0,2,0) and its `background` shorthand carried an implicit
`background-clip: border-box` — so the gradient filled the whole box while the
text stayed transparent inside it. A bar, not a line of text.

Proved both directions in the browser with a probe carrying the same classes
under the same host:

| override | computed `background-clip` | renders as |
|---|---|---|
| `background:` shorthand | `border-box` | solid bar |
| `background-image:` | `text` | gradient text |

Note: the earlier comment on this rule already warned that the shorthand resets
`background-size` — the same reset covers `background-clip`, and that half was
missed. Longhands only when overriding a rule that relies on any other
`background-*`.

Checked the other `background:` overrides in the v2 layer (terminal chrome,
traffic lights, scrollbars, the page ground): none of those targets use
`background-clip: text`, so this was the only one affected.

## The hero stack, as marks rather than a table (64)

| # | Issue | Status | How it was settled |
|---|-------|--------|--------------------|
| 64 | The hero listed the stack as a bordered four-cell grid | done | Replaced with the v1 shape: mark plus name in a row, monochrome at rest, each mark taking its brand colour on hover. |

No logos were fetched. The marks are the same `@react-icons/all-files/si/*`
glyphs the v1 hero already uses — single-path SVGs that paint in
`currentColor`, so they are "masked" by construction: one `color` drives the
whole row, and no network request, remote asset or CSP exception is involved.

Both designs now read the same list. `V2_HERO.stack` points at `HERO.tech`
rather than repeating four strings, so the two heroes cannot drift apart. Each
entry gained a `brand` hex from simple-icons — the same source as the glyphs —
which the v1 row ignores; v1 stays monochrome on hover as before, verified
unchanged.

| state | mark | label |
|---|------|-------|
| rest | `--v2-fg-3` | `--v2-fg-3` |
| hover | `var(--tech-brand)` | `--v2-fg` |

The brand hex rides on the `li` as `--tech-brand`, so one utility
(`group-hover:text-[var(--tech-brand)]`) serves all four rather than a class
per language.

Note: reading the hovered colour immediately after the pointer lands returns
the *pre-transition* value — `transition-colors` is still running, and
`getComputedStyle` reports the animated value, not the target. The first read
said grey with `:hover` already true; a second read a moment later gave
`rgb(0 173 216)`. Measure hover states after the transition, not during.

The row scrolls sideways instead of wrapping, breaking the gutter the way the
project rail does: at 375 it is 379px inside a 375px box, scrolling within
itself with no page-level overflow.

## Contact on a phone: the sentence composer (65)

| # | Issue | Status | How it was settled |
|---|-------|--------|--------------------|
| 65 | The two contact code windows collapse into a column of nested chrome on a phone | done | Below `v2sm` the section is the composer from the new reference; the windows return at 680px and up. |

The composer is one sentence with two tappable words. The intent carries the
mail's `subject` (it says what the mail is about), the action carries a `line`
for the body (it says what should happen next), and both go into a `mailto:`
that the subject/to block previews before the reader commits to opening a mail
app.

Reference numbers kept as authored: 26px sentence at 1.45 with -0.025em, a
60px-minimum send button, 44px minimum on every social link. Colours are
tokens, so the accent tracks the variant — measured `rgb(217 242 75)` on signal
dark and `rgb(63 122 70)` on graphite light, with the CTA's text on
`--v2-btn-fg` either way. The send button takes `--v2-radius-sm`, so it stays
square on signal and rounds on graphite rather than being square in both.

Verified at 375: composer `flex`, windows `display: none`, no page overflow,
and cycling updates the sentence, the subject preview and the `mailto` together.
At 800: composer `none`, windows `grid`, the form still mounted with its three
fields.

Note: what the reference drops on a phone, and what this keeps —

| | reference | here |
|---|---|---|
| section eyebrow | its own `contact` rule | our `06 / CONTACT` header |
| "Contact me" heading | absent | kept |
| `open_to_work`, location | absent | absent below 680 (they live in the JSON window) |
| the API contact form | absent | absent below 680 — **open question, see below** |

The form is not reachable below 680 any more: the phone's send path is the mail
app. That is what the reference shows, but it is a functional change rather
than a visual one, so it is called out rather than assumed settled.
