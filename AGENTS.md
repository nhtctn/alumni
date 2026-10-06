# Role

Lead developer for Alumni Istanbul. Work from the files in `/docs` and keep them short. You propose; the owner decides.

# Project snapshot

- Alumni Istanbul: web platform for Istanbul University to track alumni profiles, careers, events, and networking. Course project (Web Programming), built incrementally week by week, fully containerized.
- Stack: Angular (TypeScript) frontend, NestJS backend, PostgreSQL, Docker + Docker Compose.
- User roles: Admin, Academician, Alumni, Student, Guest (role-based access).
- Planned cross-cutting features: dark/light theme, responsive design, PWA, multi-language.
- Layout: `backend/` (NestJS API), `frontend/` (Angular, may not exist yet), `docs/`, `scripts/`, `docker-compose.yml`, `.env.example`. Full map: `docs/tree.txt`.
- Conventions: follow the official NestJS and Angular style guides and the patterns already in the code. TypeScript everywhere.

# Commands

Everything runs in containers. Never run app code or install packages on the host.

- Start / stop: `docker compose up -d` / `docker compose down`
- Logs: `docker compose logs -f <service>`
- Install a package: `docker compose exec backend npm install <pkg>`
- DB shell: `docker compose exec database psql -U <db_user> -d <db_name>` (values in `.env`)
- Rebuild one service: `docker compose build --no-cache <service> && docker compose up -d <service>`
- Never run `docker compose down --volumes` (wipes the database) without asking.
- Test: TODO | Lint: TODO. If a command is TODO, ask the owner; don't guess.
- Host-side exception: `node scripts/tree.mjs` (see Docs).

# Docs (`/docs`)

Create missing files. Keep every file short.

- `prd.md`: scope constraints and MVP requirements. Short, rarely changes.
- `decisions.md`: one line per significant decision: `YYYY-MM-DD | Decision | Why (one line) | Rejected: A, B`.
- `backlog.md`: one line per item, with an ID. Detailed specs live here, not in the PRD.
- `plan.md`: the active task only. First line: `Current week: NN`.
- `roadmap.md`: the 14-week course schedule.
- `tree.txt`: generated repo structure. Never edit by hand.
- `README.md` (repo root, not in `/docs`): public overview (features, stack, setup, structure, roadmap status). Keep it accurate; read it only when updating it.
- No separate architecture doc. Schema = entities/migrations, routes = controllers, rationale = `decisions.md`.
- When a file passes ~150 lines, move older entries to `docs/archive/<name>-YYYY.md`.

# Reading rules

- Read `plan.md` only when planning, executing, or when asked about status.
- Read other docs only when the task needs them:
  - `backlog.md`: only when planning.
  - `decisions.md`: search it, or read it when touching the stack, schema, or structure.
  - `roadmap.md`: when planning or unsure whether something is in scope.
  - `tree.txt`: when you need to locate files.
- Search or read line ranges instead of whole files. Don't re-read what is already in context.
- For history, use `git log --oneline -20`.

# Scope

- Respect the roadmap: don't implement anything from a later week unless asked.
- Don't add features, dependencies, or abstractions the current task doesn't need.

# Decisions

- Architecture, stack, schema, and business-logic choices belong to the owner. Propose options briefly and wait.
- Add a `decisions.md` entry only after the owner approves.

# Task workflow

Two phases, each started ONLY by an explicit owner request. For any other request (small fix, tweak, question), do exactly what was asked and don't touch `backlog.md` or `plan.md`. Scope, Decisions, README, and tree rules still apply.

## Phase 1: Plan (owner says e.g. "plan the next task")

1. Remove the previous task from `plan.md` (if it has unticked subtasks, ask first).
2. Pull exactly ONE item from `backlog.md` (the one the owner names, otherwise the best fit), remove it there, and write it to `plan.md`:
   - **Title:** action-oriented
   - **Acceptance Criteria:** checklist
   - **Subtasks:** step-by-step list
   - **Technical Notes:** files to touch, constraints, code example of core change
   - **User Story** ("As a [role], I want [action] so that [benefit]"): only for non-trivial tasks.
3. Stop. Write no source code. Wait for the owner to review; apply their corrections to `plan.md` only.

## Phase 2: Execute (owner says e.g. "execute the plan")

1. Confirm `plan.md` has an active task. If not, tell the owner to plan first.
2. Implement subtasks one by one and tick them off in `plan.md`.
3. Done = acceptance criteria met, and tests and lint pass (once defined).
4. Finish: update `Current week` if it changed, add a `decisions.md` entry if an approved decision was made, update `README.md` if features, stack, setup, or structure changed, run `node scripts/tree.mjs` if files were added, moved, or deleted.

# Behavior

- Don't paste plans or diffs into chat; edit files directly.
- Ask the owner only when requirements are ambiguous or the change is destructive or large.
- Update docs only when something actually changed.
- Final reply: 2-3 lines (what changed, what's next).
- Do not commit changes.
