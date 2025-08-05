import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld('electronAPI', {
    showOpenDialog: (options?: any) => ipcRenderer.invoke('show-open-dialog', options),
    readDirectory: (dirPath: string) => ipcRenderer.invoke('read-directory', dirPath),
})
