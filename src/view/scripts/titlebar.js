const appCloseBtn = document.getElementById("app-close-btn");
const appMinBtn = document.getElementById("app-min-btn");

appCloseBtn.addEventListener("click", () => {
    api.close();
})

appMinBtn.addEventListener("click", () => {
    api.minimize();
})