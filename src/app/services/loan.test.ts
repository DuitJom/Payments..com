import { describe, it, expect } from 'vitest';
import { validateMyKad, normalizeMalaysianPhone, LOAN_PACKAGES } from './loan';
import { formatMYR } from './payment';

describe('Loan Service Utilities', () => {
  it('validates MyKad numbers correctly', () => {
    const res1 = validateMyKad('950101-14-5533');
    expect(res1.valid).toBe(true);
    expect(res1.formatted).toBe('950101-14-5533');

    const res2 = validateMyKad('950101145533');
    expect(res2.valid).toBe(true);
    expect(res2.formatted).toBe('950101-14-5533');

    const res3 = validateMyKad('12345');
    expect(res3.valid).toBe(false);
  });

  it('normalizes Malaysian phone numbers (+60 prefix preserved)', () => {
    // 9 or 10 digits required
    expect(normalizeMalaysianPhone('+60123456789').valid).toBe(true);
    expect(normalizeMalaysianPhone('60123456789').valid).toBe(true);
    expect(normalizeMalaysianPhone('0123456789').valid).toBe(true);
    expect(normalizeMalaysianPhone('123456789').valid).toBe(true);

    expect(normalizeMalaysianPhone('1234567').valid).toBe(false); // 7 digits -> fail
    expect(normalizeMalaysianPhone('123456789012').valid).toBe(false); // 12 digits -> fail
  });

  it('has consistent loan package calculations', () => {
    expect(LOAN_PACKAGES.length).toBe(3);
    LOAN_PACKAGES.forEach((pkg) => {
      expect(pkg.loanAmount - pkg.serviceFee).toBe(pkg.amountReceived);
    });
  });

  it('formats MYR currency properly', () => {
    expect(formatMYR(150)).toBe('RM 150.00');
    expect(formatMYR(0.5)).toBe('RM 0.50');
  });
});
