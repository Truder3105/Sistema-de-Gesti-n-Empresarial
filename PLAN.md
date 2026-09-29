# PLAN — Sistema de Gestión Empresarial (ERP ligero)

> Documento para usar como **plan** en agentes de código (Kiro, Claude Code, Codex/ChatGPT Codex).
> Instrucción al agente: ejecuta las fases en orden, una tarea a la vez, y no avances de fase sin cumplir su **Definition of Done (DoD)**.
> Nota: las versiones (Angular 22, Java 25, Spring Boot 4.1.x) deben verificarse contra la documentación oficial antes de fijarlas.

---

## 0. Objetivo y nivel de calidad esperado

Construir un sistema de gestión empresarial full stack, listo para producción, con arquitectura por capas, seguridad JWT/OAuth2, pruebas automatizadas, contenedores y CI, desarrollado con flujo *spec-driven* usando Kiro.

| Área | Nivel objetivo | Qué significa en este proyecto |
|---|---|---|
| Java | L4 | Java 25 idiomático: records, sealed types, pattern matching, virtual threads, `Optional` bien usado, sin anti-patrones |
| Spring | L4 | Spring Boot 4.1.x, configuración por propiedades tipadas, manejo global de errores, transacciones correctas, auto-config entendida |
| Angular | L4 | Standalone + Signals + zoneless, RxJS solo donde aporta, guards/interceptors funcionales, lazy loading |
| Kiro | L4 | Specs, steering, hooks, MCP, custom agents y skills configurados y usados en todo el ciclo |
| LLM/Agents | L3–L4 | Agentes con contexto acotado, tareas verificables, revisión humana en cada spec |
| SQL | L3 | Modelo normalizado, índices justificados, migraciones versionadas, consultas revisadas con `EXPLAIN` |
| Testing | L3–L4 | Pirámide completa; cobertura mínima y pruebas de integración con Testcontainers |
| Security | L3 | Autenticación/autorización, validación, OWASP Top 10, secretos fuera del repo |
| Docker/CI | L3 | Imágenes multi-stage, Compose reproducible, pipeline con build + test + análisis |

---

## 1. Arquitectura objetivo

```
                ┌──────────────────────────┐
                │           KIRO           │
                │   AI Agent / Specs       │
                │   MCP / Skills           │
                └────────────┬─────────────┘
                             │  (genera / revisa código)
                             ▼
┌───────────────────────────────────────────────────────────┐
│                         ANGULAR                           │
│  Components │ Signals │ RxJS │ Services │ Routing         │
│  Forms      │ Guards  │ HTTP │ Interceptors               │
└────────────────────────────┬──────────────────────────────┘
                             │  HTTPS / REST / JSON
                             ▼
┌───────────────────────────────────────────────────────────┐
│                       SPRING BOOT                         │
│  Controller                                               │
│      ↓                                                    │
│  DTO / Validation                                         │
│      ↓                                                    │
│  Service                                                  │
│      ↓                                                    │
│  Repository                                               │
│      ↓                                                    │
│  JPA / Hibernate                                          │
└────────────────────────────┬──────────────────────────────┘
                             ▼
                    ┌─────────────────┐
                    │   PostgreSQL    │
                    └─────────────────┘

Transversales: Security · Testing · Logging · Metrics · Tracing · Docker · Git · CI/CD
```

### Reglas de arquitectura (innegociables)

1. **Dependencias hacia abajo**: Controller → Service → Repository. Nunca al revés ni saltando capas.
2. Los **controllers no contienen lógica de negocio**; solo mapean HTTP ↔ DTO y delegan.
3. **Las entidades JPA nunca salen del Service**: se exponen solo DTOs (records).
4. Validación en el borde (Bean Validation en DTOs) **y** reglas de negocio en el Service.
5. El frontend **no confía en el frontend**: toda autorización se aplica en el backend.
6. Cada cambio de esquema pasa por una **migración versionada** (Flyway).
7. Cero secretos en el repositorio; configuración por variables de entorno.

