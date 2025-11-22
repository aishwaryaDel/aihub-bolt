import { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import UseCaseOverview from './components/UseCaseOverview';
import LoginModal from './components/LoginModal';
import { LanguageProvider } from './contexts/LanguageContext';
import { UseCase } from './types';
import { useCaseApi } from './services/api';

type Screen = 'landing' | 'overview';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');
  const [useCases, setUseCases] = useState<UseCase[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

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
    if (currentScreen === 'overview') {
      fetchUseCases();
    }
  }, [currentScreen]);

  const handleStartJourney = () => {
    setIsLoginModalOpen(true);
  };

  const handleLoginSuccess = (token: string, user: any) => {
    setAuthToken(token);
    setCurrentUser(user);
    setCurrentScreen('overview');
  };

  return (
    <LanguageProvider>
      {currentScreen === 'landing' ? (
        <LandingPage onStartJourney={handleStartJourney} />
      ) : (
        <UseCaseOverview
          useCases={useCases}
          onBackToHome={() => setCurrentScreen('landing')}
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
    </LanguageProvider>
  );
}

export default App;
