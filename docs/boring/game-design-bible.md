# Boring Mode game design bible

Depends on the [visual/gameplay reference](./chinatown-wars-reference.md).
Canonical content: `content/experience.ts`, `content/projects.tsx`, `content/about.tsx`, and
`content/contact.ts`.

## Promise

This is a three-mission open-world portfolio adventure about warmth, consent, curiosity, and useful
systems work. The player may explore, drive, greet, ask, deliver, scan, order, route, replay,
recover, read, and thank. The player cannot hurt, threaten, steal from, coerce, or frighten anyone.

Real Bhopal landmarks provide orientation. Fictional Portfolio Dispatch, relay, pavilion, depot,
studio, and overlook anchors sit on public-road edges outside sensitive boundaries. Aryan's work,
schools, employers, and projects are never presented as physically located at those landmarks.

## Peaceful interaction matrix

| Familiar open-world verb | Boring Mode replacement | Animation / UI response | Consent rule | Decline / retry |
| --- | --- | --- | --- | --- |
| Force a driver out | **Namaste Ride Request** | player greeting, driver acknowledgement, safe pull-over, keys icon | only an eligible driver may accept; acceptance is explicit | a friendly decline points to another eligible ride; walking always remains valid |
| Fight or threaten | Talk, de-escalate, collaborate, or solve a dialogue/rhythm pattern | open hands, speech panel, shared pulse | NPC may end or decline a conversation | prompt closes without penalty; another helper or Skip is available |
| Police/wanted chase | Civic-helper route, clean-line challenge, or lost-signal recovery | route quality ribbon and reroute line | participation is opt-in and never blocks facts | pause, abandon, or retry from last safe checkpoint |
| Weapon/tool pickup | Scanner, camera, debugger, notebook, parcel, or signal beacon | tool card and visible non-weapon silhouette | tools work only at their intended objective | Return/Skip restores the objective with no loss |
| Theft | Consent-based borrowing | owner hands over a visible key token; thank-you marker persists | occupied vehicles are never enterable without acceptance | cancel releases the reservation; a guaranteed mission ride is available |
| Pedestrian collision/injury | Automatic braking, yield, step-back, apology/namaste | brake lines, safe spacing icon, apology caption | pedestrians always retain right of way | vehicle is repositioned safely; no injury or punishment state |
| Health/damage | Goodwill, focus, route quality, and objective progress | positive meter with text and icon | progress measures cooperation, not bodies or property | a mistake reroutes or offers Show answer; no fail spiral |
| Car destruction | Safe recovery / roadside reset | comic “Let’s try that turn again” panel | no damage simulation exists | Recover returns vehicle and player to last safe road anchor |
| Timed failure | Optional route-efficiency badge | elapsed-time chip is secondary | timer never blocks story or facts | continue without badge, replay later |

### Namaste decline language

Namaste is a greeting and request—not a power or joke. Example decline: “Sorry, I’m heading the
other way. The yellow auto at the next safe bay can help.” The HUD immediately marks an alternative
or keeps the walking route active. Repeated requests never reduce goodwill.

## Allowed verbs: one-page review list

### Player verbs

- Walk, turn, drive, brake, reverse, board, exit, look, zoom, pause, recover.
- Greet, ask, accept, decline, cancel, thank, talk, listen, read, choose.
- Carry, deliver, scan, photograph, order, connect, route, compare, replay, recover.
- Explore, follow, collect a harmless signal, visit, unlock a dossier, open an explicit link.

### World responses

- Yield, stop, pull over, step back, wave, return a greeting, offer help, politely decline.
- Reroute, reset to a safe anchor, show a hint, show the answer, skip a puzzle, resume.
- Award goodwill, route quality, optional efficiency, facts, archive entries, and access.

### Forbidden verbs and states

- Attack, aim, shoot, strike, threaten, steal, carjack, kidnap, coerce, chase in terror.
- Weapon, ammunition, police/wanted, health, armour, injury, death, damage, destruction, ragdoll.
- Mission failure caused by time, collision, NPC refusal, wrong turn, puzzle error, or slow vehicle.
- Hidden placeholders or hooks for any forbidden system “later.”

Code review rejects new mechanics outside the allowed list unless this document is explicitly
amended first.

## Three-mission campaign

Facts below are keyed to the canonical repository content. UI should reference keys from the shared
fact model rather than duplicating metrics as unrelated scene strings.

### 1. Home Circuit: Meet the Builder

**Opening premise:** At the fictional Portfolio Dispatch kiosk near Kamla Park, mixed-up builder
story cards and a research notebook need to reach a fictional learning pavilion near the Shyamla
Hills cultural corridor.

**Route:** Kamla Park / lakefront → safe public road near Bharat Bhavan and the Tribal Museum →
Van Vihar-edge overlook. Landmarks are navigation scenery only.

**Objectives (5–7 minutes):**

1. Read the short builder card and arrange education/leadership cards.
2. Complete a guaranteed Namaste Ride Request at an approved curb.
3. Follow calm lakefront checkpoints with no timer.
4. Route three research signals to the matching chapter.
5. Deliver the notebook at the overlook and open the Origin & Research dossier.

**Canonical facts unlocked:**

- `EXPERIENCE_JOURNEY.companies[nit-agartala]`: B.Tech CSE, Jul 2019–Jul 2023, CGPA 8.59.
- `nit-gdsc-explore`: led 20+ members and organized GDSC Explore.
- `ihub-roadex`: three YOLO Roadex pipelines at about 12 FPS.
- `ihub-triple-rider`: 0.83 mAP@0.5 and 91% helmet result.
- `PROJECTS[Earthquake Precursor Detection - ISRO-NESAC]`: RMSE 0.22, anomaly F1 0.78,
  Dash research pipeline, and repository/report links.
