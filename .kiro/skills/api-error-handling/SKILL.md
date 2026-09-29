---
name: api-error-handling
description: Implementa o revisa respuestas de error REST homogéneas con ProblemDetail en Spring.
---

- Usa `ProblemDetail` y `application/problem+json` desde el advice global.
- Mapea errores de validación, auth, acceso, recurso inexistente, conflicto y errores internos a estados apropiados.
- No expongas stack traces, SQL, secretos ni detalles internos al cliente.
- Incluye correlation id cuando esté disponible y pruebas por caso.