---

## 2. Alcance funcional (módulos)

| # | Módulo | Descripción |
|---|---|---|
| 1 | Autenticación y usuarios | Login, refresh token, roles (`ADMIN`, `MANAGER`, `SELLER`, `VIEWER`), gestión de usuarios |
| 2 | Clientes | CRUD, búsqueda, paginación, historial de pedidos |
| 3 | Productos e inventario | Catálogo, categorías, stock, movimientos de inventario |
| 4 | Proveedores y compras | Órdenes de compra, recepción de mercancía |
| 5 | Ventas | Pedidos, líneas, estados (`DRAFT → CONFIRMED → INVOICED → CANCELLED`) |
| 6 | Facturación | Generación de facturas desde pedidos, totales e impuestos |
| 7 | Dashboard y reportes | KPIs, ventas por período, stock bajo |
| 8 | Auditoría | Quién cambió qué y cuándo (campos `created_by`, `updated_by`, tabla de auditoría) |

**MVP** = módulos 1, 2, 3 y 5. El resto se incorpora en fases posteriores.

---

## 3. Estructura del repositorio (monorepo)

```
gestion-empresarial/
├── AGENTS.md                  # Contexto común para Codex / Claude Code
├── PLAN.md
├── README.md
├── docker-compose.yml
├── docker-compose.dev.yml
├── .env.example
├── .github/workflows/         # CI
├── .kiro/
│   ├── specs/                 # requirements.md · design.md · tasks.md por feature
│   ├── steering/              # product.md · tech.md · structure.md · security.md · testing.md
│   ├── hooks/                 # automatizaciones por evento
│   ├── agents/                # custom agents (si la versión de Kiro los soporta)
│   ├── skills/                # SKILL.md por habilidad
│   └── settings/mcp.json      # servidores MCP
├── backend/
│   ├── pom.xml (o build.gradle)
│   ├── Dockerfile
│   └── src/
│       ├── main/java/com/empresa/gestion/
│       │   ├── GestionApplication.java
│       │   ├── config/        # Security, CORS, OpenAPI, propiedades tipadas
│       │   ├── common/        # excepciones, ApiError, utilidades, auditoría base
│       │   ├── auth/          # controller · dto · service · jwt
│       │   ├── user/
│       │   ├── customer/
│       │   ├── product/
│       │   ├── inventory/
│       │   ├── sales/
│       │   └── invoicing/     # cada módulo: controller/ dto/ service/ repository/ domain/ mapper/
│       ├── main/resources/
│       │   ├── application.yml, application-dev.yml, application-prod.yml
│       │   └── db/migration/  # V1__init.sql, V2__...
│       └── test/java/...      # unit + integration (Testcontainers)
└── frontend/
    ├── package.json
    ├── Dockerfile
    ├── nginx.conf
    └── src/app/
        ├── core/              # auth, interceptors, guards, layout, servicios singleton
        ├── shared/            # componentes UI reutilizables, pipes, directivas
        ├── features/          # customers/, products/, sales/, ... (lazy, con rutas propias)
        ├── app.config.ts
        └── app.routes.ts
```

Organización **por módulo (feature)**, no por tipo técnico, tanto en backend como en frontend.

---

## 4. Configuración de Kiro (Fase transversal)

### 4.1 Steering (contexto persistente) — `.kiro/steering/`

| Archivo | Contenido |
|---|---|
| `product.md` | Propósito del sistema, usuarios, módulos, glosario de dominio |
| `tech.md` | Stack y versiones, librerías permitidas/prohibidas, convenciones de código |
| `structure.md` | Estructura de carpetas, nombres de paquetes, patrón de módulo |
| `security.md` | Reglas de seguridad, manejo de secretos, políticas de autorización |
| `testing.md` | Pirámide de pruebas, umbrales de cobertura, convenciones de nombres |

