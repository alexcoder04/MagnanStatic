import setupModal from "./modal.module.js";
import makeApiCall from "./api.module.js";
import { addClasses } from "./utils.module.js";

async function createFileSelectList(type, extensions){
    const data = await makeApiCall({
        route: "storage/list-folder",
        method: "POST",
        body: {
            user: USERNAME,
            path: "root"
        }
    });
    const rootDomEl = document.querySelector("#files-select-root");
    if (type == "folder"){
        const folderDomEl = document.createElement("button");
        addClasses(folderDomEl, ["btn", "btn-secondary", "file-select"]);
        folderDomEl.innerText = "My Stuff";
        folderDomEl.dataset.name = "root";
        folderDomEl.dataset.type = "folder";
        rootDomEl.appendChild(folderDomEl);
        data.folders.forEach(folder => {
            const folderDomEl = document.createElement("button");
            addClasses(folderDomEl, ["btn", "btn-secondary", "file-select"]);
            folderDomEl.innerText = folder.name;
            folderDomEl.dataset.name = `${CURRENT_PATH}/${folder.name}`;
            folderDomEl.dataset.type = "folder";
            rootDomEl.appendChild(folderDomEl);
        });
    } else {
        console.log(extensions);
    }
    Array.from(document.getElementsByClassName("file-select")).forEach(domEl => {
        domEl.addEventListener("click", e => {
            Array.from(document.getElementsByClassName("file-select")).forEach(fileSelectEl => {
                if (fileSelectEl.classList.contains("file-select-active")) {
                    fileSelectEl.classList.remove("file-select-active");
                    fileSelectEl.classList.remove("btn-primary");
                    fileSelectEl.classList.add("btn-secondary");
                }
            });
            addClasses(e.target, ["file-select-active", "btn-primary"]);
            e.target.classList.remove("btn-secondary");
        });
    });
};

export default function selectFile(options){
    const type = options.type || "file";
    const msg = options.msg || "Select the " + type;
    const filesListEl = document.createElement("div");
    filesListEl.id = "files-select-root";
    setupModal({
        title: "Select " + type,
        text: msg,
        extraElements: [
            filesListEl
        ],
        oncreate: () => {
            createFileSelectList(type, options.extensions);
        },
        onconfirm: () => {
            const activeElement = document.querySelector(".file-select-active");
            if (activeElement){
                options.callback(activeElement.dataset.name);
            } else {
                options.callback(null);
            }
        }
    });
}
