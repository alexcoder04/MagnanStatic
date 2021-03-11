import makeApiCall from "./api.module.js";
import selectFile from "./fileSelect.module.js";
import { loadElementsIn, showFolderContent } from "./folderView.module.js";
import Browser from "./browser.module.js";
import setupModal from "./modal.module.js";

const browser = new Browser();

export default function setupContextMenu(contextmenu, event){
    var dataset;
    if (event.target.classList.contains("folder-child")){
        dataset = event.target.parentElement.dataset;
    } else {
        dataset = event.target.dataset;
    }

    contextmenu.addEntry("Open", (
        dataset.type == "file" ?
        () => { browser.openTab(`/storage/file/${USERNAME}/${dataset.href}`); }:
        () => { browser.loadPage(dataset.href); }
    ));
    contextmenu.addEntry("Download", (
        dataset.type == "file"?
            () => { browser.downloadFile(`/storage/file/${USERNAME}/${dataset.href}`); }:
            () => { browser.openTab(`/storage/download/folder/${USERNAME}/${dataset.href}`); }
    ));
    contextmenu.addEntry("Rename", () => {
        setupModal({
            title: "Rename " + dataset.type,
            text: `Type new ${dataset.type} name`,
            inputs: [
                {
                    type: "text",
                    id: "rename-file-input"
                }
            ],
            onconfirm: async () => {
                const path = CURRENT_PATH  + "/" + document.getElementById("rename-file-input").value;
                const res = await makeApiCall({
                    route: "storage/move-" + dataset.type,
                    body: {
                        path: dataset.href,
                        destination: path,
                        user: USERNAME
                    },
                });
                const folderContent = await loadElementsIn(CURRENT_PATH);
                showFolderContent(folderContent, contextmenu);
            }
        });
    });
    contextmenu.addEntry("Move", () => {
            selectFile({
                type: "folder",
                msg: `Choose where to move the ${dataset.type} to`,
                callback: async folderName => {
                    const res = await makeApiCall({
                        route: "storage/move-" + dataset.type,
                        body: {
                            path: dataset.href,
                            destination: `${folderName}/${dataset.href.split('/')[dataset.href.split('/').length - 1]}`,
                            user: USERNAME
                        },
                    });
                    const folderContent = await loadElementsIn(CURRENT_PATH);
                    showFolderContent(folderContent, contextmenu);
                }
            });
        }
    );
    contextmenu.addEntry("Delete", () => {
        setupModal({
            title: "Confirm your action",
            text: `Do you really want to delete ${event.target.innerText}?`,
            onconfirm: async () => {
                const data = {
                    user: USERNAME,
                    path: (
                        dataset.type == "file" ?
                        `${event.target.dataset.href}`:
                        dataset.href
                    )
                };
                const res = await makeApiCall({
                    route: "storage/delete-" + dataset.type,
                    body: data
                });
                const folderContent = await loadElementsIn(CURRENT_PATH);
                showFolderContent(folderContent, contextmenu);
            }
        });
        
    });
}
