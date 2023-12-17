const packagesList = new Array();
const listUI = document.getElementById("packages-section");
const packagesSearch = document.getElementById("packages-search");

const currentPageNavLabel = document.getElementById("current-page-label");
const prevPageBtn = document.getElementById("prev-page-btn");
const nextPageBtn = document.getElementById("next-page-btn");

const ITEMS_PER_PAGE = 20;
const INDEX_PAGE = 1;
var CURRENT_PAGE = INDEX_PAGE;
var PAGE_COUNT = 1;

/**
 * Whenever SEARCH_MODE is enabled (true), instead of the list rendering
 * the packagesList array, it will list whatever is inside of the SEARCH_RESULTS
 * array.
 */
var SEARCH_MODE = false;
var SEARCH_RESULTS = new Array();

prevPageBtn.addEventListener("click", () => {
    CURRENT_PAGE--;
    refreshList();
});

nextPageBtn.addEventListener("click", () => {
    CURRENT_PAGE++;
    refreshList();
});

packagesSearch.addEventListener("input", () => {
    const text = packagesSearch.value;
    if (text.length == 0) {
        SEARCH_MODE = false;
    } else {
        console.log(`Searching "${text}"`);
        const results = searchByQuery(text);
        SEARCH_MODE = true;
        SEARCH_RESULTS = results;
        //console.log(searchByQuery(text));
    }

    refreshList();
})

export function refreshList() {
    listUI.replaceChildren();
    const list = SEARCH_MODE ? SEARCH_RESULTS : packagesList;
    const pageStartIndex = (CURRENT_PAGE == 1) ? 0 : CURRENT_PAGE * ITEMS_PER_PAGE - ITEMS_PER_PAGE;
    const pageEndIndex = CURRENT_PAGE * ITEMS_PER_PAGE - 1;
    console.log(pageEndIndex);
    packagesSearch.placeholder = `Search ${packagesList.length} packages`;

    PAGE_COUNT = Math.ceil(list.length / ITEMS_PER_PAGE);
    currentPageNavLabel.innerText = `Page ${CURRENT_PAGE} of ${PAGE_COUNT} (${pageStartIndex}-${pageEndIndex})`;

    prevPageBtn.disabled = CURRENT_PAGE == INDEX_PAGE;
    nextPageBtn.disabled = CURRENT_PAGE == PAGE_COUNT;

    list.slice(pageStartIndex, pageEndIndex).forEach(async (l, index) => {
        const even = index % 2 == 0;
        const listElement = document.createElement("div");
        listElement.classList.add("package-list-item");
        listElement.style.backgroundColor = even ? "#151826" : "rgb(28 32 45)";
        // even is dark, odd is light
        listUI.appendChild(listElement);

        const header = document.createElement("h3");
        header.innerHTML = `${l.name} - ${l.version} <span id="see-more-${index}">expand</span>`;
        listElement.appendChild(header);

        const infoSection = document.createElement("span");
        infoSection.style.display = "none";
        function addInfoField(name, val) {
            const field = document.createElement("p");
            field.innerText = `${name}:${" ".repeat(10)}${val}`;
            infoSection.appendChild(field);
        }

        //const info = await api.getPackageInformation(l.name);
        addInfoField("");
        listElement.appendChild(infoSection);

        const seeMore = document.getElementById(`see-more-${index}`);
        seeMore.style.color = "blue";
        seeMore.style.textDecoration = "underline";
        seeMore.title = `See more information about ${l.name}`;
        seeMore.style.cursor = "pointer";
        seeMore.addEventListener("click", async () => {
            const displayAttr = infoSection.style.display;
            const info = api.getPackageInformation(l.name);
            infoSection.style.display = (displayAttr == "block") ? "none" : "block";
        })

        if (l.summary) {
            const summary = document.createElement("p");
            summary.innerText = l.summary;
            listElement.appendChild(summary);
        }

        const flexDiv = document.createElement("div");
        flexDiv.classList.add("flex");
        listElement.appendChild(flexDiv);

        const upgradeBtn = document.createElement("button");
        const deleteBtn = document.createElement("button");
        upgradeBtn.innerText = "Upgrade";
        deleteBtn.innerText = "Delete";

        upgradeBtn.addEventListener("click", () => {
            api.upgradePackage(l.name);
        })

        deleteBtn.addEventListener("click", () => {
            api.removePackage(l.nae);
        })

        flexDiv.appendChild(upgradeBtn);
        flexDiv.appendChild(deleteBtn);
        ////////////////////////////////
        listElement.appendChild(header);
        listElement.appendChild(flexDiv);
    });
}

export function searchByQuery(query) {
    const results = packagesList.filter((pkg) => pkg.name.toLowerCase().includes(query));
    return results;
}

/**
 * Adds an item to the list and returns the index of the item.
 */
export function addListItem(name, version, summary) {
    const index = packagesList.push({ name, version, summary });
    refreshList();
    return index;
}

/**
 * Removes a list item from the list with the provided index.
 */
export function removeListItem(index) {
    if (!packagesList.at(index)) return;
    packagesList.splice(index, 1);
    refreshList();
}