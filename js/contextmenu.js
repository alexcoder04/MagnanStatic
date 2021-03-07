
// global variables
const menu = document.querySelector(".context-menu");
const menuList = document.querySelector(".context-menu-options");
let menuVisible = false;

// helper functions
const toggleMenu = command => {
    menu.style.display = command === "show" ? "block" : "none";
    menuVisible = !menuVisible;
};

const setPosition = ({ top, left }) => {
    menu.style.left = `${left}px`;
    menu.style.top = `${top}px`;
    toggleMenu("show");
};

const clearMenuEntries = () => {
    menuList.innerHTML = "";
};

// bigger functions
const setupContextMenu = event => {
    var dataset;
    // for folders that consists of multiple dom elements
    if (event.target.classList.contains("folder-child")){
        dataset = event.target.parentElement.dataset;
    } else {
        dataset = event.target.dataset;
    }

    clearMenuEntries();

    addMenuEntry({
        name: "Open",
        onclick: (
            dataset.type == "file" ?
                () => { openTab(`/storage/file/${USERNAME}/${dataset.href}`); }:
                () => { loadPage(dataset.href); }
        )
    });
    addMenuEntry({
        name: "Delete",
        action: `delete-${dataset.type}`,
        href: dataset.href
    });
    addMenuEntry({
        name: "Rename",
        dataset: {
            toggle: "modal",
            target: "#main-modal"
        },
        onclick: () => {
            setupModal({
                title: "Rename " + dataset.type,
                text: `Type new ${dataset.type} name`,
                inputs: [
                    {
                        type: "text",
                        id: "rename-file-input"
                    }
                ],
                onconfirm: () => {
                    const path = CURRENT_PATH  + "/" + document.getElementById("rename-file-input").value;
                    apiCall(
                        "storage/move-" + dataset.type,
                        "POST",
                        {
                            path: dataset.href,
                            destination: path,
                            user: USERNAME
                        },
                        loadFolderContent,
                        false
                    );
                }
            });
        }
    });
    addMenuEntry({
        name: "Move",
        dataset: {
            toggle: "modal",
            target: "#main-modal"
        },
        onclick: () => {
            selectFile({
                type: "folder",
                msg: `Choose where to move the ${dataset.type} to`,
                callback: folderName => {
                    const path = folderName;
                    apiCall(
                        "storage/move-" + dataset.type,
                        "POST",
                        {
                            path: dataset.href,
                            destination: `${path}/${dataset.href.split('/')[dataset.href.split('/').length - 1]}`,
                            user: USERNAME
                        },
                        loadFolderContent,
                        false
                    );
                }
            });
        }
    });

    if (dataset.type == "file"){
        addMenuEntry({
            name: "Download",
            onclick: () => { downloadFile(`/storage/file/${USERNAME}/${dataset.href}`); }
        });
    }

    if (dataset.type == "folder"){
        addMenuEntry({
            name: "Download",
            onclick: () => { openTab(`/storage/download/folder/${USERNAME}/${dataset.href}`); }
        });
    }
};

const addMenuEntry = data => {
    const entry = document.createElement("li");
    entry.classList.add("context-menu-option");
    entry.innerText = data.name;

    if (data.dataset){
        Object.keys(data.dataset).forEach(key => {
            entry.dataset[key] = data.dataset[key];
        });
    }

    if (data.onclick){
        entry.innerText = data.name;
        entry.addEventListener("click", data.onclick);
        menuList.appendChild(entry);
        return;
    }

    if (data.action == "delete-file"){
        entry.dataset.href = data.href;
        entry.addEventListener("click", (e) => {
            const data = {
                user: username,
                path: `${e.target.dataset.href}`,
            };
            apiCall(
                "storage/delete-file",
                "POST",
                data,
                loadFolderContent,
                false
            );
        });
    } else if (data.action == "delete-folder"){
        entry.dataset.href = data.href;
        entry.addEventListener("click", (e) => {
            const data = {
                user: username,
                path: e.target.dataset.href,
            };
            apiCall(
                "storage/delete-folder",
                "POST",
                data,
                loadFolderContent,
                false
            );
        });
    } else if (data.action == "move-file"){
        entry.addEventListener("click", () => {
            createPopup({
                title: "Move file to",
                text: "Select the location you want to move the file to",
                inputs: [
                    {
                        type: "text",
                        id: "move-to-folder-input",
                    },
                    {
                        type: "button",
                        text: "Move",
                        onclick: () => {
                            const path = document.getElementById("move-to-folder-input").value;
                            apiCall(
                                "storage/move-file",
                                "POST",
                                {
                                    path: data.href,
                                    destination: path,
                                    user: USERNAME
                                },
                                loadFolderContent,
                                false
                            );
                        }
                    }
                ]
            });
        });
    } else {
        console.error("Unexpected action in contextmenu");
    }

    menuList.appendChild(entry);
};

// code that actually runs always
window.addEventListener("click", e => {
    if(menuVisible) toggleMenu("hide");
});

