
const reloadPage = () => {
    window.location.href = window.location.href;
};

const loadPage = href => {
    window.location.href = href;
};

const openTab = href => {
    window.open(href);
};

const downloadFile = href => {
    const element = document.createElement("a");
    element.href = href;
    element.download = href;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
};

const addClasses = (domEl, classList) => {
    classList.forEach(el => {
        domEl.classList.add(el);
    });
};

const getCookie = cname => {
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
