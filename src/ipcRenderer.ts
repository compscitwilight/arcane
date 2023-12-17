import { contextBridge, ipcRenderer } from "electron";
contextBridge.exposeInMainWorld("api", {
    /* Used to test Electron IPC. */
    test: () => { return "Hello, world." },

    /* Closes the window. */
    close: () => ipcRenderer.send("action:close"),

    /* Maximizes the window. */
    maximize: () => ipcRenderer.send("action:maximize"),

    /* Minimizes the window. */
    minimize: () => ipcRenderer.send("action:minimize"),

    /* Returns the contents within the application's settings file on disk. */
    getSettings: async () => await ipcRenderer.invoke("get:settings"),

    /* Returned all installed packages within the user's selected package manager. */
    getInstalledPackages: async () => await ipcRenderer.invoke("get:installed-packages"),

    /* Returns the application settings in a JSON format to be exported as a file by the renderer. */
    saveSettingsJson: () => ipcRenderer.send("action:save-settings-json"),

    /* Returns the current selected package manager. */
    getPackageManager: async () => await ipcRenderer.invoke("get:package-manager"),

    /* Returns the information about a provided package. */
    getPackageInformation: async (name: string) => await ipcRenderer.invoke("get:package-information", name),

    /* Sets the user's preferred package manager to use for all transactions within ArcaneExplorer */
    setPackageManager: (id: number) => ipcRenderer.send("set:package-manager", id),

    /* Sets a specific setting specified with name to the value provided. */
    setSetting: (name: string, value: any) => ipcRenderer.send("set:setting", name, value),

    /* Returns all avaliable and supported package managers. */
    getPackageManagers: async () => await ipcRenderer.invoke("get:package-managers"),

    /* Writes the settings to the settings file. This is usually performed after changes to the settings have been in memory */
    writeSettings: () => ipcRenderer.send("action:write-settings"),

    /* Installs the specified package by name. */
    installPackage: (name: string, version: string) => ipcRenderer.send("action:install-package", name, version),

    /* Upgrades the specified installed package to the latest avaliable version. */
    upgradePackage: (name: string) => ipcRenderer.send("action:upgrade-package", name),

    /* Removes/uninstalls the specified package. */
    removePackage: (name: string) => ipcRenderer.send("action:remove-package", name),

    /* Application event which triggers the package explorer to open. */
    openPackageExplorer: () => ipcRenderer.send("action:open-package-explorer"),

    /* Opens the setting GUI, if it isn't already active. */
    openSettings: () => ipcRenderer.send("action:open-settings"),

    /* Loads settings provided by the client to the settings file on disk. Usually used for settings imports. */
    loadSettings: (settings: Object) => ipcRenderer.send("action:load-settings", settings)
})