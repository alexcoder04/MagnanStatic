
export default class ContextMenu{
    constructor(){
        this.menu = document.createElement("section");
        this.menu.classList.add("context-menu");
        this.menuList = document.createElement("ul");
        this.menuList.classList.add("context-menu-options");
        this.menu.appendChild(this.menuList);
        document.body.appendChild(this.menu);
        window.addEventListener("click", () => {
            if (this.visible) this.toggle("hide");
        });
        this.visible = false;
    }

    toggle(command){
        this.menu.style.display = command === "show" ? "block" : "none";
        this.visible = !this.visible;
    }

    setPosition({ top, left }){
        this.menu.style.left = `${left}px`;
        this.menu.style.top = `${top}px`;
        this.toggle("show");
    }

    clear(){
        this.menuList.innerHTML = null;
    }

    addEntry(name, onclick){
        const entry = document.createElement("li");
        entry.classList.add("context-menu-option");
        entry.innerText = name;
        entry.addEventListener("click", onclick);
        this.menuList.appendChild(entry);
    }
}
