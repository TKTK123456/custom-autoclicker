import { contextBridge, ipcRenderer } from "electron/renderer";

contextBridge.exposeInMainWorld("autoclicker", {
  toggle: () => ipcRenderer.invoke("autoclicker:toggle"),
});
