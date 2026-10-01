# CONTEXTO COMPLETO — WebLores (Parte 2 de 3)

## BLOQUE 2 — Archivos clave en crudo (Parte 2/2)

### **src/lib/content.ts**
```typescript
import * as yaml from 'js-yaml';

import type { Game, Character } from '../types/content';

// Importa todos los archivos markdown de content
const gameFiles = import.meta.glob('/content/games/*.md', { query: '?raw', import: 'default', eager: true });
const characterFiles = import.meta.glob('/content/characters/*/*.md', { query: '?raw', import: 'default', eager: true });

const withBase = (path: string | undefined): string => {
  if (!path) return '';
  // Si ya es una URL externa (http/https), déjala tal cual
  if (path.startsWith('http')) return path;
  // Quita la barra inicial si existe, y prefija con BASE_URL
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${import.meta.env.BASE_URL}${cleanPath}`;
};

const parseMarkdown = (rawContent: string) => {
  const match = rawContent.match(/^---\r?\n([\s\S]*?)\r?\n---(\r?\n|$)/);
  if (!match) return { data: {}, content: rawContent };
  
  const frontmatterRaw = match[1];
  const content = rawContent.slice(match[0].length);
  
  const data = yaml.load(frontmatterRaw) as any;
  return { data, content };
};

export const getAllGames = (): Game[] => {
  return Object.entries(gameFiles).map(([_, content]) => {
      const { data, content: markdownContent } = parseMarkdown(content as string);
    return {
      ...data,
      cover: withBase(data.cover),
      content: markdownContent
    } as Game;
  });
};

export const getGameBySlug = (slug: string): Game | undefined => {
  return getAllGames().find(game => game.slug === slug);
};

export const getCharactersByGame = (gameSlug: string): Character[] => {
  return Object.entries(characterFiles)
    .filter(([path]) => path.includes(`/content/characters/${gameSlug}/`))
    .map(([_, content]) => {
      const { data, content: markdownContent } = parseMarkdown(content as string);
      return {
        ...data,
        cover: withBase(data.cover),
        gallery: (data.gallery || []).map(withBase),
        content: markdownContent
      } as Character;
    })
    .sort((a, b) => (a.order || 0) - (b.order || 0));
};

export const getCharacterBySlug = (gameSlug: string, charSlug: string): Character | undefined => {
  return getCharactersByGame(gameSlug).find(char => char.slug === charSlug);
};

export const getAllCharacters = (): Character[] => {
  return Object.entries(characterFiles)
    .map(([_, content]) => {
      const { data, content: markdownContent } = parseMarkdown(content as string);
      return {
        ...data,
        cover: withBase(data.cover),
        gallery: (data.gallery || []).map(withBase),
        content: markdownContent
      } as Character;
    });
};
```

### **public/admin/config.yml**
```yaml

backend:
  name: 'git-gateway'
  branch: 'main'

local_backend: true

media_folder: 'public/images/uploads'
public_folder: '/images/uploads'

collections:
  - name: 'games'
    label: 'Juegos'
    label_singular: 'Juego'
    folder: 'content/games'
    create: true
    identifier_field: 'title'
    summary: '{{title}} ({{genre}})'
    fields:
      - { label: 'Título', name: 'title', widget: 'string' }
      - { label: 'Slug (URL)', name: 'slug', widget: 'string', hint: 'Ej: hollow-knight' }
      - { label: 'Portada', name: 'cover', widget: 'image', required: false }
      - { label: 'Descripción', name: 'description', widget: 'text', required: false }
      - { label: 'Año', name: 'year', widget: 'number', value_type: 'int', required: false }
      - { label: 'Desarrollador', name: 'developer', widget: 'string', required: false }
      - { label: 'Género', name: 'genre', widget: 'string', required: false }
      - { label: 'Color del tema (hex)', name: 'themeColor', widget: 'string', required: false, default: '#8b5cf6' }
      - { label: 'Cuerpo (Lore)', name: 'body', widget: 'markdown', required: false }

  - name: 'characters'
    label: 'Personajes'
    label_singular: 'Personaje'
    folder: 'content/characters'
    create: true
    nested:
      depth: 2
    path: '{{game}}/{{slug}}'
    identifier_field: 'name'
    summary: '{{name}} — {{role}}'
    fields:
      - { label: 'Nombre', name: 'name', widget: 'string' }
      - { label: 'Slug (URL)', name: 'slug', widget: 'string', hint: 'Ej: hornet' }
      - { label: 'Juego (slug)', name: 'game', widget: 'string', hint: 'Ej: hollow-knight' }
      - { label: 'Rol', name: 'role', widget: 'string', required: false }
      - { label: 'Facción', name: 'faction', widget: 'string', required: false }
      - { label: 'Cita', name: 'quote', widget: 'text', required: false }
      - { label: 'Retrato', name: 'cover', widget: 'image', required: false }
      - { label: 'Galería', name: 'gallery', widget: 'list', required: false, field: { label: 'Imagen', name: 'image', widget: 'image' } }
      - { label: 'Tags', name: 'tags', widget: 'list', required: false, default: [] }
      - { label: 'Orden', name: 'order', widget: 'number', value_type: 'int', required: false, default: 1 }
      - { label: 'Color del tema (hex)', name: 'themeColor', widget: 'string', required: false, default: '#8b5cf6' }
      - { label: 'Cuerpo (Lore)', name: 'body', widget: 'markdown', required: false }
