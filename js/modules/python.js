import makeApiCall from "../lib/api.module.js";

document.getElementById("code-run").addEventListener("click", async () => {
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
    console.log(data);
    document.getElementById("code-output").innerText = data.output;
});