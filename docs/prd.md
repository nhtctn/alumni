# Alumni Istanbul — Product Requirements

## Product goal

Alumni Istanbul keeps Istanbul University connected with its graduates by
providing trusted profiles, career information, events, and networking in one
web platform.

## Users

- **Admin:** manages users, profiles, events, and system settings.
- **Academician:** discovers and communicates with alumni and students and
  participates in events.
- **Alumni:** maintains a profile, records career information, joins events,
  and networks with the university community.
- **Student:** browses the alumni directory and connects with alumni and
  academicians.
- **Guest:** views publicly available content without editing or messaging.

## MVP requirements

1. Users can register, sign in, and access features permitted by their role.
2. Alumni can create and update profiles containing identity, education, and
   career information.
3. Authorized users can search and filter the alumni directory.
4. Admins can manage users, alumni profiles, events, and announcements.
5. Users can browse events and alumni can register for eligible events.
6. Authorized users can exchange direct messages.
7. The API exposes documented, validated endpoints for the frontend.
8. The application runs consistently through Docker Compose with PostgreSQL.

## Scope constraints

- The project is developed incrementally according to the 14-week course
  roadmap; later-week features are not implemented early.
- Role-based access and server-side validation are required for protected data.
- Guests receive read-only access to public content.
- The first release targets a responsive web experience; native mobile apps are
  out of scope.
- Dark/light theme, PWA installation, and multi-language support are planned
  cross-cutting enhancements, not MVP blockers.
- Architecture and technology choices remain Angular, NestJS, PostgreSQL, and
  Docker Compose.

## Success criteria

- Each role can complete its intended core actions without accessing
  unauthorized data.
- Alumni can be found using the directory's supported filters.
- Event registrations and profile changes persist reliably in PostgreSQL.
- The frontend can use the documented API without undocumented behavior.
- A new developer can start the complete development environment with Docker
  Compose.
