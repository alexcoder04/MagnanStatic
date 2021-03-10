import { loadElementsIn, showFolderContent } from "./lib/folderView.module.js";
import ContextMenu from "./lib/contextmenu.module.js";
import setupModal from "./lib/modal.module.js";
import makeApiCall from "./lib/api.module.js";

const fileContextMenu = new ContextMenu();

async function loadAndRepresent(){
    const folderContent = await loadElementsIn(CURRENT_PATH);
    showFolderContent(folderContent, fileContextMenu);
}

loadAndRepresent();

document.getElementById("create-folder-trigger-btn").addEventListener("click", () => {
    setupModal({
        title: "Create folder",
        text: "Type the name of the new folder",
        inputs: [
            {
                type: "text",
                id: "new-folder-name"
            }
        ],
        onconfirm: async () => {
            const folderPath = `${currentPath}/${document.getElementById("new-folder-name").value}`;
            const res = await makeApiCall({
                route: "storage/create-folder",
                body: {
                    user: username,
                    path: folderPath
                },
            });
            loadAndRepresent();
        }
    });
    document.getElementById("new-folder-name").value = "New folder";
});