Regla para el steering: corto, imperativo y verificable. Ejemplo: *"Los controllers solo devuelven DTOs; nunca entidades."*

### 4.2 Specs (flujo por feature)

Cada feature sigue el ciclo **requirements → design → tasks**:

1. `requirements.md`: historias de usuario con criterios de aceptación en formato EARS (*WHEN … THE SYSTEM SHALL …*).
2. `design.md`: modelo de datos, endpoints, DTOs, diagrama de secuencia, decisiones y riesgos.
3. `tasks.md`: tareas pequeñas, ordenadas, cada una con su prueba asociada.

**Regla:** un humano aprueba cada documento antes de pasar al siguiente.

### 4.3 Hooks — `.kiro/hooks/`

| Evento | Acción |
|---|---|
| Guardar archivo `*.java` | Ejecutar formateo y tests unitarios del módulo afectado |
| Guardar archivo `*.ts` | Ejecutar lint y test Vitest del archivo |
| Crear/editar migración SQL | Revisar nombre, versión y reversibilidad |
| Antes de commit | Verificar que no haya secretos y que compile |
| Cambio en un DTO | Recordar actualizar el cliente TypeScript y el contrato OpenAPI |

### 4.4 MCP — `.kiro/settings/mcp.json`

Servidores sugeridos (solo con permisos de lectura cuando sea posible):

- **PostgreSQL** (solo entorno dev, usuario de solo lectura) para inspeccionar el esquema.
- **Filesystem/Git** para contexto del repositorio.
- **Documentación** (Spring, Angular) para consultar versiones actuales.
- **GitHub** para issues y PRs.

Nunca conectar MCP a bases de producción.

### 4.5 Custom Agents

| Agente | Responsabilidad | Restricciones |
|---|---|---|
| `backend-dev` | Implementar módulos Spring siguiendo `structure.md` | No toca `frontend/` |
| `frontend-dev` | Implementar features Angular con Signals | No toca `backend/` |
| `db-architect` | Diseñar esquema, migraciones e índices | Solo `db/migration` y documentación |
| `test-engineer` | Escribir y mejorar pruebas | No modifica código de producción salvo bugs confirmados |
| `security-reviewer` | Revisar código contra OWASP y `security.md` | Solo lectura, entrega informe |
| `devops` | Docker, Compose y CI | Solo archivos de infraestructura |

### 4.6 Skills — `.kiro/skills/<nombre>/SKILL.md`

- `crud-module-spring`: plantilla paso a paso de un módulo (entity, repo, service, controller, DTO, tests).
- `angular-feature`: plantilla de feature (ruta lazy, componente, servicio, formulario reactivo, test).
- `flyway-migration`: reglas para migraciones seguras.
- `api-error-handling`: formato estándar de errores `ProblemDetail`.
- `code-review-checklist`: lista de revisión previa a PR.

### 4.7 Compatibilidad con otros agentes

`AGENTS.md` en la raíz resume stack, comandos (`build`, `test`, `lint`), convenciones y reglas de arquitectura, para que Codex y Claude Code trabajen con el mismo contexto que Kiro.

---

## 5. Fases de implementación

### Fase 1 — Fundaciones (repo, Kiro y entorno)

**Tareas**
1. Inicializar Git, `.gitignore`, `README.md`, `AGENTS.md`, `.env.example`.
2. Crear steering, hooks base, `mcp.json` y skills iniciales (sección 4).
3. Crear esqueleto `backend/` (Spring Initializr: Web, Validation, Security, Data JPA, PostgreSQL, Actuator, Flyway, Lombok opcional) y `frontend/` (Angular CLI, standalone, routing, SCSS).
4. `docker-compose.dev.yml` con PostgreSQL y healthcheck.

**DoD:** `docker compose up db` levanta la BD; backend arranca y responde `/actuator/health`; frontend compila y sirve una página.

### Fase 2 — Base de datos y modelo

