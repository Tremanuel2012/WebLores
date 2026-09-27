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
