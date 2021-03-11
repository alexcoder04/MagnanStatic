import { addClasses, generateFAIcon } from "./utils.module.js";

export default function showCurrentPath(){
    const folderPathContainer = document.getElementById("folder-path");
    const path = window.location.href.split("mystuff")[1];
    var pathPart = "";
    path.split("/").forEach(el => {
        if (el == "" || el == null) return;
        pathPart += `/${el}`;
        if (el == "root") el = "My Stuff";
        const domEl = document.createElement("a");
        addClasses(domEl, ["btn", "btn-dark"]);
        domEl.role = "button";
        domEl.href = `/mystuff${pathPart}`;
        domEl.innerText = el.replace("%20", " ") + " ";
        domEl.appendChild(generateFAIcon("fa-folder-open-o"));
        folderPathContainer.appendChild(domEl);
        folderPathContainer.appendChild(generateFAIcon("fa-chevron-right"));
    });
}
