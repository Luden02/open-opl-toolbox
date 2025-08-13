import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  showOpenDialog: (options?: any) =>
    ipcRenderer.invoke("show-open-dialog", options),
  readDirectory: (dirPath: string) =>
    ipcRenderer.invoke("read-directory", dirPath),
  get3DCoverArt: (gameId: string) =>
    ipcRenderer.invoke("get-3d-coverart", gameId),
  getAsset: (asset: string) => ipcRenderer.invoke("get-asset", asset),
  renameGame: (filePath: string, newGameName: string, newGameId: string) =>
    ipcRenderer.invoke("rename-game", filePath, newGameName, newGameId),
  importGameArt: (gameId: string, dirpath: string) =>
    ipcRenderer.invoke("import-gameart", gameId, dirpath),
  downloadGameArt: (gameId: string, dirpath: string) =>
    ipcRenderer.invoke("download-gameart", gameId, dirpath),
});
