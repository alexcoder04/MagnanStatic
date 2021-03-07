
const subfoldersListEl = document.querySelector("#subfolders-list");
const elementsListEl = document.querySelector("#files-list");

// helper function
const generateFAIcon = name => {
    const domEl = document.createElement("i");
    domEl.classList.add("fa");
    domEl.classList.add(name);
    return domEl;
};

const createFolderDomEl = data => {
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
    folderNameEl.innerText = data.name;

    domEl.appendChild(folderIcon);
    domEl.appendChild(folderNameEl);

    domEl.addEventListener("contextmenu", e => {
        e.preventDefault();
        const origin = {
            left: e.clientX,
            top: e.clientY
        };
        setPosition(origin);
        setupContextMenu(e);
        return false;
    });

    return domEl;
};

const createFileDomEl = data => {
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
        setPosition(origin);
        setupContextMenu(e);
        return false;
    });

    fileNameEl.addEventListener("click", () => {
        openTab(data.fileOpenHref);
    });

    return domEl;
};

const representFolderContent = data => {
    data.folders.forEach(subfolder => {
        const folderEl = createFolderDomEl({
            href: `${currentPath}/${subfolder.name}`,
            name: subfolder.name
        });
        subfoldersListEl.appendChild(folderEl);
    });

    data.files.forEach(file => {
        const fileEl = createFileDomEl({
            isImage: file.is_image,
            thumbnailHref: (file.is_image ? `/storage/thumbnail/${USERNAME}/${currentPath}/${file.name}` : null),
            filePath: `${currentPath}/${file.name}`,
            fileOpenHref: `/storage/file/${USERNAME}/${currentPath}/${file.name}`,
            name: file.name
        });
        elementsListEl.appendChild(fileEl);
    });
};

const loadFolderContent = () => {
    subfoldersListEl.innerHTML = "";
    elementsListEl.innerHTML = "";

    apiCall(
        "storage/list-folder",
        "POST",
        {
            user: username,
            path: currentPath
        },
        representFolderContent,
        false
    );
};

loadFolderContent();
