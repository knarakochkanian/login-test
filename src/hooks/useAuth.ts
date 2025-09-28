import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { authService } from '../services/authService';
import type { LoginCredentials } from '../services/authService';
import { useAuthStore } from '../stores/authStore';

export const useLogin = () => {
  const { setUser, setLoading } = useAuthStore();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      setLoading(true);
      const response = await authService.login(credentials);
      
      if (response.success && response.user) {
        if (response.requires2FA) {
          setUser({ ...response.user, requires2FA: true });
          return { success: true, requires2FA: true, user: response.user };
        } else {
          setUser(response.user);
          message.success('Login successful!');
          return { success: true, requires2FA: false, user: response.user };
        }
      } else {
        message.error(response.message || 'Login failed');
        throw new Error(response.message || 'Login failed');
      }
    },
    onError: (error: Error) => {
      if (error.message.includes('Network error')) {
        message.error('Network error: Please check your internet connection');
      } else if (error.message.includes('Server error')) {
        message.error('Server error: Please try again later');
      } else if (error.message.includes('timeout')) {
        message.error('Request timeout: Please try again');
      } else if (error.message.includes('blocked')) {
        message.error('Account blocked: Please contact support');
      } else if (error.message.includes('expired')) {
        message.error('Account expired: Please renew your subscription');
      } else if (error.message.includes('maintenance')) {
        message.error('System maintenance: Please try again later');
      } else if (error.message.includes('rate limit')) {
        message.error('Too many attempts: Please wait before trying again');
      } else {
        message.error('Login failed: ' + error.message);
      }
      console.error('Login error:', error);
    },
    onSettled: () => {
      setLoading(false);
    },
    retry: (failureCount, error) => {
      if (error.message.includes('Invalid') || error.message.includes('blocked') || error.message.includes('expired')) {
        return false;
      }
      return failureCount < 2;
    },
  });
};

export const useVerify2FA = () => {
  const { user, setUser, setTwoFAError, setLoading } = useAuthStore();

  return useMutation({
    mutationFn: async (code: string) => {
      if (!user) throw new Error('No user found');
      
      setLoading(true);
      const response = await authService.verify2FA(user.id, code);
      
      if (response.success && response.user) {
        setUser({ ...response.user, requires2FA: false });
        message.success('2FA verification successful!');
        return { success: true, user: response.user };
      } else {
        setTwoFAError(response.message || 'Invalid verification code');
        throw new Error(response.message || 'Invalid verification code');
      }
    },
    onError: (error) => {
      message.error('An error occurred during verification');
      console.error('2FA verification error:', error);
    },
    onSettled: () => {
      setLoading(false);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const { logout } = useAuthStore();

  return useMutation({
    mutationFn: async () => {
      await authService.logout();
    },
    onSuccess: () => {
      logout();
      queryClient.clear();
      message.success('Logged out successfully');
    },
    onError: (error) => {
      message.error('An error occurred during logout');
      console.error('Logout error:', error);
    },
  });
};

export const useGetNewCode = () => {
  return useMutation({
    mutationFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    },
    onSuccess: () => {
      message.success('New code sent to your authenticator app');
    },
    onError: () => {
      message.error('Failed to send new code');
    },
  });
};
