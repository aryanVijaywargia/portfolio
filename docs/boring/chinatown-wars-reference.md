# Boring Mode: angled open-world reference contract

Status: approved implementation contract for issues #58–#63
Scope: original portfolio game, not a reimplementation of *Grand Theft Auto: Chinatown Wars*

## Reference boundary

The target is the interaction and composition grammar visible in Rockstar's
[official Chinatown Wars page](https://www.rockstargames.com/games/chinatownwars/): a readable
angled overhead city, short objective loops, a map/PDA layer, emphatic prompts, and comic-book
presentation. The [gtactw_vita project](https://github.com/TheOfficialFloW/gtactw_vita) confirms
that it is a wrapper which loads a legally obtained Android executable. It is not a reusable game
engine and is not an asset source.

### Use

- A high, angled, spring-follow camera with limited rotation.
- Original low-poly Bhopal geometry with stepped/cel lighting and ink-like silhouettes.
- Compact route objectives, large waypoint arrows, circular GPS, PDA overlays, and comic panels.
- Original color, copy, icons, models, sounds, map transforms, and interactions.
- Publicly licensed OpenStreetMap data transformed by the repository's offline pipeline.

### Do not use

- GTA/Rockstar names, logos, trademarks, screenshots, UI crops, typefaces, mission copy, maps, or
  audio as shipped assets.
- Extracted APK/OBB models, textures, animation, code, data, or sound.
- Rockstar or community recreations as a runtime dependency.
- Violence, injury, weapons, wanted/police systems, theft, coercion, or damage mechanics.
- Wording that implies endorsement by Rockstar, Bhopal civic bodies, employers, schools, or
  institutions shown only as navigation context.

Every committed visual must be independently created from primitives, owned assets, or an
explicitly compatible license. External screenshots remain links used only during visual review.

## Visual thesis

**A warm late-afternoon Bhopal made from compressed toy-city geometry, heavy charcoal ink,
sun-bleached plaster, and decisive mustard/coral comic UI.**

The first frame must read as a city from above—not a neon diorama, a conventional third-person
driving game, or a generic cyberpunk grid.

### Fixed time and palette

Vertical-slice time is **17:10 on a clear, warm day**. Long shadows point east-northeast; the sky
is peach near the horizon and pale cream overhead. Night mode is outside this slice.

| Role | Color | Use |
| --- | --- | --- |
| Ink | `#17181d` | outlines, text, tyre/roof silhouettes |
| Paper | `#f5ecd7` | panels, road markings, high-value text |
| Mustard | `#e9b949` | active objective, selected controls, route arrow |
| Signal coral | `#df604f` | mission stamps, warning-free emphasis |
| Lake teal | `#5ca7a2` | Upper and Lower Lakes |
| Park green | `#71865b` | Van Vihar and planted corridors |
| Plaster | `#d9c7a5` | Old City walls and civic buildings |
| New-city stone | `#9d927d` | broad modern blocks |
| Asphalt | `#34343a` | driveable roads |
| Dusk sky | `#e9aa72` | fog and horizon |

Material rules:

- Two- or three-step toon shading; low roughness variation; no photoreal PBR showcase.
- Dark edges on buildings, vehicles, props, and landmark silhouettes.
- Warm directional light, cool sky fill, readable contact shadows.
- Halftone/noise only as a subtle screen/panel texture. No heavy bloom, neon windows, stars, or
  chromatic aberration.
- Roofs are simple, graphic, and more saturated than walls so blocks remain legible from above.

## Camera and movement contract

### Vehicle camera

- Perspective camera, starting FOV `34–40°`.
- Target pitch `52–58°` downward; never descend to a shoulder/bumper camera.
- Starting follow offset about `14 m` behind and `20 m` above the vehicle.
- Critically damped/spring-like follow: position half-life about `140 ms`, look target half-life
  about `90 ms`.
- Look-ahead `4–7 m` in the travel direction.
- Speed zoom adds at most `4 m` height and `2–4°` FOV.
- Yaw follows the vehicle slowly and may be nudged in bounded increments. Reduced-motion mode uses
  longer damping and disables camera kick/snap.

### On-foot camera

- Same grammar and horizon; closer by roughly 20%, slower yaw, no shoulder view.
- The transition between targets is a single damped move, never a cinematic cut longer than one
  second.

### Movement

- Input is expressed as actions (`move`, `steer`, `accelerate`, `brake`, `interact`, `namaste`,
  `pause/PDA`, camera, confirm/back), not raw keys.
- Car response is arcade-readable: quick acceleration, visible body heading, forgiving braking,
  reversible steering, and safe collision recovery.
- Fixed simulation is 60 Hz with capped delta and bounded catch-up. Render transforms do not enter
  React state every frame.

## City composition

- Preserve the twin-lake silhouettes and relative district directions, then compress repetitive
  travel to a 2–4 minute cross-city loop.
- Old City: narrow lanes, small irregular footprints, denser warm plaster, minarets/domes as distant
  navigation silhouettes.
- Lakefront: open sightlines, teal water, curved VIP Road, ghats/green edges, Kamla Park.
- Shyamla Hills: terrain tiers, larger cultural footprints, dense tree canopy, protected green edge.
- New Bhopal: broader roads, larger set-back blocks, station/rail context, modern skyline markers.
- Sensitive sites are scenery anchors. Interaction pads use clearly fictional names and remain
  outside religious, museum, memorial, palace, heritage, and protected boundaries.

### Bhopal street-reference pass

Google Maps and user-contributed Street View/360 imagery were inspected on 2026-07-13 only as
visual reference. No Google imagery, geometry, texture, measurement, or extracted asset is stored
or shipped.

- [Kamla Park](https://www.google.com/maps/search/?api=1&query=Kamla+Park+Bhopal): pale-blue
  lake-edge walls with red caps, dark metal railings, palms, low hedges, ornamental lamps, benches,
  strolling visitors, and informal seating facing the water.
- [Chowk Bazaar](https://www.google.com/maps/search/?api=1&query=Chowk+Bazaar+Bhopal): narrow lanes,
  irregular weathered plaster/brick blocks, metal shutters, fabric awnings and tarps, dense Hindi
  and English sign bands, overhead service wires, scooters, and tight shop thresholds.
- [New Market](https://www.google.com/maps/search/?api=1&query=New+Market+Bhopal): black-and-white
  curb/median rhythm, buses, green-yellow autos, scooters, compact hatches and SUVs, traffic lights,
  billboards, planted medians, mixed-height commercial façades, and broad painted junctions.
- [Madhya Pradesh Tribal Museum](https://www.google.com/maps/search/?api=1&query=Madhya+Pradesh+Tribal+Museum+Bhopal):
  quieter shaded forecourts, pink/red low walls, potted planting, motorcycles, compact cars, street
  dogs, and dense mature canopy around the Shyamla Hills cultural corridor.

These observations define an original modular street kit rather than literal replicas: façade
bands, shutters, awnings, rooftop tanks, wires, painted curbs, lake furniture, buses, autos,
scooters, compact cars, and varied pedestrian silhouettes.

## HUD contract

The canvas owns the city; the DOM owns readable information.

1. **Circular GPS, lower-left:** derived from the same static map data; dark road field, pale road
   strokes, teal water, mustard route, player chevron, north tick, and nearby landmark labels.
2. **Objective panel, upper-left:** one black/paper comic slab, mission stamp, one-line objective,
   district, and non-color progress pattern.
3. **Goodwill/status, upper-right:** small textual meter and PDA/pause button; no health, armour,
   wanted stars, weapon icon, or cash imitation.
4. **Context prompt, lower-right:** one action at a time with keyboard/touch glyph and caption.
5. **Briefing/completion:** asymmetrical comic panels with thick ink border, halftone corner, short
   copy, large stamped heading, and explicit continue/back buttons.

At 200% browser zoom, overlays may reflow but must not obscure Exit, Pause, or the active objective.
All important color signals also have an icon, text, pattern, or shape.

## Game flow

`loading → title → free-roam → mission-briefing → mission-active → dialogue/pause →
mission-complete → free-roam`

Recoverable states are `loading-error` and `webgl-unavailable`. Leaving and remounting the route
must not retain listeners, animation loops, pointer state, body locks, or audio.

The initial route surface immediately shows the title, loading status, controls, mute state, HTML
dossier option, and Exit. WebGL is optional: the full three-mission portfolio dossier and canonical
links remain available as semantic HTML.

## Input table

| Action | Keyboard default | Touch | Controller-ready |
| --- | --- | --- | --- |
| Move / steer | WASD or arrows | left directional pad | left stick |
| Accelerate / brake | W/S or up/down | two large pedals | RT/LT |
| Interact / enter / exit | E or Enter | context button | A |
| Namaste | N | context gesture button | X |
| Pause / PDA | Esc or P | persistent PDA button | Menu |
| Camera nudge / zoom | Q/R, wheel | drag/pinch interface | right stick |
| Confirm / back | Enter / Esc | labelled buttons | A/B |
| Recover | Backspace | Pause → Recover | Y |

Keyboard input is ignored while a text input, textarea, select, contenteditable region, or modal
action owns focus.

## Technical budgets

Initial budgets are release gates, not aspirational prose.

| Metric | Desktop target | Mid-range mobile target |
| --- | ---: | ---: |
| Frame rate | 60 FPS | 30 FPS |
| p95 frame time | ≤ 18 ms | ≤ 34 ms |
| Draw calls, normal view | ≤ 180 | ≤ 110 |
| Visible triangles | ≤ 350k | ≤ 160k |
| Active traffic / pedestrians (future phases) | 24 / 45 | 10 / 18 |
| Map JSON, gzip | ≤ 2 MB | ≤ 2 MB |
| Game route initial JS + assets, gzip | ≤ 1.5 MB | ≤ 1.5 MB |
| Map parse + scene init | ≤ 250 ms | ≤ 650 ms |
| GPU textures | ≤ 96 MB | ≤ 48 MB |
| Total steady memory after 15 min | ≤ 350 MB | ≤ 220 MB |

Quality tiers:

- **High:** 1.5 DPR cap, 1024 shadow map, full outlines, 100% draw distance.
- **Medium:** 1.25 DPR cap, 768 shadow map, reduced outline/noise, 80% draw distance.
- **Low:** 1 DPR, 512/no dynamic shadows, no full-screen postprocessing, 60% draw distance,
  reduced decorative instances. Objectives, landmarks, facts, and minimap remain.

Hidden tabs pause simulation. The renderer resumes without accumulated time. A performance/debug
overlay reports FPS, draw calls, triangles, entities, quality, state, and player position in
development.

## Accessibility and fallback

- Every route can be completed with keyboard or touch; target sizes are at least 44 CSS pixels.
- Reduced motion removes rapid pulses, screen shake, fast panel sweeps, and camera snaps.
- Mute is available before sound; no audio starts before a user gesture; captions/visual pulses
  duplicate every required cue.
- The HTML mission dossier contains all essential profile facts and final links without WebGL.
- Focus is visible and trapped only inside an open modal; Escape always reaches pause/back.
- High contrast and scalable HUD text are CSS-level preferences independent of renderer quality.

## Visual-review checklist

- [ ] First frame reads as an angled overhead city, not third-person, isometric-flat, or neon sci-fi.
- [ ] Camera pitch stays within `45–60°` and remains readable at speed.
- [ ] Sunlit warm Bhopal palette, lake teal, and heavy ink silhouettes are immediately visible.
- [ ] Upper and Lower Lakes and at least one district-specific landmark silhouette orient the shot.
- [ ] Buildings, vehicle, props, and waypoint have graphic edges and stepped shading.
- [ ] GPS, objective slab, context prompt, and PDA feel like one bold comic system.
- [ ] No Rockstar/GTA logo, font, asset, screenshot, audio, mission copy, or extracted data ships.
- [ ] No violence, injury, theft, coercion, wanted/police, weapon, or damage mechanic exists.
- [ ] Desktop stays near 60 FPS and mobile near 30 FPS under the stated budgets.
- [ ] Reduced-motion, keyboard, touch, and complete HTML fallback paths remain usable.
