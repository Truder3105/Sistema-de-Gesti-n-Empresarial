---
name: crud-module-spring
description: Implementa o revisa un módulo CRUD en Spring Boot, incluyendo dominio, DTOs, repository, service, controller y pruebas.
---

1. Lee la spec aprobada y confirma alcance/criterios.
2. Crea entidad JPA interna y repository; diseña consultas evitando N+1.
3. Define DTO records con Bean Validation y mapper explícito.
4. Implementa reglas/transacciones en Service; controller solo delega y retorna DTOs.
5. Versiona rutas `/api/v1`, documenta OpenAPI y aplica autorización backend.
6. Añade pruebas de Service, WebMvc y Repository/integración. Ejecuta comandos de verificación de PLAN.md.
7. Informa archivos, resultados exactos y limitaciones del entorno.
