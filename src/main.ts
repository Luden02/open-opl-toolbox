import { app, BrowserWindow, screen } from "electron";
import path from "path";
import electronReloader from "electron-reloader";

app.whenReady().then(() => {
  const args = process.argv.slice(1);
  const serve = args.includes("--serve");
  const size = screen.getPrimaryDisplay().workAreaSize;

  let win = new BrowserWindow({
    width: size.width,
    height: size.height,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
    },
  });

  if (serve) {
    electronReloader(module);
    win.loadURL("http://localhost:4200");
  } else {
    win.loadFile(path.join(__dirname, "angular/browser/index.html"));
  }

  win.on("closed", () => {
    app.quit();
  });
});
