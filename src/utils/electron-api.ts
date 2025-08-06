export interface ElectronAPI {
  showOpenDialog: (
    options?: any
  ) => Promise<{ canceled: boolean; filePaths: string[] }>;
  readDirectory: (dirPath: string) => Promise<DirectoryContents>;
  get3DCoverArt: (gameId: string) => Promise<string>;
  getAsset: (asset: string) => Promise<object>;
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