```

### **public/admin/index.html**
```html
<!DOCTYPE html>
<html lang='es'>
<head>
<meta charset='utf-8' />
<meta name='viewport' content='width=device-width, initial-scale=1.0' />
<meta name='decap-cms-local-backend' content='true' />
<title>Panel de Administración - WebLores</title>
<script src='https://identity.netlify.com/v1/netlify-identity-widget.js'></script>
</head>
<body>
<script src='https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js'></script>
</body>
</html>
```

### **.github/workflows/deploy.yml**
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Deploy
        id: deployment
        uses: actions/deploy-pages@v4
```

### **scripts/sync-folders.mjs**
```javascript
import { execSync } from 'node:child_process';
import { readdir, mkdir, writeFile } from 'node:fs/promises';
import { join, parse } from 'node:path';

// Colores ANSI
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const CYAN = '\x1b[36m';
const RESET = '\x1b[0m';

async function run() {
  try {
    const cwd = process.cwd();
    const gamesDir = join(cwd, 'content/games');
    const charactersDir = join(cwd, 'content/characters');

    // 1. Comprobar git status
    const status = execSync('git status --porcelain', { encoding: 'utf-8' });
    if (status.trim() !== '') {
      console.error(`${RED}❌ Error: Hay cambios locales sin commitear.${RESET}`);
      process.exit(1);
    }

    // 2. Ejecutar git pull --rebase
    try {
      execSync('git pull --rebase', { stdio: 'inherit' });
    } catch (e) {
      console.error(`${RED}❌ Error: Falló el git pull --rebase.${RESET}`);
      process.exit(1);
    }

    // 3. Listar juegos
    const gameFiles = await readdir(gamesDir);
    const gameSlugs = gameFiles
      .filter(file => file.endsWith('.md'))
      .map(file => parse(file).name);

    // 4. Listar carpetas de personajes
    const charFolders = await readdir(charactersDir);

    // 5. Comparar
    const missingFolders = gameSlugs.filter(slug => !charFolders.includes(slug));

    // 7. Salir si nada que crear
    if (missingFolders.length === 0) {
      console.log(`${CYAN}✨ Todo sincronizado.${RESET}`);
      process.exit(0);
    }

    // 6. Crear carpetas
    for (const slug of missingFolders) {
      const folderPath = join(charactersDir, slug);
      await mkdir(folderPath, { recursive: true });
      await writeFile(join(folderPath, '.gitkeep'), '');
      console.log(`${YELLOW}🔧 Creada carpeta:${RESET} ${slug}`);
    }

    // 8. Commit y push
    execSync('git add content/characters/');
    execSync('git commit -m "Sync: crear carpetas de personajes para juegos nuevos"');
    execSync('git push');

    console.log(`${GREEN}✅ Carpetas creadas: ${missingFolders.length}. Push realizado.${RESET}`);
    process.exit(0);

  } catch (err) {
    console.error(`${RED}❌ Error inesperado:${RESET}`, err);
    process.exit(1);
  }
}

run();
```