**Tareas**
1. Diseñar el modelo entidad-relación de los módulos (documentar en `design.md`).
2. Migración `V1__init.sql`: tablas `users`, `roles`, `customers`, `products`, `categories`, `stock_movements`, `sales_orders`, `sales_order_lines`.
3. Convenciones: `snake_case`, PK `bigint` identity o `uuid`, columnas de auditoría, `NOT NULL` y `CHECK` donde aplique, FKs con índice.
4. Migración de datos semilla solo para dev (`V999__seed_dev.sql` o perfil dedicado).

**DoD:** las migraciones corren desde cero; `ddl-auto=validate`; índices justificados por consultas reales.

### Fase 3 — Backend núcleo (transversales)

**Tareas**
1. Propiedades tipadas (`@ConfigurationProperties`) y perfiles `dev` / `prod`.
2. Manejo global de errores con `ProblemDetail` (`@RestControllerAdvice`): 400, 401, 403, 404, 409, 500.
3. Auditoría automática (`@CreatedBy`, `@LastModifiedDate`, etc.).
4. OpenAPI (springdoc) y paginación estándar (`Pageable`).
5. Logging estructurado con correlation id; Actuator + Micrometer para métricas y tracing.

**DoD:** un endpoint de ejemplo devuelve errores homogéneos; existe documentación OpenAPI; se ven métricas en `/actuator`.

### Fase 4 — Seguridad (JWT / OAuth2)

**Tareas**
1. Spring Security con `SecurityFilterChain` *stateless*.
2. Login con credenciales → access token JWT (corta vida) + refresh token (rotación y revocación).
3. Contraseñas con `BCrypt`/`Argon2`.
4. Autorización por rol con `@PreAuthorize` y reglas por endpoint.
5. CORS restringido a orígenes configurados; cabeceras de seguridad.
6. Opcional: Resource Server OAuth2 con un proveedor externo (Keycloak) detrás de un perfil.
7. Rate limiting o protección básica contra fuerza bruta en login.

**DoD:** endpoints protegidos rechazan sin token (401) y sin permiso (403); tests de seguridad con `@WithMockUser` y tokens reales; sin secretos en el repo.

### Fase 5 — Módulos de negocio del backend (MVP)

Para **cada módulo** (`user`, `customer`, `product`, `inventory`, `sales`) seguir la skill `crud-module-spring`:

1. Entity + Repository (consultas derivadas o `@Query`; evitar N+1 con `@EntityGraph`/fetch join).
2. DTOs como `record` con Bean Validation; mapper (MapStruct o manual).
3. Service transaccional (`@Transactional` en la capa Service, `readOnly` en consultas).
4. Controller REST versionado (`/api/v1/...`), códigos HTTP correctos, paginación y filtros.
5. Reglas de negocio: control de stock no negativo, transiciones válidas de estado en pedidos, locking optimista (`@Version`) en inventario.
6. Tests: unitarios del Service (Mockito), slice `@WebMvcTest` del Controller, integración del Repository con Testcontainers.

**DoD por módulo:** endpoints documentados, tests verdes, sin lógica en controllers, sin entidades expuestas.

### Fase 6 — Frontend núcleo

**Tareas**
1. Configuración moderna: standalone components, zoneless change detection, `provideRouter`, `provideHttpClient(withInterceptors([...]))`.
2. `core/auth`: `AuthService` con Signals (`user`, `isAuthenticated`, `roles`), almacenamiento seguro del token y renovación.
3. **Interceptors funcionales**: adjuntar token, refresh automático ante 401, manejo global de errores, indicador de carga.
4. **Guards funcionales**: `authGuard`, `roleGuard`, `unsavedChangesGuard`.
5. Layout (shell, navegación por rol, notificaciones).
6. Lazy loading por feature con `loadChildren` / `loadComponent`.

**DoD:** login funcional; rutas protegidas; token renovado sin intervención; errores del backend mostrados de forma consistente.

### Fase 7 — Features del frontend (MVP)

