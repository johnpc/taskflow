<p align="center">
  <img src="assets/banner.png" alt="Taskflow — projects & tasks, beautifully organized" width="100%" />
</p>

<p align="center">
  <a href="https://github.com/johnpc/taskflow/actions/workflows/ci.yml"><img src="https://github.com/johnpc/taskflow/actions/workflows/ci.yml/badge.svg" alt="CI" /></a>
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License: MIT" />
</p>

# Taskflow

**A fast, focused project & task manager for getting things done.** Plan work on a board, work
through it in a list, and always know what's next — projects, sections, tasks, subtasks, priorities,
due dates, and comments, in a clean app that works on the web, as an installable PWA, and natively on
iOS and Android.

> Create an account, and your workspace is private to you and synced across every device.

## Features

| Area                  | What you get                                                                                                               | Status |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------- | ------ |
| **Home**              | Dashboard: greeting, due-today / overdue stats, a "coming up" task list, project links                                     | ✅     |
| **Projects**          | Create projects, recolor them, favorite them (list or board header), add a description, archive/delete                     | ✅     |
| **Duplicate project** | Copy a whole project — its sections + open tasks — into a fresh "(copy)" from the board menu                               | ✅     |
| **Archived**          | Browse archived projects in a collapsible section and restore any of them                                                  | ✅     |
| **Templates**         | Start a ready-made project (Sprint / Content / Launch) with sections + tasks                                               | ✅     |
| **Counts**            | Open-task count badge per project; overdue count on My Tasks                                                               | ✅     |
| **Progress**          | Each project card shows a completion bar and "X of Y done"                                                                 | ✅     |
| **Project status**    | Set a project On track / At risk / Off track with a note; a colored pill shows on card+header                              | ✅     |
| **Sections**          | Add, rename, duplicate (with tasks), delete, and reorder a project's columns/sections                                      | ✅     |
| **Board**             | Kanban columns (To do / In progress / Done) with inline task creation; collapse a column, or collapse/expand all           | ✅     |
| **List view**         | Dense aligned table — group by None/Section/Assignee/Due/Priority & sort by any; overdue dates red, priority pills         | ✅     |
| **Timeline**          | Gantt-style two-week view — dated tasks as bars; tap to open, drag a bar to reschedule                                     | ✅     |
| **Tasks**             | Title, notes, priority (Low→High), due dates with overdue/today/upcoming cues; project breadcrumb                          | ✅     |
| **Start date**        | Give a task a start date; not-yet-started tasks show a "Starts Mon D" chip                                                 | ✅     |
| **Due presets**       | One-tap Today / Tomorrow / Next week due-date buttons                                                                      | ✅     |
| **Due time**          | Add a time of day to a due date; the card chip shows it (e.g. "Aug 3 2:00 PM")                                             | ✅     |
| **Drag & drop**       | Drag a card to a column to move it, or onto a card to drop it at that position                                             | ✅     |
| **Reorder**           | Drag onto a card, or move a task up/down within its section                                                                | ✅     |
| **Multi-select**      | Select tasks on the board or in the list and bulk-complete, move-to-section, or delete                                     | ✅     |
| **Followers**         | Follow a task to track it; a followers avatar stack shows who's watching, filterable in My Tasks                           | ✅     |
| **Quick-edit**        | Set a due date and cycle priority straight from a card, no detail needed                                                   | ✅     |
| **Inline rename**     | Rename a task in place from its card (pencil), no detail needed                                                            | ✅     |
| **Milestones**        | Mark a task a milestone; its card shows a ◆ marker for key checkpoints                                                     | ✅     |
| **Approvals**         | Mark a task Approved / Changes requested / Rejected; a colored outcome badge shows on the card                             | ✅     |
| **Likes**             | Like a task or a comment with a heart; the count shows on the card and in the thread                                       | ✅     |
| **Highlight color**   | Give a task a color; its card gets a left accent stripe for visual grouping                                                | ✅     |
| **Cover image**       | Upload a cover photo for a task; it shows as a banner on the board card                                                    | ✅     |
| **Subtasks**          | Checklist with a "2/3" chip; open a subtask + breadcrumb back; promote one to a task; confirm if incomplete                | ✅     |
| **Attachments**       | Attach labelled links or upload files to a task; each opens in a new tab (XSS-guarded hrefs)                               | ✅     |
| **Dependencies**      | "Blocked by" + "Blocking" lines, board badge, and a confirm before completing early                                        | ✅     |
| **Recurring**         | Repeat daily/weekly/monthly (card shows the cadence); completing spawns the next                                           | ✅     |
| **Rich notes**        | Notes render **bold**, safe links, and [ ]/[x] checklists (XSS-guarded hrefs)                                              | ✅     |
| **Comments**          | Discuss on any task; **bold**, safe links & @mentions; relative timestamps; edit or delete                                 | ✅     |
| **Labels**            | Reusable colored tags; apply on task detail, chips render on every card                                                    | ✅     |
| **Move & assign**     | Move a task between sections/projects, assign it to any member; a name-resolved avatar shows on the card                   | ✅     |
| **Duplicate**         | Copy a task — its subtasks, custom-field values, and link attachments included — into the same section                     | ✅     |
| **Copy link**         | Copy a task's deep link (with "Copied!" feedback) or a project's link from its board menu                                  | ✅     |
| **Delete task**       | Delete a task (with confirm) from its detail; it leaves the board                                                          | ✅     |
| **My Tasks**          | Open tasks across projects — quick-add, group, sort within buckets, completed, filter to assigned-to-me or followed        | ✅     |
| **Focus plan**        | File tasks into Today / Upcoming / Later in My Tasks — drag between buckets or pick                                        | ✅     |
| **Calendar**          | Two-week list or full month grid of dated tasks; drag a task to another day to reschedule (project-tagged)                 | ✅     |
| **Search**            | Live search over title/notes/assignee/label — rows show project + due + assignee avatar; filter by priority/project/status | ✅     |
| **Complete**          | One-tap complete on the board and in lists, with a strike-through state                                                    | ✅     |
| **Undo**              | An undo toast after completing a task — one tap to bring it back                                                           | ✅     |
| **Celebration**       | A confetti burst on completing a task (intermittent; respects reduced-motion)                                              | ✅     |
| **Completed view**    | Per-project archive of done tasks (with when), each reopenable                                                             | ✅     |
| **Activity**          | Created / completed timestamps + an activity feed (who created / completed / reopened, when)                               | ✅     |
| **Filter & sort**     | Hide/show completed, filter by label / priority / due / assignee, sort; a "Clear filters (N)" reset                        | ✅     |
| **Saved views**       | Save a filter/sort combo as a named view per project; re-apply or delete in one tap                                        | ✅     |
| **Custom fields**     | Manage text/select/number/date fields from the board; fill per task; values chip on cards + list rows                      | ✅     |
| **Dark mode**         | Follows your OS, with an in-app Light / Dark / System override                                                             | ✅     |
| **Accounts**          | "You" tab: upload an avatar, set a display name, change your password, switch theme, or sign out                           | ✅     |
| **Sharing**           | Invite people by email; a header avatar stack (display-name-resolved) shows who's on the project                           | ✅     |
| **Shortcuts**         | Keyboard nav — `g` then h/p/t/c to jump around, `/` to search, `?` for help                                                | ✅     |