### **scripts/organize-images.mjs**
```javascript
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const CONTENT_DIR = path.join(ROOT, 'content');
const PUBLIC_DIR = path.join(ROOT, 'public');

const log = (msg, color = '\x1b[36m') => console.log(`${color}${msg}\x1b[0m`);
const warn = (msg) => console.log(`\x1b[33mWarning: ${msg}\x1b[0m`);
const error = (msg) => console.log(`\x1b[31mError: ${msg}\x1b[0m`);

function runCommand(cmd) {
  try {
    return execSync(cmd, { stdio: 'pipe', encoding: 'utf-8' });
  } catch (e) {
    throw new Error(e.stderr || e.message);
  }
}

async function getFiles(dir) {
      const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(entries.map((res) => {
    const resPath = path.resolve(dir, res.name);
    return res.isDirectory() ? getFiles(resPath) : resPath;
  }));
  return files.flat();
      }

async function organize() {
  try {
    log('--- Iniciando reorganización de imágenes ---');

    // 1. Git Checks
    if (runCommand('git status --porcelain').trim()) {
      error('Hay cambios sin commitear. Abortando.');
      process.exit(1);
    }
    log('Pulling latest changes...');
    runCommand('git pull --rebase');

    const allFiles = await getFiles(CONTENT_DIR);
    const mdFiles = allFiles.filter(f => f.endsWith('.md'));
    const movements = [];

    // 2. Procesar MDs
    let modifiedFilesCount = 0;
    for (const filePath of mdFiles) {
      const fullContent = await fs.readFile(filePath, 'utf8');
      const match = fullContent.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
      if (!match) continue;

      const isCRLF = fullContent.includes('\r\n');
      const eol = isCRLF ? '\r\n' : '\n';

      const originalYamlStr = match[1];
      let newYamlStr = originalYamlStr;
      const data = yaml.load(originalYamlStr);
      const body = fullContent.slice(match[0].length);

      const isGame = filePath.includes(path.sep + 'games' + path.sep);
      const isChar = filePath.includes(path.sep + 'characters' + path.sep);
      if (!isGame && !isChar) continue;

      const gameSlug = isGame ? data.slug : data.game;
      const charSlug = isChar ? data.slug : null;
      if (!gameSlug) continue;

      const processImg = async (oldPath, isGallery = false, index = 0) => {
        if (!oldPath || oldPath.startsWith('http')) return null;

        const ext = path.extname(oldPath);
        const sourcePath = oldPath.startsWith('/') 
          ? path.join(PUBLIC_DIR, oldPath)
          : path.resolve(path.dirname(filePath), oldPath);

        const destDir = isGame 
          ? path.join(PUBLIC_DIR, 'images', 'games', gameSlug)
          : path.join(PUBLIC_DIR, 'images', 'characters', gameSlug, charSlug);
        
        const destName = isGallery ? `gallery-${index + 1}${ext}` : `cover${ext}`;
        const destPath = path.join(destDir, destName);

        if (sourcePath === destPath) return null;
        try {
          await fs.mkdir(destDir, { recursive: true });
          await fs.rename(sourcePath, destPath);
          log(`→ ${path.basename(oldPath)} → ${path.relative(PUBLIC_DIR, destPath)}`);
          movements.push({ from: oldPath, to: destPath });
          return `/images${destPath.split(path.join(PUBLIC_DIR, 'images'))[1].replace(/\\/g, '/')}`;
        } catch (e) {
          warn(`No se pudo mover ${oldPath}: ${e.message}`);
          return null;
        }
      };

      let changedInFile = false;

      if (data.cover) {
        const newPath = await processImg(data.cover);
        if (newPath) {
          newYamlStr = newYamlStr.replace(new RegExp(data.cover.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), newPath);
          changedInFile = true;
        }
      }

      if (Array.isArray(data.gallery)) {
        for (let i = 0; i < data.gallery.length; i++) {
          const oldPath = data.gallery[i];
          const newPath = await processImg(oldPath, true, i);
          if (newPath) {
            newYamlStr = newYamlStr.replace(new RegExp(oldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), newPath);
            changedInFile = true;
          }
        }
      }

      if (changedInFile) {
        await fs.writeFile(filePath, `---${eol}${newYamlStr}${eol}---${eol}${body}`);
        modifiedFilesCount++;
      }
    }

    // 3. Aviso imágenes huérfanas
    const uploadsPath = path.join(PUBLIC_DIR, 'images', 'uploads');
    try {
      const orphans = await fs.readdir(uploadsPath);
      if (orphans.length > 0) {
        warn(`Imágenes en uploads/ detectadas: ${orphans.join(', ')}. Por favor, verifícalas manualmente.`);
      }
    } catch (e) { /* no existe la carpeta */ }

    // 4. Git Commit
    if (movements.length > 0) {
      runCommand('git add public/images/ content/');
      runCommand('git commit -m "Organize: mover y renombrar imágenes"');
      runCommand('git push');
      log(`Completado: ${movements.length} imágenes movidas en ${modifiedFilesCount} archivos.`, '\x1b[32m');
    } else {
      log('No se requirieron movimientos.');
    }

  } catch (err) {
    error(err.message);
    process.exit(1);
  }
}

organize();
```

## BLOQUE 2.B — Estructura actual de content/
- content/characters/hollow-knight/hornet.md
- content/characters/hollow-knight/the-knight.md
- content/characters/world-of-warcraft/arthas.md
- content/games/hollow-knight.md
- content/games/world-of-warcraft.md

## BLOQUE 2.C — Ejemplos de .md reales
### content/games/hollow-knight.md
```markdown
---

title: Hollow Knight
slug: hollow-knight
cover: /images/games/hollow-knight/cover.jpg
description: Una aventura épica en el reino decadente de Hallownest.
year: 2017
developer: Team Cherry
genre: Metroidvania
themeColor: #f59e0b
---
```

### content/characters/hollow-knight/hornet.md
```markdown
---

name: Hornet
slug: hornet
game: hollow-knight
role: Protectora
faction: Hallownest
quote: "Git gud!"
cover: /images/characters/hollow-knight/hornet/cover.jpg
gallery:
  - /images/characters/hollow-knight/hornet/gallery-1.jpg
  - /images/characters/hollow-knight/hornet/gallery-2.jpg
  - /images/characters/hollow-knight/hornet/gallery-3.jpg
tags: [protectora, guardiana]
order: 2
themeColor: #ef4444
---

La protectora de las ruinas de Hallownest, Hornet blande su aguja con precisión letal. Vigilante ante cualquiera que se atreva a profanar los restos de su reino, observa los pasos del recipiente con cautela.
```


