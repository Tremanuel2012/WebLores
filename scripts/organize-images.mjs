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
      const match = fullContent.match(/^---[\s\S]*?---\n/);
      if (!match) continue;

      const originalYamlStr = match[0].replace(/^---/, '').replace(/---\n$/, '');
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
        await fs.writeFile(filePath, `---\n${newYamlStr}---\n${body}`);
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

