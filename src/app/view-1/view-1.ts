import { html, css, LitElement, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';
import baseStyles from '/src/app/base-view-styles.css?inline';

@customElement('app-view-1')
export default class View1 extends LitElement {
  static styles = css`
    :host {
      height: 100%;
      display: flex;
      justify-content: flex-start;
      align-items: stretch;
      align-content: flex-start;
    }
    .column-layout {
      display: flex;
      flex-direction: column;
    }
    .group {
      background-color: var(--ig-gray-100);
      justify-content: flex-start;
      align-items: stretch;
      align-content: flex-start;
      padding: 32px;
      width: 20%;
      min-width: 50px;
      min-height: 50px;
      max-width: 20%;
    }
    .group_1 {
      justify-content: flex-start;
      align-items: stretch;
      align-content: flex-start;
      padding: 32px;
      min-width: 50px;
      min-height: 50px;
      flex-grow: 1;
      flex-basis: 0;
    }
    .content {
      margin: 0 0 16px;
      height: max-content;
      min-width: min-content;
    }
    .text_1 {
      height: max-content;
      min-width: min-content;
    }
  `;

  render() {
    return html`
      <style>${unsafeCSS(baseStyles)}</style>
      <div class="column-layout group">
        <p class="typography__subtitle-2 content">
          FIXED PANE 1
        </p>
        <p class="typography__body-2 text_1">
          Ut finibus risus eros, et bibendum ante eleifend ac. Sed justo felis, ultrices vel velit quis, sodales consectetur tellus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vivamus sed consectetur mi.
        </p>
      </div>
      <div class="column-layout group_1">
        <h5 class="content">
          View 1
        </h5>
        <p class="typography__body-1 text_1">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>
      </div>
    `;
  }
}
