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

**Locked:** Create and edit are **separate routes** (shared store / grid / offs engine — not one mixed page). `/roster` = roster home (default **view**, enter **edit** to mutate); `/roster/new` = create-only (always edit). (Not a separate `/app`.)

```
/login, /sign-up, …          # auth (keep logic, restyle)
/roster                      # Roster Workspace (team + switcher; view by default, edit on demand)
/roster/new                  # Create Workspace (team + guided empty → arrange → first Save)
  ├─ Team settings (workers / posts / prefs / caps)
  └─ Account settings
```

**Drop** `auto-new/**` and `edit/**` routes in Phase 1 (delete, not long-lived redirect-only). Legacy `?rosterId=new` redirects to `/roster/new`.

| Region | Create (`/roster/new`) | Roster home (`/roster`) |
|--------|------------------------|------------------|
| Top bar | Back to list, team | Team, roster switcher, delete, “新建” → `/roster/new` |
| Interaction | Always edit | **View** default: off / assign grids + export + “編輯”. **Edit**: name, dates, arrange / 再排, Save, Undo, “取消編輯” |
| Date bar | Selected dates; add / remove | Edit only (hidden in view) |
| Toolbar | Off / assign, **Auto-arrange** (primary), Save → replace to `/roster` | View: export. Edit: **再排**, Save (success → back to view), Undo |
| Main | Day grid or Off matrix + step guidance | Day grid or Off matrix (read-only in view) |
| Bottom / side | Solver status | Solver status, assign-on-off conflict notes |

Working state lives **in memory** until explicit **Save** writes the DB (see §5.4). Refresh / leave discards unsaved work. First successful Save on create inserts then navigates to `/roster` (**view**).

### 4.2 Primary happy path (new roster)

1. Pick team → “New roster” opens `/roster/new` → name (editable).
2. Pick dates (multi calendar).
3. Switch to **Off** mode → Worker × date matrix (click / keyboard toggle — see phase split below).
4. Hit **Auto-arrange** (primary CTA — not buried in dialog chains).
5. Solver returns: grid filled; diffs highlighted; side panel briefly “balanced load / respected offs.”
6. Keyboard cell tweaks; **swap whole day columns** when the pattern should move (Phase 2).
7. **Save** inserts DB row → land on `/roster` in **view**; export XLSX from view or edit (or after arrange on create).

**Off entry phase split (locked):**

| Capability | Phase |
|------------|-------|
| Off matrix (worker × date), click + keyboard `Y`/`N`/Space | **Phase 1** |
| Ctrl+V / rectangular paste offs; XLSX offs import | **Out of scope** (no product intent this revamp) |

Vs old flow: two fewer forced step pages, fewer confirms, off-entry effort drops sharply; day-level ops remove “rebuild the day by hand.”

### 4.3 Day-column switch — operation spec

| Action | Behavior |
|--------|----------|
| Select day | Click column header; entire day highlighted |
| Swap days A ↔ B | All post assignments for A and B exchange. Offs for A and B also exchange with the columns (off stays attached to the shifted pattern). After swap, run eligibility / off validation; **warn** on assign-on-off (Save still allowed); offer “Re-arrange to fix”. |
| Swap then re-arrange (optional) | After swap, user can run `modify` to fix conflicts while preserving as much as possible |
| Move / reorder | **Day-header drag-and-drop.** Columns stay **date-sorted** (labels fixed). Drop header A onto B = **direct content swap** A↔B (assignments + offs; not bubble through neighbors). Same validation as swap. |
| Clear day | Clear **assignments only** for selected day: every post’s worker on that timeslot → empty. Offs for that day are **kept** (see §11 if changed). |
| Copy day pattern | **Out of Phase 2** — defer |

**Important semantic choice (see §11):**  
Prefer **content swap on fixed date headers** (date 10/27 and 10/28 stay labeled; who works which post swaps) — matches “switch day shifts,” not “rename days.”  
**Gesture (locked):** day-header **drag-and-drop** is primary for swap / reorder (not click-A-then-B toolbar).

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

### 5.4 Working state (**locked** — no localStorage draft)

