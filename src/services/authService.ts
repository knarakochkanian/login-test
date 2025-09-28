export interface User {
  id: string;
  email: string;
  name?: string;
  requires2FA?: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  requires2FA?: boolean;
  message?: string;
}


class AuthService {
  private baseUrl = 'http://localhost:3001/api';

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(credentials.email)) {
        return {
          success: false,
          message: 'Invalid email format'
        };
      }

      const response = await this.makeRequest<AuthResponse>('/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async verify2FA(userId: string, code: string): Promise<AuthResponse> {
    try {
      const response = await this.makeRequest<AuthResponse>('/verify-2fa', {
        method: 'POST',
        body: JSON.stringify({ userId, code }),
      });

      return response;
    } catch (error) {
      console.error('2FA verification error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await this.makeRequest('/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
}

export const authService = new AuthService();
