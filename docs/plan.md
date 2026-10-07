Current week: 04

> [ ] B-07 | add a announcments module: routes, model, 2 controller (one for hbs), views

## Add the announcements module with API and Handlebars routes

**Title:** Add announcements data, JSON routes, and browser views

**Acceptance Criteria**

- [ ] Announcements are organized in a feature directory at `backend/src/announcements/`, following the existing users structure.
- [ ] The announcement model exposes an `id`, `title`, `content`, and publication timestamp suitable for API responses and rendered pages.
- [ ] The announcement service owns the in-memory collection, ID generation, ordering, create/read/update/delete operations, and not-found handling.
- [ ] `GET /api/announcements` lists announcements ordered by ID.
- [ ] `POST /api/announcements` creates an announcement with validated input.
- [ ] `GET /api/announcements/:id`, `PUT /api/announcements/:id`, `PATCH /api/announcements/:id`, and `DELETE /api/announcements/:id` provide the same CRUD conventions as `/api/users`.
- [ ] Swagger documents the announcement API, DTOs, model, and expected success/error responses.
- [ ] `GET /announcements` renders an announcement list through Handlebars.
- [ ] `GET /announcements/new`, `POST /announcements`, `GET /announcements/:id`, `GET /announcements/:id/edit`, `POST /announcements/:id/edit`, and `POST /announcements/:id/delete` support browser-facing announcement management.
- [ ] Unknown announcement IDs return an appropriate HTML 404 page, while API errors remain JSON NestJS exceptions.
- [ ] The HBS controller delegates all storage and business logic to `AnnouncementsService`; no duplicate collection is introduced.
- [ ] Existing user routes, API behavior, view engine configuration, styling, and Swagger documentation remain unchanged.
- [ ] API and rendered browser routes are verified through Docker-based HTTP requests.
- [ ] README and generated repository structure documentation describe the new announcements feature.

**Subtasks**

- [ ] Add `announcement.entity.ts`, `announcement.dto.ts`, and `announcements.service.ts` using the users module's conventions.
- [ ] Add `announcements-api.controller.ts` with `AnnouncementsApiController` for `/api/announcements`, including Swagger metadata and full CRUD.
- [ ] Add `AnnouncementsController` for `/announcements` with rendered list, detail, form, not-found, and error flows.
- [ ] Register the announcement provider and both controllers in `AppModule`, preserving the existing users registrations.
- [ ] Add Handlebars templates under `backend/views/announcements/` for list, detail, form, not-found, and error states.
- [ ] Verify validation, API CRUD, browser CRUD, redirects, and unknown-ID behavior against the running Docker Compose backend.
- [ ] Update README documentation and regenerate `docs/tree.txt`.

**Technical Notes**

- Follow the existing users layout: one feature directory containing the entity, DTOs, service, `announcements-api.controller.ts` JSON controller, and HBS controller; register these in the current root `AppModule`.
- Name API controllers and files with the feature first (`UsersApiController` in `users-api.controller.ts`, then `AnnouncementsApiController` in `announcements-api.controller.ts`) so feature files sort consistently in directory listings.
- Use `/api/announcements` for JSON and `/announcements` for server-rendered HTML. Keep route names plural and use `Announcement` consistently in TypeScript symbols.
- Proposed in-memory fields are `id: number`, `title: string`, `content: string`, and `publishedAt: string`; validate non-empty title/content and normalize the publication timestamp in the service.
- Match users API semantics: `CreateAnnouncementDto`, `ReplaceAnnouncementDto`, and `UpdateAnnouncementDto`; `PUT` replaces all editable fields and `PATCH` updates supplied fields.
- Reuse the current Handlebars engine, shared `backend/public/styles.css`, `HttpException` handling pattern, and existing view conventions rather than adding a second rendering setup.
- Database persistence and Angular frontend work are out of scope; keep this task focused on the in-memory NestJS module and its HBS entry point.

**User Story**

As an administrator, I want to create and manage announcements through API and browser routes so that users can view current university information while both clients share one announcement store.
