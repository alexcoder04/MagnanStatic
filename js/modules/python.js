document.getElementById("code-run").addEventListener("click", () => {
    apiCall(
        "module/python/run",
        "POST",
        {
            code: document.getElementById("code-input").value
        },
        data => {
            document.getElementById("code-output").innerText = data.output;
        },
        false
    );
});