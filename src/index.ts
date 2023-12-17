import * as electron from "electron";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { createMainWindow } from "./app";
import { Settings } from "./types/Settings";
import { validateRegisteredServices } from "./util/services";

import CONFIG from "./config.json";
export { CONFIG };

export const SETTINGS_PATH = `/home/${os.userInfo().username}/.config/arcane-explorer/arcane-settings.json`;
export const pmServices = new Map<number, Object>();
export const state = {} as {
    mainWin: electron.BrowserWindow,
    packageExplorerWin: electron.BrowserWindow,
    settingsWin: electron.BrowserWindow,
    linuxDistribution: string | undefined,
    packageManagerID: number,
    getPackageSummaries: boolean,
    settings: Settings
};

if (!fs.existsSync(SETTINGS_PATH)) {
    if (!fs.existsSync(path.join(SETTINGS_PATH, "../")))
        fs.mkdirSync(path.join(SETTINGS_PATH, "../"));
    
    console.warn("Settings file wasn't found so we're writing it at", SETTINGS_PATH);
    fs.writeFile(SETTINGS_PATH, "{}", (err) => {
        if (!err) return;
        err.message = `Error while writing file ${err.message}`;
        throw err;
    });
};

export const getSettings = () => JSON.parse(fs.readFileSync(SETTINGS_PATH).toString("utf-8")) as Settings;

state.settings = {};
state.linuxDistribution = getLinuxDistribution();

console.log("PLATFORM: ", process.platform);
console.log("DISTRIBUTION: ", state.linuxDistribution);

const packageManager = CONFIG.packageManagers.find(
    (pm) => pm.distribution.includes(state.linuxDistribution)
);
if (packageManager) {
    const packageManagerId = packageManager._id;
    state.packageManagerID = packageManagerId;
    console.log("PACKAGE_MANAGER: ", packageManagerId);

    const serviceFile = require(path.join(__dirname, packageManager.service));
    pmServices.set(packageManagerId, serviceFile);
}

validateRegisteredServices();

function getLinuxDistribution() {
    if (process.platform !== "linux") return;
    const osRelease = fs.readFileSync("/etc/os-release").toString();
    const lines = osRelease.split("\n");

    var dist: string;
    lines.forEach((ln) => {
        const [key, value] = ln.split("=");
        if (key == "ID")
            dist = value;
    })
    return dist;
}

electron.app.whenReady().then(() => {
    createMainWindow();
});