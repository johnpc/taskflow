# Taskflow

**Taskflow is a fast, focused project & task manager** — an Asana-style workspace where you plan work
on a board, work through it in a list, and always know what's next. Projects hold sections (columns);
sections hold tasks; tasks have priorities, due dates, subtasks, and comments. My Tasks aggregates
everything open across projects by due date; Search finds any task instantly.

Architecture, quality bar, and toolchain descend from the **spork** app (`~/repo/spork`) via the
`new-ionic-app` runbook — when a pattern is unclear here, spork is the reference implementation.

## How we work together (read this first)

The person directing you may be **non-technical** — an "idea guy" who owns the **product**. They
define **WHAT**: features, intent, and Gherkin acceptance scenarios. **You own the HOW**:
architecture, code quality, testing, and every technical decision below.

- **Never ask them to make a technical call.** Don't surface coverage numbers, CRAP, lint,
  file-length, library choices, or schema design as questions. Decide them yourself, silently.
- **Translate vague ideas into Gherkin.** When they describe a feature, propose concrete `.feature`
  scenarios (Given/When/Then) and confirm those — that's the spec you build to.
- **Only escalate genuine _product_ questions** — ambiguous behavior, scope, copy, what a screen
  should do. Everything technical is yours. (The one product call already made: the app **name** and
  App Store product name/SKU — those are permanent and public.)

## Workflow: specs-first vertical slices

Every feature ships as one **thin vertical slice** — UI + hook + API + backend model + tests, just
enough for the scenario, nothing speculative.

1. **Spec first.** Write/confirm Gherkin scenarios in `e2e/features/<slice>/*.feature`, steps in
   `e2e/steps/`.
2. **Scaffold backend only as the slice needs it** — add Amplify models + seed in `amplify/` for
   exactly this slice's read patterns; don't model ahead of a UI.
3. **Implement to pass the spec** — follow the architecture and file conventions below.
4. **Run the full quality gate** (`npm run quality`) and get it green locally.
5. **Deploy + seed** the backend if it changed (`npx ampx sandbox`, `npm run seed`).
6. **Conventional commit, push, CI green.** Open a PR; CI blocks the merge.

### PR titles (what shipped, not the backstory)

The **title** names the feature added, bug fixed, or behavior changed — plainly, as a
conventional-commit line: `type(scope): what changed`. All context — phase, rationale, issues
closed — belongs in the **description**, never the title. No dev narrative, no issue-number soup
(`Closes #N` in the body).

Good: `feat(board): drag a task between columns` · `fix(mytasks): count overdue tasks due today separately`

### PR demo artifacts (screenshot or video of the new feature)

When a PR changes anything a user can **see or interact with**, the description MUST include a
screenshot or short video, generated from the slice's own Gherkin test (Playwright records `.webm`
with `VIDEO=1`; or `page.screenshot`). Upload to `files.jpc.io` and paste the permanent `/d/` URL —
`.webm`/`.mp4`/`.png`/`.gif` render inline in the PR body. A `curl -I` returning a 307 is expected
(it re-signs S3 per render); the `/d/` link never expires. All `aws` calls use `AWS_PROFILE=personal`.

```bash
FILE_PATH="test-results/<…>/video.webm"
FILENAME=$(basename "$FILE_PATH")
HASH=$(LC_ALL=C tr -dc 'A-Za-z0-9' < /dev/urandom | head -c 5)
AWS_PROFILE=personal aws s3 cp "$FILE_PATH" \
  "s3://amplify-d1wnjkkkrwiiql-mai-imagehostbucketaac3bfe7-aark0f5h8nw8/public/public/${HASH}-${FILENAME}" \
  --region us-west-2
echo "https://files.jpc.io/d/${HASH}-${FILENAME}"   # PERMANENT — the 307 on curl -I is expected
```

## Stack

- **Client:** Ionic 8 + React 19 + TypeScript (strict), Vite, Capacitor (iOS + Android).
- **Backend:** AWS Amplify Gen2 — Cognito auth + AppSync (GraphQL) + DynamoDB. Lives in `amplify/`.
- **Server state:** react-query wrapping the Amplify data client. **Client state:** Context + hooks.

## The core structure — account-based, per-project sharing

Taskflow is **account-based with per-project sharing** (Asana-style). A project can be shared with
other people by email; each project-scoped record carries a `members` list of everyone with access.

- **`Project`** — a board/list of work (name, color, view, favorite, archived).
- **`Section`** — a named column/group within a project, ordered by sortOrder.
- **`Task`** — the unit of work: title, notes, status, priority, dueDate, assignee, ordered within
  its section. **Subtasks self-reference** the parent via `parentTaskId`.
- **`Comment`** — an activity/discussion entry on a task.
- **`Label`** — a reusable colored tag; a task carries denormalized `labelIds[]`.

The board read is a single per-project GSI query (sections + tasks), grouped into columns
client-side. My Tasks + Search reuse a single "all my tasks" fetch.

### Amplify auth contract (this is where Taskflow diverges from spork)

