import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'am', label: 'አማርኛ (Amharic)' },
  { code: 'fr', label: 'Français (French)' },
  { code: 'ar', label: 'العربية (Arabic)' },
  { code: 'es', label: 'Español (Spanish)' },
  { code: 'sw', label: 'Kiswahili (Swahili)' },
];

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  return (
    <div className="flex items-center gap-2">
      <Globe className="size-4 text-indigo-200" />
      <Select
        value={i18n.language}
        onValueChange={(val) => i18n.changeLanguage(val)}
      >
        <SelectTrigger className="w-[140px] h-8 text-xs bg-indigo-900/50 border-indigo-700/50 text-white">
          <SelectValue placeholder="Language" />
        </SelectTrigger>
        <SelectContent>
          {LANGUAGES.map((lang) => (
            <SelectItem key={lang.code} value={lang.code} className="text-xs">
              {lang.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
