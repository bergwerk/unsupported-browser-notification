const getCookie = (name) => {
    const v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return v ? v[2] : null;
}

const setCookie = (name, value, days) => {
    const d = new Date;
    d.setTime(d.getTime() + 24 * 60 * 60 * 1000 * days);
    document.cookie = `${name}=${value};path=/;expires=${d.toGMTString()}`;
}

const isInArray = (value, array) => {
    return array.indexOf(value) > -1;
}

export {
    getCookie,
    setCookie,
    isInArray
}