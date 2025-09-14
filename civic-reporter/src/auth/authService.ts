import { STORAGE_KEYS } from '@/config/constants';

export type UserType = 'user' | 'admin';

export interface AuthUser {
  type: UserType;
  email?: string;
  // backend: add more fields like id, name, token if needed
}

// this handles user authentication
export class AuthService {
  // replace this with POST /api/auth/login

  static login(userType: UserType, email?: string): AuthUser {
    // replace with fetch('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) })
    const user: AuthUser = { type: userType, email };
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
    return user;
  }

  //replace this with POST /api/auth/logout
  static logout(): void {
    // replace with fetch('/api/auth/logout', { method: 'POST' })
    localStorage.removeItem(STORAGE_KEYS.user);
  }

  // replace this with GET /api/auth/me
  static getCurrentUser(): AuthUser | null {
    // fetch('/api/auth/me') with Authorization header
    const stored = localStorage.getItem(STORAGE_KEYS.user);
    return stored ? JSON.parse(stored) : null;
  }

  static isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  // this checks if current user is admin
  static isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.type === 'admin';
  }

  // remove this validation
  // replace with real database user validation
  static validateAdminCredentials(email: string, password: string): boolean {
    // remove credentials
    // validate database with password hashing
    return email === 'admin@civic.com' && password === 'admin123';
  }
}