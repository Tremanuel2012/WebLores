import * as yaml from 'js-yaml';

import type { Game, Character } from '../types/content';

// Importa todos los archivos markdown de content
const gameFiles = import.meta.glob('/content/*/_game.md', { query: '?raw', import: 'default', eager: true });
const characterFiles = import.meta.glob('/content/*/*.md', { query: '?raw', import: 'default', eager: true });

const parseMarkdown = (rawContent: string) => {
  const match = rawContent.match(/^---[\s\S]*?---\n/);
  if (!match) return { data: {}, content: rawContent };
  
  const frontmatterRaw = match[0].replace(/---/g, '').trim();
  const content = rawContent.slice(match[0].length);
  
  const data = yaml.load(frontmatterRaw) as any;
  return { data, content };
};

export const getAllGames = (): Game[] => {
  return Object.entries(gameFiles).map(([_, content]) => {
    const { data, content: markdownContent } = parseMarkdown(content as string);
    return { ...data, content: markdownContent } as Game;
  });
};

export const getGameBySlug = (slug: string): Game | undefined => {
  return getAllGames().find(game => game.slug === slug);
};

export const getCharactersByGame = (gameSlug: string): Character[] => {
  return Object.entries(characterFiles)
    .filter(([path]) => path.includes(`/content/${gameSlug}/`) && !path.endsWith('_game.md'))
    .map(([_, content]) => {
      const { data, content: markdownContent } = parseMarkdown(content as string);
      return { ...data, content: markdownContent } as Character;
    })
    .sort((a, b) => (a.order || 0) - (b.order || 0));
};

export const getCharacterBySlug = (gameSlug: string, charSlug: string): Character | undefined => {
  return getCharactersByGame(gameSlug).find(char => char.slug === charSlug);
};

export const getAllCharacters = (): Character[] => {
  return Object.entries(characterFiles)
    .filter(([path]) => !path.endsWith('_game.md'))
    .map(([_, content]) => {
      const { data, content: markdownContent } = parseMarkdown(content as string);
      return { ...data, content: markdownContent } as Character;
    });
};
