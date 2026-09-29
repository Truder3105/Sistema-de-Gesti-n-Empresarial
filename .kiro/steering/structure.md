# Estructura

- Organiza backend y frontend por módulo de negocio, no por tipo técnico global.
- Conserva Controller → Service → Repository. Los controllers solo traducen HTTP y delegan.
- Mantén entidades JPA internas; expón DTOs únicamente.
- Coloca configuración transversal en `backend/.../config` y `common`; servicios singleton de UI en `frontend/src/app/core`.
- Usa `/api/v1`, nombres de archivo `kebab-case` en TypeScript y paquetes Java bajo `com.empresa.gestion`.
