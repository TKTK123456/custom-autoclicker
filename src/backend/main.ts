import robot from "robotjs";
import { app, BrowserWindow, ipcMain } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { uIOhook, UiohookKey, UiohookKeyboardEvent } from "uiohook-napi";
import { RateLimitInfo } from "../shared/sharedTypes.js";
import { Unit, units } from "../shared/sharedInfo.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


async function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,

    webPreferences: {
      preload: path.join(__dirname, "../client", "preload.mjs"),
      sandbox: false,
    },
  });
  const htmlPath = path.join(__dirname, "../client", "index.html");

  await win.loadFile(htmlPath);
}
let mainWindow: Electron.BrowserWindow;

app.whenReady().then(async () => {
  await createWindow();
  mainWindow = BrowserWindow.getAllWindows()[0];
  app.on("activate", async () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      await createWindow();
      mainWindow = BrowserWindow.getAllWindows()[0];
    }
  });
  uIOhook.start();
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
const clickerIntervalMs = 100;
const maxPerMin = 150;
let clickerInterval: number | undefined | NodeJS.Timeout = undefined;
const amountThisMin: number[] = [];
let unit: Unit = "City";
function doClick() {
  while (Date.now() - (amountThisMin[11] ?? Infinity) >= 60000) {
    amountThisMin.shift();
  }
  if (amountThisMin.length < maxPerMin) {
    const key = units[unit].toString();
    if (unit != "Atom Bomb") {
      robot.keyTap(key);
      if (unit !== "MIRV" && unit !== "Hydro" && unit !== "Warship")
        robot.keyTap(key);
    }
    robot.mouseClick();
    amountThisMin.push(Date.now());
  }
  const data: RateLimitInfo = { amount: amountThisMin.length, max: maxPerMin };
  mainWindow.webContents.send("autoclicker:rateLimitInfo", data);
}
function start() {
  stop();
  if (unit === "Atom Bomb") {
    const key = units[unit].toString();
    robot.keyTap(key);
    robot.keyTap(key);
  }
  clickerInterval = setInterval(doClick, clickerIntervalMs);
}
function stop() {
  if (clickerInterval !== undefined) {
    clearInterval(clickerInterval);
    clickerInterval = undefined;
  }
}
ipcMain.handle("autoclicker:setKey", (e: any, setUnit: Unit) => {
  unit = setUnit;
});
ipcMain.handle("autoclicker:stop", stop);
uIOhook.on("keydown", (e: UiohookKeyboardEvent) => {
  if (e.keycode === UiohookKey.Z && e.ctrlKey) {
    if (clickerInterval === undefined) {
      start();
    } else {
      stop();
    }
  }
});
