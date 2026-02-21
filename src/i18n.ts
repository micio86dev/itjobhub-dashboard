import { createI18n } from 'vue-i18n';
import it from './locales/it.json';
import en from './locales/en.json';

export const i18n = createI18n({
    legacy: false,
    locale: 'it',
    fallbackLocale: 'en',
    messages: {
        it,
        en,
        es: {},
        fr: {},
        de: {}
    }
});
