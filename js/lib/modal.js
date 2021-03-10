
const createFolderTriggerBtn = document.getElementById("create-folder-trigger-btn");

const createInputEl = data => {
    if (data.type == null) data.type = "button";
    if (data.type == "button"){
        var domEl = document.createElement("button");
        domEl.innerText = data.text || "Submit";
    } else {
        var domEl = document.createElement("input");
        domEl.classList.add("form-control");
        domEl.type = data.type || "text";
    }
    domEl.id = data.id;
    
    if (data.onclick != null){
        domEl.addEventListener("click", () => {
            data.onclick();
        });
    }
    return domEl;
};


const setupModal = data => {
    const modalTitle = document.getElementById("main-modal-title");
    const modalText = document.getElementById("main-modal-text");
    const modalExtraElements = document.getElementById("main-modal-extra");
    const modalInputs = document.getElementById("main-modal-inputs");

    modalTitle.innerText = data.title || "Main modal";
    modalText.innerText = data.text || "Modal text";
    modalExtraElements.innerHTML = null;
    modalInputs.innerHTML = null;
    if (data.extraElements){
        data.extraElements.forEach(domEl => {
            modalExtraElements.appendChild(domEl);
        });
    }
    if (data.inputs){
        data.inputs.forEach(inputData => {
            const domEl = createInputEl(inputData);
            modalInputs.appendChild(domEl);
        });
    }
    if (data.oncreate){
        data.oncreate();
    }
    if (data.onconfirm){
        document.getElementById("main-modal-confirm").addEventListener("click", data.onconfirm);
    }
};

createFolderTriggerBtn.addEventListener("click", () => {
    setupModal({
        title: "Create folder",
        text: "Type the name of the new folder",
        inputs: [
            {
                type: "text",
                id: "new-folder-name"
            }
        ],
        onconfirm: () => {
            const folderPath = `${currentPath}/${document.getElementById("new-folder-name").value}`;
            apiCall(
                "storage/create-folder",
                "POST",
                {
                    user: username,
                    path: folderPath
                },
                loadFolderContent,
                false
            );
        }
    });
    document.getElementById("new-folder-name").value = "New folder";
});
