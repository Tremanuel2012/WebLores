export interface Game {
  title: string;
  slug: string;
  cover: string;
  description: string;
  year: number;
  developer: string;
  genre: string;
  themeColor: string;
}

export interface Character {
  name: string;
  slug: string;
  game: string;
  role: string;
  faction: string;
  quote: string;
  cover: string;
  gallery: string[];
  tags: string[];
  order: number;
  themeColor: string;
  lore: string;
}
