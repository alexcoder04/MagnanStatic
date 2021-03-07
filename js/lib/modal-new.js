
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

const createModalTitle = title => {
    const domEl = document.createElement("div");
    addClasses(domEl, ["modal-title"]);
    domEl.innerText = title;
    return domEl;
};

const createCloseBtn = dismiss => {
    const domEl = document.createElement("button");
    domEl.type = "button";
    addClasses(domEl, ["close"]);
    domEl.dataset.dismiss = "modal";
    domEl.innerHTML = '<span aria-hidden="true">&times;</span>';
    return domEl;
};

const createCancelBtn = () => {
    const domEl = document.createElement("button");
    addClasses(domEl, ["btn", "btn-secondary"]);
    domEl.dataset.dismiss = "modal";
    domEl.innerText = "Cancel";
    return domEl;
};

const createConfirmBtn = () => {
    const domEl = document.createElement("button");
    addClasses(domEl, ["btn", "btn-success"]);
    domEl.dataset.dismiss = "modal";
    domEl.innerText = "Confirm";
    return domEl;
};

const setupModal = data => {
    // header
    const modalHeader = document.createElement("div");
    addClasses(modalHeader, ["modal-header"]);
    const modalTitle = createModalTitle(data.title || "Modal");
    const closeModalBtn = createCloseBtn("modal");
    modalHeader.appendChild(modalTitle);
    modalHeader.appendChild(closeModalBtn);
    // body
    const modalBody = document.createElement("div");
    modalBody.classList.add("modal-body");
    const modalText = document.createElement("div");
    modalText.innerText = data.text || "Modal text";
    modalBody.appendChild(modalText);
    if (data.extraElements){
        const modalExtra = document.createElement("div");
        data.extraElements.forEach(el => {
            modalExtra.appendChild(el);
        });
        modalBody.appendChild(modalExtra);
    }
    if (data.inputs){
        const modalInputs = document.createElement("div");
        data.inputs.forEach(el => {
            modalInputs.appendChild(createInputEl(el));
        });
        modalBody.appendChild(modalInputs);
    }
    // footer
    const modalFooter = document.createElement("div");
    modalFooter.classList.add("modal-footer");
    const cancelBtn = createCancelBtn();
    const confirmBtn = createConfirmBtn();
    modalFooter.appendChild(cancelBtn);
    modalFooter.appendChild(confirmBtn);
    // put everything together
    const modalContent = document.createElement("div");
    modalContent.classList.add("modal-content");
    modalContent.appendChild(modalHeader);
    modalContent.appendChild(modalBody);
    modalContent.appendChild(modalFooter);
    const modalDialog = document.createElement("div");
    modalDialog.role = "document";
    modalDialog.classList.add("modal-dialog");
    modalDialog.appendChild(modalContent);
    // modal root and show it finally
    const modalRoot = document.createElement("div");
    addClasses(modalRoot, ["modal", "fade"]);
    modalRoot.tabIndex = "-1";
    modalRoot.role = "dialog";
    modalRoot.ariaHidden = "true";
    modalRoot.id = "main-modal";
    modalRoot.appendChild(modalDialog);
    document.getElementById("main-modal-container").appendChild(modalRoot);
    if (data.oncreate){
        data.oncreate();
    }
    confirmBtn.addEventListener("click", () => {
        if (data.onconfirm){
            data.onconfirm();
        }
        modalRoot.remove();
    });
    $("#main-modal").modal("show");
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
