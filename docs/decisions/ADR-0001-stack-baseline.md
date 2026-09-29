# ADR-0001: Versiones base del stack

- **Estado:** aceptada como baseline del proyecto el 2026-09-28
- **Contexto:** `PLAN.md` exige verificar Angular 22, Java 25 y Spring Boot 4.1.x contra documentación oficial.
- **Decisión:** Java 25, Spring Boot 4.1.1 y Angular 22.0.x, usando los rangos de parche de `backend/pom.xml` y `frontend/package.json`.

## Evidencia y compatibilidad

- Spring Boot 4.1.1 es una versión estable. Su rango declarado es Java 17–26; el Java 27 instalado localmente queda fuera del soporte declarado.
- Angular 22 admite Node `^22.22.3`, `^24.15.0` o `^26.0.0`; el Node 24.21.0 instalado cumple.
- La política del proyecto conserva Java 25 y Angular 22 según el plan aprobado; los parches deben mantenerse en sus líneas compatibles y verificarse antes de actualizar.

## Consecuencias

- La verificación del backend requiere JDK 25 (o una versión compatible hasta 26) y Maven.
- La verificación del frontend puede ejecutarse con el Node local disponible.
- No se fija Spring Boot 4.2 preview ni se actualiza Angular a una versión mayor sin spec/decisión aprobada.

## Fuentes oficiales

- [Spring Boot 4.1.1 System Requirements](https://docs.spring.io/spring-boot/system-requirements.html)
- [Angular releases](https://angular.dev/reference/releases)
- [Angular version compatibility](https://angular.dev/reference/versions)
