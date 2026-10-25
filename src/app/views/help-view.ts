import { html, css, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { i18n } from '../services/i18n.js';

@customElement('app-help-view')
export default class HelpView extends LitElement {
  static styles = css`
    :host {
      display: block;
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem 1.25rem 4rem;
    }

    .card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 1.25rem;
      padding: 2.25rem 2rem;
      box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.05);
    }

    .title {
      font-size: 1.5rem;
      font-weight: 800;
      color: #0f172a;
      margin: 0 0 1.5rem;
    }

    .faq-item {
      border-bottom: 1px solid #e2e8f0;
      padding: 1.25rem 0;
    }

    .faq-q {
      font-weight: 700;
      color: #1e40af;
      font-size: 1.0625rem;
      margin-bottom: 0.5rem;
    }

    .faq-a {
      font-size: 0.9375rem;
      color: #475569;
      line-height: 1.6;
    }

    .btn-contact {
      margin-top: 2rem;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.875rem 1.5rem;
      background: #25d366;
      color: #ffffff;
      border: none;
      border-radius: 0.75rem;
      font-weight: 700;
      font-size: 1rem;
      cursor: pointer;
      text-decoration: none;
    }
  `;

  render() {
    return html`
      <div class="card">
        <h1 class="title">${i18n.t('help.title')}</h1>

        <div class="faq-item">
          <div class="faq-q">Q: ${i18n.t('help.faq1_q')}</div>
          <div class="faq-a">${i18n.t('help.faq1_a')}</div>
        </div>

        <div class="faq-item">
          <div class="faq-q">Q: ${i18n.t('help.faq2_q')}</div>
          <div class="faq-a">${i18n.t('help.faq2_a')}</div>
        </div>

        <a class="btn-contact" href="https://wa.me/60123456789" target="_blank">
          💬 ${i18n.t('help.contact')}
        </a>
      </div>
    `;
  }
}
