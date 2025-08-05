export interface ElectronAPI {
  showOpenDialog: (options?: any) => Promise<{ canceled: boolean; filePaths: string[] }>;
}