- **No** `Roster.status` / DB draft row. **No** localStorage working draft (create or edit).
- Working grid / offs / name / dates live **in memory** only until explicit **Save** writes the DB.
- **Create (`/roster/new`):** always brand-new empty workspace. Refresh / leave = lose unsaved work (expected). No DB row until first successful Save (insert) → navigate to `/roster` in view.
- **Roster home (`/roster`):** open saved roster in **view** (read-only grids). **編輯** unlocks mutations. **儲存** success → stay on page in **view**. **取消編輯** always confirms, then discards in-memory changes (`hydrateFromServer`) and returns to view.
- **Create leave:** **返回列表** (and team switch on create) always confirms; discard = navigate away (no restore).
- No `dirty` flag — cancel / leave always asks confirm.
- `Roster.updatedAt` (Timestamptz; bump on every successful Save) remains for audit / future concurrency — **not** for local-vs-server draft conflict prompts (removed).

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
| **Expose / clarify `maxWorkerAssignPerRoster`** | Team-scoped field; show in team UI. `null` = unlimited (no hard cap in sch). |
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
3. **Team settings** — workers, posts, eligibility, **ranked priority**, affinity, max assign per roster  
4. ~~**Import offs**~~ — **out of scope** this revamp  
5. **Solver status** — structured OPTIMAL / FEASIBLE / INFEASIBLE (deep hints UI out of scope)  
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

Do not open the next phase to external users until the current phase **exit criteria** pass. Create and edit share one **engine** (store / grid / offs) from Phase 1 onward, on **separate routes** — every phase that touches the grid includes an **edit regression** path (open saved roster → enter edit → change → save → reload).

### 9.0 Shared test layers

| Layer | Use for |
|-------|---------|
| Unit | Day-swap pure functions, off-matrix helpers, undo stack, status→UI mapping, view/edit interaction |
| Contract | sch arrange / modify response shape (`status`; never treat bare `[]` as success) |
| Integration | Prisma save / load |
| E2E / scripted manual | Workspace happy path; keyboard; day swap; view → edit → save → view; cancel edit discards |
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

- `/roster` = roster Workspace (**view** default; enter **edit** to mutate); `/roster/new` = create Workspace (shared engine, separate chrome; always edit)
- Date pick + Off matrix (click + keyboard toggle; **no** paste/import yet) — date bar only while editing / creating
- **Auto-arrange** (create) + **再排 / Auto-modify** (edit — uses **working** grid + offs, not stale DB snapshot)
- Keyboard cell tweak (arrows / Enter / Esc / Tab) in edit
- Explicit Save + XLSX export (Save = only DB write; create inserts on first Save then replace to `/roster` view; edit Save success → view)
- **Cancel edit** discards in-memory changes and returns to view
- **No** localStorage draft / conflict prompt
- Zustand workspace store
- **Delete** unused `auto-new/**` and `edit/**` routes (and dead wizard components)

**Expectations**

- User: ≤ 3 clear actions from “new roster” to editable grid (pick dates, mark offs, arrange)
- User: open an **existing** roster on `/roster` in **view**; enter edit → rename / cells / offs / **再排** → save → back to view; reload matches DB; create never mixed into roster-home chrome
- Product: already **beats the old wizard**; ready for external trials
- Eng: unsaved work is memory-only (refresh loses it); Save is the only persist-to-DB path; create always starts blank

**Test plan**

- E2E create: pick dates → offs → arrange → edit one cell → save → reopen from DB in view
- E2E **edit regression**: open saved roster (view) → 編輯 → change off → **再排** and/or manual cell → save → view → reload matches
- Cancel: enter edit → change → 取消編輯 → confirm → grids match server again
- Hard refresh mid-edit: unsaved changes gone (expected); create refresh = blank sheet
- Keyboard: arrow move, Enter open picker, Esc close; complete at least one reassignment without mouse
- Export: open XLSX; dates + worker names correct
- UX trial (5–10 people): time to build a ~7-day roster vs old wizard and vs Excel offs+fill

**Exit criteria**

- [ ] Create happy path and edit regression both green
- [ ] View / edit distinction clear; false-success incidents = 0 in trial
- [ ] Majority of trial users say create flow is faster than old wizard
- [ ] Keyboard-only single-cell reassignment works
- [ ] `auto-new` / `edit` routes gone; create = `/roster/new`, roster home = `/roster`

**Out of scope until later**

- Day-column swap (Phase 2), affinity / ranked priority / max-assign UI (Phase 3), motion polish

---

### Phase 2 — Day-column batch ops

**Deliverables**

- Finish Phase 1 cleanup if still open: **delete** unused `auto-new/**` and `edit/**` routes + dead wizard code
- Select day column; **drag-and-drop** day headers → **direct content swap** drop target (assignments + offs; fixed date labels per §11) — not bubble reorder
- Clear day (assignments only; offs kept)
- Undo stack covers **day ops only** (swap / clear) — each as **one** undo step; cell/off edits not on this stack
- Post-swap validation: **warn** on assign-on-off (Save still allowed) + optional “re-arrange to fix”
- **No** copy day pattern this phase

