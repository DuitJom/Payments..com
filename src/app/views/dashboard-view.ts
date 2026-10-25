import { html, css, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { Router } from '@vaadin/router';
import { auth, User } from '../services/auth.js';
import { loanService, LoanRecord } from '../services/loan.js';
import { i18n } from '../services/i18n.js';
import '../components/feature-carousel.js';

@customElement('app-dashboard-view')
export default class DashboardView extends LitElement {
  static styles = css`
    :host {
      display: block;
      max-width: 1280px;
      margin: 0 auto;
      padding: 1.5rem 1.25rem 3rem;
    }

    .welcome-header {
      margin-bottom: 2rem;
    }

    .welcome-title {
      font-size: 1.75rem;
      font-weight: 800;
      color: #0f172a;
      margin: 0 0 0.5rem;
    }

    .welcome-sub {
      font-size: 1rem;
      color: #64748b;
      margin: 0;
    }

    /* Action Cards Grid */
    .action-cards {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
      margin-bottom: 2.5rem;
    }

    .action-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 1.25rem;
      padding: 2rem 1.75rem;
      box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.05);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: all 0.25s ease;
      position: relative;
      overflow: hidden;
    }

    .action-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 20px -4px rgba(15, 23, 42, 0.1);
      border-color: #cbd5e1;
    }

    .card-a {
      border-top: 4px solid #1e40af;
    }

    .card-b {
      border-top: 4px solid #0284c7;
    }

    .card-icon {
      width: 48px;
      height: 48px;
      border-radius: 0.75rem;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1.25rem;
      font-size: 1.5rem;
    }

    .card-a .card-icon {
      background: #eff6ff;
      color: #1e40af;
    }

    .card-b .card-icon {
      background: #f0f9ff;
      color: #0284c7;
    }

    .card-title {
      font-size: 1.375rem;
      font-weight: 700;
      color: #0f172a;
      margin: 0 0 0.625rem;
    }

    .card-desc {
      font-size: 0.9375rem;
      color: #475569;
      margin: 0 0 1.5rem;
      line-height: 1.5;
    }

    .btn-card {
      width: 100%;
      padding: 0.875rem 1.25rem;
      border-radius: 0.75rem;
      font-size: 1rem;
      font-weight: 600;
      border: none;
      cursor: pointer;
      transition: all 0.2s;
      text-align: center;
    }

    .card-a .btn-card {
      background: #1e40af;
      color: #ffffff;
      box-shadow: 0 4px 12px rgba(30, 64, 175, 0.25);
    }

    .card-a .btn-card:hover {
      background: #1d4ed8;
    }

    .card-b .btn-card {
      background: #0284c7;
      color: #ffffff;
      box-shadow: 0 4px 12px rgba(2, 132, 199, 0.25);
    }

    .card-b .btn-card:hover {
      background: #0369a1;
    }

    /* Section Application Records */
    .records-section {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 1.25rem;
      padding: 2rem 1.75rem;
      box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.05);
      margin-bottom: 2.5rem;
    }

    .records-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .records-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: #0f172a;
      margin: 0;
    }

    .last-updated {
      font-size: 0.8125rem;
      color: #64748b;
    }

    .record-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .record-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 0.875rem;
      padding: 1.25rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .record-info {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
    }

    .record-id {
      font-weight: 700;
      font-size: 1rem;
      color: #0f172a;
    }

    .record-meta {
      font-size: 0.875rem;
      color: #64748b;
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .status-badge {
      display: inline-block;
      padding: 0.375rem 0.875rem;
      border-radius: 9999px;
      font-size: 0.8125rem;
      font-weight: 700;
    }

    .status-received {
      background: #dbeafe;
      color: #1e40af;
    }

    .status-approved {
      background: #d1fae5;
      color: #065f46;
    }

    .status-review {
      background: #fef3c7;
      color: #92400e;
    }

    .status-rejected {
      background: #fee2e2;
      color: #991b1b;
    }

    .btn-detail {
      padding: 0.5rem 1rem;
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 0.5rem;
      font-size: 0.875rem;
      font-weight: 600;
      color: #334155;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-detail:hover {
      background: #f1f5f9;
      border-color: #94a3b8;
    }

    .empty-state {
      text-align: center;
      padding: 3rem 1rem;
      color: #64748b;
    }

    .empty-icon {
      font-size: 2.5rem;
      margin-bottom: 0.75rem;
    }

    @media (max-width: 768px) {
      .action-cards {
        grid-template-columns: 1fr;
      }
    }
  `;

  @state() private user: User | null = null;
  @state() private records: LoanRecord[] = [];
  @state() private loadingRecords: boolean = true;
  @state() private lastUpdatedStr: string = '';
  @state() private selectedRecord: LoanRecord | null = null;

  private pollInterval?: any;

  connectedCallback() {
    super.connectedCallback();
    this.user = auth.getUser();
    this.fetchRecords();

    // Setup periodic polling for realtime update
    this.pollInterval = setInterval(() => {
      this.fetchRecords(true);
    }, 10000);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.pollInterval) clearInterval(this.pollInterval);
  }

  private async fetchRecords(silent: boolean = false) {
    if (!silent) this.loadingRecords = true;
    if (this.user) {
      this.records = await loanService.getUserRecords(this.user.id);
    } else {
      this.records = [];
    }
    this.loadingRecords = false;
    const now = new Date();
    this.lastUpdatedStr = now.toLocaleTimeString('ms-MY', { timeZone: 'Asia/Kuala_Lumpur' });
  }

  private getStatusClass(status: string): string {
    switch (status) {
      case 'Diterima':
        return 'status-received';
      case 'Diluluskan':
        return 'status-approved';
      case 'Dalam Semakan':
      case 'Dokumen Tambahan Diperlukan':
        return 'status-review';
      case 'Tidak Diluluskan':
        return 'status-rejected';
      default:
        return 'status-received';
    }
  }

  render() {
    return html`
      <!-- Welcome Greeting -->
      <div class="welcome-header">
        <h1 class="welcome-title">
          ${this.user ? `Selamat Kembali, ${this.user.fullName || this.user.email}!` : i18n.t('login.title')}
        </h1>
        <p class="welcome-sub">${i18n.t('welcome.desc')}</p>
      </div>

      <!-- Action Cards A & B -->
      <div class="action-cards">
        <!-- CARD A: Mohon Pinjaman -->
        <div class="action-card card-a">
          <div>
            <div class="card-icon">📝</div>
            <h2 class="card-title">${i18n.t('dash.card_a_title')}</h2>
            <p class="card-desc">${i18n.t('dash.card_a_desc')}</p>
          </div>
          <button class="btn-card" @click=${() => Router.go('/mohon-pinjaman')}>
            ${i18n.t('dash.card_a_btn')}
          </button>
        </div>

        <!-- CARD B: Teruskan ke Pembayaran -->
        <div class="action-card card-b">
          <div>
            <div class="card-icon">💳</div>
            <h2 class="card-title">${i18n.t('dash.card_b_title')}</h2>
            <p class="card-desc">${i18n.t('dash.card_b_desc')}</p>
          </div>
          <button class="btn-card" @click=${() => Router.go('/buat-bayaran')}>
            ${i18n.t('dash.card_b_btn')}
          </button>
        </div>
      </div>

      <!-- Realtime Loan Records -->
      <div class="records-section">
        <div class="records-header">
          <h3 class="records-title">${i18n.t('dash.records_title')}</h3>
          <div class="last-updated">
            ${i18n.t('dash.last_updated')} ${this.lastUpdatedStr || '—'}
          </div>
        </div>

        ${this.loadingRecords
          ? html`<div class="empty-state">${i18n.t('dash.loading_records')}</div>`
          : this.records.length === 0
          ? html`
              <div class="empty-state">
                <div class="empty-icon">📁</div>
                <div>${i18n.t('dash.no_records')}</div>
              </div>
            `
          : html`
              <div class="record-list">
                ${this.records.map(
                  (rec) => html`
                    <div class="record-card">
                      <div class="record-info">
                        <div class="record-id">ID: ${rec.id}</div>
                        <div class="record-meta">
                          <span>Pakej: <strong>${rec.package.name}</strong></span>
                          <span>Jumlah: <strong>RM ${rec.package.loanAmount}</strong></span>
                          <span
                            >Tarikh:
                            ${new Date(rec.createdAt).toLocaleDateString('ms-MY', {
                              timeZone: 'Asia/Kuala_Lumpur'
                            })}</span
                          >
                        </div>
                      </div>

                      <div style="display:flex; align-items:center; gap:1rem;">
                        <span class="status-badge ${this.getStatusClass(rec.status)}">
                          ${rec.status}
                        </span>
                        <button
                          class="btn-detail"
                          @click=${() => {
                            alert(
                              `Butiran Permohonan ${rec.id}:\nPakej: ${rec.package.name}\nJumlah Pinjaman: RM${rec.package.loanAmount}\nStatus: ${rec.status}`
                            );
                          }}
                        >
                          ${i18n.t('btn.details')}
                        </button>
                      </div>
                    </div>
                  `
                )}
              </div>
            `}
      </div>

      <!-- Feature Carousel -->
      <feature-carousel></feature-carousel>
    `;
  }
}
