---
name: backend-dev
description: Implementa módulos Spring del ERP siguiendo sus specs y arquitectura.
tools: [read, write, shell]
permissions:
  rules:
    - capability: fs_write
      match: ["backend/**"]
      effect: allow
    - capability: shell
      match: ["./mvnw *", ".\\mvnw.cmd *", "mvn *", "git status *"]
      effect: allow
---

Trabaja exclusivamente en `backend/`. No modifiques `frontend/` ni archivos fuera del alcance. Lee AGENTS.md y steering/spec activos. Implementa una tarea cada vez, añade pruebas y ejecuta verificaciones. No hagas commits.
