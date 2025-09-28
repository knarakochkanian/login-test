import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { QueryProvider } from './providers/QueryProvider';
import { useAuthStore } from './stores/authStore';
import { useLogin, useVerify2FA, useLogout, useGetNewCode } from './hooks/useAuth';
import LoginForm from './components/LoginForm';
import TwoFactorAuth from './components/TwoFactorAuth';
import Dashboard from './components/Dashboard';
import './App.css';

const AppContent: React.FC = () => {
  const { isAuthenticated, user, show2FA, twoFAError, isLoading, setShow2FA, setTwoFAError } = useAuthStore();
  
  const loginMutation = useLogin();
  const verify2FAMutation = useVerify2FA();
  const logoutMutation = useLogout();
  const getNewCodeMutation = useGetNewCode();

  const handleLogin = async (credentials: { email: string; password: string }) => {
    try {
      await loginMutation.mutateAsync(credentials);
    } catch {
    }
  };

  const handle2FAVerify = async (code: string) => {
    setTwoFAError('');
    try {
      await verify2FAMutation.mutateAsync(code);
      setShow2FA(false);
    } catch {
    }
  };

  const handleBackToLogin = () => {
    setShow2FA(false);
    setTwoFAError('');
  };

  const handleGetNewCode = () => {
    setTwoFAError('');
    getNewCodeMutation.mutate();
  };

  const handleLogout = () => {
    logoutMutation.mutate();
    setShow2FA(false);
    setTwoFAError('');
  };

  if (isAuthenticated) {
    return (
      <Routes>
        <Route path="/dashboard" element={<Dashboard onLogout={handleLogout} user={user || undefined} />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    );
  }

  if (show2FA) {
    return (
      <div className="app-container">
        <TwoFactorAuth
          onVerify={handle2FAVerify}
          onBack={handleBackToLogin}
          onGetNewCode={handleGetNewCode}
          loading={isLoading || verify2FAMutation.isPending}
          error={twoFAError}
        />
      </div>
    );
  }

  return (
    <div className="app-container">
      <LoginForm 
        onLogin={handleLogin} 
        loading={isLoading || loginMutation.isPending} 
      />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 8,
        },
      }}
    >
      <QueryProvider>
        <Router>
          <AppContent />
        </Router>
      </QueryProvider>
    </ConfigProvider>
  );
};

export default App;
