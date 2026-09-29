# Repository instructions

Read `PLAN.md` and the active `.kiro/specs/<feature>/` documents before changing code. Work one task at a time and stop at every human approval gate in the spec cycle.

## Stack
- Java 25, Spring Boot 4.1.x, Maven, PostgreSQL, Flyway.
- Angular 22, standalone components, Signals, strict TypeScript, SCSS.
- Docker Compose for local development.

## Architecture and security
- Keep dependencies Controller → Service → Repository. Controllers only map HTTP and DTOs.
- Never return JPA entities from services/controllers; expose validated DTO records.
- Put business rules in services; transactions belong in services.
- Enforce authorization in the backend. Never commit secrets; use environment variables.
- Version schema changes with immutable Flyway migrations.

## Workflow
- Follow Conventional Commits and small, reviewable changes.
- Run the verification commands in `PLAN.md` after each implementation task. Never weaken or remove a failing test.
- Do not run destructive commands or target non-development databases.
