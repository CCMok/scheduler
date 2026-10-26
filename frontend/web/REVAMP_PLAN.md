# Roster UX Revamp Plan

> Status: Draft for full frontend rewrite (and optional `backend/sch` changes)  
> Audience: Product + engineering  
> Goal: Make auto-arrange roster **faster, clearer, and more pleasant than editing in Excel** — while keeping OR-Tools optimization as the product core.

**Batch adjust:** **whole day-column switch** — swap / move an entire day’s shift pattern with another day.

---

## 1. Vision

### 1.1 One-line positioning

**Pick dates → mark days off → one-click arrange → tweak like a spreadsheet (including whole-day switches) → export / save.**  
The solver is the engine; a spreadsheet-like grid is the shell; **the day column** is the batch unit of work.

### 1.2 Success criteria (vs manual Excel)

| Scenario | Excel today | Must win after revamp |
|----------|-------------|------------------------|
| Build a new roster | Copy sheet + hand-edit | Pick dates + off matrix + arrange in seconds |
| Re-arrange after offs change | Refill the whole sheet | Re-arrange while keeping what can be kept |
| Tweak one cell | Fast type / paste | Keyboard flow close to Excel (arrows, Tab, Enter, paste) |
| Move a whole day’s pattern | Select column, cut / paste | **Day-column select, swap days, reorder days** |
| On failure | User notices collisions themselves | Explainable: short staff / off conflicts / infeasible |
| Look & feel | Useful but ugly / messy | Professional, quiet, branded editor |

If users still prefer finishing the whole sheet in Excel then importing, that is failure. Allow “paste offs from Excel”; do not allow “product is only an export shell.”

### 1.3 Non-goals (out of this round)

- Multi-shift / morning–evening (still one cell per day; expandable later)
- Mobile-first roster editing (desktop-first; mobile can be read-only + light edits)
- Real-time multi-user collaboration / OT
- Full HRIS integration

---

## 2. Extra requirements (explicit for this revamp)

### 2.1 Whole day-shift switch (batch unit = day column)

A **day column** = one timeslot/date: all post assignments (and related offs) for that day.

Must support:

1. **Select day column** — click day header; highlight entire column.
2. **Swap two days** — exchange the full shift pattern between day A and day B (all posts). Offs for those two days swap with the columns (or follow an explicit rule — see open decisions).
3. **Reorder days** — drag day header (or move left / right) to change column order when dates are contiguous or when order is display-only; if order is date-sorted, “reorder” may mean swap with neighbor only.
4. **Clear day** — empty all assignments for one selected day (offs optionally kept).
5. **Copy day → another day** (optional Phase 2) — paste one day’s assignment pattern onto another day, then validate offs / eligibility.

Solver runs on the **full selected date set** for the roster (or current edit scope).

### 2.2 Polished UI

Not “add more shadows.” Goals:

- First glance reads as a **professional roster workspace**, not admin CRUD + default shadcn skin.
- The grid is the visual hero; toolbar stays quiet; status via color / light motion — not dialog stacks.
- Allowed to **fully replace** current `external/shadcn` deps and palette; no need to compromise for old components.
- Restrained motion: enter preview, solver done, save success, **day-column swap** — about 2–3 meaningful transitions.

Design direction (avoid common AI template looks):

- **Visual anchor**: clear **day columns** (headers selectable, swap affordance) — not abstract purple gradients.
- **Type**: keep / upgrade CJK display (e.g. Noto Sans HK + one distinctive display face for brand mark only); body text must not feel like Inter / system default.
- **Color**: one clear primary (prefer deep ink teal / slate blue — not purple, not cream terracotta); background via faint paper texture or vertical **day-column** rhythm — avoid dead flat white.
- **Density**: editor mode information-dense (spreadsheet-like); settings pages can breathe more.

---

## 3. Current state (why a large rewrite)

### 3.1 Current journey

1. `/roster` pick team → “Auto arrange”
2. Multi-select arbitrary dates
3. Per-worker Combobox + per-day Checkbox for offs
4. Confirm dialog → `POST /roster`
5. Preview via drag-and-drop / double-click Combobox → name and save
6. Back to read-only list; edits open `/roster/edit`; XLSX export only (one-way)

