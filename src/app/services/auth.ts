export interface User {
  id: string;
  email: string;
  fullName?: string;
  authMethod: 'google' | 'magic_link' | 'password';
}

type AuthListener = (user: User | null) => void;

class AuthService {
  private currentUser: User | null = null;
  private listeners: Set<AuthListener> = new Set();
  private welcomePopupShownInSession: boolean = false;

  constructor() {
    this.loadSession();
  }

  private loadSession(): void {
    if (typeof sessionStorage !== 'undefined') {
      const stored = sessionStorage.getItem('duitjom_session_user');
      if (stored) {
        try {
          this.currentUser = JSON.parse(stored);
        } catch {
          this.currentUser = null;
        }
      }
      const popupShown = sessionStorage.getItem('duitjom_welcome_shown');
      if (popupShown === 'true') {
        this.welcomePopupShownInSession = true;
      }
    }
  }

  public getUser(): User | null {
    return this.currentUser;
  }

  public isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  public shouldShowWelcomePopup(): boolean {
    return this.isAuthenticated() && !this.welcomePopupShownInSession;
  }

  public markWelcomePopupShown(): void {
    this.welcomePopupShownInSession = true;
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem('duitjom_welcome_shown', 'true');
    }
  }

  // Google Login
  public async loginWithGoogle(): Promise<User> {
    await new Promise((res) => setTimeout(res, 800));
    const user: User = {
      id: 'usr_google_' + Date.now(),
      email: 'user.google@example.com',
      fullName: 'Google User',
      authMethod: 'google'
    };
    this.setSession(user);
    return user;
  }

  // Magic Link ("Login Email")
  public async sendMagicLink(email: string): Promise<boolean> {
    await new Promise((res) => setTimeout(res, 1000));
    // Simulate magic link delivery
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('duitjom_pending_magic_email', email);
    }
    return true;
  }

  public async verifyMagicLink(email: string): Promise<User> {
    await new Promise((res) => setTimeout(res, 600));
    const user: User = {
      id: 'usr_magic_' + Date.now(),
      email: email,
      fullName: email.split('@')[0],
      authMethod: 'magic_link'
    };
    this.setSession(user);
    return user;
  }

  // Password Login
  public async loginWithPassword(email: string, pass: string): Promise<User> {
    await new Promise((res) => setTimeout(res, 800));
    if (!email || !pass) {
      throw new Error('Sila masukkan e-mel dan kata laluan yang sah.');
    }
    const user: User = {
      id: 'usr_pass_' + Date.now(),
      email: email,
      fullName: email.split('@')[0],
      authMethod: 'password'
    };
    this.setSession(user);
    return user;
  }

  public async registerAccount(email: string, pass: string, name?: string): Promise<User> {
    await new Promise((res) => setTimeout(res, 800));
    if (!email || !pass) {
      throw new Error('Maklumat pendaftaran tidak lengkap.');
    }
    const user: User = {
      id: 'usr_reg_' + Date.now(),
      email,
      fullName: name || email.split('@')[0],
      authMethod: 'password'
    };
    this.setSession(user);
    return user;
  }

  public logout(): void {
    this.currentUser = null;
    this.welcomePopupShownInSession = false;
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem('duitjom_session_user');
      sessionStorage.removeItem('duitjom_welcome_shown');
    }
    this.notify();
  }

  private setSession(user: User): void {
    this.currentUser = user;
    this.welcomePopupShownInSession = false; // Fresh login -> will show welcome popup once
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem('duitjom_session_user', JSON.stringify(user));
      sessionStorage.removeItem('duitjom_welcome_shown');
    }
    this.notify();
  }

  public subscribe(listener: AuthListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener(this.currentUser));
  }
}

export const auth = new AuthService();
