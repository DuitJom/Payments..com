import { html, css, LitElement, unsafeCSS } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { Router, VaadinRouterLocationChangedEvent } from '@vaadin/router';
import { routes } from './app-routing.js';
import { defineComponents, IgcIconButtonComponent, IgcIconComponent, IgcNavbarComponent, IgcNavDrawerComponent } from 'igniteui-webcomponents';
import baseStyles from '/src/app/base-view-styles.css?inline';

defineComponents(IgcNavbarComponent, IgcIconButtonComponent, IgcIconComponent, IgcNavDrawerComponent);

@customElement('app-root')
export default class App extends LitElement {
  static styles = css`
    :host {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: stretch;
      align-content: flex-start;
    }
    .navbar {
      height: max-content;
      min-width: min-content;
    }
    .view-container {
      overflow: auto;
      display: block;
      position: relative;
      min-width: 0;
      min-height: 0;
      flex-grow: 1;
      flex-basis: 0;
    }
    .nav-drawer {
      --menu-full-width: 320px;
      min-width: min-content;
      min-height: 0;
      max-width: 320px;
      flex-shrink: 0;
    }
    .row-layout {
      display: flex;
    }
    .group {
      justify-content: flex-start;
      align-items: center;
      align-content: flex-start;
      gap: 1rem;
      overflow: hidden;
    }
    .group_1 {
      justify-content: flex-start;
      align-items: stretch;
      align-content: flex-start;
      position: relative;
      min-width: 50px;
      min-height: 50px;
      flex-grow: 1;
      flex-basis: 0;
    }
    .group_2 {
      background-color: var(--ig-primary-800);
      border-color: var(--ig-primary-200);
      border-style: solid;
      position: relative;
      min-width: 50px;
      min-height: 50px;
    }
    .h6 {
      margin: 0;
      flex-shrink: 0;
    }
    .icon {
      --size: 24px;
      font-size: 24px;
      width: 24px;
      height: 24px;
    }
  `;

  @state()
  private currentPath: string = '/view-1';

  connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener('vaadin-router-location-changed', this.onLocationChange);
  }
  disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener('vaadin-router-location-changed', this.onLocationChange);
  }
  public isActive(path: string): boolean {
    if (!this.currentPath) return false;
    return this.currentPath === path;
  }
  private onLocationChange = (event: VaadinRouterLocationChangedEvent) => {
    const pathname = event.detail?.location?.pathname ?? '';
    this.currentPath = pathname;
  }

  render() {
    return html`
      <link href='https://fonts.googleapis.com/icon?family=Material+Icons' rel='stylesheet'>
      <style>${unsafeCSS(baseStyles)}</style>
      <igc-navbar class="navbar">
        <div class="row-layout group">
          <h6 class="h6">
            App Name
          </h6>
        </div>
        <igc-icon-button variant="flat" slot="end">
          <span class="material-icons">
            search
          </span>
        </igc-icon-button>
        <igc-icon-button variant="flat" slot="end">
          <span class="material-icons">
            favorite
          </span>
        </igc-icon-button>
        <igc-icon-button variant="flat" slot="end">
          <span class="material-icons">
            more_vert
          </span>
        </igc-icon-button>
      </igc-navbar>
      <div class="row-layout group_1">
        <router-outlet class="view-container"></router-outlet>
        <igc-nav-drawer position="relative" class="nav-drawer">
          <div slot="mini">
            <igc-nav-drawer-item ?active=${this.isActive('/view-1')} @click=${() => Router.go(`/view-1`)}>
              <span slot="icon">
                <span class="material-icons icon">
                  account_circle
                </span>
              </span>
            </igc-nav-drawer-item>
            <igc-nav-drawer-item ?active=${this.isActive('/view-2')} @click=${() => Router.go(`/view-2`)}>
              <span slot="icon">
                <span class="material-icons icon">
                  assignment_turned_in
                </span>
              </span>
            </igc-nav-drawer-item>
            <igc-nav-drawer-item ?active=${this.isActive('/view-3')} @click=${() => Router.go(`/view-3`)}>
              <span slot="icon">
                <span class="material-icons icon">
                  assessment
                </span>
              </span>
            </igc-nav-drawer-item>
            <igc-nav-drawer-item ?active=${this.isActive('/view-3')} @click=${() => Router.go(`/view-3`)}>
              <span slot="icon">
                <span class="material-icons icon">
                  assessment
                </span>
              </span>
            </igc-nav-drawer-item>
            <igc-nav-drawer-item ?active=${this.isActive('/view-3')} @click=${() => Router.go(`/view-3`)}>
              <span slot="icon">
                <span class="material-icons icon">
                  assessment
                </span>
              </span>
            </igc-nav-drawer-item>
          </div>
          <igc-nav-drawer-item>
            <span slot="icon">
              <span class="material-icons icon">
                account_circle
              </span>
            </span>
            <div slot="content">Title goes here</div>
          </igc-nav-drawer-item>
        </igc-nav-drawer>
      </div>
      <div class="group_2"></div>
    `;
  }

  firstUpdated() {
    const outlet = this.shadowRoot?.querySelector('router-outlet');
    const router = new Router(outlet);
    router.setRoutes(routes);
  }
}
