# Fase 1 — Fundaciones

**Estado:** en curso. No avanzar a la Fase 2 hasta cerrar todos los puntos del DoD.

## Trabajo preparado

- Inicializado Git; incluidos `.gitignore`, `PLAN.md`, `README.md`, `AGENTS.md` y `.env.example`. El rename inicial a `main` no se pudo terminar porque el sandbox bloquea la escritura de `.git/HEAD`; por ahora Git muestra `master`.
- Creados cinco archivos de steering, cinco hooks, seis agentes, cinco skills y la configuración MCP de workspace.
- Añadido el esqueleto Spring Boot 4.1.1/Java 25, PostgreSQL/Flyway/Actuator, perfil dev, seguridad cerrada por defecto salvo el health check y Maven Wrapper 3.3.4.
- Añadido el esqueleto Angular 22 standalone con routing y TypeScript strict.
- Compose dev define PostgreSQL con volumen y healthcheck; hay un `.env` local con credenciales de desarrollo de ejemplo, excluido de Git. `.env.example` se versiona como plantilla.

## Verificaciones ejecutadas

- `npm install --no-audit --no-fund`: completó.
- `npm run build`: completó correctamente con Angular CLI 22.
- `npm start -- --host 127.0.0.1`: servidor iniciado y respuesta HTTP 200; la página contenía “Gestión Empresarial”.
- `mvn -B verify` con Maven 3.9.16 y Java 27: BUILD SUCCESS; compiló dos fuentes con `--release 25`. Todavía no hay fuentes de prueba.
- El Maven Wrapper generado se invocó, pero su descarga de Maven mediante PowerShell falló por error de recepción TLS. El build directo con Maven sí funcionó.
- Los perfiles/hook de Kiro se prepararon conforme al formato documentado, pero no se validó su carga desde la UI de Kiro.

## Pendiente para cerrar el DoD

- Docker no está instalado/disponible en este entorno; no se pudo levantar ni verificar PostgreSQL ni el healthcheck de Compose.
- Solo está disponible Java 27. Spring Boot 4.1.1 declara compatibilidad hasta Java 26, así que el arranque no queda validado con un JDK soportado.
- No se pudo iniciar el backend contra una base de datos dev confirmada ni comprobar `/actuator/health` en ejecución.
- Falta validar los agentes y hooks desde la UI de Kiro y habilitar servidores MCP solo cuando exista un PostgreSQL dev de solo lectura.

**Criterio de salida:** `docker compose up db` saludable, backend arrancado con JDK soportado y `/actuator/health` confirmado, frontend compilado y servido, y configuración Kiro validada. Después se revisa y aprueba la siguiente spec antes de comenzar su implementación.
