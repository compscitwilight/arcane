import * as electron from "electron";
import * as path from "path";
import { state } from ".";

import "./ipcMain";

const WIN_HEIGHT = 650;
const WIN_WIDTH = 900;
const PRELOAD_SCRIPT = path.join(__dirname, "./ipcRenderer.js");

/* Generative function to create a window with the important defaults. */
function createWindow(extraConfig: electron.BrowserWindowConstructorOptions) {
    const window = new electron.BrowserWindow({
        title: "ArcaneExplorer",
        icon: path.join(__dirname, "../assets/icon-x256.png"),
        webPreferences: {
            preload: PRELOAD_SCRIPT
        },
        ...extraConfig
    });
    return window;
}

export function createMainWindow() {
    const window = createWindow({
        center: true,
        minHeight: WIN_HEIGHT,
        minWidth: WIN_WIDTH,
        height: WIN_HEIGHT,
        width: WIN_WIDTH,
        frame: false
    })

    window.loadFile("./view/index.html");
    window.on("close", () => process.exit());
    state.mainWin = window;
}

export function createPackageExplorerWindow() {
    const window = createWindow({
        title: "Package Explorer - ArcaneExplorer",
        frame: false,
        height: 600,
        width: 600,
        center: true
    });

    window.loadFile("./view/explorer.html");
    window.on("close", () => state.packageExplorerWin = undefined);
    state.packageExplorerWin = window;
}

export function createSettingsWindow() {
    if (state.settingsWin) {
        console.warn("An existing settings window is already active.");
        return;
    };

    const window = createWindow({
        title: "ArcaneExplorer - Settings",
        minHeight: 400,
        minWidth: 500,
        height: 400,
        width: 500,
        x: 0
    })

    window.loadFile("./view/settings.html");
    window.on("close", () => state.settingsWin = undefined);
    state.settingsWin = window;
}