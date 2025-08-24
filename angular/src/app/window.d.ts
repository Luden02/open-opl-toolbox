declare interface Window {
  libraryAPI: {
    openAskDirectory: () => Promise<any>;
    getGamesFiles: (dirPath: string) => Promise<any>;
    getArtFolder: (dirPath: string) => Promise<any>;
  };
}
