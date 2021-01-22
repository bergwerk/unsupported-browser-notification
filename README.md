<div align="center">
<h1>Unsupported Browser Notification</h1>
</div>

With Internet Explorer becoming less prevalent and frameworks like Bootstrap 5 also dropping support for IE 10 and IE 11, it makes less and less sense to support these browsers.

To show someone who is still using IE or Edge (not Chromium based) that the site is not actually broken (it' only for him broken), the plugin gives the possibility to show the user a short message that he is using a browser that is no longer supported.

## Install

**Important:** Because of older Browsers, we recommend to implement this plugin before any other JavaScript.

### Option 1: Self Executing

Include the plugin's script at the bottom ot the HTML body: 

```html
<script src='dist/notification.js'></script>
```

If you want to overwrite some default options, you have the possibility to define `ubnOptions` on the `window` object.
It's important that you define the options before you include the file.

```html
<script>
    window.ubnOptions = {
        title: 'Uppps. Your browser is to old ...',
        showNotification: ['ie', 'chrome']
    }
</script>
<script src='dist/notification.js'></script>
```

### Option 2: Call the plugin

Include the plugins's UMD script at the bottom of the HTML body:
```html
<script src='dist/notification.umd.js'></script>
```

Call the plugin. Pass the options to the plugin initialization.
```html
<script src='dist/notification.umd.js'></script>
<script>
    var notification = new UnsupportedBrowserNotification({
        showNotification: ['ie', 'chrome']
    });

    notification.init();
</script>
```

## Options

```js
title: '',
description: '',
injectCss: true,
injectHtml: true,
cssPrefix: 'ubn',
lang: 'auto', // Language key e.g. 'en', 'de'
translations: {
    en: {
        title: 'Uppps. Your browser is to old ...',
        description: 'We recommend that you use a newer version!'
    }
},
backdropOpacity: '0.5',
backdropColor: '#000000',
closeColor: '#ffffff',
cookie: 'ubn-hidden',
showNotification: ['ie', 'edge'] // Possible options 'edge', 'edge-chromium', 'opera', 'chrome', 'ie', 'firefox', 'safari'
```

## License

Copyright © 2021 Marvin Hübner and contributors

Licensed under the MIT license, see [LICENSE](LICENSE) for details.