**Taskflow is account-based, NOT guest-first, with per-project sharing.** A task manager needs a
signed-in identity to own projects and sync across devices, so:

- **Project-scoped models use `allow.ownersDefinedIn('members').identityClaim('email')`** (userPool):
  every email in a record's `members` array has full read/write. `Project/Section/Task/Comment/
Attachment` all carry `members`; creating a record sets it (creator on a new project; a copy of the
  project's/task's members for children — see `src/features/auth/members.ts`). `Label` stays a
  personal `allow.owner()` registry. There is **no guest/`identityPool` read path**.
- The data client (`src/lib/dataClient.ts`) fixes **`authMode: 'userPool'`**.
- Every workspace route is wrapped in **`RequireAuth`** (redirects signed-out visitors to `/welcome`).
- The seed signs in as the test user; every seeded record lists that user in `members` (via
  `seedMembers()`), or the signed-in seed user couldn't read back its own writes.

A request is authorized only when the **client authMode** and the model's **`allow.*` rule** name the
same provider (userPool ↔ owner). A mismatch returns empty results, not a loud error.

### Code organization (vertical slices)

Features live under `src/features/<feature>/`; tests are colocated. File conventions:

- **`useX.ts`** — hooks hold all logic/orchestration; client state via Context + Hook + Provider.
- **`xApi.ts`** — all server state through react-query wrapping the Amplify client. No fetches in
  components.
- **`X.tsx`** — components only render.
- **`x.ts`** helpers — pure functions for non-trivial logic (unit-testable, keeps files short). Pure
  helpers take **injected time** (`today`/`now`), never bare `Date.now()` — the one impure clock read
  lives in `src/features/task/today.ts`.
- **`X.css`** — consume `--tf-*` design tokens / role classes from `src/theme/variables.css`.

## Design

- **Style only via design tokens.** Consume the `--tf-*` CSS variables and role classes
  (`.tf-heading`, `.tf-kicker`, `.tf-muted`) from `src/theme/variables.css` — **never hardcoded
  hex/px** in feature CSS.
- **Dark mode follows the OS AND an in-app override.** The dark palette applies under
  `@media (prefers-color-scheme: dark)` (System) or `html[data-theme='dark']` (explicit, from
  Settings); `data-theme='light'` forces light. Persisted in localStorage via `settings/themeStore`.
- **Safe-area insets** are hardened in `variables.css` (`viewport-fit=cover` in index.html) so the
  toolbar clears the notch and the tab bar clears the home bar.

### LLM feedback panel (`npm run panel`)

A panel of **different vendors' vision LLMs** (Anthropic Claude, Amazon Nova, Meta Llama 4, Mistral
Pixtral — all via **Bedrock Converse**, `AWS_PROFILE=personal`, us-west-2) each drive a **real
Playwright browser** (screenshot → choose one action → execute, agentic loop) to organize a project
for a scenario, then answer a structured feedback questionnaire. The output is a synthesized
`report.md` (delight/clarity scores + improvement themes ranked by how many panelists raised them) —
a cheap, reproducible way to get outside-eyes UX feedback to act on. Lives in `scripts/llm-panel/`
(exempt from the line/CRAP gate — it's a `scripts/` harness, not `src`/`amplify`).

```bash
npm run dev -- --port 5173                 # (or point at a deployed URL)
AWS_PROFILE=personal npm run panel         # default: wedding scenario, all 4 panelists
PANEL_SCENARIO=trip PANEL_ONLY=claude,nova npm run panel   # subset + other scenario
PANEL_BASE=https://taskflow.example npm run panel          # target a live deployment
```

Env: `TEST_USERNAME`/`TEST_PASSWORD` (from `.env.local`) to sign in; `AWS_PROFILE=personal` for
Bedrock. Scenarios (`wedding` default, `launch`, `trip`) + the panel roster live in
`scripts/llm-panel/scenarios.mjs`. Output (transcripts, per-step screenshots, `report.md`) →
`/tmp/tf-panel/<PANEL_RUN_ID>/`. Models that need an inference profile use the region/`global.`-prefixed
id (e.g. `us.meta.llama4-…`, `global.anthropic.claude-haiku-…`) — on-demand model ids throw
`ValidationException`. **Treat low-delight findings as a backlog: the panel is the "measure vs Asana"
loop automated.**

## Quality gates (non-negotiable — CI + husky pre-commit enforce them)

Run `npm run quality` for the full set. **Enforce them yourself; when one fails, fix the code, never
the gate.** Scope covers `src/` and `amplify/` LOGIC; only declarative files are exempt
(`amplify/**/resource.ts`, `amplify/backend.ts`, `amplify/**/fixtures/**`, seed-runner entrypoints).

- **No `any`, ever.** ESLint `@typescript-eslint/no-explicit-any: error`.
- **Every `.ts`/`.tsx` logic file ≤ 100 lines** (`npm run check:lines`). Over → extract a helper.
- **≥ 80% coverage** on every logic file. Fix by writing tests — never exclusions.
- **CRAP ≤ 15 per function** (`npm run crap`).
- **Acceptance tests are always Gherkin** (`.feature` + steps), run via Playwright + playwright-bdd,
  and every `.feature` must map to a CI matrix area (`npm run check:features`).
- **Build must pass** (`npm run build`). **Format clean** (Prettier).

### Honest e2e

Every data-reading flow asserts on **rendered real (seeded) data** — e.g. the board shows the seeded
"Draft launch announcement" task in the "To do" column, and completing it flips the card to the done
state. Sign in (wait for the Cognito session — landing on `/projects` proves it) before reading data,
or the read races the session and silently passes as signed-out.

### Local e2e port

Port 5173 may be held by a sibling repo's dev server. Run acceptance tests with a dedicated port so
Playwright starts its OWN server instead of adopting a stranger's:
`TF_PORT=5178 npm run test:e2e`. CI uses the default 5173 (no collision).

## Definition of done

A slice is done only when **all** hold:

1. `npm run quality` green locally (pre-commit enforces it on commit).
2. Gherkin acceptance scenarios + colocated unit tests added and passing.
3. Backend deployed + seeded if any Amplify model changed.
4. Conventional commit, branch pushed, PR open, **CI green**.
5. PR description includes a **demo artifact** for any user-visible change.

## Commands

```bash
npm run dev            # Vite dev server (add -- --port 5178 to dodge a busy 5173)
npm run quality        # full local gate
npm run format         # Prettier write (run before committing)
npm run test:e2e       # Gherkin acceptance tests (bddgen + Playwright); TF_PORT=5178 locally
npm run seed           # seed the demo workspace (idempotent; needs .env.local creds)
npm run gen:icons      # regenerate app icons from assets/icon{,-dark}.png
npm run e2e-config     # pull amplify_outputs.json from the sandbox stack
npx ampx sandbox       # personal cloud backend sandbox
```

## Key facts

- **Repo:** `johnpc/taskflow`. **Bundle id:** `com.johncorser.taskflow`. Region `us-west-2`, AWS
  profile `personal`.
- **Sandbox stack:** `amplify-taskflow-xss-sandbox-86303460ee` (wired into `package.json` `e2e-config`).
- **Cognito test user:** `test@example.com` (see `.env.local`, git-ignored). Also GH secrets
  `TEST_USERNAME`/`TEST_PASSWORD`.
- **CI:** `.github/workflows/ci.yml` (quality + Gherkin acceptance matrix, one area per feature) blocks
  PRs. `ios-deploy.yml` / `android-deploy.yml` publish after CI on `main`. Secrets: `AWS_ACCESS_KEY_ID`,
  `AWS_SECRET_ACCESS_KEY`, `TEST_USERNAME`, `TEST_PASSWORD`, `ASC_KEY_ID`, `ASC_ISSUER_ID`,
  `ASC_KEY_CONTENT`, `TEAM_ID`.
- **Prod backend:** Amplify app id **`dbu3ty06r2jaw`** (`johnpc/taskflow`, branch `main`, region
  us-west-2), set as the repo **variable** `TASKFLOW_APP_ID`. The deploy workflows (ios/android)
  gate on that variable and now activate on merges to `main`; `prod-config.mjs` reads the id from
  `process.env.TASKFLOW_APP_ID` (defaulting to it) to pull `amplify_outputs.json` from prod. CI
  acceptance + local dev/e2e still run on the **sandbox** via `npm run e2e-config` — only the deploy
  jobs pull prod outputs.
- **iOS signing:** team `JW5SC3NYUV` (set in `project.pbxproj`); `ITSAppUsesNonExemptEncryption=false`
  in Info.plist (skips the export-compliance prompt).

## Conventions

- **Conventional commits** (`feat:`, `fix:`, `chore:`, `ci:`, `docs:` …).
- Keep logic out of view components. Throwaway scripts go in `/tmp`, not the repo.

## Decisions

Significant, hard-to-reverse choices (read before re-opening a settled question):

- **Account-based & per-project sharing, not guest-first.** A task manager needs an identity to own
  work, be assigned tasks, and sync; and real collaboration needs sharing. Project-scoped models
  authorize via `allow.ownersDefinedIn('members').identityClaim('email')` — a `members` email list per
  record, mirrored from project → sections/tasks → comments/attachments. (`Label` stays owner-scoped.)
  There's a `RequireAuth` guard + `/welcome` landing. This is the deliberate divergence from spork's
  guest-first reference. (Superseded the original single-user owner-scoped design once collaboration
  was required — the `members` cascade is the migration.)
- **Subtasks are a self-relation on Task** (`parentTaskId`), not a separate model — a subtask is just a
  task with a parent, so it reuses all task machinery (complete, priority, due date).
- **Board reads client-side-group a single per-project query.** Sections + tasks are two bounded GSI
  reads; grouping into columns is a pure helper (`taskGrouping`), not a server join.
- **Theme override via `data-theme` on `<html>`**, keyed by the same token media query — so System,
  Light, and Dark all come from one token set with no component-level branching.
