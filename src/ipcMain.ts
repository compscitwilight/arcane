import * as electron from "electron";
import * as fs from "fs";
import config from "./config.json";
import { SETTINGS_PATH, getSettings, pmServices, state } from ".";
import { createPackageExplorerWindow, createSettingsWindow } from "./app";
import * as services from "./util/services";

/* Get events */
electron.ipcMain.handle("get:package-managers", () => {
    return config.packageManagers.map((pm) => pm.name);
})

electron.ipcMain.handle("get:package-manager", async () => {
    return config.packageManagers.find((pm) => pm._id == state.packageManagerID).name;
})

electron.ipcMain.handle("get:installed-packages", async () => {
    var [res, err] = await services.invokeServiceMethod(state.packageManagerID, "list_installed_packages");
    if (err) 
        console.log(err);
    else
        return res;
})

electron.ipcMain.handle("get:settings", async () => {
    return getSettings();
})

electron.ipcMain.handle("get:package-information", async (_, name: string) => {
    const [res] = await services.invokeServiceMethod(state.packageManagerID, "get_package_information", name);
    return res;
})

/* Set events */
electron.ipcMain.on("set:setting", (_, name: string, val: any) => {
    state.settings[name] = val;
    console.log(state.settings);
})

/* Action events */
electron.ipcMain.on("action:open-package-explorer", () => {
    if (state.packageExplorerWin) return;
    createPackageExplorerWindow();
})

electron.ipcMain.on("action:close", (event: electron.IpcMainEvent) => {
    electron.BrowserWindow.fromWebContents(event.sender).close();
})

electron.ipcMain.on("action:minimize", (event: electron.IpcMainEvent) => {
    electron.BrowserWindow.fromWebContents(event.sender).minimize();
})

electron.ipcMain.on("action:maximize", (event: electron.IpcMainEvent) => {
    electron.BrowserWindow.fromWebContents(event.sender).maximize();
})

electron.ipcMain.on("action:open-settings", () => {
    createSettingsWindow();
})

electron.ipcMain.on("action:save-settings-json", (event: electron.IpcMainEvent) => {
    const json = JSON.stringify(state.settings);
    electron.dialog.showSaveDialog(electron.BrowserWindow.fromWebContents(event.sender)).then(({ filePath }) => {
        if (filePath) fs.writeFileSync(filePath, json);
    })
})

electron.ipcMain.on("action:write-settings", () => {
    fs.writeFileSync(SETTINGS_PATH, JSON.stringify(state.settings));
})