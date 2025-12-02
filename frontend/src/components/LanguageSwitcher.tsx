import { useLanguage } from '../contexts/LanguageContext';
import { UI_CONSTANTS } from '../config/constants';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  return (
    <div className="flex items-center gap-2 bg-[#f2f2f2] rounded-lg p-1">
      <button
        onClick={() => setLanguage(UI_CONSTANTS.LANGUAGE.CODES.GERMAN)}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
          language === UI_CONSTANTS.LANGUAGE.CODES.GERMAN
            ? 'bg-[#E30613] text-white'
            : 'text-gray-600 hover:bg-gray-200'
        }`}
      >
        {UI_CONSTANTS.LANGUAGE.LABELS.GERMAN}
      </button>
      <button
        onClick={() => setLanguage(UI_CONSTANTS.LANGUAGE.CODES.ENGLISH)}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
          language === UI_CONSTANTS.LANGUAGE.CODES.ENGLISH
            ? 'bg-[#E30613] text-white'
            : 'text-gray-600 hover:bg-gray-200'
        }`}
      >
        {UI_CONSTANTS.LANGUAGE.LABELS.ENGLISH}
      </button>
    </div>
  );
}
