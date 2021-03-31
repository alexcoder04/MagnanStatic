import makeApiCall from "../../js/lib/api.module.js";

const codeInputArea = document.getElementById("code-input");
const codeRunBtn = document.getElementById("code-run");

codeInputArea.addEventListener("keydown", e => {
    if (e.key == "Tab"){
        e.preventDefault();
        const position = codeInputArea.selectionStart;
        const currentValue = codeInputArea.value;
        const newValue = `${currentValue.slice(0, position)}    ${currentValue.slice(position, currentValue.length)}`;
        codeInputArea.value = newValue;
    }
    if (e.key == "Enter" && e.ctrlKey){
        codeRunBtn.click();
    }
});

codeRunBtn.addEventListener("click", async () => {
    const data = await makeApiCall({
        external: true,
        route: "https://emkc.org/api/v1/piston/execute",
        method: "POST",
        body: {
            language: document.getElementById("language").value,
            source: document.getElementById("code-input").value,
            args: document.getElementById("args").value.split()
        },
    });
    document.getElementById("code-output").innerText = data.output;
});