// LOCALSTORAGE METHODS

export function setLocalItem(name: string, value: string) {
    localStorage.setItem(name, value);
}

export function getLocalItem(name: string) {
    const match = localStorage.getItem(name);
    return match;
}

export function deleteLocalItem(name: string) {
    localStorage.removeItem(name);
}

// GET URL PARAMS METHOD

export function getUrlParam(name: string) {
    var result = null,
        tmp = [];
    window.location.search
        .substr(1)
        .split("&")
        .forEach(function (item) {
          tmp = item.split("=");
          if (tmp[0] === name) {
            result = decodeURIComponent(tmp[1]);
          }
        });
    return result;
}