### 3.2 Key gaps

| Layer | Gap |
|-------|-----|
| Domain | Timeslot is opaque `name` (keep — not date-bound); sorting / display / export formatting live in UI |
| UX | Painful off entry; grid is not spreadsheet-like; **no whole-day column ops**; no draft on preview; failure becomes empty “success” |
| Product | Affinity / priority / `maxWorkerAssignPerRoster` almost no UI |
| Design | Shadcn new-york + neutral tokens; feature-led, weak brand |
| Excel | Export only; offs not exported |

Manual `/roster/new` and history already removed; create is locked to the auto wizard — right direction, high friction.

---

## 4. Target experience

### 4.1 Information architecture

```
/login, /sign-up, …          # auth (keep logic, restyle)
/app                         # or /roster: workspace home
  ├─ Team switcher (top bar)
  ├─ Roster workspace (main)
  ├─ Team settings (workers / posts / prefs / caps)
  └─ Account settings
```

**Drop multi-step wizard route mental model** (`auto-new` three-step pages can go). Replace with a single **Roster Workspace**:

| Region | Content |
|--------|---------|
| Top bar | Team, roster name, save state, theme |
| Date bar | Selected dates summary; add / remove dates; jump / calendar |
| Left or top toolbar | Off mode / assign mode, auto-arrange, **swap days**, import / export, Undo |
| Main | **Day grid** (post × date) or Off matrix (worker × date) |
| Bottom / side | Solver status, conflict notes, stats (days worked per worker) |

Merge read-only list and edit: opening a roster = editable; auto-save draft + explicit “Publish / Save” if versioning is needed.

### 4.2 Primary happy path (new roster)

1. Pick team (if no roster yet) → “New roster” → name (editable).
2. Pick dates (multi calendar or quick presets like “next 7 days”).
3. Switch to **Off** mode → Worker × date matrix (or Ctrl+V paste from Excel).
4. Hit **Auto-arrange** (primary CTA — not buried in dialog chains).
5. Solver returns: grid filled; diffs highlighted; side panel briefly “balanced load / respected offs.”
6. Keyboard cell tweaks; **swap whole day columns** when the pattern should move.
7. Save / export XLSX.

Vs old flow: two fewer forced step pages, fewer confirms, off-entry effort drops sharply; day-level ops remove “rebuild the day by hand.”

### 4.3 Day-column switch — operation spec

| Action | Behavior |
|--------|----------|
| Select day | Click column header; entire day highlighted |
| Swap days A ↔ B | All post assignments for A and B exchange. Default: offs for A and B also exchange with the columns so workers stay attached to the day they were off. After swap, run eligibility / off validation; block or warn if a worker is assigned on a day they are off. |
| Swap then re-arrange (optional) | After swap, user can run `modify` to fix conflicts while preserving as much as possible |
| Move / reorder | Drag header to new position among dates; if grid is always date-sorted, “move” = swap with neighbor until target order matches dates — or allow free column order with date labels fixed (prefer **date-sorted columns**; swap changes **content**, not calendar identity — see decisions) |
| Clear day | Clear assignments for selected day |
| Copy day pattern | Copy assignments from day A onto day B (offs unchanged unless user opts in); validate |

**Important semantic choice (see §11):**  
Prefer **content swap on fixed date headers** (date 10/27 and 10/28 stay labeled; who works which post swaps) — matches “switch day shifts,” not “rename days.”

### 4.4 Grid editing (must beat “I’d rather use Excel”)

Minimum spreadsheet feel:

- Single-click select; arrow keys move; Enter opens worker picker; Esc closes; Tab next cell
- Type-to-filter worker names (keyboard-first combobox)
- Ctrl/Cmd+Z Undo (includes day-swap as one undo step)
- Copy / paste single cell or rectangular range (worker name text)
- Cell drag-and-drop swap can stay as secondary — not the only path
- **Day-header drag** (or explicit “Swap with…” picker) for whole-day switch

Off matrix gets keyboard + paste support (`Y`/`N`, blank, or checkbox ranges).

### 4.5 Solver trust layer

