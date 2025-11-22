import { useState } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import bcrypt from 'bcryptjs';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (token: string, user: any) => void;
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
      const hashedPassword = await bcrypt.hash(password, 10);

      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password: hashedPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || t('login.loginFailed'));
        setIsLoading(false);
        return;
      }

      if (data.success) {
        onLoginSuccess(data.data.token, data.data.user);
        onClose();
      }
    } catch (err) {
      setError(t('login.connectionFailed'));
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
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="p-8">
          <div className="flex justify-center mb-6">
            <img
              src="/image.png"
              alt="Tesa logo"
              className="h-16 w-auto"
            />
          </div>

          <h2 className="text-3xl font-bold text-slate-800 text-center mb-8">
            {t('login.title')}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                {t('login.email')}
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('login.emailPlaceholder')}
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                {t('login.password')}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('login.passwordPlaceholder')}
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-600 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#E30613] hover:bg-[#c00510] text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? t('login.loggingIn') : t('login.loginButton')}
            </button>

            <div className="text-center">
              <button
                type="button"
                className="text-blue-600 hover:text-blue-700 text-sm transition-colors"
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
