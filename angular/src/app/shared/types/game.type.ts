export type Game = {
  filename: string;
  size: number;
  gameId?: string;
  region?: 'NTSC-U' | 'PAL' | 'NTSC-J' | 'UNKNOWN';
  title?: string;
  lastModified?: Date;
  valid: boolean;
};