| Status | UI |
|--------|-----|
| `OPTIMAL` | Success; optional objective summary |
| `FEASIBLE` (if enabled) | Warning: not optimal, still usable |
| `INFEASIBLE` | Clear failure; list likely causes (too many offs, not enough eligible workers, `maxWorkerAssign` too tight) |
| Engine / network error | Error, retryable; **never** treat as empty successful sheet |

Preview vs saved: keep `initialRoster` (auto result) and `workingRoster` (manual) together; offer “Restore auto result” and “Show changes.”

---

## 5. Domain & data model changes

### 5.1 Timeslot stays opaque `name` (no `date` column)

**Decision (locked):** Do **not** migrate `RosterTimeslot.name` → `date`. Timeslots are not guaranteed to be calendar days forever (future units may be shifts, periods, etc.). Keep `name` as the opaque timeslot key end-to-end (Prisma ↔ web ↔ sch).

**Implications:**

- sch continues to treat timeslot strings as opaque labels (no schema change for “date keys”).
- Near-term product UX may still *feel* day-based when the user picks calendar dates (display / sort / “day column” ops live in the frontend presentation layer).
- Sorting, export formatting, and column labels are frontend concerns; do not bake “must be a date” into the DB.

### 5.2 Timeslot set

A roster’s timeslots remain an **arbitrary list of named slots** (as today). When the UI creates slots from a calendar, it may store display-friendly or stable strings in `name` — that is a product convention, not a schema constraint.

### 5.3 Complete team settings (ship the product promise)

Frontend must edit:

- `maxWorkerAssignPerRoster` (expose in UI; keep roster-scoped meaning unless sch changes it)
- Post↔Worker eligibility + **priority**
- Post affinity groups, Worker affinity groups

Otherwise README “preferences” stay fake for users.

### 5.4 Drafts

Prefer `Roster.status`: `DRAFT | SAVED`, or a separate `RosterDraft` JSON.  
Workspace auto-saves draft every N seconds / debounced per edit — kill “leave preview and it’s gone.”

### 5.5 Day swap — where it lives

**Default: pure frontend / persist layer.** Swapping day A ↔ B rewrites assignments (and offs) for those two `RosterTimeslot`s, then save. No sch call required for a pure swap.

Call sch `modify` only when user asks to **re-arrange after swap** (or when validation fails and they choose “fix with solver”).

---

## 6. Backend / `sch` required changes

Day swap is client/persist-first. Below are changes still needed for trust and consistency.

### 6.1 Must change (correctness / trust)

| Item | Today | Change |
|------|-------|--------|
| Non-OPTIMAL return | `[]` | Structured `{ status, posts?, meta? }`; **breaking** — no empty-array failure; no backward compat |
| Timeslot key | Opaque `name` string | **Keep** opaque `name` (no forced ISO date) |
| Error messaging | Frontend “system error” | sch returns machine-readable `status` (+ optional `meta` / message) |

**Why structured status (independent of `name` / `date`):**  
Today, when the solver is not `OPTIMAL`, sch returns `[]`. The web client parses that as a valid empty roster and can show an empty grid as if arrange “succeeded.” Structured status makes failure explicit (`INFEASIBLE` / error) so the UI never celebrates a blank sheet.

Suggested response shape:

```json
{
  "status": "OPTIMAL",
  "posts": [{ "postId": 1, "timeslots": [{ "timeslot": "2026年10月27日", "workerId": 3 }] }],
  "meta": { "solveMs": 120 }
}
```

On `INFEASIBLE`, omit `posts` (or leave empty) **and** set `status`; never rely on “empty array means failure.” Optional later: `meta.hints` e.g. `["insufficient_workers", "off_coverage"]`.

### 6.2 Strongly recommended (usability)

| Item | Notes |
|------|-------|
| **Expose / clarify `maxWorkerAssignPerRoster`** | Keep roster-scoped; show in team UI so users know the cap. |
| **Accept FEASIBLE** | On timeout / non-optimal, return FEASIBLE + solution instead of empty; UI labels “approximate.” |
| **Modify after day swap** | Existing `modify` is enough if client sends full roster (or edited scope) + offs; document preserve semantics. Optional later: `scopeDates[]` if partial re-solve is useful after swapping two days only. |

### 6.3 Optional advanced

- Soft-constraint weights via API (balance, affinity) for an advanced panel
- Explain: which hard constraints caused infeasible (OR-Tools assumptions when enough)
- Public holidays as **labels** on the date picker

