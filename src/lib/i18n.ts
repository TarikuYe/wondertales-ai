import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation resources
import translationEN from '../locales/en.json';
import translationAM from '../locales/am.json';
import translationAR from '../locales/ar.json';
import translationFR from '../locales/fr.json';
import translationES from '../locales/es.json';
import translationSW from '../locales/sw.json';

const resources = {
  en: { translation: translationEN },
  am: { translation: translationAM },
  ar: { translation: translationAR },
  fr: { translation: translationFR },
  es: { translation: translationES },
  sw: { translation: translationSW },
};

// Always initialise with 'en' so the SSR-rendered HTML matches the
// initial client render (no hydration mismatch). After React has
// mounted we read the user's saved preference from localStorage and
// switch to it in a non-render phase.
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',            // Fixed start language — keeps SSR + client in sync
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

// Apply RTL direction whenever the language changes (guarded for SSR)
const applyDirection = (lng: string) => {
  if (typeof document === 'undefined') return;
  document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = lng;
};

i18n.on('languageChanged', applyDirection);

// After the browser has painted (post-hydration), read the user's
// saved language and switch to it. We defer with setTimeout(0) so
// this never fires during SSR or the synchronous hydration pass.
if (typeof window !== 'undefined') {
  setTimeout(() => {
    const saved = localStorage.getItem('i18nextLng');
    if (saved && saved !== 'en' && resources[saved as keyof typeof resources]) {
      i18n.changeLanguage(saved);
    }
  }, 0);
}

// Persist language choice whenever the user changes it
i18n.on('languageChanged', (lng) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('i18nextLng', lng);
  }
});

export default i18n;
