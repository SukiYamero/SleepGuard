import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';
import en from './locales/en';
import es from './locales/es';

const deviceLanguage = RNLocalize.getLocales()[0].languageCode;

i18n
    .use(initReactI18next)
    .init({
        compatibilityJSON: 'v4',
        resources: {
            en,
            es,
        },
        lng: deviceLanguage,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