### 6.4 Can keep for first ship

- Coverage “one worker per post per timeslot,” hard offs, soft affinity — core algorithm can stay
- API-key auth mode can stay
- Arrange / modify over arbitrary timeslot lists

---

## 7. Frontend rewrite plan

### 7.1 Principles

- **Full `frontend/web` rewrite is allowed** (routes, state, UI kit, styles).
- Keep what is valuable: **Prisma schema evolution, auth / session concepts, sch call boundary, domain nouns (Team / Post / Worker / Roster).**
- No mandate to keep shadcn; if building a design system, pull only needed headless (Radix / Base UI / React Aria) or fully custom-draw the grid.

### 7.2 Suggested technical direction

| Concern | Suggestion |
|---------|------------|
| Grid | Custom DayGrid (div + keyboard + **column select / swap**); or light spreadsheet core |
| State | One workspace store (Zustand or equivalent): dates, offs, grid, selection (cell + day column), undo, solver status |
| Data | Pick one of Server Actions / tRPC / Route Handlers — stop scattering |
| Motion | CSS + light motion on day-swap and solver complete; virtualize if many dates / posts |
| Import / export | Keep exceljs; add parse for offs / roster seed |

### 7.3 Suggested layout (sketch)

```
frontend/web/
  app/…                 # new IA
  features/roster/      # workspace, day-grid, day-swap, off-matrix, solver-ui
  features/team/        # workers, posts, affinities, caps
  design-system/        # tokens, type, Button, Overlay (can replace shadcn)
  libs/sch/             # arrange/modify client + result types
  libs/roster/          # prisma services
```

Mark old `app/(private)/roster/auto-new/**`, `edit/**`, and the split list/edit flow as deprecated; delete after migration.

### 7.4 UI surface list (delivery scope)

1. **Roster Workspace (core)** — date selection, dual-mode grid, auto-arrange, **day-column swap**, save, export  
2. **New roster light dialog** — name + initial dates (not a three-step wizard)  
3. **Team settings** — workers, posts, eligibility, priority, affinity, max assign per roster  
4. **Import offs** — paste or upload xlsx  
5. **Solver result / conflict panel**  
6. **Auth & account** — restyle is enough  
7. **Empty states / first-run** — no team / no workers / no posts → guide to settings (never dump into a broken arrange)

### 7.5 Visual design deliverables (“polished” acceptance)

- Design tokens doc (color, type scale, spacing, **day column** width)
- Desktop workspace mocks (off mode + assign mode + day column selected / swap)
- Motion notes (solver done, day swap, save)
- Light + dark both usable (rosters often edited at night)
- A11y: focus rings, contrast, full keyboard paths (including day-header focus)

Acceptance questions: with the logo removed, does the first screen still clearly read as a **roster product** rather than a generic dashboard? Is the grid the absolute hero? Can users see how to grab a **whole day**?

---

## 8. UX writing & density

- Primary CTA copy: **“Auto-arrange”** — not “Confirm” / “Submit.”
- Day ops: **“Swap days”**, **“Clear day”** — short and concrete.
- Prefer fewer blocking dialogs; use inline confirm (second click on toolbar) or toast undo (especially after day swap).
- Errors: full sentence + next step (e.g. “Not enough eligible workers to cover 3 posts — add eligibility or reduce offs.”).
- Success: light toast; the real result is the grid updating.

---

## 9. Phased delivery

Do not open the next phase to external users until the current phase **exit criteria** pass. Create and edit share one Workspace from Phase 1 onward — every phase that touches the grid includes an **edit regression** path (open saved roster → change → save → reload).

### 9.0 Shared test layers

| Layer | Use for |
|-------|---------|
| Unit | Day-swap pure functions, off-matrix helpers, undo stack, status→UI mapping |
| Contract | sch arrange / modify response shape (`status`; never treat bare `[]` as success) |
| Integration | Prisma save / load; draft persist |
| E2E / scripted manual | Workspace happy path; keyboard; day swap; edit existing |
| UX trial | Real users: time and willingness vs Excel / old wizard |

**Phase 0 test skeleton (recommended):**

