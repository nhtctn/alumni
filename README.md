# 🎓 Alumni Istanbul

> A web platform that keeps Istanbul University and its graduates connected for life.

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)](./LICENSE)

Alumni Istanbul is a centralized hub where the university can track alumni profiles, follow career progression, manage events, and help alumni, students, and academics network with each other.

> **Course project:** This system is built for a **Web Programming** course taught by **[Emre Akadal](https://github.com/akadal)**. It is developed incrementally, week by week, and the whole application is containerized with Docker.

<!-- Add a screenshot or GIF here once the frontend exists:
![Alumni Istanbul screenshot](docs/images/screenshot.png)
-->

## Table of Contents

- [🎓 Alumni Istanbul](#-alumni-istanbul)
  - [Table of Contents](#table-of-contents)
  - [Key Features](#key-features)
    - [User Roles](#user-roles)
  - [Technical Features](#technical-features)
  - [Tech Stack](#tech-stack)
  - [Getting Started](#getting-started)
    - [Requirements](#requirements)
    - [Setup](#setup)
  - [Docker Compose Cheat Sheet](#docker-compose-cheat-sheet)
    - [Daily use](#daily-use)
    - [Working inside containers](#working-inside-containers)
    - [Rebuilding](#rebuilding)
    - [Cleanup](#cleanup)
  - [Project Structure](#project-structure)
  - [Development Roadmap](#development-roadmap)
  - [Project Evolution](#project-evolution)
  - [LLM Usage \& Developer Responsibility](#llm-usage--developer-responsibility)
  - [License](#license)

---

## Key Features

**Status legend:** ✅ done · 🚧 in progress · 📅 planned

| Feature                    | Description                                                                                                                                     | Status |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| **Alumni Profiles**        | Personal information, graduation details, and career status that verified alumni can update.                                                    | 📅     |
| **Alumni Directory**       | Search and filter alumni by graduation year, department, city, and industry.                                                                    | 📅     |
| **Career Tracking**        | Career milestones, employers, roles, and industries that give insight into graduate outcomes.                                                   | 📅     |
| **Events & Announcements** | University events that alumni can browse, register for, and get notified about.                                                                 | 📅     |
| **Achievements**           | A dedicated space for notable alumni accomplishments and contributions.                                                                         | 📅     |
| **Role-Based Access**      | Separate permissions and views for each user role (see below).                                                                                  | 📅     |
| **Messaging**              | Direct communication between alumni, students, and academicians.                                                                                | 📅     |
| **Help & Support**         | A ticket system for requesting assistance, reporting issues, or contacting administration.                                                      | 📅     |
| **Admin Dashboard**        | Statistics on alumni, active users, event registrations, and department distribution, plus management tools for profiles, events, and settings. | 📅     |

### User Roles

| Role            | Intended use                                                        |
| --------------- | ------------------------------------------------------------------- |
| **Admin**       | Manages profiles, events, and system settings; views the dashboard. |
| **Academician** | Connects with alumni and students through messaging and events.     |
| **Alumni**      | Maintains a profile, joins events, and networks with others.        |
| **Student**     | Browses the directory and connects with alumni and academicians.    |
| **Guest**       | Limited, read-only access to public content.                        |

---

## Technical Features

| Feature                    | Description                                                                  | Status |
| -------------------------- | ---------------------------------------------------------------------------- | ------ |
| **Dark / Light theme**     | Switch between a dark and a light interface.                                 | 📅     |
| **PWA**                    | Installable Progressive Web App that can be added to a device's home screen. | 📅     |
| **Multi-language support** | The interface is available in more than one language.                        | 📅     |

---

## Tech Stack

| Layer     | Technology              | Why                                                  | Trade-off                                    |
| --------- | ----------------------- | ---------------------------------------------------- | -------------------------------------------- |
| Frontend  | Angular (TypeScript)    | Matches the university's existing web infrastructure | Steep learning curve, heavy boilerplate      |
| Backend   | Node.js + NestJS        | Angular-style architecture and end-to-end TypeScript | Extra abstraction layers for simple domains  |
| Database  | PostgreSQL              | ACID compliance, strong relational model, JSONB      | More setup and tuning than lighter databases |
| Container | Docker + Docker Compose | One command to run the whole system                  | None                                         |

The full reasoning behind each choice is in [`docs/decisions.md`](./docs/decisions.md).

---

## Getting Started

### Requirements

- [Docker](https://www.docker.com/products/docker-desktop) (includes Docker Compose)
- [Git](https://git-scm.com/)

### Setup

**1. Clone the repository**

```bash
git clone https://github.com/nhtctn/alumni.git
cd alumni
```

**2. Create your environment file**

```bash
cp .env.example .env
```

Open `.env` and adjust the values if needed (database user, password, database name, ports).

**3. Start the application**

```bash
docker compose up -d
```

Docker Compose starts every service defined in `docker-compose.yml` and wires them together. Use `docker compose up` (without `-d`) if you want logs in your terminal.

**4. Check that it works**

```bash
docker compose ps
docker compose logs -f backend
```

---

## Docker Compose Cheat Sheet

### Daily use

```bash
# Start all services in the background
docker compose up -d

# Stop all services
docker compose down

# Follow logs for one service
docker compose logs -f backend
```

### Working inside containers

```bash
# Install a package in the backend
docker compose exec backend npm install package-name

# Open a PostgreSQL shell (use the values from your .env file)
docker compose exec database psql -U <db_user> -d <db_name>

# Run a single query
docker compose exec database psql -U <db_user> -d <db_name> -c "SELECT * FROM users;"
```

### Rebuilding

```bash
# Rebuild the frontend without cache, then restart it (once the frontend exists)
docker compose build --no-cache frontend && docker compose up -d frontend
```

### Cleanup

```bash
# Stop everything and remove volumes (wipes the database)
docker compose down --volumes

# Stop everything and remove images, volumes, and orphaned containers
docker compose down --rmi all --volumes --remove-orphans
```

---

## Project Structure

```text
alumni/
├── docs/
│   ├── backlog.md      # Product backlog with planned work items
│   ├── decisions.md    # Stack rationale and trade-offs
│   ├── plan.md         # Active task and acceptance criteria
│   ├── prd.md          # Product requirements and scope constraints
│   ├── roadmap.md      # Course roadmap and delivery timeline
│   └── tree.txt        # Generated repository structure snapshot
├── scripts/
│   └── tree.mjs        # Generates docs/tree.txt
├── backend/            # NestJS API server
├── frontend/           # Angular application (coming soon)
├── AGENTS.md           # Local repo instructions and contributor workflow
├── README.md           # Project overview, setup steps, and documentation
├── package.json        # Root tooling and scripts
├── docker-compose.yml  # Docker Compose configuration for running the application services
└── .env.example        # Sample environment variable configuration
```

---

## Development Roadmap

The project follows an **incremental, week-by-week** model where each week builds directly on the previous one.

| Week | Focus                                | Status |
| ---- | ------------------------------------ | ------ |
| 01   | Project inception & fundamentals     | ✅     |
| 02   | Routing: the doors of the system     | 📅     |
| 03   | HTTP methods & CRUD                  | 📅     |
| 04   | MVC Architecture                     | 📅     |
| 05   | Database & ORM                       | 📅     |
| 06   | Database integration                 | 📅     |
| 07   | Relational data & advanced routing   | 📅     |
| 08   | Midterm: code review                 | 📅     |
| 09   | Middleware: the bouncer              | 📅     |
| 10   | Views & front-end integration        | 📅     |
| 11   | Authentication & authorization       | 📅     |
| 12   | Service layers                       | 📅     |
| 13   | Deployment & CI/CD                   | 📅     |
| 14   | Final presentations: system handover | 📅     |

---

## Project Evolution

In a previous group assignment for the **System Analysis and Design** course, our group built an Alumni Management System with a strong focus on frontend design. Our group use Django and React. Selected feature decisions and frontend concepts from that codebase may be adapted and reimplemented here.

---

## LLM Usage & Developer Responsibility

Parts of this project were developed with the assistance of Large Language Models (LLMs) under the following principles:

- **Author-driven decisions:** All core choices about system architecture, the technology stack, the database schema, and business logic were made by the developer, not by AI.
- **Productivity tooling:** LLMs were used strictly to draft boilerplate code, format documentation, and suggest syntax for specific implementation details.
- **Full accountability:** Every piece of AI-assisted content was manually reviewed, tested, and adapted. Understanding of the codebase and responsibility for its final functionality remain entirely with the author.

---

## License

This project is licensed under the **GNU Affero General Public License v3.0 (AGPL-3.0)**.

You are free to use, study, and modify this software. If you deploy it, including as a network service, any modifications must also be released under the same license.

See the [LICENSE](./LICENSE) file for the full text, or visit [gnu.org/licenses/agpl-3.0](https://www.gnu.org/licenses/agpl-3.0.html).