Para cada feature (`customers`, `products`, `sales`, `users`) seguir la skill `angular-feature`:

- **Estado con Signals** (`signal`, `computed`, `effect` con moderación; `resource`/`httpResource` si la versión lo permite).
- **RxJS** para HTTP, `debounceTime` en búsquedas, `switchMap`, cancelación y composición de flujos; convertir con `toSignal` en la vista.
- **Reactive Forms** tipados (`FormBuilder.nonNullable`), validadores síncronos y asíncronos, mensajes de error reutilizables.
- Tablas con paginación/orden/filtros conectadas al backend.
- Componentes presentacionales (`input()`/`output()`, `OnPush`) separados de los contenedores.
- Accesibilidad básica (labels, foco, contraste, navegación por teclado).

**DoD:** CRUD completo por feature, formularios validados, sin `any`, `strict` activado, tests Vitest verdes.

### Fase 8 — Módulos posteriores

Proveedores/compras, facturación, dashboard/reportes y auditoría visible. Cada uno con su propio ciclo de spec (requirements → design → tasks) en `.kiro/specs/`.

### Fase 9 — Calidad y pruebas

| Nivel | Backend | Frontend |
|---|---|---|
| Unitarias | JUnit 5 + Mockito (Service, mappers, validadores) | Vitest (servicios, pipes, guards, interceptors, componentes) |
| Slice | `@WebMvcTest`, `@DataJpaTest` | Component tests con Testing Library o TestBed |
| Integración | `@SpringBootTest` + Testcontainers PostgreSQL | Pruebas de servicios contra `HttpTestingController` |
| Contrato | Verificar OpenAPI generado | Cliente tipado generado desde OpenAPI (opcional) |
| E2E (opcional) | — | Playwright: login, crear cliente, crear pedido |

**Metas mínimas:** cobertura ≥ 80 % en Services y ≥ 70 % global backend (JaCoCo); ≥ 70 % en frontend; los tests no dependen del orden ni de datos externos.

Análisis estático: Checkstyle/Spotless + SpotBugs (o SonarQube) en backend; ESLint + Prettier en frontend.

### Fase 10 — Docker y DevOps

**Tareas**
1. `backend/Dockerfile` multi-stage (build con JDK 25, runtime JRE mínimo, usuario no root, `HEALTHCHECK`).
2. `frontend/Dockerfile` multi-stage (build Node → servir con nginx, con fallback SPA en `nginx.conf`).
3. `docker-compose.yml`: `db` (volumen persistente, healthcheck), `backend` (depende de `db` saludable), `frontend`; variables desde `.env`.
4. Perfiles de Compose para dev y prod-like.

**DoD:** `docker compose up --build` deja el sistema completo funcionando desde cero.

### Fase 11 — Git y CI

**Git:** ramas `main` + `feature/*`, *Conventional Commits*, PRs pequeños, revisión obligatoria.

**Pipeline CI (GitHub Actions o equivalente), en cada PR:**
1. Backend: compilar → tests unitarios → tests de integración → cobertura → análisis estático.
2. Frontend: instalar (`npm ci`) → lint → Vitest → build de producción.
3. Construir imágenes Docker (sin publicar en PR).
4. Escaneo de dependencias y de imágenes (Dependabot/Trivy).
5. En `main`: publicar imágenes con tag versionado.

**DoD:** un PR no se puede fusionar con el pipeline en rojo.

### Fase 12 — Observabilidad y endurecimiento

- Logs JSON con correlation id, niveles por perfil.
- Métricas Micrometer (Prometheus) y trazas (OpenTelemetry).
- Revisión OWASP Top 10, `security-reviewer` sobre todo el código, revisión de rendimiento SQL con `EXPLAIN`.
- Documentación final: README, guía de despliegue, ADRs de decisiones clave.

---

## 6. Convenciones de código

