import UnsupportedBrowserNotification from './UnsupportedBrowserNotification';

document.addEventListener("DOMContentLoaded", function(event) {
    let options = {};

    if (window.ubnOptions) options = window.ubnOptions;

    const notification = new UnsupportedBrowserNotification(options);

    notification.init();
});