import { html, css, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { Router } from '@vaadin/router';
import { auth } from '../services/auth.js';
import {
  LOAN_PACKAGES,
  LoanPackage,
  loanService,
  LoanApplicationDraft,
  formatMyKadInput,
  validateMyKad,
  normalizeMalaysianPhone,
  LoanRecord
} from '../services/loan.js';
import { BANK_OPTIONS } from '../services/payment.js';
import { i18n } from '../services/i18n.js';

@customElement('app-apply-loan-view')
export default class ApplyLoanView extends LitElement {
  static styles = css`
    :host {
      display: block;
      max-width: 960px;
      margin: 0 auto;
      padding: 2rem 1.25rem 4rem;
    }

    /* Stepper Header */
    .stepper {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2.5rem;
      position: relative;
    }

    .step-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      z-index: 1;
      cursor: pointer;
    }

    .step-num {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: #f1f5f9;
      color: #64748b;
      border: 2px solid #cbd5e1;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.875rem;
      transition: all 0.2s;
    }

    .step-item.active .step-num {
      background: #1e40af;
      color: #ffffff;
      border-color: #1e40af;
    }

    .step-item.completed .step-num {
      background: #059669;
      color: #ffffff;
      border-color: #059669;
    }

    .step-label {
      font-size: 0.75rem;
      font-weight: 600;
      color: #64748b;
      text-align: center;
    }

    .step-item.active .step-label {
      color: #1e40af;
      font-weight: 700;
    }

    /* Form Container */
    .form-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 1.25rem;
      padding: 2.25rem 2rem;
      box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.05);
    }

    .section-title {
      font-size: 1.5rem;
      font-weight: 800;
      color: #0f172a;
      margin: 0 0 0.5rem;
    }

    .section-desc {
      font-size: 0.9375rem;
      color: #64748b;
      margin: 0 0 2rem;
    }

    /* Selected Package Recap Card */
    .recap-card {
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      border-radius: 1rem;
      padding: 1.25rem 1.5rem;
      margin-bottom: 2rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .recap-info {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .recap-title {
      font-weight: 700;
      color: #1e40af;
      font-size: 1rem;
    }

    .recap-details {
      font-size: 0.875rem;
      color: #334155;
      display: flex;
      gap: 1.25rem;
      flex-wrap: wrap;
    }

    .btn-change-pkg {
      padding: 0.5rem 1rem;
      background: #ffffff;
      border: 1px solid #93c5fd;
      border-radius: 0.5rem;
      color: #1e40af;
      font-weight: 700;
      font-size: 0.875rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.375rem;
    }

    .btn-change-pkg:hover {
      background: #dbeafe;
    }

    /* Packages Grid */
    .packages-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.25rem;
      margin-bottom: 2rem;
    }

    .pkg-card {
      border: 2px solid #e2e8f0;
      border-radius: 1rem;
      padding: 1.5rem 1.25rem;
      background: #ffffff;
      cursor: pointer;
      transition: all 0.2s;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .pkg-card:hover {
      border-color: #93c5fd;
      transform: translateY(-2px);
    }

    .pkg-card.selected {
      border-color: #1e40af;
      background: #f0f6ff;
      box-shadow: 0 4px 12px rgba(30, 64, 175, 0.15);
    }

    .pkg-selected-badge {
      position: absolute;
      top: 0.75rem;
      right: 0.75rem;
      background: #1e40af;
      color: #ffffff;
      padding: 0.2rem 0.5rem;
      border-radius: 9999px;
      font-size: 0.7rem;
      font-weight: 700;
    }

    .pkg-header {
      margin-bottom: 1rem;
    }

    .pkg-wallet-icon {
      font-size: 1.75rem;
      margin-bottom: 0.5rem;
    }

    .pkg-name-small {
      font-size: 0.8125rem;
      font-weight: 700;
      color: #64748b;
      text-transform: uppercase;
    }

    .pkg-amount-large {
      font-size: 1.75rem;
      font-weight: 800;
      color: #1e40af;
      margin: 0.25rem 0;
    }

    .pkg-label-tag {
      font-size: 0.75rem;
      font-weight: 600;
      color: #475569;
    }

    .pkg-features {
      list-style: none;
      padding: 0;
      margin: 1rem 0 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.625rem;
      font-size: 0.875rem;
      color: #334155;
    }

    .pkg-feature-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .btn-pkg {
      width: 100%;
      padding: 0.75rem;
      border-radius: 0.625rem;
      font-weight: 700;
      font-size: 0.875rem;
      border: none;
      cursor: pointer;
      background: #1e40af;
      color: #ffffff;
    }

    /* Form Layout */
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

    .helper-text {
      font-size: 0.8125rem;
      color: #64748b;
    }

    .phone-input-group {
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

    .phone-input-group .input {
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

    /* Media Upload Cards */
    .media-card {
      border: 1px dashed #cbd5e1;
      border-radius: 0.875rem;
      padding: 1.25rem;
      background: #f8fafc;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      align-items: flex-start;
    }

    .media-title {
      font-weight: 700;
      color: #0f172a;
      font-size: 1rem;
    }

    .media-instructions {
      font-size: 0.875rem;
      color: #64748b;
      line-line: 1.4;
    }

    .btn-action {
      padding: 0.625rem 1.25rem;
      background: #1e40af;
      color: #ffffff;
      border: none;
      border-radius: 0.5rem;
      font-weight: 600;
      font-size: 0.875rem;
      cursor: pointer;
    }

    .btn-secondary {
      padding: 0.5rem 1rem;
      background: #ffffff;
      border: 1px solid #cbd5e1;
      color: #334155;
      border-radius: 0.5rem;
      font-weight: 600;
      font-size: 0.875rem;
      cursor: pointer;
    }

    .preview-box {
      width: 100%;
      max-height: 200px;
      object-fit: cover;
      border-radius: 0.5rem;
      border: 1px solid #e2e8f0;
    }

    .checkbox-group {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      margin: 1.5rem 0;
      font-size: 0.875rem;
      color: #334155;
      line-height: 1.5;
    }

    .checkbox-group input {
      margin-top: 0.25rem;
      width: 18px;
      height: 18px;
      accent-color: #1e40af;
    }

    /* Step 6 Success Card */
    .success-card {
      text-align: center;
      padding: 2rem 1rem;
    }

    .success-icon {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: #d1fae5;
      color: #059669;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      margin: 0 auto 1.5rem;
    }

    .success-title {
      font-size: 1.5rem;
      font-weight: 800;
      color: #0f172a;
      margin: 0 0 0.75rem;
    }

    .success-msg {
      font-size: 1rem;
      color: #475569;
      max-width: 500px;
      margin: 0 auto 2rem;
      line-height: 1.6;
    }

    .details-box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 1rem;
      padding: 1.25rem 1.5rem;
      max-width: 480px;
      margin: 0 auto 2rem;
      text-align: left;
      display: flex;
      flex-direction: column;
      gap: 0.625rem;
      font-size: 0.9375rem;
    }

    .details-row {
      display: flex;
      justify-content: space-between;
      color: #334155;
    }

    .details-row strong {
      color: #0f172a;
    }

    /* Actions Footer */
    .form-actions {
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

    .btn-next {
      padding: 0.875rem 2rem;
      background: #1e40af;
      border: none;
      border-radius: 0.75rem;
      font-weight: 700;
      color: #ffffff;
      cursor: pointer;
    }

    @media (max-width: 768px) {
      .packages-grid {
        grid-template-columns: 1fr;
      }
      .form-grid {
        grid-template-columns: 1fr;
      }
      .form-group.full {
        grid-column: span 1;
      }
    }
  `;

  @state() private currentStep: number = 1;
  @state() private draft: LoanApplicationDraft = {};
  @state() private errorMessage: string = '';
  @state() private submitting: boolean = false;
  @state() private submittedRecord: LoanRecord | null = null;

  connectedCallback() {
    super.connectedCallback();
    this.draft = loanService.getDraft();
    if (!this.draft.packageId) {
      this.draft.packageId = LOAN_PACKAGES[0].id;
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  private handleSelectPackage(pkgId: string) {
    this.draft.packageId = pkgId;
    loanService.updateDraft({ packageId: pkgId });
    this.currentStep = 2;
  }

  private getSelectedPackage(): LoanPackage {
    return LOAN_PACKAGES.find((p) => p.id === this.draft.packageId) || LOAN_PACKAGES[0];
  }

  private handleNextStep2() {
    this.errorMessage = '';
    if (!this.draft.fullName || !this.draft.gender || !this.draft.race || !this.draft.icNumber || !this.draft.email) {
      this.errorMessage = 'Sila lengkapkan semua medan wajib yang bertanda *.';
      return;
    }

    const icVal = validateMyKad(this.draft.icNumber);
    if (!icVal.valid) {
      this.errorMessage = icVal.message || 'Nombor MyKad tidak sah.';
      return;
    }

    loanService.updateDraft(this.draft);
    this.currentStep = 3;
  }

  private handleNextStep3() {
    this.errorMessage = '';
    if (!this.draft.whatsappNumber) {
      this.errorMessage = 'Sila masukkan nombor WhatsApp yang sah.';
      return;
    }

    const norm = normalizeMalaysianPhone(this.draft.whatsappNumber);
    if (!norm.valid) {
      this.errorMessage = norm.message || 'Nombor WhatsApp tidak sah.';
      return;
    }

    this.draft.whatsappNumber = norm.digitsAfter60;
    loanService.updateDraft(this.draft);
    this.currentStep = 4;
  }

  private handleNextStep4() {
    this.errorMessage = '';
    if (
      !this.draft.bankName ||
      !this.draft.accountNumber ||
      !this.draft.contactRelation ||
      !this.draft.contactName ||
      !this.draft.contactPhone
    ) {
      this.errorMessage = 'Sila lengkapkan maklumat bank dan orang kenalan.';
      return;
    }

    const contactPhoneNorm = normalizeMalaysianPhone(this.draft.contactPhone);
    if (!contactPhoneNorm.valid) {
      this.errorMessage = `Nombor kenalan: ${contactPhoneNorm.message}`;
      return;
    }

    this.draft.contactPhone = contactPhoneNorm.digitsAfter60;
    loanService.updateDraft(this.draft);
    this.currentStep = 5;
  }

  private async handleFileSelect(e: Event, key: 'icFrontUrl' | 'icBackUrl' | 'videoSelfieUrl') {
    const input = e.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      if (file.size > 50 * 1024 * 1024) {
        this.errorMessage = 'Saiz fail melebihi had 50MB.';
        return;
      }
      const url = URL.createObjectURL(file);
      this.draft[key] = url;
      loanService.updateDraft({ [key]: url });
      this.requestUpdate();
    }
  }

  private async handleSubmitApplication() {
    this.errorMessage = '';
    if (!this.draft.icFrontUrl || !this.draft.icBackUrl) {
      this.errorMessage = 'Sila muat naik foto MyKad (Hadapan & Belakang).';
      return;
    }
    if (!this.draft.pdpaConsent) {
      this.errorMessage = 'Sila tandakan persetujuan pemprosesan data.';
      return;
    }

    const user = auth.getUser();
    const userId = user ? user.id : 'usr_guest';

    this.submitting = true;
    try {
      const rec = await loanService.submitApplication(userId);
      this.submittedRecord = rec;
      this.currentStep = 6;
    } catch {
      this.errorMessage = 'Gagal menghantar permohonan. Sila cuba lagi.';
    } finally {
      this.submitting = false;
    }
  }

  renderRecapCard() {
    const pkg = this.getSelectedPackage();
    return html`
      <div class="recap-card">
        <div class="recap-info">
          <div class="recap-title">Pakej Pinjaman Dipilih</div>
          <div class="recap-details">
            <span>Pakej: <strong>${pkg.name}</strong></span>
            <span>Jumlah Pinjaman: <strong>RM${pkg.loanAmount}.00</strong></span>
            <span>Yuran: <strong>RM${pkg.serviceFee}.00</strong></span>
            <span>Anda Akan Terima: <strong>RM${pkg.amountReceived}.00</strong></span>
            <span>Tempoh: <strong>7 hari</strong></span>
          </div>
        </div>
        <button class="btn-change-pkg" @click=${() => (this.currentStep = 1)}>✏️ Tukar</button>
      </div>
    `;
  }

  renderStep1() {
    return html`
      <h2 class="section-title">${i18n.t('pkg.title')}</h2>
      <p class="section-desc">${i18n.t('pkg.desc')}</p>

      <div class="packages-grid">
        ${LOAN_PACKAGES.map((pkg) => {
          const isSelected = this.draft.packageId === pkg.id;
          return html`
            <div
              class="pkg-card ${isSelected ? 'selected' : ''}"
              @click=${() => this.handleSelectPackage(pkg.id)}
            >
              ${isSelected ? html`<span class="pkg-selected-badge">${i18n.t('pkg.selected')} ✓</span>` : ''}

              <div class="pkg-header">
                <div class="pkg-wallet-icon">👛</div>
                <div class="pkg-name-small">${pkg.name}</div>
                <div class="pkg-amount-large">RM${pkg.loanAmount}</div>
                <div class="pkg-label-tag">${i18n.t('pkg.label')}</div>
              </div>

              <ul class="pkg-features">
                <li class="pkg-feature-item">⚡ ${i18n.t('pkg.interest')}</li>
                <li class="pkg-feature-item">⏱️ ${i18n.t('pkg.tenure')}</li>
                <li class="pkg-feature-item">📄 ${i18n.t('pkg.fee')} — RM${pkg.serviceFee}</li>
                <li class="pkg-feature-item" style="font-weight:700; color:#1e40af;">
                  👛 ${i18n.t('pkg.receive')} — RM${pkg.amountReceived}
                </li>
              </ul>

              <button class="btn-pkg">${i18n.t('pkg.select')}</button>
            </div>
          `;
        })}
      </div>
    `;
  }

  renderStep2() {
    return html`
      <h2 class="section-title">Data Peribadi</h2>
      <p class="section-desc">Sila berikan maklumat peribadi anda.</p>

      ${this.errorMessage ? html`<div class="error-box">${this.errorMessage}</div>` : ''}

      <div class="form-grid">
        <div class="form-group full">
          <label class="label">Nama Penuh*</label>
          <input
            type="text"
            class="input"
            placeholder="Masukkan nama penuh anda"
            .value=${this.draft.fullName || ''}
            @input=${(e: Event) => (this.draft.fullName = (e.target as HTMLInputElement).value)}
          />
        </div>

        <div class="form-group">
          <label class="label">Jantina*</label>
          <select
            class="select"
            .value=${this.draft.gender || ''}
            @change=${(e: Event) => (this.draft.gender = (e.target as HTMLSelectElement).value as any)}
          >
            <option value="">Pilih jantina</option>
            <option value="Lelaki">Lelaki</option>
            <option value="Perempuan">Perempuan</option>
          </select>
        </div>

        <div class="form-group">
          <label class="label">Bangsa*</label>
          <select
            class="select"
            .value=${this.draft.race || ''}
            @change=${(e: Event) => (this.draft.race = (e.target as HTMLSelectElement).value)}
          >
            <option value="">Pilih bangsa</option>
            <option value="Melayu">Melayu</option>
            <option value="Cina">Cina</option>
            <option value="India">India</option>
            <option value="Bumiputera Sabah">Bumiputera Sabah</option>
            <option value="Bumiputera Sarawak">Bumiputera Sarawak</option>
            <option value="Lain-lain">Lain-lain</option>
          </select>
        </div>

        <div class="form-group">
          <label class="label">Nombor IC*</label>
          <input
            type="text"
            class="input"
            placeholder="000000-00-0000"
            .value=${this.draft.icNumber || ''}
            @input=${(e: Event) => {
              const val = (e.target as HTMLInputElement).value;
              this.draft.icNumber = formatMyKadInput(val);
              this.requestUpdate();
            }}
          />
          <span class="helper-text">Masukkan nombor MyKad anda (12 digit).</span>
        </div>

        <div class="form-group">
          <label class="label">E-mel*</label>
          <input
            type="email"
            class="input"
            placeholder="Masukkan alamat e-mel anda"
            .value=${this.draft.email || ''}
            @input=${(e: Event) => (this.draft.email = (e.target as HTMLInputElement).value)}
          />
        </div>

        <div class="form-group full">
          <label class="label">Dari mana anda tahu tentang kami?</label>
          <select
            class="select"
            .value=${this.draft.referralSource || ''}
            @change=${(e: Event) => (this.draft.referralSource = (e.target as HTMLSelectElement).value)}
          >
            <option value="">Pilih sumber</option>
            <option value="Google">Google</option>
            <option value="Facebook">Facebook</option>
            <option value="Instagram">Instagram</option>
            <option value="TikTok">TikTok</option>
            <option value="WhatsApp">WhatsApp</option>
            <option value="Rakan / Keluarga">Rakan / Keluarga</option>
            <option value="Lain-lain">Lain-lain</option>
          </select>
        </div>
      </div>

      <div class="form-actions">
        <button class="btn-back" @click=${() => (this.currentStep = 1)}>Kembali</button>
        <button class="btn-next" @click=${this.handleNextStep2}>Seterusnya</button>
      </div>
    `;
  }

  renderStep3() {
    return html`
      <h2 class="section-title">Nombor WhatsApp</h2>
      <p class="section-desc">Sila berikan nombor telefon yang boleh menerima mesej WhatsApp.</p>

      ${this.errorMessage ? html`<div class="error-box">${this.errorMessage}</div>` : ''}

      <div class="form-group full" style="margin-bottom: 1.5rem;">
        <label class="label">Nombor WhatsApp*</label>
        <div class="phone-input-group">
          <div class="prefix-box">+60</div>
          <input
            type="tel"
            class="input"
            placeholder="123456789"
            .value=${this.draft.whatsappNumber || ''}
            @input=${(e: Event) => {
              const val = (e.target as HTMLInputElement).value;
              const norm = normalizeMalaysianPhone(val);
              this.draft.whatsappNumber = norm.digitsAfter60;
              this.requestUpdate();
            }}
          />
        </div>
        <span class="helper-text"
          >Masukkan nombor mudah alih Malaysia yang boleh menerima mesej WhatsApp (9 atau 10 digit).</span
        >
      </div>

      <div class="form-actions">
        <button class="btn-back" @click=${() => (this.currentStep = 2)}>Kembali</button>
        <button class="btn-next" @click=${this.handleNextStep3}>Seterusnya</button>
      </div>
    `;
  }

  renderStep4() {
    const banksOnly = BANK_OPTIONS.filter((b) => !b.isEWallet);
    const eWalletsOnly = BANK_OPTIONS.filter((b) => b.isEWallet);

    return html`
      ${this.renderRecapCard()}

      <h2 class="section-title">Butiran Bank & Orang Kenalan</h2>
      <p class="section-desc">Sila berikan maklumat perbankan dan orang kenalan anda.</p>

      ${this.errorMessage ? html`<div class="error-box">${this.errorMessage}</div>` : ''}

      <div class="form-grid">
        <div class="form-group">
          <label class="label">Nama Bank / E-Wallet*</label>
          <select
            class="select"
            .value=${this.draft.bankName || ''}
            @change=${(e: Event) => (this.draft.bankName = (e.target as HTMLSelectElement).value)}
          >
            <option value="">Pilih bank / e-wallet</option>
            <optgroup label="Bank Perbankan">
              ${banksOnly.map((b) => html`<option value=${b.name}>${b.name}</option>`)}
            </optgroup>
            <optgroup label="E-Wallet">
              ${eWalletsOnly.map((b) => html`<option value=${b.name}>${b.name}</option>`)}
            </optgroup>
          </select>
        </div>

        <div class="form-group">
          <label class="label">Nombor Akaun Bank*</label>
          <input
            type="text"
            class="input"
            placeholder="Masukkan nombor akaun bank anda"
            .value=${this.draft.accountNumber || ''}
            @input=${(e: Event) => (this.draft.accountNumber = (e.target as HTMLInputElement).value)}
          />
          <span class="helper-text">Masukkan nombor akaun simpanan atau semasa anda.</span>
        </div>
      </div>

      <div class="form-grid" style="margin-top:1.5rem;">
        <div class="form-group">
          <label class="label">Hubungan Orang Kenalan*</label>
          <select
            class="select"
            .value=${this.draft.contactRelation || ''}
            @change=${(e: Event) => (this.draft.contactRelation = (e.target as HTMLSelectElement).value)}
          >
            <option value="">Pilih hubungan</option>
            <option value="Pasangan">Pasangan</option>
            <option value="Ibu Bapa">Ibu Bapa</option>
            <option value="Adik-beradik">Adik-beradik</option>
            <option value="Anak">Anak</option>
            <option value="Kawan">Kawan</option>
            <option value="Rakan Sekerja">Rakan Sekerja</option>
            <option value="Saudara">Saudara</option>
          </select>
        </div>

        <div class="form-group">
          <label class="label">Nama Orang Kenalan*</label>
          <input
            type="text"
            class="input"
            placeholder="Masukkan nama orang kenalan anda"
            .value=${this.draft.contactName || ''}
            @input=${(e: Event) => (this.draft.contactName = (e.target as HTMLInputElement).value)}
          />
        </div>

        <div class="form-group full">
          <label class="label">Nombor Telefon Orang Kenalan*</label>
          <div class="phone-input-group">
            <div class="prefix-box">+60</div>
            <input
              type="tel"
              class="input"
              placeholder="123456789"
              .value=${this.draft.contactPhone || ''}
              @input=${(e: Event) => {
                const val = (e.target as HTMLInputElement).value;
                const norm = normalizeMalaysianPhone(val);
                this.draft.contactPhone = norm.digitsAfter60;
                this.requestUpdate();
              }}
            />
          </div>
          <span class="helper-text">Nombor mudah alih orang kenalan anda (9 atau 10 digit).</span>
        </div>
      </div>

      <div class="form-actions">
        <button class="btn-back" @click=${() => (this.currentStep = 3)}>Kembali</button>
        <button class="btn-next" @click=${this.handleNextStep4}>Seterusnya</button>
      </div>
    `;
  }

  renderStep5() {
    return html`
      ${this.renderRecapCard()}

      <h2 class="section-title">Pengesahan Dokumen & Video</h2>

      ${this.errorMessage ? html`<div class="error-box">${this.errorMessage}</div>` : ''}

      <div class="form-grid" style="margin-bottom: 2rem;">
        <!-- IC Hadapan -->
        <div class="media-card">
          <div class="media-title">📷 IC Hadapan*</div>
          <div class="media-instructions">Ambil atau muat naik gambar IC anda dari bahagian hadapan.</div>
          ${this.draft.icFrontUrl
            ? html`
                <img class="preview-box" src=${this.draft.icFrontUrl} alt="IC Front Preview" />
                <button
                  class="btn-secondary"
                  @click=${() => {
                    this.draft.icFrontUrl = undefined;
                    this.requestUpdate();
                  }}
                >
                  Padam / Ambil Semula
                </button>
              `
            : html`
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/heic"
                  style="display:none;"
                  id="fileFront"
                  @change=${(e: Event) => this.handleFileSelect(e, 'icFrontUrl')}
                />
                <button
                  class="btn-action"
                  @click=${() => this.shadowRoot?.getElementById('fileFront')?.click()}
                >
                  Ambil / Muat Naik Foto
                </button>
              `}
        </div>

        <!-- IC Belakang -->
        <div class="media-card">
          <div class="media-title">📷 IC Belakang*</div>
          <div class="media-instructions">Ambil atau muat naik gambar IC anda dari bahagian belakang.</div>
          ${this.draft.icBackUrl
            ? html`
                <img class="preview-box" src=${this.draft.icBackUrl} alt="IC Back Preview" />
                <button
                  class="btn-secondary"
                  @click=${() => {
                    this.draft.icBackUrl = undefined;
                    this.requestUpdate();
                  }}
                >
                  Padam / Ambil Semula
                </button>
              `
            : html`
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/heic"
                  style="display:none;"
                  id="fileBack"
                  @change=${(e: Event) => this.handleFileSelect(e, 'icBackUrl')}
                />
                <button
                  class="btn-action"
                  @click=${() => this.shadowRoot?.getElementById('fileBack')?.click()}
                >
                  Ambil / Muat Naik Foto
                </button>
              `}
        </div>

        <!-- Video Selfie -->
        <div class="media-card full">
          <div class="media-title">📹 Pengesahan Video Selfie</div>
          <div class="media-instructions">
            Rakam video selfie dengan muka penuh anda yang jelas dan pegang IC anda di sebelah muka semasa rakaman
            (Tempoh 3 - 30 saat).
          </div>
          ${this.draft.videoSelfieUrl
            ? html`
                <video class="preview-box" controls src=${this.draft.videoSelfieUrl}></video>
                <button
                  class="btn-secondary"
                  @click=${() => {
                    this.draft.videoSelfieUrl = undefined;
                    this.requestUpdate();
                  }}
                >
                  Rakam Semula
                </button>
              `
            : html`
                <input
                  type="file"
                  accept="video/*"
                  style="display:none;"
                  id="fileVideo"
                  @change=${(e: Event) => this.handleFileSelect(e, 'videoSelfieUrl')}
                />
                <button
                  class="btn-action"
                  @click=${() => this.shadowRoot?.getElementById('fileVideo')?.click()}
                >
                  Pilih / Rakam Video Selfie
                </button>
              `}
        </div>
      </div>

      <!-- PDPA Checkbox -->
      <div class="checkbox-group">
        <input
          type="checkbox"
          id="pdpa"
          .checked=${this.draft.pdpaConsent || false}
          @change=${(e: Event) => {
            this.draft.pdpaConsent = (e.target as HTMLInputElement).checked;
            this.requestUpdate();
          }}
        />
        <label for="pdpa">
          Saya bersetuju dengan pengumpulan dan pemprosesan data peribadi saya untuk permohonan ini mengikut
          <strong>Polisi Privasi</strong> dan <strong>Terma & Syarat</strong> DuitJom.
        </label>
      </div>

      <div style="font-size:0.875rem; color:#64748b; margin-bottom:1rem;">
        Nota: Dengan menekan Seterusnya, permohonan anda akan dihantar secara rasmi untuk pemprosesan.
      </div>

      <div class="form-actions">
        <button class="btn-back" @click=${() => (this.currentStep = 4)}>Kembali</button>
        <button class="btn-next" ?disabled=${this.submitting} @click=${this.handleSubmitApplication}>
          ${this.submitting ? 'Menghantar...' : 'Seterusnya (Hantar)'}
        </button>
      </div>
    `;
  }

  renderStep6() {
    const rec = this.submittedRecord;
    return html`
      <div class="success-card">
        <div class="success-icon">✓</div>
        <h2 class="success-title">Permohonan Anda Telah Diterima</h2>
        <p class="success-msg">
          Terima kasih kerana memilih DuitJom. Permohonan anda telah diterima dan akan diproses. Pihak kami akan
          menghubungi anda kemudian untuk maklumat lanjut.
        </p>

        ${rec
          ? html`
              <div class="details-box">
                <div class="details-row">
                  <span>ID Permohonan:</span>
                  <strong>${rec.id}</strong>
                </div>
                <div class="details-row">
                  <span>Tarikh & Masa:</span>
                  <strong
                    >${new Date(rec.createdAt).toLocaleString('ms-MY', {
                      timeZone: 'Asia/Kuala_Lumpur'
                    })}</strong
                  >
                </div>
                <div class="details-row">
                  <span>Pakej Dipilih:</span>
                  <strong>${rec.package.name}</strong>
                </div>
                <div class="details-row">
                  <span>Status:</span>
                  <strong style="color:#059669;">${rec.status}</strong>
                </div>
              </div>
            `
          : ''}

        <button class="btn-next" @click=${() => Router.go('/dashboard')}>Kembali ke Utama</button>
      </div>
    `;
  }

  render() {
    const steps = [
      'Pilih Pakej',
      'Data Peribadi',
      'Nombor WhatsApp',
      'Bank & Kenalan',
      'Dokumen & Video',
      'Pengesahan'
    ];

    return html`
      <!-- Stepper -->
      <div class="stepper">
        ${steps.map((st, idx) => {
          const stepNum = idx + 1;
          const isActive = this.currentStep === stepNum;
          const isCompleted = this.currentStep > stepNum;
          return html`
            <div class="step-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}">
              <div class="step-num">${isCompleted ? '✓' : stepNum}</div>
              <div class="step-label">${st}</div>
            </div>
          `;
        })}
      </div>

      <div class="form-card">
        ${this.currentStep === 1
          ? this.renderStep1()
          : this.currentStep === 2
          ? this.renderStep2()
          : this.currentStep === 3
          ? this.renderStep3()
          : this.currentStep === 4
          ? this.renderStep4()
          : this.currentStep === 5
          ? this.renderStep5()
          : this.renderStep6()}
      </div>
    `;
  }
}
