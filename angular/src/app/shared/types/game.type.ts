export type Game = {
  filename: string;
  size?: string;
  gameId: string;
  region?: 'NTSC-U' | 'PAL' | 'NTSC-J' | 'UNKNOWN';
  cdType: string;
  title?: string;
  path: string;
  extension: string;
  parentPath: string;
};

export type RawGameFile = {
  extension: string;
  name: string;
  parentPath: string;
  path: string;
  stats?: {
    dev: number;
    mode: number;
    nlink: number;
    uid: number;
    gid: number;
    rdev: number;
    blksize: number;
    ino: number;
    size: number;
    blocks: number;
    atimeMs: number;
    mtimeMs: number;
    ctimeMs: number;
    birthtimeMs: number;
    atime: string;
    mtime: string;
    ctime: string;
    birthtime: string;
  };
};