## The vision

Most task managers are either too heavy (a project-management suite you fight with) or too light (a
notes app pretending). Taskflow aims for the middle: the **interaction fabric** of a great task
manager — a board you can think in, a list you can grind through, and a "what's due" view that tells
you where to point your attention — without the ceremony. It's guest-free on purpose: your work is
yours, private and synced.

## How it works

Taskflow is a **shell + feature-slice** app:

- **Client:** Ionic 8 + React 19 + TypeScript (strict) + Vite, wrapped by Capacitor for iOS/Android.
  Server state flows through react-query wrapping the AWS Amplify data client; UI state lives in
  hooks + context. Every screen renders four honest states — loading, error (retryable), empty, and
  ready — through one shared `LoadState`, so nothing ever hangs on a spinner.
- **Backend:** AWS Amplify Gen2 — Cognito auth + AppSync (GraphQL) + DynamoDB. The data model is
  `Project → Section → Task` (subtasks are tasks with a parent) `+ Comment + Label`.

### Where the data comes from

There's no AI generation or ingestion here — **you** are the source of the data. Everything you see is
your own workspace. Every model is **owner-scoped** (`allow.owner()`): a signed-in account only ever
reads and writes its own rows, enforced at the API layer by Cognito, not just in the UI. The board
you open, the tasks you complete, and the comments you post are stored in DynamoDB under your
identity and synced to every device you sign in on.

## Install

- **Web / PWA:** open the app in your browser and choose **Add to Home Screen** (or your browser's
  install button) for a full-screen, offline-ready app.
- **iOS:** TestFlight link coming once the first build is live.
- **Android:** a debug APK is published to each GitHub Release.

## Development

```bash
npm install
npm run dev            # Vite dev server (add -- --port 5178 if 5173 is busy)
npm run quality        # full gate: lint + format + line-length + feature-coverage + tests(80%) + CRAP(15) + build
npm run test:e2e       # Gherkin acceptance tests (TF_PORT=5178 locally to dodge a busy 5173)
npm run seed           # seed a demo workspace (needs .env.local creds)
```

The backend is AWS Amplify Gen2 — `npx ampx sandbox` stands up a personal cloud backend, and
`npm run e2e-config` pulls its config into `amplify_outputs.json` (git-ignored).

### Quality bar

Enforced by both a husky pre-commit hook and CI: no `any`, every logic file ≤ 100 lines, ≥ 80% test
coverage, CRAP ≤ 15 per function, Prettier-clean, a passing build, and a Gherkin acceptance scenario
for every user-facing flow (asserting on real seeded data). See [CLAUDE.md](./CLAUDE.md) for the full
architecture and conventions.

## License

MIT
