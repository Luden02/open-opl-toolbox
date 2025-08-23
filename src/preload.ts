import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("libraryAPI", {
  openAskDirectory: () => ipcRenderer.invoke("open-ask-directory"),
  getGamesFiles: (dirPath: string) =>
    ipcRenderer.invoke("get-games-files", dirPath),
});
