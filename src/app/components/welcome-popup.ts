import { html, css, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { auth } from '../services/auth.js';
import { i18n } from '../services/i18n.js';

@customElement('welcome-popup')
export class WelcomePopup extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.6);
      backdrop-filter: blur(6px);
      z-index: 2000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.25rem;
      animation: fadeIn 0.25s ease-out;
    }

    .modal-card {
      background: #ffffff;
      border-radius: 1.25rem;
      max-width: 440px;
      width: 100%;
      padding: 2rem 1.75rem;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
      position: relative;
      text-align: center;
      border: 1px solid #e2e8f0;
      animation: scaleUp 0.25s ease-out;
    }

    .close-btn {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: #f1f5f9;
      border: none;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      font-size: 1.125rem;
      color: #64748b;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }

    .close-btn:hover {
      background: #e2e8f0;
      color: #0f172a;
    }

    .logo-container {
      margin-bottom: 1.25rem;
    }

    .logo-container img {
      height: 52px;
      width: auto;
      object-fit: contain;
    }

    .title {
      font-size: 1.375rem;
      font-weight: 700;
      color: #0f172a;
      margin: 0 0 0.75rem;
      line-height: 1.3;
    }

    .description {
      font-size: 0.9375rem;
      color: #475569;
      margin: 0 0 1.75rem;
      line-height: 1.6;
    }

    .btn-continue {
      width: 100%;
      padding: 0.875rem 1.5rem;
      background: #1e40af;
      color: #ffffff;
      border: none;
      border-radius: 0.75rem;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(30, 64, 175, 0.25);
      transition: all 0.2s;
    }

    .btn-continue:hover {
      background: #1d4ed8;
      transform: translateY(-1px);
      box-shadow: 0 6px 16px rgba(30, 64, 175, 0.35);
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes scaleUp {
      from { transform: scale(0.95); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
  `;

  @state() private visible: boolean = false;
  private unsubAuth?: () => void;

  connectedCallback(): void {
    super.connectedCallback();
    this.evaluatePopupVisibility();
    this.unsubAuth = auth.subscribe(() => {
      this.evaluatePopupVisibility();
    });
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this.unsubAuth) this.unsubAuth();
  }

  private evaluatePopupVisibility() {
    this.visible = auth.shouldShowWelcomePopup();
  }

  private closePopup() {
    auth.markWelcomePopupShown();
    this.visible = false;
  }

  render() {
    if (!this.visible) return html``;

    return html`
      <div class="modal-overlay" @click=${(e: MouseEvent) => {
        if (e.target === e.currentTarget) this.closePopup();
      }}>
        <div class="modal-card">
          <button class="close-btn" @click=${this.closePopup} aria-label="Tutup">✕</button>

          <div class="logo-container">
            <img src="https://www.duitjom.com/logo.png" alt="DuitJom Logo" />
          </div>

          <h3 class="title">${i18n.t('welcome.title')}</h3>

          <p class="description">
            ${i18n.t('welcome.desc')}
          </p>

          <button class="btn-continue" @click=${this.closePopup}>
            ${i18n.t('welcome.continue')}
          </button>
        </div>
      </div>
    `;
  }
}
