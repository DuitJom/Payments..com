import { html, css, LitElement, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';
import baseStyles from '/src/app/base-view-styles.css?inline';

@customElement('app-view-2')
export default class View2 extends LitElement {
  static styles = css`
    :host {
      height: 100%;
      display: flex;
      justify-content: flex-start;
      align-items: stretch;
      align-content: flex-start;
    }
  `;

  render() {
    return html`
      <style>${unsafeCSS(baseStyles)}</style>
    `;
  }
}
