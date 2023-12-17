const inputs = document.querySelectorAll("input, select");
const saveSettingsBtn = document.getElementById("settings-save");
const exportSettingsBtn = document.getElementById("settings-file-export");

var body = new Map();

async function refreshSettings() {
    const settings = await api.getSettings();
    Object.keys(settings).forEach((alias) => {
        const val = settings[alias];
        const input = document.querySelector(`input[name="${alias}"`);
        if (!input) {
            console.warn(`Setting input for setting "${alias}" does not exist.`);
            return;
        };

        if (typeof val == "boolean") input.checked = val; else input.value = val;
    })
    console.log(settings);
}

refreshSettings();

saveSettingsBtn.addEventListener("click", () => {
    body.forEach((val, key) => {
        api.setSetting(key, val);
        console.log(`Set setting ${key} to ${val}`);
    })

    api.writeSettings();
})

exportSettingsBtn.addEventListener("click", async () => {
    api.saveSettingsJson();
})

for (var i = 0; i < inputs.length; i++) {
    const input = inputs.item(i);
    if (input.type !== "submit") {
        input.addEventListener("input", () => {
            const name = input.name;
            const val = (input.type == "checkbox") ? input.checked : input.value;
            body.set(name, val);
            //api.setSetting(name, val);
        })
    }
}