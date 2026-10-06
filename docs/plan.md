Current week: 03

> B-02 | testing api via basic routes: /, /hello, /hello/{name}, /sum/{a}/{b}, /about

## Implement basic API routes

**Acceptance Criteria**

- [x] The backend service starts through Docker Compose.
- [x] `GET /` returns a successful API welcome response.
- [x] `GET /hello` and `GET /hello/:name` return greeting responses.
- [x] `GET /sum/:a/:b` returns the numeric sum of both route parameters.
- [x] `GET /about` returns basic project information.
- [x] All routes are verified with container-based HTTP requests.

**Subtasks**

- [x] Add the NestJS backend service and container configuration.
- [x] Implement the basic route controller and application bootstrap.
- [x] Verify each route through the running backend container.
- [x] Update project documentation and regenerate the repository tree.

**Technical Notes**

- Files: `backend/`, `docker-compose.yml`, `README.md`, `docs/tree.txt`.
- Keep this task limited to basic GET routes; persistence and CRUD belong to B-03.
