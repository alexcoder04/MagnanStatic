
export function appendChildren(parent, children){
    children.forEach(child => {
        parent.appendChild(child);
    });
}

export function addClasses(domEl, classes){
    classes.forEach(elClass => {
        domEl.classList.add(elClass);
    });
}

export function generateFAIcon(name){
    const domEl = document.createElement("i");
    addClasses(domEl, ["fa", name]);
    return domEl;
};

export function roundDecimals(number, places=2){
    const factor = 10 ** places;
    return Math.round((number / 1024) * factor) / factor;
}

export function representBytes(bytes){
    const units = ["B", "KB", "MB", "GB"];
    for (let i = 0; i < units.length; i++){
        if (bytes < 1024){
            return `${bytes} ${units[i]}`;
        }
        bytes = roundDecimals(bytes);
    }
}

export function getCookie(cname){
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