**Expectations**

- User: moving a whole day’s pattern via header drag is faster than editing cell-by-cell
- User: conflicts after swap/reorder are visible; no silent invalid assign-on-off
- Eng: swap/reorder is client/persist-first; sch `modify` only when user chooses fix / re-arrange

**Test plan**

- Unit: after A↔B swap, every post’s workers exchanged; offs follow agreed rule
- Unit: drag A onto C under fixed dates = direct A↔C content swap (B untouched); date labels unchanged
- Case: swap creates assign-on-off → warn; Save still succeeds; never silent bad UI
- Undo: swap / clear → Undo → bit-identical to pre-op working state
- E2E: swap → save → reload consistent
- Edit regression: day swap on an existing saved roster, save, reload
- Routes: `auto-new` / `edit` gone (or one-shot redirect removed)

**Exit criteria**

- [x] Swap / clear + Undo property tests green
- [ ] Manual “drag day header” preferred over per-cell rebuild in smoke UX check
- [x] Conflict after swap always surfaced (warn); Save not blocked
- [x] Dead `auto-new` / `edit` code deleted

**Out of scope until later**

- Copy day pattern, bubble reorder, rectangular paste, heavy motion, Undo for cell/off edits

---

### Phase 3 — Trust & preferences

**Deliverables**

- Affinity UI in team settings (post affinity groups + worker affinity groups)
- Priority UX on post↔worker eligibility: **ranked drag list** (top = preferred; no numeric priority field)
- Expose `maxWorkerAssignPerRoster` in team info (`null` = no cap / unlimited)

**Not in this phase (explicitly dropped)**

- Import offs / import roster seed / Ctrl+V rectangular paste / XLSX offs import
- Diff / restore auto result
- Stronger conflict explanation / sch hints UI

**Expectations**

- User: can see and edit preferences that README already promised (priority, affinity, max assign)
- Eng: preference changes persist and are visible on next arrange / modify (sch reads DB)
- UX: priority feels like a preference ranking (staffing / bid-list pattern), not a raw integer

**Test plan**

- Change priority / affinity / max assign → persist → next arrange uses updated data (assert DB)
- Drag reorder on a post’s eligible workers → saved `PostWorker.priority` order matches list (top highest)
- Affinity CRUD: create / edit members / delete; next arrange still succeeds
- Edit regression: prefs change mid-edit of existing roster does not corrupt grid without user action

**Exit criteria**

- [ ] Trial users can name at least one preference they changed and why it matters
- [ ] `maxWorkerAssignPerRoster` editable in team settings (`null` = unlimited)
- [ ] Post eligible workers editable as ranked list; affinity groups editable in team settings

**Out of scope until later**

- Perf hardening for huge grids, motion system, empty-state copy polish (light empty states OK)
- Offs paste / XLSX import, Diff / restore, sch hints UI

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

From Phase 1, “edit roster enhancement” is **not** a separate app — it is `/roster` loaded with an existing `rosterId` (create stays on `/roster/new`). Minimum edit regression every relevant phase:

1. Open saved roster (**view**)  
2. Enter **edit** → change name and/or offs and/or cells (and day swap from Phase 2+)  
3. Auto-modify / re-arrange only when user opts in; must use **working** grid + offs as input to `modify`, not a stale DB snapshot that ignores unsaved cell edits  
4. Save → return to **view** → reload → matches  
5. Cancel edit discards unsaved memory state; create has no draft restore  

---


## 10. Migration notes

- Existing Roster timeslots keep `name` as-is (no date parse migration).
- Phase 1: **no** `Roster.status`; **no** localStorage working draft (create or edit).
- Phase 1: add `Roster.updatedAt` (backfill `createdAt` or `now()`); bump on every Save (audit / future concurrency — not draft conflict).
- Phase 1: **delete** `app/(private)/roster/auto-new/**` and `edit/**` (optional short-lived redirect to `/roster?teamId=` only if needed during cutover).
- Seed / demo data: multi-day roster story that demos **day swap** (Phase 2).
- Not in production: breaking sch response shape OK; ship web + `backend/sch` in lockstep; **no backward compat** for empty-array failures.

---

## 11. Risks & open decisions