### Java 25 / Spring
- DTOs como `record`; interfaces `sealed` para jerarquías cerradas cuando aporte.
- Inyección por constructor; sin `@Autowired` en campos.
- `Optional` solo como retorno, nunca como parámetro ni campo.
- Excepciones de dominio propias, traducidas a HTTP en un único lugar.
- Virtual threads habilitados si el perfil de carga lo justifica (`spring.threads.virtual.enabled=true`).
- Sin `System.out`; usar SLF4J.

### TypeScript / Angular
- `strict: true`; prohibido `any` (usar `unknown` y *narrowing*).
- Componentes standalone con `ChangeDetectionStrategy.OnPush`.
- `inject()` en lugar de constructor cuando simplifique.
- Un `subscribe` manual es una señal de alerta: preferir `async`/`toSignal`/`takeUntilDestroyed`.
- Nombres: `kebab-case` en archivos, `PascalCase` en clases, `camelCase` en variables.

### SQL
- Migraciones inmutables una vez fusionadas; nunca editar una migración aplicada.
- Índices creados solo con consulta que los justifique.
- Sin `SELECT *` en consultas nativas.

### API REST
- Prefijo `/api/v1`, recursos en plural, verbos HTTP correctos.
- Errores con `application/problem+json`.
- Paginación: `page`, `size`, `sort`.

---

## 7. Seguridad — checklist mínimo

- [ ] Contraseñas hasheadas (BCrypt/Argon2), nunca en logs.
- [ ] JWT de corta duración, firma con clave desde variable de entorno/secret.
- [ ] Refresh token con rotación y revocación.
- [ ] Autorización por rol validada en backend (`@PreAuthorize`).
- [ ] Validación de entrada en todos los DTOs; consultas parametrizadas (JPA).
- [ ] CORS con lista blanca; cabeceras de seguridad activas.
- [ ] Sin secretos en Git; `.env` en `.gitignore`; `.env.example` versionado.
- [ ] Dependencias escaneadas en CI.
- [ ] Mensajes de error que no filtran detalles internos.
- [ ] Contenedores sin root, imágenes mínimas.

---

## 8. Reglas de trabajo para el agente de IA

1. **Lee primero** `AGENTS.md`, el steering y la spec activa antes de escribir código.
2. Una tarea de `tasks.md` a la vez; cada tarea termina con **código + prueba + verificación ejecutada**.
3. Antes de dar una tarea por terminada, ejecuta: `./mvnw verify` (backend) y `npm test` + `npm run lint` + `npm run build` (frontend).
4. No añadas dependencias sin justificarlas en el mensaje de commit o en la spec.
5. Si un requisito es ambiguo, **pregunta** en lugar de suponer.
6. No modifiques migraciones ya aplicadas; crea una nueva.
7. Mantén los cambios pequeños y revisables; un commit por tarea con Conventional Commits.
8. Si una prueba falla, corrige la causa; nunca la borres ni la debilites para que pase.
9. Nunca ejecutes comandos destructivos ni apuntes a bases de datos que no sean las de desarrollo.
10. Al terminar cada fase, resume lo hecho, lo pendiente y los riesgos.

---

## 9. Comandos de referencia

```bash
# Infraestructura local
docker compose -f docker-compose.dev.yml up -d db

# Backend
cd backend
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
./mvnw verify

# Frontend
cd frontend
npm ci
npm start
npm test
npm run lint
npm run build

# Sistema completo
docker compose up --build
```

---

## 10. Criterios de aceptación finales

- [ ] `docker compose up --build` levanta BD, backend y frontend funcionando.
- [ ] Flujo completo: login → crear cliente → crear producto → registrar pedido → ver dashboard.
- [ ] Roles restringen correctamente acciones en UI **y** API.
- [ ] CI en verde con pruebas, cobertura y análisis estático.
- [ ] Cada feature tiene su spec (`requirements`, `design`, `tasks`) en `.kiro/specs/`.
- [ ] Steering, hooks, MCP, agentes y skills documentados y en uso.
- [ ] Documentación OpenAPI, README y ADRs actualizados.
