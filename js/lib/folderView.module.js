import makeApiCall from "./api.module.js";
import { addClasses, generateFAIcon, representBytes } from "./utils.module.js";
import Browser from "./browser.module.js";
import setupContextMenu from "./fileContextMenu.module.js";

const browser = new Browser();

function createFolderEl(data){
    const domEl = document.createElement("a");
    addClasses(domEl, ["btn", "btn-secondary", "btn-folder"]);

    domEl.role = "button";
    domEl.dataset.type = "folder";
    domEl.dataset.href = data.href;
    domEl.href = "/mystuff/" + data.href;

    const folderIcon = generateFAIcon("fa-folder");
    folderIcon.classList.add("folder-child");

    const folderNameEl = document.createElement("span");
    folderNameEl.classList.add("folder-child");
    folderNameEl.innerText = " " + data.name;
    domEl.appendChild(folderIcon);
    domEl.appendChild(folderNameEl);

    domEl.addEventListener("contextmenu", e => {
        e.preventDefault();
        const origin = {
            left: e.clientX,
            top: e.clientY
        };
        data.contextMenu.clear();
        data.contextMenu.setPosition(origin);
        setupContextMenu(data.contextMenu, e);
        return false;
    });

    return domEl;
}

function createFileEl(data){
    console.log(data);
    const tr = document.createElement("tr");
    tr.classList.add("file-el");
    let columns = [];

    const col1 = document.createElement("td");
    const imgEl = document.createElement("img");
    imgEl.setAttribute("width", "100px"); imgEl.setAttribute("height", "100px");
    if (data.isImage){
        imgEl.src = data.thumbnailHref;
    } else {
        imgEl.src = `${STATIC_SERVER}img/file.png`;
    }
    col1.appendChild(imgEl);
    columns.push(col1);

    const col2 = document.createElement("tr");
    col2.innerText = representBytes(data.size);
    columns.push(col2);

    const col3 = document.createElement("td");
    col3.innerText = data.name;
    columns.push(col3);

    columns.push(document.createElement("td"));

    columns.forEach(col => {
        tr.appendChild(col);
    });

    tr.addEventListener("contextmenu", e => {
        e.preventDefault();
        data.contextMenu.setPosition({
            left: e.clientX,
            top: e.clientY
        });
        data.contextMenu.clear();
        setupContextMenu(data.contextMenu, e);
        return false;
    });

    return tr;
}

export async function loadElementsIn(path){
    const elements = await makeApiCall({
        route: "storage/read/list-folder",
        method: "POST",
        body: {
            user: USERNAME,
            path
        }
    });
    return elements;
}

export function showFolderContent(elements, contextMenu){
    const subfoldersListEl = document.querySelector("#subfolders-list");
    const elementsListEl = document.querySelector("#files-list");
    subfoldersListEl.innerHTML = null;
    elementsListEl.innerHTML = null;
    if (elements.folders.length == 0 && elements.files.length == 0){
        const domEl = document.createElement("div");
        domEl.innerText = "This folder is empty";
        elementsListEl.appendChild(domEl);
        return;
    }
    elements.folders.forEach(subfolder => {
        subfoldersListEl.appendChild(createFolderEl({
            href: `${CURRENT_PATH}/${subfolder.name}`,
            name: subfolder.name,
            contextMenu
        }));
    });
    elements.files.forEach(file => {
        elementsListEl.appendChild(createFileEl({
            isImage: file.is_image,
            thumbnailHref: (file.is_image ? `/storage/thumbnail/${USERNAME}/${CURRENT_PATH}/${file.name}` : null),
            filePath: `${CURRENT_PATH}/${file.name}`,
            fileOpenHref: `/storage/file/${USERNAME}/${CURRENT_PATH}/${file.name}`,
            name: file.name,
            size: file.size,
            contextMenu
        }));
    });
}