| Decision | Options | Recommendation |
|----------|---------|----------------|
| What does “swap days” move? | Assignments only vs assignments + offs | **Both** — keep off attached to the day column content being swapped; then validate |
| Fixed date headers vs moving dates | Content swap under fixed dates vs swap the date identity | **Content swap under fixed date labels** |
| Swap with conflict | Block / warn / auto modify | **Locked: warn + offer “Re-arrange to fix”; Save still allowed** |
| Clear day vs offs | Clear assignments only vs clear offs too | **Locked: assignments only; offs kept** |
| Day-header gesture | Click-A-then-B / toolbar / drag | **Locked: day-header drag-and-drop** (swap + reorder) |
| Day-header drag drop | Bubble path vs direct swap vs free column order | **Locked: date-sorted labels fixed; drop A on B = direct content swap A↔B** |
| Copy day pattern | Phase 2 / later | **Locked: out of Phase 2** (later) |
| Undo scope (Phase 2) | All edits vs day ops only | **Locked: day ops only** (swap / clear); no cell/off undo yet |
| Quick date presets (“next 7 days”) | Offer / omit | **Locked: omit** (calendar multi-select only) |
| Show FEASIBLE to users? | OPTIMAL only vs approximate | **Approximate + label** (Phase 0 returns FEASIBLE) |
| Day vs timeslot column copy | User “day” vs domain “timeslot” | **Locked: UI 日欄 this round; code/API/store = timeslot column** |
| Keep cell drag-and-drop? | Yes / no | **Done (secondary):** cell DnD swaps workers; day-header drag remains primary batch gesture |
| UI kit | Custom vs new package | Custom grid; forms can use headless |
| English i18n this round? | Yes / no | zh-Hant-HK only first is fine |
| Timeslot DB shape | `name` vs `date` column | **Keep `name`** — not date-bound forever (§5.1) |
| sch API compat | Compat shim vs break | **Break** — structured status only; no empty-array failure |
| Workspace route | `/app` vs `/roster` vs split create | **Locked: `/roster` = roster home (view default); `/roster/new` = create**; shared store/grid; delete `auto-new`/`edit` |
| View vs edit on `/roster` | Always edit vs explicit enter-edit | **Locked: view default; 編輯 / 取消編輯; Save success → view** |
| Draft storage | localStorage vs DB status vs draft table vs memory-only | **Locked: memory-only until Save**; no localStorage draft; create always blank |
| Edit local vs server conflict | Silent / always local / always server / prompt | **Locked: N/A** — no local draft; cancel reloads server snapshot in memory |
| `Roster.updatedAt` | Skip / for draft conflict / audit | **Locked: keep**; bump on Save; not used for draft conflict prompts |
| Off paste / import | Phase 1 vs later | **Locked: Phase 1 = matrix+keyboard only; paste/XLSX import = out of scope this revamp** |
| Phase 3 prefs scope | Full trust layer vs prefs only | **Locked: affinity + ranked priority + max assign only; no import / diff / hints** |
| Workspace client store | Zustand vs other | **Locked: Zustand** |
| Auto-modify / 再排 | Which phase? | **Locked: Phase 1** (edit path toolbar); post-swap “fix with solver” = Phase 2 |

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
- [ ] Edit existing roster on `/roster` (view → edit → name / offs / cells / save → view → reload); create on `/roster/new` — see §9.2
- [ ] Off matrix for ~10 workers × N days is not slower than Excel checking
- [ ] Grid can reassign workers keyboard-only
- [ ] Day ops: select column, swap two days, undo swap, clear day
- [ ] After swap, conflicts are visible; false success never shown for infeasible arrange
- [ ] `modify` / re-arrange uses working grid + offs (not stale saved snapshot ignoring unsaved edits)
- [ ] Unsaved work is memory-only; cancel edit / leave create always confirm then discard; create refresh = blank
- [ ] Export includes dates and workers; team prefs (priority / affinity / max assign) editable
- [ ] Visual: Workspace passes brand / grid-hero check; day-column affordance obvious; light + dark usable

---

## 14. Summary

This revamp is not “add buttons on the old three-step wizard.”

1. Make the **day / timeslot column** the batch unit (select, swap, clear) under fixed column identities (near-term: calendar days in the UI; storage stays opaque `name`).
2. Build a **shell** better suited than Excel for offs + constraints + re-arrange + day switch.
3. Surface the **core** (OR-Tools) status and preferences; kill empty-array false success.
4. Allow a full **visual** redo — professional, quiet, grid-first — not tied to shadcn; tokens applied in-place (no orphan DS code).
5. Ship by phase gates (§9): test layers, expectations, exit criteria — create and edit share one engine, **separate pages**.

Priority order: **failure semantics (+ tokens / test skeleton) → Roster Workspace + off matrix → day-column swap → prefs UI (affinity / ranked priority / max assign) → visual polish.**
