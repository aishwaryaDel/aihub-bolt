import { useState } from 'react';
import { X, Eye, EyeOff, ExternalLink } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { authApi } from '../services/authApi';
import { UI_CONSTANTS, STYLE_CONSTANTS, CONSOLE_MESSAGES } from '../config/constants';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: any) => void;
}

export default function LoginModal({ isOpen, onClose, onLoginSuccess }: LoginModalProps) {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!email || !password) {
      setError(t('login.fillAllFields'));
      setIsLoading(false);
      return;
    }

    try {
      const data = await authApi.login({ email, password });
      onLoginSuccess(data.user);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('login.connectionFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className={STYLE_CONSTANTS.CLASS_NAMES.MODAL_OVERLAY}
      onClick={handleOverlayClick}
    >
      <div className={STYLE_CONSTANTS.CLASS_NAMES.MODAL_CONTAINER}>
        <button
          onClick={onClose}
          className={STYLE_CONSTANTS.CLASS_NAMES.CLOSE_BUTTON}
        >
          <X size={UI_CONSTANTS.ICON_SIZES.MEDIUM} />
        </button>

        <div className={STYLE_CONSTANTS.SPACING.MODAL_PADDING}>
          <div className={`flex justify-center ${STYLE_CONSTANTS.SPACING.LOGO_MARGIN}`}>
            <img
              src={UI_CONSTANTS.IMAGES.LOGO_PATH}
              alt={UI_CONSTANTS.IMAGES.LOGO_ALT}
              className={`${STYLE_CONSTANTS.SPACING.LOGO_HEIGHT} w-auto`}
            />
          </div>

          <h2 className={STYLE_CONSTANTS.CLASS_NAMES.HEADING}>
            {t('login.title')}
          </h2>

          <form onSubmit={handleSubmit} className={STYLE_CONSTANTS.SPACING.FORM}>
            <div>
              <label htmlFor={UI_CONSTANTS.FORM.IDS.EMAIL} className={STYLE_CONSTANTS.CLASS_NAMES.FORM_LABEL}>
                {t('login.email')}
              </label>
              <input
                type={UI_CONSTANTS.FORM.TYPES.EMAIL}
                id={UI_CONSTANTS.FORM.IDS.EMAIL}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('login.emailPlaceholder')}
                className={STYLE_CONSTANTS.CLASS_NAMES.INPUT_FIELD}
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor={UI_CONSTANTS.FORM.IDS.PASSWORD} className={STYLE_CONSTANTS.CLASS_NAMES.FORM_LABEL}>
                {t('login.password')}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? UI_CONSTANTS.FORM.TYPES.TEXT : UI_CONSTANTS.FORM.TYPES.PASSWORD}
                  id={UI_CONSTANTS.FORM.IDS.PASSWORD}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('login.passwordPlaceholder')}
                  className={STYLE_CONSTANTS.CLASS_NAMES.INPUT_FIELD}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={STYLE_CONSTANTS.CLASS_NAMES.PASSWORD_TOGGLE}
                >
                  {showPassword ? <EyeOff size={UI_CONSTANTS.ICON_SIZES.SMALL} /> : <Eye size={UI_CONSTANTS.ICON_SIZES.SMALL} />}
                </button>
              </div>
            </div>

            {error && (
              <div className={STYLE_CONSTANTS.CLASS_NAMES.ERROR_BOX}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={STYLE_CONSTANTS.CLASS_NAMES.PRIMARY_BUTTON}
            >
              {isLoading ? t('login.loggingIn') : t('login.loginButton')}
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className={STYLE_CONSTANTS.CLASS_NAMES.DIVIDER_LINE}></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className={STYLE_CONSTANTS.CLASS_NAMES.DIVIDER_TEXT}>{UI_CONSTANTS.TEXT.OR_DIVIDER}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                console.log(CONSOLE_MESSAGES.AZURE_AD_CLICKED);
              }}
              className={STYLE_CONSTANTS.CLASS_NAMES.SECONDARY_BUTTON}
            >
              <ExternalLink size={UI_CONSTANTS.ICON_SIZES.SMALL} />
              {UI_CONSTANTS.BUTTON_LABELS.AZURE_AD_SIGNIN}
            </button>

            <div className="text-center mt-4">
              <button
                type="button"
                className={STYLE_CONSTANTS.CLASS_NAMES.LINK_BUTTON}
              >
                {t('login.forgotPassword')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
