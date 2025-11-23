import { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import UseCaseOverview from './components/UseCaseOverview';
import LoginModal from './components/LoginModal';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { UseCase } from './types';
import { useCaseApi } from './services/api';

type Screen = 'landing' | 'overview';

function AppContent() {
  const { login, logout, isAuthenticated } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');
  const [useCases, setUseCases] = useState<UseCase[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const fetchUseCases = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await useCaseApi.getAllUseCases();
      setUseCases(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load use cases');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentScreen === 'overview' && isAuthenticated()) {
      fetchUseCases();
    }
  }, [currentScreen]);

  const handleStartJourney = () => {
    setIsLoginModalOpen(true);
  };

  const handleLoginSuccess = (token: string, user: any) => {
    login(token, user);
    setCurrentScreen('overview');
  };

  const handleBackToHome = () => {
    logout();
    setUseCases([]);
    setError(null);
    setIsLoginModalOpen(false);
    setCurrentScreen('landing');
  };

  return (
    <>
      {currentScreen === 'landing' ? (
        <LandingPage onStartJourney={handleStartJourney} />
      ) : (
        <UseCaseOverview
          useCases={useCases}
          onBackToHome={handleBackToHome}
          isLoading={isLoading}
          error={error}
          onRefresh={fetchUseCases}
        />
      )}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
