import makeApiCall from "./api.module.js";
import selectFile from "./fileSelect.module.js";
import { loadElementsIn, showFolderContent } from "./folderView.module.js";
import Browser from "./browser.module.js";
import setupModal from "./modal.module.js";
import { addClasses } from "./utils.module.js";

const browser = new Browser();

async function getLinkFor(href){
    const link = await makeApiCall({
        route: "storage/share",
        body: {
            path: href,
            user: USERNAME
        },
        method: "POST"
    });
    return link.link;
}

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
    contextmenu.addEntry("Share", () => {
        if (dataset.type == "folder"){
            alert("You cannot share folders yet!");
            return;
        }
        const selectBox = document.createElement("select");
        selectBox.id = "share-options-select";
        const shareWithAll = document.createElement("option");
        shareWithAll.innerText = "Share with everybody who has the link";
        shareWithAll.value = "link";
        const shareWithUsers = document.createElement("option");
        shareWithUsers.innerText = "Share with specific users";
        shareWithUsers.value = "user";
        selectBox.appendChild(shareWithAll); selectBox.appendChild(shareWithUsers);
        setupModal({
            title: "More options",
            text: "Select some more options",
            extraElements: [
                selectBox
            ],
            onconfirm: async () => {
                const all = selectBox.value == "link";
                if (!all){
                    alert("Not supported yet!")
                    return
                }
                const shareLink = await getLinkFor(dataset.href);
                const linkEl = document.createElement("input");
                linkEl.classList.add("form-control");
                linkEl.style.fontFamily = "monospace";
                linkEl.style.color = "blue";
                linkEl.setAttribute("readonly", "true");
                linkEl.value = `${window.location.protocol}//${window.location.host}/storage/shared/${shareLink}`;
                const linkBtn = document.createElement("button");
                addClasses(linkBtn, ["btn", "btn-primary"])
                linkBtn.innerText = "Click me to copy the link!";
                linkBtn.addEventListener("click", () => {
                    linkEl.select();
                    document.execCommand("copy");
                    linkBtn.innerText = "Link copied!";
                });
                setupModal({
                    title: "Link",
                    text: "Send this link to the people you want to share this file with: ",
                    extraElements: [
                        linkEl,
                        linkBtn
                    ]
                });
            }
        });
    });
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
                    route: "storage/delete/" + dataset.type,
                    body: data
                });
                const folderContent = await loadElementsIn(CURRENT_PATH);
                showFolderContent(folderContent, contextmenu);
            }
        });
    });
}