| Side | Tool | First tests |
|------|------|-------------|
| `frontend/web` | Vitest (+ zod fixtures) | Parse `OPTIMAL` → grid data; parse `INFEASIBLE` / transport error → typed failure (not empty success) |
| `backend/sch` | pytest | Non-optimal solve returns structured `status`, not `[]`; optimal still returns posts |

Do **not** add Playwright / full E2E in Phase 0 (no Workspace yet). Wire `yarn test` / `pytest` into scripts so later phases have a place to land.

### 9.1 Cross-phase expectations (user value)

| Phase | What users get | Vs Excel |
|-------|----------------|----------|
| 0 | Trustworthy solver status + visual tokens foundation | — |
| 1 | Build / edit / save / export in one workspace | Start winning on create + offs |
| 2 | Whole-day pattern switch | Clear win on moving a day’s pattern |
| 3 | Prefs + import + explainability | Less “black box” |
| 4 | Feel fast and polished | Willing to stay in-product long-term |

---

### Phase 0 — Foundations (first)

**Deliverables**

- Structured solver status on arrange / modify (kill false-success empty sheets); **breaking API, no backward compat**
- Return **`OPTIMAL` | `FEASIBLE` | `INFEASIBLE`** (and transport/engine errors as typed failure) — FEASIBLE = usable approximate; UI must label it, never treat as silent empty success
- Design tokens applied in-place (`globals.css` + existing shell) — no parallel unused design-system tree
- Test skeleton: Vitest (web) + pytest (sch) with contract coverage for status

**Not in Phase 0**

- No `RosterTimeslot.name` → `date` migration (locked — see §5.1)
- No full Roster Workspace / off matrix / day swap

**Expectations**

- Engineering: client never celebrates `INFEASIBLE` / errors as success; empty `posts` without failure `status` is invalid; `FEASIBLE` shows grid **with** an approximate warning
- User-facing: existing wizard/edit may only get clearer failure messaging + token/shell refresh — no promise of new editor UX yet

**Design token strategy (avoid dead code)**

- **Do:** rewrite CSS variables in `app/globals.css` (and `@theme`) to the new palette / type; point existing private layout / shell at them in the **same** change set
- **Do:** delete unused token names / dead animations / unused font CSS vars when nothing references them
- **Don’t:** scaffold an empty `design-system/` with unused Button/Overlay wrappers “for later”
- **Don’t:** keep old + new token systems side by side
- New headless / custom components arrive when a Phase 1+ screen needs them — not as orphan files

**Test plan**

- Contract: mock `INFEASIBLE` and transport errors → failure UI / typed error (no empty “success” grid)
- Regression: `OPTIMAL` arrange still fills the grid
- Skeleton scripts run green in CI or local `yarn test` / `pytest`

**Exit criteria**

- [ ] False-success empty sheet count = 0 in automated + manual checks
- [ ] sch and web agree on structured `{ status, posts?, meta? }` in the same release (breaking OK)
- [ ] No orphan unused design-token / design-system files introduced by this phase
- [ ] Vitest + pytest skeletons exist with at least the contract cases above

**Out of scope until later**

- Off matrix, day swap, affinity UI, import, editor visual polish beyond tokens/shell

---

### Phase 1 — Roster Workspace MVP

**Deliverables**

- Date pick + Off matrix
- Auto-arrange + keyboard cell tweak (arrows / Enter)
- Save + XLSX export
- Draft auto-save
- Unified Workspace for **create and edit** (deprecate split list → `/roster/edit` mental model)

**Expectations**

- User: ≤ 3 clear actions from “new roster” to editable grid (pick dates, mark offs, arrange)
- User: open an **existing** roster in the same Workspace; rename, edit cells / offs, save, reload — data sticks
- Product: already **beats the old wizard**; ready for external trials
- Eng: draft survives refresh / tab close within the agreed retention window

**Test plan**

- E2E create: pick dates → offs → arrange → edit one cell → save → reopen
- E2E **edit regression**: open saved roster → change off → optional modify / manual cell → save → reload matches
- Draft: edit → hard refresh → draft restored
- Keyboard: arrow move, Enter open picker, Esc close; complete at least one reassignment without mouse
- Export: open XLSX; dates + worker names correct
- UX trial (5–10 people): time to build a ~7-day roster vs old wizard and vs Excel offs+fill

