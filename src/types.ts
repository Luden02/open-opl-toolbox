export interface ElectronAPI {
  showOpenDialog: (
    options?: any
  ) => Promise<{ canceled: boolean; filePaths: string[] }>;
  readDirectory: (dirPath: string) => Promise<DirectoryContents>;
  get3DCoverArt: (gameId: string) => Promise<{ success: boolean; data: any }>;
  getAsset: (asset: string) => Promise<object>;
  renameGame: (
    filePath: string,
    newGameName: string,
    newGameId: string
  ) => Promise<object>;
  importGameArt: (gameId: string, dirpath: string) => Promise<object>;
  downloadGameArt: (gameId: string, dirpath: string) => Promise<object>;
}

export interface GameObject {
  name: string;
  gameId: string;
  type: "PS2" | "PS1" | "APP";
  size: string;
  diskType: "CD" | "DVD";
  isValid: boolean;
  art?: {
    coverart3d?: string;
    front_cover?: boolean;
    back_cover?: boolean;
    disc_icon?: boolean;
    spine_cover?: boolean;
    screen_1?: boolean;
    screen_2?: boolean;
    background?: boolean;
    logo?: boolean;
  };
}

export interface Library {
  loadedDirectory: string | null;
  cdGamesList: GameObject[];
  dvdGamesList: GameObject[];
  selectedGame: GameObject | null;
}

export interface FileSystemItem {
  name: string;
  path: string;
  isDirectory: boolean;
  isFile: boolean;
  size: number;
  modified: Date;
}

export interface DirectoryContents {
  directories: FileSystemItem[];
  files: FileSystemItem[];
}
