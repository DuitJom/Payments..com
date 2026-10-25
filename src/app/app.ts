import { html, css, LitElement, unsafeCSS } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { Router, VaadinRouterLocationChangedEvent } from '@vaadin/router';
import { routes } from './app-routing.js';
import { i18n, LANGUAGES } from './services/i18n.js';
import { auth, User } from './services/auth.js';
import baseStyles from '/src/app/base-view-styles.css?inline';

@customElement('app-root')
export default class App extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      background-color: #f8fafc;
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
      color: #0f172a;
    }

    /* Header & Navbar */
    .header {
      position: sticky;
      top: 0;
      z-index: 50;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid #e2e8f0;
      box-shadow: 0 1px 3px rgba(15, 23, 42, 0.05);
    }

    .navbar-container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0.75rem 1.25rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      text-decoration: none;
      color: #0f172a;
      font-weight: 700;
      font-size: 1.25rem;
      cursor: pointer;
    }

    .brand img {
      height: 38px;
      width: auto;
      object-fit: contain;
    }

    .nav-menu {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .nav-item {
      padding: 0.5rem 0.875rem;
      border-radius: 0.5rem;
      font-weight: 600;
      font-size: 0.9375rem;
      color: #475569;
      text-decoration: none;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .nav-item:hover,
    .nav-item.active {
      color: #1e40af;
      background-color: #eff6ff;
    }

    .nav-right {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    /* Language Dropdown */
    .lang-dropdown {
      position: relative;
    }

    .lang-btn {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      padding: 0.5rem 0.75rem;
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      border-radius: 0.5rem;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      color: #334155;
    }

    .lang-btn:hover {
      background: #e2e8f0;
    }

    .lang-menu {
      position: absolute;
      right: 0;
      top: calc(100% + 0.5rem);
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 0.75rem;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
      width: 170px;
      padding: 0.375rem;
      z-index: 100;
      display: flex;
      flex-direction: column;
    }

    .lang-option {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 0.75rem;
      border: none;
      background: transparent;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      font-weight: 500;
      text-align: left;
      cursor: pointer;
      color: #334155;
    }

    .lang-option:hover,
    .lang-option.active {
      background: #eff6ff;
      color: #1e40af;
      font-weight: 600;
    }

    /* User Badge & Logout */
    .user-pill {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.375rem 0.75rem;
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      border-radius: 9999px;
      font-size: 0.875rem;
      font-weight: 600;
      color: #1e40af;
    }

    .btn-logout {
      padding: 0.5rem 0.875rem;
      border: 1px solid #e2e8f0;
      background: #ffffff;
      color: #dc2626;
      border-radius: 0.5rem;
      font-weight: 600;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-logout:hover {
      background: #fef2f2;
      border-color: #fca5a5;
    }

    /* Mobile Hamburger */
    .hamburger {
      display: none;
      background: transparent;
      border: none;
      padding: 0.5rem;
      cursor: pointer;
      color: #1e293b;
    }

    .hamburger svg {
      width: 28px;
      height: 28px;
    }

    /* Mobile Drawer */
    .mobile-drawer-overlay {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.5);
      backdrop-filter: blur(4px);
      z-index: 1000;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s ease;
    }

    .mobile-drawer-overlay.open {
      opacity: 1;
      pointer-events: auto;
    }

    .mobile-drawer {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      width: 280px;
      background: #ffffff;
      z-index: 1001;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      box-shadow: -4px 0 20px rgba(0, 0, 0, 0.15);
      transform: translateX(100%);
      transition: transform 0.3s ease;
    }

    .mobile-drawer.open {
      transform: translateX(0);
    }

    .drawer-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 1rem;
      border-bottom: 1px solid #e2e8f0;
    }

    .btn-close {
      background: transparent;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: #64748b;
    }

    .drawer-menu {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-top: 1.5rem;
    }

    .drawer-item {
      padding: 0.75rem 1rem;
      border-radius: 0.5rem;
      font-weight: 600;
      color: #334155;
      text-decoration: none;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .drawer-item.active {
      background: #eff6ff;
      color: #1e40af;
    }

    .view-container {
      flex: 1;
      display: block;
    }

    @media (max-width: 900px) {
      .nav-menu {
        display: none;
      }
      .hamburger {
        display: block;
      }
    }
  `;

  @state() private currentPath: string = '/';
  @state() private user: User | null = null;
  @state() private langMenuOpen: boolean = false;
  @state() private mobileMenuOpen: boolean = false;

  private unsubAuth?: () => void;
  private unsubI18n?: () => void;

  connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener('vaadin-router-location-changed', this.onLocationChange);
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('click', this.onGlobalClick);

    this.user = auth.getUser();
    this.unsubAuth = auth.subscribe((u) => {
      this.user = u;
      this.requestUpdate();
    });

    this.unsubI18n = i18n.subscribe(() => {
      this.requestUpdate();
    });
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener('vaadin-router-location-changed', this.onLocationChange);
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('click', this.onGlobalClick);
    if (this.unsubAuth) this.unsubAuth();
    if (this.unsubI18n) this.unsubI18n();
  }

  private onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      this.langMenuOpen = false;
      this.mobileMenuOpen = false;
    }
  };

  private onGlobalClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest('.lang-dropdown')) {
      this.langMenuOpen = false;
    }
  };

  private onLocationChange = (event: VaadinRouterLocationChangedEvent) => {
    this.currentPath = event.detail?.location?.pathname ?? '/';
    this.mobileMenuOpen = false;
  };

  private navigate(path: string) {
    Router.go(path);
    this.mobileMenuOpen = false;
  }

  private handleLogout() {
    auth.logout();
    Router.go('/login');
  }

  render() {
    const currentLangObj = LANGUAGES.find((l) => l.code === i18n.getLanguage()) || LANGUAGES[0];

    return html`
      <style>${unsafeCSS(baseStyles)}</style>

      <header class="header">
        <div class="navbar-container">
          <!-- Logo -->
          <div class="brand" @click=${() => this.navigate(this.user ? '/dashboard' : '/login')}>
            <img src="https://www.duitjom.com/logo.png" alt="DuitJom Logo" />
            <span>DuitJom</span>
          </div>

          <!-- Desktop Navigation -->
          <nav class="nav-menu">
            <a
              class="nav-item ${this.currentPath === '/dashboard' || this.currentPath === '/' ? 'active' : ''}"
              @click=${() => this.navigate('/dashboard')}
            >
              ${i18n.t('nav.home')}
            </a>
            <a
              class="nav-item ${this.currentPath === '/mohon-pinjaman' ? 'active' : ''}"
              @click=${() => this.navigate('/mohon-pinjaman')}
            >
              ${i18n.t('nav.apply')}
            </a>
            <a
              class="nav-item ${this.currentPath === '/buat-bayaran' ? 'active' : ''}"
              @click=${() => this.navigate('/buat-bayaran')}
            >
              ${i18n.t('nav.pay')}
            </a>
            <a
              class="nav-item ${this.currentPath === '/rekod-permohonan' ? 'active' : ''}"
              @click=${() => this.navigate('/rekod-permohonan')}
            >
              ${i18n.t('nav.records')}
            </a>
            <a
              class="nav-item ${this.currentPath === '/bantuan' ? 'active' : ''}"
              @click=${() => this.navigate('/bantuan')}
            >
              ${i18n.t('nav.help')}
            </a>
          </nav>

          <!-- Right Actions -->
          <div class="nav-right">
            <!-- Language Dropdown -->
            <div class="lang-dropdown">
              <button class="lang-btn" @click=${() => (this.langMenuOpen = !this.langMenuOpen)}>
                <span>${currentLangObj.flag}</span>
                <span>${currentLangObj.code.toUpperCase()}</span>
                <span style="font-size: 0.7rem;">▼</span>
              </button>

              ${this.langMenuOpen
                ? html`
                    <div class="lang-menu">
                      ${LANGUAGES.map(
                        (l) => html`
                          <button
                            class="lang-option ${l.code === currentLangObj.code ? 'active' : ''}"
                            @click=${() => {
                              i18n.setLanguage(l.code);
                              this.langMenuOpen = false;
                            }}
                          >
                            <span>${l.flag}</span>
                            <span>${l.name}</span>
                          </button>
                        `
                      )}
                    </div>
                  `
                : ''}
            </div>

            <!-- User Auth Controls -->
            ${this.user
              ? html`
                  <div class="user-pill">
                    <span>👤</span>
                    <span>${this.user.fullName || this.user.email}</span>
                  </div>
                  <button class="btn-logout" @click=${this.handleLogout}>
                    ${i18n.t('nav.logout')}
                  </button>
                `
              : html`
                  <button
                    class="nav-item"
                    style="background:#1e40af; color:#fff; padding: 0.5rem 1rem;"
                    @click=${() => this.navigate('/login')}
                  >
                    ${i18n.t('nav.login')}
                  </button>
                `}

            <!-- Mobile Hamburger Toggle -->
            <button class="hamburger" @click=${() => (this.mobileMenuOpen = true)} aria-label="Open Menu">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <!-- Mobile Overlay & Drawer -->
      <div
        class="mobile-drawer-overlay ${this.mobileMenuOpen ? 'open' : ''}"
        @click=${() => (this.mobileMenuOpen = false)}
      ></div>

      <div class="mobile-drawer ${this.mobileMenuOpen ? 'open' : ''}">
        <div>
          <div class="drawer-header">
            <div class="brand">
              <img src="https://www.duitjom.com/logo.png" alt="DuitJom Logo" />
              <span>DuitJom</span>
            </div>
            <button class="btn-close" @click=${() => (this.mobileMenuOpen = false)}>✕</button>
          </div>

          <div class="drawer-menu">
            <a
              class="drawer-item ${this.currentPath === '/dashboard' ? 'active' : ''}"
              @click=${() => this.navigate('/dashboard')}
            >
              ${i18n.t('nav.home')}
            </a>
            <a
              class="drawer-item ${this.currentPath === '/mohon-pinjaman' ? 'active' : ''}"
              @click=${() => this.navigate('/mohon-pinjaman')}
            >
              ${i18n.t('nav.apply')}
            </a>
            <a
              class="drawer-item ${this.currentPath === '/buat-bayaran' ? 'active' : ''}"
              @click=${() => this.navigate('/buat-bayaran')}
            >
              ${i18n.t('nav.pay')}
            </a>
            <a
              class="drawer-item ${this.currentPath === '/rekod-permohonan' ? 'active' : ''}"
              @click=${() => this.navigate('/rekod-permohonan')}
            >
              ${i18n.t('nav.records')}
            </a>
            <a
              class="drawer-item ${this.currentPath === '/bantuan' ? 'active' : ''}"
              @click=${() => this.navigate('/bantuan')}
            >
              ${i18n.t('nav.help')}
            </a>
          </div>
        </div>

        <div>
          ${this.user
            ? html`
                <div style="padding: 1rem 0; border-top: 1px solid #e2e8f0; margin-bottom: 1rem;">
                  <div style="font-size:0.875rem; color:#64748b;">${i18n.t('nav.account')}</div>
                  <div style="font-weight:700; color:#0f172a;">${this.user.fullName || this.user.email}</div>
                </div>
                <button class="btn-logout" style="width:100%;" @click=${this.handleLogout}>
                  ${i18n.t('nav.logout')}
                </button>
              `
            : html`
                <button
                  class="btn-logout"
                  style="width:100%; background:#1e40af; color:#fff; border-color:#1e40af;"
                  @click=${() => this.navigate('/login')}
                >
                  ${i18n.t('nav.login')}
                </button>
              `}
        </div>
      </div>

      <!-- Welcome Popup Placeholder -->
      <welcome-popup></welcome-popup>

      <!-- View Router Outlet -->
      <main class="view-container">
        <router-outlet></router-outlet>
      </main>
    `;
  }

  firstUpdated() {
    const outlet = this.shadowRoot?.querySelector('router-outlet');
    if (outlet) {
      const router = new Router(outlet);
      router.setRoutes(routes);
    }
  }
}
