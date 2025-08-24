import { contextBridge, ipcRenderer } from "electron";
import { getArtFolder } from "./library.service";

contextBridge.exposeInMainWorld("libraryAPI", {
  openAskDirectory: () => ipcRenderer.invoke("open-ask-directory"),
  getGamesFiles: (dirPath: string) =>
    ipcRenderer.invoke("get-games-files", dirPath),
  getArtFolder: (dirPath: string) =>
    ipcRenderer.invoke("get-art-folder", dirPath),
});
