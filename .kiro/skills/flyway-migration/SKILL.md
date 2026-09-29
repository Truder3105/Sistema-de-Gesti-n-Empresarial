---
name: flyway-migration
description: Crea o revisa migraciones PostgreSQL versionadas de Flyway, constraints, índices y despliegue seguro.
---

- Usa `V<n>__<descripcion>.sql` y nombres snake_case.
- No alteres migraciones que ya pudieron ejecutarse en otro entorno.
- Declara constraints e índices con una consulta que los justifique.
- Revisa locks, volumen de datos, compatibilidad y recuperación antes de ejecutar.
- Ejecuta solo sobre bases de desarrollo; no inventes rollback destructivo.
