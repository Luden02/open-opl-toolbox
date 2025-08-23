declare interface Window {
  libraryAPI: {
    openAskDirectory: () => Promise<any>;
    getGamesFiles: (dirPath: string) => Promise<any>;
  };
}