- `imd-hailstorm` and `omdena-ev`: next-day severity work and EV time-series clustering.

**Nonviolent interaction:** ordering, request/consent, driving, scanning/routing, delivery.

**Reward:** Origin & Research dossier, goodwill, Mission 2. No reward is duplicated on replay.

**Accessible alternative:** focusable Move up/down buttons, guaranteed Accept ride button, list-based
signal matching, Show answer/Skip, captions, untimed route, full HTML dossier.

### 2. Runtime Relay

**Opening premise:** Three fictional runtime relays in New Bhopal have lost their harmless debug
signal. Carry the signal through three distinct system puzzles and return it to the station overlook.

**Route:** Rani Kamlapati / DB Mall zone → Shaurya Smarak perimeter → Arera Hills / New Market →
fictional data depot → station overlook.

**Objectives (6–8 minutes):**

1. Collect the debug signal and choose a mission vehicle or guaranteed ride.
2. Put streamed runtime events in order.
3. Route a query through the Search Platform graph.
4. Connect three CDC domain lanes.
5. Return the restored signal and review the three-panel summary.

**Canonical facts unlocked:**

- `gep-agentic-runtime`: TTFT from ~5s batch to ~500ms streaming; session MCP pooling measured
  2.8× on a five-tool workflow; restart-safe human review with p95 under 500ms.
- `gep-elasticsearch-platform`: seven query types; six comparison operators; eight normalization
  strategies; multi-tenant KNN; cache hits under 10ms; 80+ indices; ~1k jobs/month.
- `gep-cdc`: 171 Logstash pipelines across 28 domains; secured Kafka CDC feeding Elasticsearch.

**Nonviolent interaction:** event ordering, graph routing, lane connection, delivery.

**Reward:** Runtime Systems dossier, goodwill, Mission 3.

**Accessible alternative:** semantic ordered lists, labelled nodes/edges, buttons for each lane,
shape/pattern/text signals, Show answer/Skip, reduced pulses, full HTML dossier.

### 3. Continue the Long Run

**Opening premise:** A fictional Workflow Studio near the lakefront safely paused after losing a
signal. Record, replay, and recover its trace, then carry the completed history to an overlook.

**Route:** Shyamla Hills/lakefront studio → three safe public-road checkpoints → fictional Project
Promenade → lake overlook.

**Objectives (6–8 minutes):**

1. Pick up a workflow seed and record a short event sequence.
2. Replay the trace and identify a labelled mismatch.
3. Route a waiting worker into a free lease slot.
4. Stop at Project Promenade for selected projects and skills.
5. Deliver the recovered trace and explicitly choose GitHub, résumé, contact, replay, free roam,
   or Exit.

**Canonical facts unlocked:**

- `PROJECTS[Continua]`: Go/PostgreSQL engine, event-sourced replay, byte-exact divergence,
  `FOR UPDATE SKIP LOCKED` lease recovery, p99 under 50ms, 1K+ span waterfall, 5K-node JSON search,
  Python SDK tracing/heartbeats, site and repository.
- `PROJECTS[Earthquake Precursor Detection - ISRO-NESAC]` and
  `PROJECTS[Forex Trading Recommendation System]`: canonical summaries and repositories.
- `content/tech-stack.tsx` and experience technologies: Go, C#, .NET, TypeScript, Python,
  PostgreSQL, Elasticsearch, Kafka, React/Next.js, and ML tooling.
- `CONTACT` and the existing résumé asset: canonical GitHub, LinkedIn, email, and résumé paths.

**Nonviolent interaction:** record/reorder, compare, route/recover, browse, deliver, explicitly open.

**Reward:** complete three-mission portfolio archive, free roam, replay controls, final links.

**Accessible alternative:** list sequence, textual diff, lease-slot buttons, semantic project list,
explicit links, captions, reduced motion, full HTML finale.

## Failure and recovery rules

- Missing a route marker redraws the route; it does not fail the objective.
- Collision boundaries prevent water/building traversal. Recovery places the player at the latest
  safe road checkpoint with the same mission progress.
- Wrong puzzle moves explain the mismatch. After a reasonable attempt, Show answer and Skip are
  always present and produce the same portfolio fact unlock.
- NPC decline/cancel/despawn releases reservations and reveals a guaranteed alternative.
- Refresh resumes at a serialized safe objective, never at a half-finished animation.
- Replay may repeat interactions but not duplicate one-time unlocks or goodwill rewards.

## Cultural-sensitivity checklist

- [ ] Bhopal-specific lake, road, hill, vegetation, rail, and landmark relationships are present.
- [ ] Taj-ul-Masajid, Moti Masjid, Gohar Mahal, museums, Bharat Bhavan, Shaurya Smarak, and Van
  Vihar are orientation anchors only.
- [ ] No mission pad, stunt, takeover, timed line, collision joke, or fictional institution sits
  inside a religious, memorial, museum, heritage, palace, or protected boundary.
- [ ] Fictional sites are visibly named as fictional and do not imply a real institutional address.
- [ ] Namaste is framed as a respectful request with explicit acceptance/decline.
- [ ] Clothing, silhouettes, gestures, street props, language, and sound avoid caricature and
  generic “Indian” shorthand.
- [ ] Claims about Aryan, employers, schools, projects, and metrics resolve to canonical content.
- [ ] External links open only after explicit user action and use clear screen-reader labels.
