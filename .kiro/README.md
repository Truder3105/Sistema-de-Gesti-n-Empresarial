# Kiro en este repositorio

- Usa `.kiro/steering/` como contexto persistente y `.kiro/agents/` para perfiles especializados del proyecto.
- Los hooks están en `.kiro/hooks/` con formato `v1`; los hooks de calidad piden al agente ejecutar los comandos aplicables, y las verificaciones siempre deben reportarse con evidencia.
- Las habilidades siguen el formato `SKILL.md` con frontmatter `name` y `description`.
- Cada feature debe pasar por `requirements.md` → aprobación humana → `design.md` → aprobación humana → `tasks.md` → aprobación humana antes de implementación.
- `.kiro/settings/mcp.json` está válido pero no activa servidores: primero debe existir una cuenta de PostgreSQL de desarrollo con permisos de solo lectura y un servidor MCP local instalado/configurado. Nunca apuntar MCP a producción.
- Verifica en la interfaz de Kiro que cada perfil y hook aparece y funciona antes de dar por cumplido el DoD de Kiro.
