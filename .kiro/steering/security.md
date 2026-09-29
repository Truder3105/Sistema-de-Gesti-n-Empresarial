# Seguridad

- No guardes secretos, tokens ni credenciales reales en Git; usa variables de entorno y `.env` ignorado.
- Aplica autenticación y autorización en el backend; los guards de UI son solo UX.
- Valida entradas en DTOs y reglas de dominio en servicios; usa consultas parametrizadas.
- Hashea contraseñas con BCrypt/Argon2. Nunca registres credenciales o tokens.
- Limita CORS a orígenes configurados y no conectes herramientas MCP a bases productivas.
- Usa usuarios no root en contenedores de aplicación.
