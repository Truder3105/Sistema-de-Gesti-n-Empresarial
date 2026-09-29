---
name: code-review-checklist
description: Revisa cambios del ERP antes de PR por arquitectura, seguridad, pruebas, API y mantenibilidad.
---

- Comprueba criterios de aceptación y límite de alcance de la tarea/spec.
- Verifica dirección de capas, DTOs públicos, transacciones, validación y autorización backend.
- Revisa migraciones, consultas/índices y consistencia de contratos TypeScript/OpenAPI.
- Busca secretos, exposición de datos, errores filtrados y accesibilidad.
- Confirma pruebas significativas y resultados ejecutados; prioriza hallazgos con evidencia.
