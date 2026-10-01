# CONTEXTO COMPLETO — WebLores (Parte 3.1 — Complemento)
## BLOQUE 4 — Estado actual del proyecto
- **Fecha**: 2025-09-30
- **Despliegue**: GitHub Pages (deploy automático con GitHub Actions).
- **Funcionalidades completas**:
- Publicación en GitHub Pages.
- CMS autogestionable (Decap + Netlify Identity + Git Gateway).
- Scripts de automatización (sync + organize).
- Sistema de partículas adaptativo (canvas desktop, DOM móvil).
- Galería con carrusel y Lightbox.
- Transiciones entre páginas, scroll progress, custom cursor.
- Detección móvil y responsive.
- **Bugs conocidos y aceptados**:
- Contador del Lightbox removido por bug de sincronización táctil.
- **Decisiones de diseño tomadas**:
- HashRouter por base '/WebLores/'.
- AnimatePresence dentro de Layout.
- Partículas DOM en móvil por rendimiento.
- **Archivos residuales por limpiar**:
- `REPORTE_PROYECTO.md`
- `src/App.css`
- **Archivo huérfano**: `src/components/GlobalBackground.tsx` existe pero 
NO se renderiza en `App.tsx`. Tiene blobs animados con blur-120px 
(potencialmente pesados en móvil). Pendiente decidir: integrar / mantener 
/ borrar.
## BLOQUE 5 — Próximos pasos sugeridos
1. **Subtítulos animados del lore** (## y ### con estilo + fade-in al scroll).
2. **Pulido final**:
- SEO (og:image, description).
- Título dinámico por página.
- Favicon personalizado.
3. **Limpieza de archivos residuales**.
4. **Añadir más contenido** (juegos y personajes).
## NOTA DE USO
Este archivo es un complemento de CONTEXTO_PARTE_3.md. Al pegar el contexto 
en un chat nuevo, se debe pegar en este orden:
1. CONTEXTO_PARTE_1.md
2. CONTEXTO_PARTE_2.md
3. CONTEXTO_PARTE_3.md (contiene Bloques 0-3.B e instrucciones al asistente)
4. CONTEXTO_PARTE_3_1.md (este archivo, con Bloques 4 y 5)
El asistente debe leer los 4 archivos como un todo continuo.
