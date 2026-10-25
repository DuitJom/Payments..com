export interface LoanPackage {
  id: string;
  name: string;
  loanAmount: number;
  interestRate: number; // percentage, 0%
  tenureDays: number; // 7 days
  serviceFee: number;
  amountReceived: number;
}

export const LOAN_PACKAGES: LoanPackage[] = [
  {
    id: 'pkg_300',
    name: 'Pakej RM300',
    loanAmount: 300,
    interestRate: 0,
    tenureDays: 7,
    serviceFee: 150,
    amountReceived: 150
  },
  {
    id: 'pkg_600',
    name: 'Pakej RM600',
    loanAmount: 600,
    interestRate: 0,
    tenureDays: 7,
    serviceFee: 300,
    amountReceived: 300
  },
  {
    id: 'pkg_1000',
    name: 'Pakej RM1000',
    loanAmount: 1000,
    interestRate: 0,
    tenureDays: 7,
    serviceFee: 500,
    amountReceived: 500
  }
];

export interface LoanApplicationDraft {
  packageId?: string;
  fullName?: string;
  gender?: 'Lelaki' | 'Perempuan';
  race?: string;
  icNumber?: string;
  email?: string;
  referralSource?: string;
  whatsappNumber?: string;
  bankName?: string;
  accountNumber?: string; // string to keep leading zeros
  contactRelation?: string;
  contactName?: string;
  contactPhone?: string;
  icFrontUrl?: string;
  icBackUrl?: string;
  videoSelfieUrl?: string;
  pdpaConsent?: boolean;
}

export type ApplicationStatus =
  | 'Draf'
  | 'Diterima'
  | 'Dalam Semakan'
  | 'Dokumen Tambahan Diperlukan'
  | 'Diluluskan'
  | 'Tidak Diluluskan';

export interface LoanRecord {
  id: string;
  userId: string;
  package: LoanPackage;
  draft: LoanApplicationDraft;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
  submittedAt: string;
}

// Helpers & Validations
export function validateMyKad(ic: string): { valid: boolean; formatted: string; message?: string } {
  const digits = ic.replace(/\D/g, '');
  if (digits.length !== 12) {
    return { valid: false, formatted: ic, message: 'Masukkan nombor MyKad anda (12 digit).' };
  }
  const formatted = `${digits.slice(0, 6)}-${digits.slice(6, 8)}-${digits.slice(8, 12)}`;
  return { valid: true, formatted };
}

export function formatMyKadInput(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 12);
  if (digits.length <= 6) return digits;
  if (digits.length <= 8) return `${digits.slice(0, 6)}-${digits.slice(6)}`;
  return `${digits.slice(0, 6)}-${digits.slice(6, 8)}-${digits.slice(8, 12)}`;
}

export function normalizeMalaysianPhone(input: string): { valid: boolean; digitsAfter60: string; message?: string } {
  let cleaned = input.trim().replace(/\s+|-/g, '');
  if (cleaned.startsWith('+60')) {
    cleaned = cleaned.slice(3);
  } else if (cleaned.startsWith('60')) {
    cleaned = cleaned.slice(2);
  } else if (cleaned.startsWith('0')) {
    cleaned = cleaned.slice(1);
  }

  const digits = cleaned.replace(/\D/g, '');
  if (digits.length < 9 || digits.length > 10) {
    return {
      valid: false,
      digitsAfter60: digits,
      message: 'Masukkan 9 atau 10 digit sahaja selepas +60.'
    };
  }
  return { valid: true, digitsAfter60: digits };
}

type RecordListener = (records: LoanRecord[]) => void;

class LoanService {
  private records: LoanRecord[] = [];
  private listeners: Set<RecordListener> = new Set();
  private draft: LoanApplicationDraft = {};

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    if (typeof localStorage !== 'undefined') {
      const data = localStorage.getItem('duitjom_loan_records');
      if (data) {
        try {
          this.records = JSON.parse(data);
        } catch {
          this.records = [];
        }
      }
    }
  }

  private saveToStorage(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('duitjom_loan_records', JSON.stringify(this.records));
    }
  }

  public getDraft(): LoanApplicationDraft {
    return { ...this.draft };
  }

  public updateDraft(partial: Partial<LoanApplicationDraft>): void {
    this.draft = { ...this.draft, ...partial };
  }

  public clearDraft(): void {
    this.draft = {};
  }

  public async getUserRecords(userId: string): Promise<LoanRecord[]> {
    await new Promise((res) => setTimeout(res, 300)); // Simulating network latency
    return this.records.filter((r) => r.userId === userId);
  }

  public async submitApplication(userId: string): Promise<LoanRecord> {
    await new Promise((res) => setTimeout(res, 1000));
    const pkg = LOAN_PACKAGES.find((p) => p.id === this.draft.packageId) || LOAN_PACKAGES[0];
    const now = new Date().toISOString();
    const newRecord: LoanRecord = {
      id: 'DJ-' + Math.floor(100000 + Math.random() * 900000),
      userId,
      package: pkg,
      draft: { ...this.draft },
      status: 'Diterima',
      createdAt: now,
      updatedAt: now,
      submittedAt: now
    };

    this.records.unshift(newRecord);
    this.saveToStorage();
    this.clearDraft();
    this.notify();
    return newRecord;
  }

  public subscribe(listener: RecordListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener(this.records));
  }
}

export const loanService = new LoanService();
