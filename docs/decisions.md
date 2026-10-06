# Architecture & Stack Decisions

This document explains why each technology in Alumni Istanbul was chosen, and what it costs us. For a quick overview, see the [Tech Stack](../README.md#tech-stack) table in the README.

| Layer     | Technology              |
| --------- | ----------------------- |
| Frontend  | Angular (TypeScript)    |
| Backend   | Node.js + NestJS        |
| Database  | PostgreSQL              |
| Container | Docker + Docker Compose |

---

## Frontend: Angular

**Why**

- **Maintainability:** The university's existing web infrastructure already uses Angular. Adopting it means the system can be maintained using established institutional knowledge.
- **Stability:** Angular is widely used in business and enterprise environments and offers better long-term backward compatibility than faster-moving alternatives such as React, Vue, or Svelte.
- **Structure:** Its opinionated, modular design makes the codebase easy for future developers or teams to navigate and maintain.

**Trade-off**

- The combination of Angular and NestJS has a steep learning curve and a lot of boilerplate (see the backend section).

---

## Backend: NestJS

**Why**

- **The Angular twin:** NestJS is widely considered the most natural backend fit for Angular developers. Its architecture closely mirrors Angular's: TypeScript by default, decorators, dependency injection, and a modular structure.
- **Seamless context switching:** Moving between an Angular frontend and a NestJS backend feels natural because the design patterns are nearly identical, and both sides can share end-to-end type safety.
- **Enterprise-ready:** It suits complex, scalable APIs where strict architectural guidelines and consistency across teams are required.

**Trade-off**

- **Learning curve and boilerplate:** The extra abstraction layers (decorators, dependency injection containers) can feel like over-engineering for simple domains.
- **Minor overhead:** NestJS runs on top of Express (or Fastify) by default, so those layers add a small performance cost compared with using Express directly.

---

## Database: PostgreSQL

**Why**

- **Data integrity:** PostgreSQL is a robust, open-source relational database valued for its strict ACID compliance, stability, and data integrity.
- **Flexibility:** It handles highly relational data well while also supporting features like JSONB when document-style flexibility is needed.

**Trade-off**

- **Complexity:** Setting it up, configuring performance parameters, and optimizing complex queries has a steep learning curve and is not beginner-friendly.
- **Indexing matters:** Without proper indexing, simple read operations can be slower than on lighter databases.

---

## Container: Docker + Docker Compose

**Why**

- The whole system (API server, frontend, and database) starts with a single `docker compose up`, so every developer and every environment runs the same setup.
