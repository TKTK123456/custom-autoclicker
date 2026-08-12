import { contextBridge, ipcRenderer } from "electron/renderer";

contextBridge.exposeInMainWorld("autoclicker", {
    run: () => ipcRenderer.invoke("autoclicker:run")
});
