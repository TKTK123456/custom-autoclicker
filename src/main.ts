import robot from "robotjs";
import { app, BrowserWindow, ipcMain } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs/promises";
import ejs from "ejs";

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
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

ipcMain.handle("autoclicker:toggle", () => {
  robot.mouseClick();
  console.log("hi");
});
