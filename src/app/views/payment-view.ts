import { html, css, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { Router } from '@vaadin/router';
import { auth } from '../services/auth.js';
import {
  formatMYR,
  PaymentForm,
  PaymentTransaction,
  paymentService
} from '../services/payment.js';
import {
  formatMyKadInput,
  validateMyKad,
  normalizeMalaysianPhone
} from '../services/loan.js';

@customElement('app-payment-view')
export default class PaymentView extends LitElement {
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
      margin: 0 0 0.5rem;
    }

    .desc {
      font-size: 0.9375rem;
      color: #64748b;
      margin: 0 0 2rem;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.25rem;
      margin-bottom: 1.5rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
    }

    .form-group.full {
      grid-column: span 2;
    }

    .label {
      font-size: 0.875rem;
      font-weight: 600;
      color: #334155;
    }

    .input,
    .select {
      width: 100%;
      box-sizing: border-box;
      padding: 0.75rem 1rem;
      border: 1px solid #cbd5e1;
      border-radius: 0.625rem;
      font-size: 0.9375rem;
      color: #0f172a;
      background: #ffffff;
    }

    .input:focus,
    .select:focus {
      outline: none;
      border-color: #2563eb;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
    }

    .phone-group,
    .amount-group {
      display: flex;
      border: 1px solid #cbd5e1;
      border-radius: 0.625rem;
      overflow: hidden;
    }

    .prefix-box {
      background: #f1f5f9;
      padding: 0.75rem 1rem;
      font-weight: 700;
      color: #334155;
      border-right: 1px solid #cbd5e1;
      display: flex;
      align-items: center;
    }

    .phone-group .input,
    .amount-group .input {
      border: none;
      border-radius: 0;
    }

    .error-box {
      background: #fef2f2;
      border: 1px solid #fca5a5;
      color: #dc2626;
      padding: 0.75rem 1rem;
      border-radius: 0.625rem;
      font-size: 0.875rem;
      margin-bottom: 1.25rem;
    }

    /* Step 2: Payment Methods & QR */
    .qr-box {
      text-align: center;
      padding: 1.5rem;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 1rem;
      margin-bottom: 1.5rem;
    }

    .qr-img {
      width: 220px;
      height: 220px;
      margin: 0 auto 1rem;
      object-fit: contain;
      border: 1px solid #cbd5e1;
      border-radius: 0.75rem;
      padding: 0.5rem;
      background: #ffffff;
    }

    .timer-box {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: #fef3c7;
      border: 1px solid #fde68a;
      color: #92400e;
      border-radius: 9999px;
      font-weight: 700;
      font-size: 0.875rem;
      margin-bottom: 1.5rem;
    }

    .upload-area {
      border: 2px dashed #cbd5e1;
      border-radius: 1rem;
      padding: 1.5rem;
      text-align: center;
      background: #ffffff;
      cursor: pointer;
      margin-bottom: 1.5rem;
    }

    .btn-actions {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      margin-top: 2rem;
      padding-top: 1.5rem;
      border-top: 1px solid #e2e8f0;
    }

    .btn-back {
      padding: 0.875rem 1.75rem;
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 0.75rem;
      font-weight: 600;
      color: #334155;
      cursor: pointer;
    }

    .btn-submit {
      padding: 0.875rem 2rem;
      background: #0284c7;
      border: none;
      border-radius: 0.75rem;
      font-weight: 700;
      color: #ffffff;
      cursor: pointer;
    }

    @media (max-width: 640px) {
      .form-grid {
        grid-template-columns: 1fr;
      }
      .form-group.full {
        grid-column: span 1;
      }
    }
  `;

  @state() private step: 'form' | 'qr' | 'success' = 'form';
  @state() private form: PaymentForm = {
    fullName: '',
    icNumber: '',
    loanId: '',
    phoneNumber: '',
    email: '',
    amount: 0
  };
  @state() private rawAmount: string = '';
  @state() private errorMessage: string = '';
  @state() private timerSeconds: number = 900; // 15 minutes
  @state() private receiptUrl?: string;
  @state() private submitting: boolean = false;
  @state() private completedTransaction?: PaymentTransaction;

  private timerInterval?: any;

  connectedCallback() {
    super.connectedCallback();
    const user = auth.getUser();
    if (user) {
      this.form.fullName = user.fullName || '';
      this.form.email = user.email || '';
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.timerInterval) clearInterval(this.timerInterval);
  }

  private startTimer() {
    this.timerSeconds = 900;
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      if (this.timerSeconds > 0) {
        this.timerSeconds--;
      } else {
        clearInterval(this.timerInterval);
      }
    }, 1000);
  }

  private formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  private handleProceedForm() {
    this.errorMessage = '';
    if (!this.form.fullName || !this.form.icNumber || !this.form.loanId || !this.form.phoneNumber || !this.form.email) {
      this.errorMessage = 'Sila lengkapkan semua medan wajib.';
      return;
    }

    const icVal = validateMyKad(this.form.icNumber);
    if (!icVal.valid) {
      this.errorMessage = icVal.message || 'Nombor MyKad tidak sah.';
      return;
    }

    const phoneNorm = normalizeMalaysianPhone(this.form.phoneNumber);
    if (!phoneNorm.valid) {
      this.errorMessage = phoneNorm.message || 'Nombor telefon tidak sah.';
      return;
    }
    this.form.phoneNumber = phoneNorm.digitsAfter60;

    const parsedAmt = parseFloat(this.rawAmount);
    if (isNaN(parsedAmt) || parsedAmt <= 0) {
      this.errorMessage = 'Jumlah bayaran mesti melebihi RM0.00.';
      return;
    }
    this.form.amount = parsedAmt;

    this.step = 'qr';
    this.startTimer();
  }

  private handleReceiptUpload(e: Event) {
    const input = e.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.receiptUrl = URL.createObjectURL(input.files[0]);
      this.requestUpdate();
    }
  }

  private async handleConfirmPayment() {
    if (!this.receiptUrl) {
      this.errorMessage = 'Sila muat naik resit pembayaran sebelum meneruskan.';
      return;
    }

    this.submitting = true;
    try {
      const tx = await paymentService.submitPayment(this.form);
      tx.receiptUrl = this.receiptUrl;
      this.completedTransaction = tx;
      this.step = 'success';
    } catch {
      this.errorMessage = 'Gagal memproses pengesahan bayaran.';
    } finally {
      this.submitting = false;
    }
  }

  renderForm() {
    return html`
      <h1 class="title">Maklumat Pembayaran</h1>
      <p class="desc">Lengkapkan maklumat anda untuk meneruskan pembayaran.</p>

      ${this.errorMessage ? html`<div class="error-box">${this.errorMessage}</div>` : ''}

      <div class="form-grid">
        <div class="form-group full">
          <label class="label">Nama Penuh*</label>
          <input
            type="text"
            class="input"
            placeholder="Masukkan nama penuh anda"
            .value=${this.form.fullName}
            @input=${(e: Event) => (this.form.fullName = (e.target as HTMLInputElement).value)}
          />
        </div>

        <div class="form-group">
          <label class="label">Nombor IC*</label>
          <input
            type="text"
            class="input"
            placeholder="000000-00-0000"
            .value=${this.form.icNumber}
            @input=${(e: Event) => {
              this.form.icNumber = formatMyKadInput((e.target as HTMLInputElement).value);
              this.requestUpdate();
            }}
          />
        </div>

        <div class="form-group">
          <label class="label">No. ID Loan / CUST ID*</label>
          <input
            type="text"
            class="input"
            placeholder="Contoh: DJ-102938"
            .value=${this.form.loanId}
            @input=${(e: Event) => (this.form.loanId = (e.target as HTMLInputElement).value)}
          />
        </div>

        <div class="form-group">
          <label class="label">Nombor Telefon*</label>
          <div class="phone-group">
            <div class="prefix-box">+60</div>
            <input
              type="tel"
              class="input"
              placeholder="123456789"
              .value=${this.form.phoneNumber}
              @input=${(e: Event) => {
                const norm = normalizeMalaysianPhone((e.target as HTMLInputElement).value);
                this.form.phoneNumber = norm.digitsAfter60;
                this.requestUpdate();
              }}
            />
          </div>
        </div>

        <div class="form-group">
          <label class="label">E-mel*</label>
          <input
            type="email"
            class="input"
            placeholder="nama@email.com"
            .value=${this.form.email}
            @input=${(e: Event) => (this.form.email = (e.target as HTMLInputElement).value)}
          />
        </div>

        <div class="form-group full">
          <label class="label">Jumlah Bayaran*</label>
          <div class="amount-group">
            <div class="prefix-box">RM</div>
            <input
              type="number"
              step="0.01"
              min="0.01"
              class="input"
              placeholder="0.00"
              .value=${this.rawAmount}
              @input=${(e: Event) => (this.rawAmount = (e.target as HTMLInputElement).value)}
            />
          </div>
        </div>
      </div>

      <div class="btn-actions">
        <button class="btn-back" @click=${() => Router.go('/dashboard')}>Kembali</button>
        <button class="btn-submit" @click=${this.handleProceedForm}>Teruskan</button>
      </div>
    `;
  }

  renderQR() {
    return html`
      <h1 class="title">Imbas QR & Buat Bayaran</h1>
      <p class="desc">Sila imbas QR DuitNow di bawah atau gunakan maklumat perbankan untuk membuat bayaran.</p>

      ${this.errorMessage ? html`<div class="error-box">${this.errorMessage}</div>` : ''}

      <div style="text-align:center;">
        <div class="timer-box">⏱️ Masa Berbaki: ${this.formatTime(this.timerSeconds)}</div>
      </div>

      <div class="qr-box">
        <img
          class="qr-img"
          src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=DuitJom%20Payment"
          alt="DuitNow QR Code"
        />
        <div style="font-weight:700; color:#0f172a;">Akaun Penerima: DuitJom Enterprise</div>
        <div style="font-size:1.25rem; font-weight:800; color:#0284c7; margin-top:0.5rem;">
          ${formatMYR(this.form.amount)}
        </div>
      </div>

      <!-- Receipt Upload Area -->
      <div class="upload-area">
        <div style="font-size:1.5rem; margin-bottom:0.5rem;">📄</div>
        <div style="font-weight:700; color:#0f172a; margin-bottom:0.25rem;">Muat Naik Resit Pembayaran*</div>
        <div style="font-size:0.875rem; color:#64748b; margin-bottom:1rem;">
          Sila ambil gambar resit atau simpan PDF pembayaran anda sebagai bukti.
        </div>
        ${this.receiptUrl
          ? html`
              <img src=${this.receiptUrl} style="max-height:150px; border-radius:0.5rem; border:1px solid #cbd5e1;" />
              <div style="margin-top:0.5rem; font-weight:600; color:#059669;">Resit telah dimuat naik ✓</div>
            `
          : html`
              <input
                type="file"
                accept="image/*,application/pdf"
                style="display:none;"
                id="receiptInput"
                @change=${this.handleReceiptUpload}
              />
              <button
                class="btn-back"
                style="border-color:#0284c7; color:#0284c7;"
                @click=${() => this.shadowRoot?.getElementById('receiptInput')?.click()}
              >
                Pilih Fail Resit
              </button>
            `}
      </div>

      <div class="btn-actions">
        <button class="btn-back" @click=${() => (this.step = 'form')}>Kembali</button>
        <button class="btn-submit" ?disabled=${this.submitting} @click=${this.handleConfirmPayment}>
          ${this.submitting ? 'Mengesahkan...' : 'Sahkan Pembayaran'}
        </button>
      </div>
    `;
  }

  renderSuccess() {
    return html`
      <div style="text-align:center; padding: 2rem 1rem;">
        <div
          style="width:64px; height:64px; border-radius:50%; background:#d1fae5; color:#059669; display:flex; align-items:center; justify-content:center; font-size:2rem; margin: 0 auto 1.5rem;"
        >
          ✓
        </div>
        <h2 class="title">Resit Bayaran Berjaya Dihantar</h2>
        <p class="desc">
          Terima kasih. Resit anda sedang disemak oleh pihak pengurusan DuitJom. Rekod bayaran anda akan dikemas
          kini setelah disahkan.
        </p>

        <button class="btn-submit" @click=${() => Router.go('/dashboard')}>Kembali ke Utama</button>
      </div>
    `;
  }

  render() {
    return html`
      <div class="card">
        ${this.step === 'form' ? this.renderForm() : this.step === 'qr' ? this.renderQR() : this.renderSuccess()}
      </div>
    `;
  }
}
