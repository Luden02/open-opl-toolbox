import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electron", {
  sendMessage: (channel: string, data: any) => ipcRenderer.send(channel, data),
  getData: (channel: string) => ipcRenderer.invoke(channel),
  onDataUpdate: (callback: any) => ipcRenderer.on("update-data", callback),
});
