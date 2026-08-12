import { contextBridge, ipcRenderer } from "electron/renderer";
import { RateLimitInfo } from "src/shared/sharedTypes.js";

contextBridge.exposeInMainWorld("autoclicker", {
  setKey: (key: string) => ipcRenderer.invoke("autoclicker:setKey", key),
  stop: () => ipcRenderer.invoke("autoclicker:stop"),
  onRateLimitInfo: (callback: (data: RateLimitInfo) => void) => {
    ipcRenderer.on("autoclicker:rateLimitInfo", (_, data: RateLimitInfo) => {
      callback(data);
    });
  },
});
