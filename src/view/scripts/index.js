import { addListItem, refreshList } from "./packagesView.js";
console.log(api.test());

export var INSTALLED_PACKAGES;
export var PACKAGE_MANAGERS = (await api.getPackageManagers());
export var PACKAGE_MANAGER = (await api.getPackageManager());
export const state = {
    // This determines what the reload button will do.
    awaiting: false
};

console.log("PACKAGE_MANAGER: ", PACKAGE_MANAGER);
const refreshBtn = document.getElementById("refresh-btn");
const settingsBtn = document.getElementById("open-settings-btn");
const statusText = document.getElementById("status-text");

/**
 * Function that is called periodically to ensure the application state is in
 * synch with the graphical user interface.
 */
function stateHook() {
    if (state.awaiting) {
        refreshBtn.ariaDisabled = true;
        refreshBtn.innerText = "Action in progress";
    } else {
        refreshBtn.ariaDisabled = false;
        refreshBtn.innerText = "Refresh";
    }
    setTimeout(stateHook, 1000);
}

/**
 * Sets the status text element with the text provided, and clears it after the
 * duration provided in milliseconds (ms) 1/1000 of a second, second * 1000.
 */
export function setStatusText(text, duration) {
    statusText.innerText = text;
    if (duration)
        setTimeout(() => { statusText.innerText = "" }, duration);
}

stateHook();
refreshList();

PACKAGE_MANAGERS.forEach((pm) => {
    const opt = document.createElement("option");
    opt.value = pm;
    opt.innerText = pm;
    document.getElementById("package-manager-selection").appendChild(opt);

    if (pm == PACKAGE_MANAGER) {
        opt.selected = true;
    }
})

const packageManagerSelection = document.getElementById("package-manager-selection");
packageManagerSelection.value = PACKAGE_MANAGER;

INSTALLED_PACKAGES = (await api.getInstalledPackages());
INSTALLED_PACKAGES.forEach((pkg, i) => {
    // pkg.group
    setTimeout(() => {
        addListItem(`${pkg.name}`, pkg.version, pkg.summary);
        setStatusText(`successfully loaded package ${pkg.name} (${i + 1} of ${INSTALLED_PACKAGES.length})`);
    }, 50);
})

setStatusText("packages successfully loaded.", 1000);

settingsBtn.addEventListener("click", () => {
    api.openSettings();
})