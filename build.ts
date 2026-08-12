import { execFileSync } from "node:child_process";
import { mkdir, rm, cp, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import ejs from "ejs";
import { units } from "./src/shared/sharedInfo.js";

const root = process.cwd();
const srcClient = path.join(root, "src/client");
const buildDir = path.join(root, "build");
const buildClient = path.join(buildDir, "client");

console.log("Cleaning build directory...");
await rm(buildDir, { recursive: true, force: true });

console.log("Running TypeScript compiler...");
execFileSync("npx", ["tsc"], {
    stdio: "inherit"
});

await mkdir(buildClient, { recursive: true });

console.log("Renaming client JavaScript files...");

for (const file of await readdir(buildClient)) {
    if (file.endsWith(".js")) {
        const oldPath = path.join(buildClient, file);
        const newPath = path.join(
            buildClient,
            file.slice(0, -3) + ".mjs"
        );

        await cp(oldPath, newPath);
        await rm(oldPath);
    }
}

console.log("Rendering EJS...");

const indexTemplate = path.join(srcClient, "index.ejs");
const indexOutput = path.join(buildClient, "index.html");
const data: Record<string, any> = {
  buildingDropdown: "",
};
for (const key of Object.keys(units)) {
  data.buildingDropdown += `<option value="${key}">${key}</option>`;
}
const html = await ejs.renderFile(indexTemplate, data);

await writeFile(indexOutput, html);

console.log("Build complete!");