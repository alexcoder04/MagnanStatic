
export default class Browser{
    reloadPage(){
        window.location.href = window.location.href;
    }

    loadPage(href){
        window.location.href = href;
    }

    openTab(href){
        window.open(href);
    }

    downloadFile(href){
        const element = document.createElement("a");
        element.href = href;
        element.download = href;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }
}

