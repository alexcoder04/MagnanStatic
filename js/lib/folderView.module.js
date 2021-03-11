import makeApiCall from "./api.module.js";
import { addClasses, generateFAIcon } from "./utils.module.js";
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
    const domEl = document.createElement("li");

    domEl.classList.add("list-group-item");

    if (data.isImage){
        const imgEl = document.createElement("img");
        imgEl.src = data.thumbnailHref;
        imgEl.setAttribute("width", "100px"); imgEl.setAttribute("height", "100px");

        domEl.appendChild(imgEl);
    }

    const fileNameEl = document.createElement("button");
    fileNameEl.type = "button";
    addClasses(fileNameEl, ["btn", "btn-dark", "btn-file"]);
    fileNameEl.dataset.type = "file";
    fileNameEl.dataset.href = data.filePath;

    const fileIcon = generateFAIcon("fa-file-o");

    fileNameEl.appendChild(fileIcon);
    fileNameEl.append(data.name);
    domEl.appendChild(fileNameEl);

    fileNameEl.addEventListener("contextmenu", e => {
        e.preventDefault();
        const origin = {
            left: e.clientX,
            top: e.clientY
        };
        data.contextMenu.setPosition(origin);
        data.contextMenu.clear();
        setupContextMenu(data.contextMenu, e);
        return false;
    });

    fileNameEl.addEventListener("click", () => {
        browser.openTab(data.fileOpenHref);
    });

    return domEl;
};

export async function loadElementsIn(path){
    const elements = await makeApiCall({
        route: "storage/list-folder",
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
            contextMenu
        }));
    });
}
