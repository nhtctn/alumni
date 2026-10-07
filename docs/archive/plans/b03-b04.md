Current week: 03

> [x] B-03 | CRUD on /api/users

## Implement CRUD users API

**Acceptance Criteria**

- [x] `GET /api/health` returns `{ "status": "ok" }`.
- [x] User CRUD routes support create, list, read, full replace, partial update, and delete.
- [x] User input validation returns 400 for invalid payloads.
- [x] Unknown user IDs return 404.
- [x] Duplicate e-mail addresses return 409.
- [x] User records remain in memory and list results are ordered by ID.
- [x] All routes are verified with container-based HTTP requests.

**Subtasks**

- [x] Add the user model, DTOs, service, and API controller.
- [x] Add health endpoint and preserve existing basic routes.
- [x] Verify CRUD, validation, conflict, and not-found behavior through Docker.
- [x] Update project documentation and regenerate the repository tree.

**Technical Notes**

- Files: `backend/src/users/`, including the consolidated `user.dto.ts`, plus `backend/src/health.controller.ts`, `backend/src/app.module.ts`, `backend/src/main.ts`.
- Keep users in memory until the database work in week 05.
- Use `class-validator` and `class-transformer` through Nest's global validation pipe.

---

> [x] B-04 | Swagger UI at /api/swagger

## Add Swagger API documentation

**Acceptance Criteria**

- [x] Swagger UI is available at `GET /api/swagger`.
- [x] The generated document describes the health and users endpoints.
- [x] Request DTOs and response models appear in the generated documentation.
- [x] Endpoint descriptions, parameters, request bodies, and response status codes are documented.
- [x] Swagger setup works through Docker Compose.
- [x] Updating endpoint decorators automatically updates the generated OpenAPI document on application restart.

**Subtasks**

- [x] Add `@nestjs/swagger` to the backend and configure `DocumentBuilder` in application bootstrap.
- [x] Add Swagger decorators to controllers and DTOs.
- [x] Verify the UI and generated JSON document through the running backend container.
- [x] Document the development workflow for keeping Swagger current.

**Technical Notes**

- Files: `backend/src/main.ts`, `backend/src/app.controller.ts`, `backend/src/health.controller.ts`, `backend/src/users/`, and `backend/package.json`.
- Nest Swagger generates the OpenAPI document at runtime from decorators; no manually maintained JSON file is required.
- Development is the default `docker-compose.yml`: it mounts `backend/src`, runs the webpack-backed `start:dev` watch process with a one-second polling interval for reliable Windows/Docker file change detection. After a source change, Nest rebuilds and the Swagger document is regenerated when the application restarts.
- Production applies the separate `docker-compose.prod.yml` override with the default `docker-compose.yml`; it changes the backend to `npm start` and removes the development source mount. Rebuild and restart the backend image after source changes. A fully live-updating production API is not recommended.
