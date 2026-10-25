import { html, css, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { i18n } from '../services/i18n.js';

interface Slide {
  titleKey: string;
  descKey: string;
  iconSvg: string;
  badge: string;
}

@customElement('feature-carousel')
export class FeatureCarousel extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: 100%;
    }

    .carousel-container {
      position: relative;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 1.25rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
      padding: 2rem 1.5rem;
      overflow: hidden;
      touch-action: pan-y;
    }

    .carousel-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.5rem;
    }

    .section-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: #0f172a;
      margin: 0;
    }

    .controls {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .btn-control {
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: #334155;
      transition: all 0.2s;
    }

    .btn-control:hover {
      background: #1e40af;
      color: #ffffff;
      border-color: #1e40af;
    }

    .slide-wrapper {
      display: flex;
      transition: transform 0.4s ease-in-out;
    }

    .slide-card {
      min-width: 100%;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }

    .icon-box {
      width: 56px;
      height: 56px;
      border-radius: 1rem;
      background: #eff6ff;
      color: #1e40af;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 8px rgba(30, 64, 175, 0.12);
    }

    .icon-box svg {
      width: 28px;
      height: 28px;
    }

    .badge {
      display: inline-block;
      padding: 0.25rem 0.625rem;
      background: #dbeafe;
      color: #1e40af;
      font-size: 0.75rem;
      font-weight: 700;
      border-radius: 9999px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .slide-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: #0f172a;
      margin: 0;
    }

    .slide-desc {
      font-size: 0.9375rem;
      color: #475569;
      margin: 0;
      line-height: 1.6;
    }

    /* Dots */
    .dots-container {
      display: flex;
      justify-content: center;
      gap: 0.5rem;
      margin-top: 1.5rem;
    }

    .dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #cbd5e1;
      border: none;
      cursor: pointer;
      transition: all 0.3s ease;
      padding: 0;
    }

    .dot.active {
      width: 28px;
      border-radius: 5px;
      background: #1e40af;
    }

    /* News Banner */
    .news-banner {
      margin-top: 1.5rem;
      background: linear-gradient(135deg, #1e40af, #0284c7);
      color: #ffffff;
      border-radius: 1rem;
      padding: 1.25rem 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      box-shadow: 0 10px 15px -3px rgba(30, 64, 175, 0.2);
    }

    .news-icon {
      font-size: 1.75rem;
      flex-shrink: 0;
    }

    .news-text {
      font-size: 0.875rem;
      line-height: 1.5;
      font-weight: 500;
    }
  `;

  @state() private activeIndex: number = 0;
  @state() private isPaused: boolean = false;

  private timer?: any;
  private touchStartX: number = 0;

  private slides: Slide[] = [
    {
      titleKey: 'feat.loan.title',
      descKey: 'feat.loan.desc',
      badge: 'Pilihan Utut',
      iconSvg: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`
    },
    {
      titleKey: 'feat.payment.title',
      descKey: 'feat.payment.desc',
      badge: 'DuitNow & QR',
      iconSvg: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>`
    },
    {
      titleKey: 'feat.status.title',
      descKey: 'feat.status.desc',
      badge: 'Realtime Tracker',
      iconSvg: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`
    },
    {
      titleKey: 'feat.support.title',
      descKey: 'feat.support.desc',
      badge: 'Sokongan 24/7',
      iconSvg: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>`
    }
  ];

  connectedCallback() {
    super.connectedCallback();
    this.startAutoplay();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.stopAutoplay();
  }

  private startAutoplay() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    this.timer = setInterval(() => {
      if (!this.isPaused) {
        this.nextSlide();
      }
    }, 5000);
  }

  private stopAutoplay() {
    if (this.timer) clearInterval(this.timer);
  }

  private nextSlide() {
    this.activeIndex = (this.activeIndex + 1) % this.slides.length;
  }

  private prevSlide() {
    this.activeIndex = (this.activeIndex - 1 + this.slides.length) % this.slides.length;
  }

  private handleTouchStart(e: TouchEvent) {
    this.touchStartX = e.touches[0].clientX;
  }

  private handleTouchEnd(e: TouchEvent) {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = this.touchStartX - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) this.nextSlide();
      else this.prevSlide();
    }
  }

  render() {
    return html`
      <div
        class="carousel-container"
        @mouseenter=${() => (this.isPaused = true)}
        @mouseleave=${() => (this.isPaused = false)}
        @touchstart=${this.handleTouchStart}
        @touchend=${this.handleTouchEnd}
      >
        <div class="carousel-header">
          <h3 class="section-title">${i18n.t('feat.title')}</h3>
          <div class="controls">
            <button class="btn-control" @click=${this.prevSlide} aria-label="Previous Slide">‹</button>
            <button class="btn-control" @click=${this.nextSlide} aria-label="Next Slide">›</button>
          </div>
        </div>

        <div class="slide-wrapper" style="transform: translateX(-${this.activeIndex * 100}%);">
          ${this.slides.map(
            (s) => html`
              <div class="slide-card">
                <div style="display:flex; align-items:center; gap:0.75rem;">
                  <div class="icon-box" .innerHTML=${s.iconSvg}></div>
                  <span class="badge">${s.badge}</span>
                </div>
                <h4 class="slide-title">${i18n.t(s.titleKey)}</h4>
                <p class="slide-desc">${i18n.t(s.descKey)}</p>
              </div>
            `
          )}
        </div>

        <!-- Pagination Dots -->
        <div class="dots-container">
          ${this.slides.map(
            (_, idx) => html`
              <button
                class="dot ${idx === this.activeIndex ? 'active' : ''}"
                @click=${() => (this.activeIndex = idx)}
                aria-label="Go to slide ${idx + 1}"
              ></button>
            `
          )}
        </div>
      </div>

      <!-- Preserved News Banner -->
      <div class="news-banner">
        <span class="news-icon">📢</span>
        <div class="news-text">
          <strong>Pengumuman DuitJom:</strong> Permohonan pinjaman micro terkini kini menyokong kelulusan segera
          melalui DuitNow. Sila pastikan dokumen MyKad anda jelas semasa muat naik.
        </div>
      </div>
    `;
  }
}
