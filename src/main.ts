import { app, BrowserWindow, globalShortcut, Menu } from "electron";
import path from "path";
import electronReloader from "electron-reloader";
import PackageInfo from "../package.json";

const size = { minWidth: 1024, minHeight: 600 };

function createWindow() {
  const win = new BrowserWindow({
    width: size.minWidth,
    height: size.minHeight,
    minWidth: size.minWidth,
    minHeight: size.minHeight,
    title: `OpenOPLToolbox (${PackageInfo.version})`,
    icon: path.join(__dirname, "assets", "applogo", "icon_512x512.png"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
    },
  });

  win.removeMenu();
  Menu.setApplicationMenu(
    Menu.buildFromTemplate([
      {
        label: "OpenOPL Toolbox",
        submenu: [
          {
            label: "Quit",
            accelerator: "CmdOrCtrl+Q",
            click: () => {
              app.quit();
            },
          },
        ],
      },
    ])
  );

  const args = process.argv.slice(1);
  const serve = args.includes("--serve");

  if (serve) {
    electronReloader(module);
    win.loadURL("http://localhost:4200");
    win.webContents.openDevTools();
  } else {
    win.loadFile(
      path.join(__dirname, "..", "angular", "browser", "index.html")
    );
  }
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on("browser-window-focus", function () {
  globalShortcut.register("CommandOrControl+R", () => {
    console.log("CommandOrControl+R is pressed: Shortcut Disabled");
  });
  globalShortcut.register("F5", () => {
    console.log("F5 is pressed: Shortcut Disabled");
  });
});

app.on("browser-window-blur", function () {
  globalShortcut.unregister("CommandOrControl+R");
  globalShortcut.unregister("F5");
});
