import { contextBridge, ipcRenderer } from "electron/renderer";

contextBridge.exposeInMainWorld("autoclicker", {
  setKey: (key: string) => ipcRenderer.invoke("autoclicker:setKey", key),
  stop: () => ipcRenderer.invoke("autoclicker:stop"),
});
