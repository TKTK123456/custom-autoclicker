import robot from "robotjs";
import { app, BrowserWindow, ipcMain } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs/promises";
import ejs from "ejs";
import { uIOhook, UiohookKey, UiohookKeyboardEvent } from "uiohook-napi";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const data: Record<string, any> = {
  buildingDropdown: "",
};
//Name: Keyboard key
const units = {
  City: 1,
  Factory: 2,
  Port: 3,
  Silo: 5,
  SAM: 6,
  "Atom Bomb": 8,
  Hydro: 9,
  Warship: 7,
  MIRV: 0,
};
type Unit = keyof typeof units;
for (const key of Object.keys(units)) {
  data.buildingDropdown += `<option value="${key}">${key}</option>`;
}

async function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,

    webPreferences: {
      preload: path.join(__dirname, "client", "preload.mjs"),
      sandbox: false,
    },
  });

  const templatePath = path.join(__dirname, "client", "index.ejs");

  const outputPath = path.join(__dirname, "client", "index.html");

  try {
    const html = await ejs.renderFile(templatePath, data);

    await fs.writeFile(outputPath, html);

    await win.loadFile(outputPath);
  } catch (err) {
    console.error("Failed to render EJS:", err);
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
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
  while (Date.now() - (amountThisMin[0] ?? Infinity) >= 60000) {
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
