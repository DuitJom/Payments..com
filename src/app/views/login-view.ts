import { html, css, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { Router } from '@vaadin/router';
import { auth } from '../services/auth.js';
import { i18n } from '../services/i18n.js';

@customElement('app-login-view')
export default class LoginView extends LitElement {
  static styles = css`
    :host {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: calc(100vh - 70px);
      padding: 2rem 1rem;
      background: radial-gradient(circle at top, rgba(30, 64, 175, 0.05), transparent 70%), #f8fafc;
    }

    .card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 1.25rem;
      box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04);
      max-width: 460px;
      width: 100%;
      padding: 2.5rem 2rem;
    }

    .header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .logo {
      height: 56px;
      width: auto;
      margin-bottom: 1rem;
    }

    .title {
      font-size: 1.5rem;
      font-weight: 700;
      color: #0f172a;
      margin: 0 0 0.5rem;
    }

    .subtitle {
      font-size: 0.9375rem;
      color: #64748b;
      margin: 0;
      line-height: 1.5;
    }

    /* Tabs for login method */
    .tabs {
      display: flex;
      background: #f1f5f9;
      padding: 0.25rem;
      border-radius: 0.75rem;
      margin-bottom: 1.5rem;
    }

    .tab-btn {
      flex: 1;
      padding: 0.625rem 0.5rem;
      border: none;
      background: transparent;
      border-radius: 0.5rem;
      font-size: 0.875rem;
      font-weight: 600;
      color: #64748b;
      cursor: pointer;
      transition: all 0.2s;
    }

    .tab-btn.active {
      background: #ffffff;
      color: #1e40af;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    /* OAuth Button */
    .btn-google {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      border: 1px solid #cbd5e1;
      background: #ffffff;
      border-radius: 0.75rem;
      font-size: 0.9375rem;
      font-weight: 600;
      color: #334155;
      cursor: pointer;
      transition: all 0.2s;
      margin-bottom: 1.25rem;
    }

    .btn-google:hover:not(:disabled) {
      background: #f8fafc;
      border-color: #94a3b8;
    }

    .divider {
      display: flex;
      align-items: center;
      text-align: center;
      margin: 1.25rem 0;
      color: #94a3b8;
      font-size: 0.8125rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .divider::before,
    .divider::after {
      content: '';
      flex: 1;
      border-bottom: 1px solid #e2e8f0;
    }

    .divider span {
      padding: 0 0.75rem;
    }

    /* Form Inputs */
    .form-group {
      margin-bottom: 1.25rem;
      text-align: left;
    }

    .label {
      display: block;
      font-size: 0.875rem;
      font-weight: 600;
      color: #334155;
      margin-bottom: 0.375rem;
    }

    .input {
      width: 100%;
      box-sizing: border-box;
      padding: 0.75rem 1rem;
      border: 1px solid #cbd5e1;
      border-radius: 0.625rem;
      font-size: 0.9375rem;
      color: #0f172a;
      transition: border-color 0.2s, box-shadow 0.2s;
    }

    .input:focus {
      outline: none;
      border-color: #2563eb;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
    }

    .btn-primary {
      width: 100%;
      padding: 0.875rem;
      background: #1e40af;
      color: #ffffff;
      border: none;
      border-radius: 0.75rem;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      margin-top: 0.5rem;
    }

    .btn-primary:hover:not(:disabled) {
      background: #1d4ed8;
      box-shadow: 0 4px 12px rgba(30, 64, 175, 0.25);
    }

    .btn-primary:disabled,
    .btn-google:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .error-msg {
      background: #fef2f2;
      border: 1px solid #fca5a5;
      color: #dc2626;
      padding: 0.75rem 1rem;
      border-radius: 0.625rem;
      font-size: 0.875rem;
      margin-bottom: 1.25rem;
    }

    .success-msg {
      background: #ecfdf5;
      border: 1px solid #6ee7b7;
      color: #065f46;
      padding: 0.75rem 1rem;
      border-radius: 0.625rem;
      font-size: 0.875rem;
      margin-bottom: 1.25rem;
    }

    .links {
      display: flex;
      justify-content: space-between;
      margin-top: 1.5rem;
      font-size: 0.875rem;
    }

    .link {
      color: #2563eb;
      text-decoration: none;
      font-weight: 600;
      cursor: pointer;
    }

    .link:hover {
      text-decoration: underline;
    }
  `;

  @state() private mode: 'magic' | 'password' = 'magic';
  @state() private email: string = '';
  @state() private password: string = '';
  @state() private loading: boolean = false;
  @state() private errorMessage: string = '';
  @state() private magicSent: boolean = false;

  connectedCallback() {
    super.connectedCallback();
    if (auth.isAuthenticated()) {
      Router.go('/dashboard');
    }
  }

  private async handleGoogleLogin() {
    this.loading = true;
    this.errorMessage = '';
    try {
      await auth.loginWithGoogle();
      Router.go('/dashboard');
    } catch (err: any) {
      this.errorMessage = err.message || 'Gagal log masuk dengan Google.';
    } finally {
      this.loading = false;
    }
  }

  private async handleSubmit(e: Event) {
    e.preventDefault();
    if (this.loading) return; // Prevent double submit

    this.errorMessage = '';
    this.loading = true;

    try {
      if (this.mode === 'magic') {
        if (!this.email || !this.email.includes('@')) {
          throw new Error('Sila masukkan e-mel yang sah.');
        }
        await auth.sendMagicLink(this.email);
        // For demonstration, auto-verify after sending magic link
        await auth.verifyMagicLink(this.email);
        this.magicSent = true;
        Router.go('/dashboard');
      } else {
        if (!this.email || !this.password) {
          throw new Error('Sila masukkan e-mel dan kata laluan.');
        }
        await auth.loginWithPassword(this.email, this.password);
        Router.go('/dashboard');
      }
    } catch (err: any) {
      this.errorMessage = err.message || 'Proses log masuk gagal. Sila cuba lagi.';
    } finally {
      this.loading = false;
    }
  }

  render() {
    return html`
      <div class="card">
        <div class="header">
          <img class="logo" src="https://www.duitjom.com/logo.png" alt="DuitJom Logo" />
          <h1 class="title">${i18n.t('login.title')}</h1>
          <p class="subtitle">${i18n.t('login.subtitle')}</p>
        </div>

        ${this.errorMessage ? html`<div class="error-msg">${this.errorMessage}</div>` : ''}
        ${this.magicSent
          ? html`
              <div class="success-msg">
                <strong>${i18n.t('login.success_magic_title')}</strong>
                <br />${i18n.t('login.success_magic_desc')}
              </div>
            `
          : ''}

        <!-- Google OAuth -->
        <button class="btn-google" ?disabled=${this.loading} @click=${this.handleGoogleLogin}>
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path
              fill="#4285F4"
              d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.616z"
            />
            <path
              fill="#34A853"
              d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
            />
            <path
              fill="#FBBC05"
              d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
            />
            <path
              fill="#EA4335"
              d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
            />
          </svg>
          ${i18n.t('login.google')}
        </button>

        <div class="divider">
          <span>${i18n.t('login.or')}</span>
        </div>

        <!-- Mode Tab Selector -->
        <div class="tabs">
          <button
            class="tab-btn ${this.mode === 'magic' ? 'active' : ''}"
            @click=${() => {
              this.mode = 'magic';
              this.errorMessage = '';
            }}
          >
            ${i18n.t('login.email_magic')}
          </button>
          <button
            class="tab-btn ${this.mode === 'password' ? 'active' : ''}"
            @click=${() => {
              this.mode = 'password';
              this.errorMessage = '';
            }}
          >
            ${i18n.t('login.email_password')}
          </button>
        </div>

        <!-- Login Form -->
        <form @submit=${this.handleSubmit}>
          <div class="form-group">
            <label class="label">Alamat E-mel*</label>
            <input
              type="email"
              class="input"
              required
              placeholder=${i18n.t('login.email_placeholder')}
              .value=${this.email}
              @input=${(e: Event) => (this.email = (e.target as HTMLInputElement).value)}
            />
          </div>

          ${this.mode === 'password'
            ? html`
                <div class="form-group">
                  <label class="label">Kata Laluan*</label>
                  <input
                    type="password"
                    class="input"
                    required
                    placeholder=${i18n.t('login.password_placeholder')}
                    .value=${this.password}
                    @input=${(e: Event) => (this.password = (e.target as HTMLInputElement).value)}
                  />
                </div>
              `
            : ''}

          <button type="submit" class="btn-primary" ?disabled=${this.loading}>
            ${this.loading
              ? i18n.t('login.authenticating')
              : this.mode === 'magic'
              ? i18n.t('login.submit_magic')
              : i18n.t('login.submit_password')}
          </button>
        </form>

        <div class="links">
          <a
            class="link"
            @click=${() => {
              alert('Fungsi Pendaftaran: Sila hubungi sokongan jika anda memerlukan akaun demo baharu.');
            }}
          >
            ${i18n.t('login.register')}
          </a>
          <a
            class="link"
            @click=${() => {
              alert('Sila gunakan fungsi "Login Email" untuk menetapkan semula akses secara selamat.');
            }}
          >
            ${i18n.t('login.forgot')}
          </a>
        </div>
      </div>
    `;
  }
}