**Exit criteria**

- [ ] Create happy path and edit regression both green
- [ ] Draft / false-success incidents = 0 in trial
- [ ] Majority of trial users say create flow is faster than old wizard
- [ ] Keyboard-only single-cell reassignment works

**Out of scope until later**

- Day-column swap, affinity / priority UI, import, conflict explain depth, motion polish

---

### Phase 2 — Day-column batch ops

**Deliverables**

- Select day column; swap two days (assignments + offs per §11); clear day; Undo as **one** step
- Post-swap validation + optional “re-arrange to fix”
- Copy day pattern (optional)

**Expectations**

- User: moving a whole day’s pattern is faster than editing cell-by-cell
- User: conflicts after swap are visible; no silent invalid assign-on-off
- Eng: swap is client/persist-first; sch `modify` only when user chooses fix / re-arrange

**Test plan**

- Unit: after A↔B swap, every post’s workers exchanged; offs follow agreed rule
- Case: swap creates assign-on-off → warn (or block); never silent bad save
- Undo: swap → Undo → bit-identical to pre-swap working state
- E2E: swap → save → reload consistent
- Optional: copy day pattern A → B + validation
- Edit regression: day swap on an existing saved roster, save, reload

**Exit criteria**

- [ ] Swap / Undo property tests green
- [ ] Manual “swap two days” preferred over per-cell rebuild in smoke UX check
- [ ] Conflict after swap always surfaced

**Out of scope until later**

- Affinity UI, import, rectangular paste, heavy motion

---

### Phase 3 — Trust & preferences

**Deliverables**

- Affinity / priority UI
- Stronger conflict explanation (hints when sch provides them)
- Import offs / import roster seed
- Diff / restore auto result
- Expose `maxWorkerAssignPerRoster`

**Expectations**

- User: can see and edit preferences that README already promised
- User: import offs without silent misalignment; can restore auto result after manual edits
- Eng: preference changes persist and are visible on next arrange / modify input path
- User: infeasible still fails clearly when hints absent

**Test plan**

- Change priority / affinity / max assign → persist → next arrange uses updated data (assert DB or request payload)
- Import fixture XLSX → off matrix matches expected cells
- Diff: after manual edits, “Show changes”; “Restore auto” returns to `initialRoster`
- sch hints present → shown in UI; absent → still explicit failure (no empty success)
- Edit regression: prefs change mid-edit of existing roster does not corrupt grid without user action

**Exit criteria**

- [ ] Trial users can name at least one preference they changed and why it matters
- [ ] Offs import: no silent row/column shift on fixture set
- [ ] Restore auto verified in E2E
- [ ] `maxWorkerAssignPerRoster` editable in team settings

**Out of scope until later**

- Perf hardening for huge grids, motion system, empty-state copy polish (light empty states OK)

---

### Phase 4 — Polish

**Deliverables**

- Rectangular paste, stronger Undo, motion, empty-state guidance, perf (large teams / many dates)

**Expectations**

- User: first-run never dumped into a broken arrange (no team / workers / posts)
- User: large roster remains usable; paste feels spreadsheet-like
- Design: grid remains hero; light + dark; day-column affordance obvious

**Test plan**

- Perf budget: e.g. ~30 workers × ~31 days — interaction latency / scroll acceptable (set numeric budget in implementation)
- Rectangular paste range correct; Undo stack covers paste + prior day swap
- Empty states: no team / no workers / no posts → settings guidance only
- Visual QA against §7.5 and §13 (brand / grid hero)

**Exit criteria**

- [ ] Perf budget met on agreed fixture
- [ ] Empty-state paths never call arrange unsuccessfully by accident
- [ ] §13 frontend acceptance checklist complete
- [ ] Visual QA signed off light + dark

**Out of scope**

- Multi-shift, mobile-first editor, realtime collab, HRIS (see §1.3)

---

### 9.2 Edit path (explicit)

From Phase 1, “edit roster enhancement” is **not** a separate app — it is the Workspace loaded with an existing `rosterId`. Minimum edit regression every relevant phase:

