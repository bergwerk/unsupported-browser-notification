import { setCookie, getCookie, isInArray } from './util';

class UnsupportedBrowserNotification {
    constructor(options) {
        this.defaultTranslations = {
            de: {
                title: 'Leider ist Ihr Browser veraltet.',
                description: 'Wir empfehlen Ihnen eine neuere Version oder einen alternativen Browser zu verwenden, um die volle Funktionalität unserer Seite zu erhalten.',
            },
            en: {
                title: 'Unfortunately, your browser is out of date.',
                description: 'We recommend that you use a newer version or an alternative browser to get the full functionality of our site.'
            }
        }

        this.defaultOptions = {
            title: '',
            description: '',
            injectCss: true,
            injectHtml: true,
            cssPrefix: 'ubn',
            lang: 'auto',
            translations: {},
            backdropOpacity: '0.5',
            backdropColor: '#000000',
            closeColor: '#ffffff',
            cookie: 'ubn-hidden',
            showNotification: ['ie', 'edge']
        }

        this.options = {...this.defaultOptions, ...options};

        this.cssPrefix = this.options.cssPrefix;
    }

    init() {
        if (this.defaultOptions.injectCss) this.injectCSS();
        if (this.defaultOptions.injectHtml) this.injectHTML();

        this.listeners();
        this.show();
    }

    detectLanguage() {
        const htmlTag = document.getElementsByTagName('html')[0];
        const lang = htmlTag.getAttribute('lang') || htmlTag.getAttribute('xml:lang');

        let detectedLanguage = this.options.lang;

        if (this.options.lang === 'auto' && lang) {
            // We are only interested in the language, so the country can be removed if string is based on RFC 1766 / 3066
            detectedLanguage = lang.substring(0, 2);
        } else if (this.options.lang === 'auto') {
            console.warn('The language could not be automatically detected. Please use the option \'lang\' to set it manually. The fallback goes automatically to \'en\' for english.')

            // Fallback
            detectedLanguage = 'en';
        }

        return detectedLanguage;
    }

    /**
     * Detect current browser
     * @see https://stackoverflow.com/a/56361977/7104555
     * @returns {string|{description: string, title: string}}
     */
    detectBrowser() {
        const agent = window.navigator.userAgent.toLowerCase();

        switch (true) {
            case agent.indexOf('edge') > -1:
                return 'edge';
            case agent.indexOf('edg/') > -1:
                return 'edge-chromium';
            case agent.indexOf('opr') > -1 && !!window.opr:
                return 'opera';
            case agent.indexOf('chrome') > -1 && !!window.chrome:
                return 'chrome';
            case agent.indexOf('trident') > -1:
                return 'ie';
            case agent.indexOf('firefox') > -1:
                return 'firefox';
            case agent.indexOf('safari') > -1:
                return 'safari';
            default:
                return 'other';
        }
    }

    isUnsupported() {
        return isInArray(this.detectBrowser(), this.options.showNotification);
    }

    text() {
        const language = this.detectLanguage();
        const translations = {...this.defaultTranslations, ...this.options.translations};

        let title = '';
        let description = '';

        const translation = translations[language];

        if (this.options.title && this.options.title.length > 0) {
            title = this.options.title;
        }

        if (this.options.description && this.options.title.description > 0) {
            description = this.options.description;
        }

        if (!title && !title.length > 0 && translation.title) {
            title = translation.title;
        }

        if (!description && !description.length > 0 && translation.description) {
            description = translation.description;
        }

        return {
            title,
            description
        }
    }

    injectCSS() {
        const {cssPrefix} = this.options;

        const css = `
            .${this.cssPrefix} {
                position: fixed;
                z-index: 100000;
                top: 0px;
                left: 0px;
                right: 0px;
                bottom: 0px;
            }
            
            .${this.cssPrefix}--is-hidden {
                display: none !important;
            }
            
            .${this.cssPrefix}__backdrop {
                position: fixed;
                top: 0px;
                left: 0px;
                right: 0px;
                bottom: 0px;
                background-color: ${this.options.backdropColor};
                opacity: ${this.options.backdropOpacity};
            }
            
            .${this.cssPrefix}__modal {
                position: absolute;
                z-index: 5;
                -webkit-transform: translateX(-50%) translateY(-50%);
                    -ms-transform: translateX(-50%) translateY(-50%);
                        transform: translateX(-50%) translateY(-50%);
                top: 50%;
                left: 50%;
                max-width: 700px;
                width: 100%;
                padding: 0 45px;
            }
            
            .${this.cssPrefix}__dialog {
                background-color: #ffffff;
                padding: 30px;
            }
            
            .${this.cssPrefix}__header {
                margin-bottom: 15px;
            }
            
            .${this.cssPrefix}__title {
                font-size: 24px;
                font-weight: bold;
                margin: 0;
            }
            
            .${this.cssPrefix}__description {
                margin: 0;
            }
            
            .${this.cssPrefix}__close-button {
                position: absolute;
                top: 30px;
                right: 30px;
                width: 24px;
                height: 24px;
                background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Cpath fill='%23${this.options.closeColor.replace('#', '')}' d='M27.6,24L46.3,5.3c1-1,1-2.6,0-3.6c-1-1-2.6-1-3.6,0L24,20.4L5.3,1.7c-1-1-2.6-1-3.6,0s-1,2.6,0,3.6L20.4,24 L1.7,42.7c-1,1-1,2.6,0,3.6C2.3,46.8,2.9,47,3.5,47s1.3-0.3,1.8-0.7L24,27.6l18.7,18.7c0.5,0.5,1.1,0.7,1.8,0.7s1.3-0.3,1.8-0.7 c1-1,1-2.6,0-3.6L27.6,24z'/%3E%3C/svg%3E%0A");
                cursor: pointer;
            }        
        `;

        const styleElement = document.createElement('style');
        styleElement.textContent = css;

        document.body.appendChild(styleElement);
    }

    injectHTML() {
        const {cssPrefix} = this.options;

        const html = `
            <div class="${cssPrefix} ${cssPrefix}--is-hidden">
                <div class="${cssPrefix}__modal">
                    <div class="${cssPrefix}__dialog">
                        <div class="${cssPrefix}__header">
                            <h5 class="${cssPrefix}__title">${this.text().title}</h5>
                        </div>
                        <div class="${cssPrefix}__body">
                            <p class="${cssPrefix}__description">${this.text().description}</p>
                        </div>
                    </div>
                </div>
            
                <div class="${cssPrefix}__backdrop"></div>
                <div class="${cssPrefix}__close-button" type="button"></div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', html);
    }

    listeners() {
        const closeButton = document.querySelector(`.${this.cssPrefix}__close-button`);

        closeButton.addEventListener('click', () => {
            this.hide();
        });
    }

    hide() {
        const notification = document.querySelector(`.${this.cssPrefix}`);

        notification.classList.add(`${this.cssPrefix}--is-hidden`);
        setCookie(this.options.cookie, '1', 1);
    }

    show() {
        const cookie = getCookie(this.options.cookie);

        const notification = document.querySelector(`.${this.cssPrefix}`);

        if (this.isUnsupported() && cookie !== '1') {
            notification.classList.remove(`${this.cssPrefix}--is-hidden`);
        }
    }
}

export default UnsupportedBrowserNotification;
