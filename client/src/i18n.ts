import i18next from 'i18next';
import {initReactI18next} from 'react-i18next';

import english from './locales/en.json';
import swedish from './locales/sv.json';

const resources = {
  en: {
    translation: english,
  },
  sv: {
    translation: swedish,
  },
};

i18next.use(initReactI18next).init({
  resources,
  lng: 'en',
});

export default i18next;
