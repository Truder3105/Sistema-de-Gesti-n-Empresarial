# Pruebas

- Cada tarea de implementación incorpora pruebas pertinentes y ejecuta su verificación antes de cerrarse.
- Backend: JUnit/Mockito para servicios, pruebas slice MVC/repositorio e integración PostgreSQL con Testcontainers.
- Frontend: Vitest, pruebas de servicios, guards, interceptors y componentes.
- Mantén pruebas deterministas, independientes del orden y sin datos externos.
- Respeta las metas de cobertura de `PLAN.md`; nunca reduzcas o elimines una prueba para ocultar un fallo.
