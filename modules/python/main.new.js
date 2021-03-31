const textarea = document.getElementById("code-input");
const backdrop = document.getElementById("_backdrop");
const output = document.getElementById("code-output");

function parse(str){
    console.log(str);
    str = str.replace(/ /g, "&nbsp;").replace(/\n/g, "<br>");
    // ["if", "for", "def", "while", "in", "return"].forEach(item => {
    //     console.log(item);
    //     str = str.replace(new RegExp(item,'g'), `<span style="color: red;">${item}</span>`);
    // });
    // TODO comments
    console.log(str);
    return str;
}

function handleBackdrop(){
    setTimeout(() => {
        backdrop.innerHTML = parse(textarea.value);
    }, 10);
}

backdrop.style.height = textarea.offsetHeight + "px";
backdrop.style.width = textarea.offsetWidth + "px";
output.style.height = textarea.offsetHeight + "px";
output.style.width = textarea.offsetWidth + "px";

textarea.addEventListener("keydown", handleBackdrop);

handleBackdrop();