1. Open saved roster  
2. Edit name and/or offs and/or cells (and day swap from Phase 2+)  
3. Auto-modify / re-arrange only when user opts in; must use **working** grid + offs as input to `modify`, not a stale DB snapshot that ignores unsaved cell edits  
4. Save → reload → matches  
5. Draft behavior consistent with create  

---


## 10. Migration notes

- Existing Roster timeslots keep `name` as-is (no date parse migration).
- Old bookmarks `/roster/auto-new/[teamId]` → redirect to new Workspace + `?teamId=` (Phase 1+).
- Seed / demo data: multi-day roster story that demos **day swap** (Phase 2).
- Not in production: breaking sch response shape OK; ship web + `backend/sch` in lockstep; **no backward compat** for empty-array failures.

---

## 11. Risks & open decisions

| Decision | Options | Recommendation |
|----------|---------|----------------|
| What does “swap days” move? | Assignments only vs assignments + offs | **Both** — keep off attached to the day column content being swapped; then validate |
| Fixed date headers vs moving dates | Content swap under fixed dates vs swap the date identity | **Content swap under fixed date labels** |
| Swap with conflict | Block / warn / auto modify | Warn + offer “Re-arrange to fix” |
| Quick date presets (“next 7 days”) | Offer / omit | Offer as convenience |
| Show FEASIBLE to users? | OPTIMAL only vs approximate | **Approximate + label** (Phase 0 returns FEASIBLE) |
| Day vs timeslot column copy | User “day” vs domain “timeslot” | **Locked: UI 日欄 this round; code/API/store = timeslot column** |
| Keep cell drag-and-drop? | Yes / no | Keep as secondary; day-header swap is primary batch gesture |
| UI kit | Custom vs new package | Custom grid; forms can use headless |
| English i18n this round? | Yes / no | zh-Hant-HK only first is fine |
| Timeslot DB shape | `name` vs `date` column | **Keep `name`** — not date-bound forever (§5.1) |
| sch API compat | Compat shim vs break | **Break** — structured status only; no empty-array failure |

---

## 12. Backend change checklist (for `sch` / API)

- [ ] Arrange / Modify responses include `status`; never use empty array for failure
- [ ] Timeslot keys remain opaque `name` strings (no forced ISO date)
- [ ] Document modify preserve semantics for full (or scoped) roster after client-side day swap
- [ ] Keep / document `maxWorkerAssignPerRoster`
- [ ] (Optional) FEASIBLE returns, infeasible hints, solve duration; optional scoped re-solve
- [ ] Agree `status` / error code table with frontend

Frontend adapts in the **same** release; **false-success empty sheets must die together with sch.**

---

## 13. Frontend acceptance checklist

Final ship bar (all phases). Use **§9 exit criteria** as per-phase gates before this full list.

- [ ] New roster reaches editable grid in ≤ 3 clear actions (pick dates, mark offs, arrange)
- [ ] Edit existing roster in same Workspace (name / offs / cells / save / reload) — see §9.2
- [ ] Off matrix for ~10 workers × N days is not slower than Excel checking
- [ ] Grid can reassign workers keyboard-only
- [ ] Day ops: select column, swap two days, undo swap, clear day
- [ ] After swap, conflicts are visible; false success never shown for infeasible arrange
- [ ] `modify` / re-arrange uses working grid + offs (not stale saved snapshot ignoring unsaved edits)
- [ ] Draft survives leave and return
- [ ] Export includes dates and workers; at least offs import works
- [ ] Visual: Workspace passes brand / grid-hero check; day-column affordance obvious; light + dark usable

---

## 14. Summary

This revamp is not “add buttons on the old three-step wizard.”

1. Make the **day / timeslot column** the batch unit (select, swap, clear) under fixed column identities (near-term: calendar days in the UI; storage stays opaque `name`).
2. Build a **shell** better suited than Excel for offs + constraints + re-arrange + day switch.
3. Surface the **core** (OR-Tools) status and preferences; kill empty-array false success.
4. Allow a full **visual** redo — professional, quiet, grid-first — not tied to shadcn; tokens applied in-place (no orphan DS code).
5. Ship by phase gates (§9): test layers, expectations, exit criteria — create and edit share one Workspace.

Priority order: **failure semantics (+ tokens / test skeleton) → Roster Workspace + off matrix → day-column swap → prefs UI / import → visual polish.**
