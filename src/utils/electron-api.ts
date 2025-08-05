export interface ElectronAPI {
  showOpenDialog: (options?: any) => Promise<{ canceled: boolean; filePaths: string[] }>;
  readDirectory: (dirPath: string) => Promise<DirectoryContents>;
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