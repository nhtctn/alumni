Current week: 04

> [x] B-05 | create /users endpoints intended to respond to the web application with page content
> [x] B-06 | add a view layer using Handlebars (`hbs`) as the template engine

## Implement web user endpoints and Handlebars views

**Title:** Add browser-facing user routes and a Handlebars view layer

**Acceptance Criteria**

- [x] `GET /users` responds with a polished rendered HTML user list.
- [x] `GET /users/new` responds with a rendered create-user form.
- [x] `POST /users` creates a user from a browser form.
- [x] `GET /users/:id` responds with rendered HTML for an existing in-memory user.
- [x] `GET /users/:id/edit` responds with a rendered edit form.
- [x] `POST /users/:id/edit` updates a user from a browser form.
- [x] `POST /users/:id/delete` deletes a user from a browser form.
- [x] Unknown user IDs return an appropriate HTML 404 response.
- [x] Handlebars is configured as the NestJS view engine and templates are loaded from a documented directory.
- [x] The web controller uses `UsersService` and does not duplicate user storage or business logic.
- [x] Existing `/api/users` CRUD behavior and Swagger documentation remain unchanged.
- [x] The rendered pages and browser CRUD operations are verified through Docker-based HTTP requests.
- [x] Shared static styling is served from `backend/public/styles.css`.
- [x] README and generated repository structure documentation describe the new view layer.

**Subtasks**

- [x] Add the Handlebars dependency and configure the NestJS application view engine.
- [x] Add browser-facing `UsersController` routes for full user CRUD.
- [x] Add Handlebars templates for lists, details, forms, errors, and empty states.
- [x] Add explicit web error handling that returns HTML without changing API error behavior.
- [x] Add polished responsive styling and serve it as a static asset.
- [x] Verify the API and web routes together through the running Docker Compose backend.
- [x] Update README documentation and regenerate `docs/tree.txt`.

**Technical Notes**

- Files: `backend/src/main.ts`, `backend/src/users/users.controller.ts`, `backend/views/`, `backend/public/styles.css`, `backend/package.json`, `README.md`, and generated `docs/tree.txt`.
- Keep the current in-memory user store; database work is out of scope.
- Keep `ApiUsersController` as the JSON API under `/api/users`.
- Use the existing `UsersService` for all user data access.
- Use NestJS response rendering and redirects; avoid duplicating controller logic or introducing a second service.
- Do not add frontend Angular work in this task; the web controller is the server-rendered browser entry point tracked by B-05/B-06.

**User Story**

As a browser user, I want `/users` pages rendered by the backend so that I can view user information through a web interface while API clients continue using `/api/users`.
