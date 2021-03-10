import { appendChildren, addClasses } from "./utils.module.js";

function createInputEl(data){
    data.type = data.type || "text";
    var domEl;
    if (data.type == "button"){
        domEl = document.createElement("button");
        domEl.innerText = data.text || "Submit";
    } else {
        domEl = document.createElement("input");
        domEl.classList.add("form-control");
        domEl.type = data.type;
    }
    domEl.id = data.id;
    if (data.onclick){
        domEl.addEventListener("click", data.onclick);
    }
    return domEl;
};

function createModalTitle(title){
    const domEl = document.createElement("div");
    domEl.classList.add("modal-title");
    domEl.innerText = title;
    return domEl;
};

function createCloseBtn(){
    const domEl = document.createElement("button");
    domEl.classList.add("close");
    domEl.dataset.dismiss = "modal";
    domEl.innerHTML = '<span aria-hidden="true">&times;</span>';
    return domEl;
};

function createModalInteractionBtn(accept, onclick){
    const domEl = document.createElement("button");
    domEl.classList.add("btn");
    if (accept){
        domEl.classList.add("btn-success");
        domEl.innerText = "Confirm";
    } else {
         domEl.classList.add("btn-secondary");
         domEl.innerText = "Cancel";
    }
    if (onclick){
        domEl.addEventListener("click", onclick);
    }
    domEl.dataset.dismiss = "modal";
    return domEl;
}

function handleAdditionalElements(data, modalBody){
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
}

function setupCloseFuncs(modal, onconfirm, oncancel, confirmBtn, cancelBtn){
    confirmBtn.addEventListener("click", () => {
        if (onconfirm){
            onconfirm();
        }
        modal.remove();
    });
    cancelBtn.addEventListener("click", () => {
        if (oncancel){
            oncancel();
        }
        modal.remove();
    });
}

export default function setupModal(data){
    // header
    const title = createModalTitle(data.title || "No title");
    const closeBtn = createCloseBtn();
    const header = document.createElement("div");
    header.classList.add("modal-header");
    appendChildren(header, [title, closeBtn]);
    // body
    const text = document.createElement("div");
    const body = document.createElement("div");
    text.innerText = data.text || "";
    body.classList.add("modal-body");
    body.appendChild(text);
    handleAdditionalElements(data, body);
    // footer
    const cancelBtn = createModalInteractionBtn(false);
    const confirmBtn = createModalInteractionBtn(true);
    const footer = document.createElement("div");
    footer.classList.add("modal-footer");
    appendChildren(footer, [cancelBtn, confirmBtn]);
    // put everything together
    const modalContent = document.createElement("div");
    modalContent.classList.add("modal-content");
    appendChildren(modalContent, [header, body, footer])
    const modalDialog = document.createElement("div");
    modalDialog.role = "document";
    modalDialog.classList.add("modal-dialog");
    modalDialog.appendChild(modalContent);
    const modalRoot = document.createElement("div");
    addClasses(modalRoot, ["modal", "fade"]);
    modalRoot.tabIndex = "-1";
    modalRoot.role = "dialog";
    modalRoot.ariaHidden = "true";
    modalRoot.id = "main-modal";
    modalRoot.appendChild(modalDialog);
    document.getElementById("main-modal-container").appendChild(modalRoot);
    // events
    if (data.oncreate){
        data.oncreate();
    }
    setupCloseFuncs(modalRoot, data.onconfirm, data.oncancel, confirmBtn, cancelBtn);
    $("#main-modal").modal("show");
}
