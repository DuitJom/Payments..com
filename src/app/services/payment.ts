export interface BankOption {
  id: string;
  name: string;
  isEWallet: boolean;
}

export const BANK_OPTIONS: BankOption[] = [
  { id: 'aeon', name: 'AEON BANK', isEWallet: false },
  { id: 'affin', name: 'AFFIN BANK BERHAD', isEWallet: false },
  { id: 'alliance', name: 'ALLIANCE BANK MALAYSIA BERHAD', isEWallet: false },
  { id: 'ambank', name: 'AMBANK (M) BERHAD', isEWallet: false },
  { id: 'islam', name: 'BANK ISLAM MALAYSIA', isEWallet: false },
  { id: 'muamalat', name: 'BANK MUAMALAT', isEWallet: false },
  { id: 'rakyat', name: 'BANK RAKYAT', isEWallet: false },
  { id: 'bsn', name: 'BANK SIMPANAN NASIONAL', isEWallet: false },
  { id: 'cimb', name: 'CIMB BANK MALAYSIA BERHAD', isEWallet: false },
  { id: 'tng', name: "TOUCH 'N GO", isEWallet: true },
  { id: 'bigpay', name: 'BIGPAY EWALLET MALAYSIA', isEWallet: true },
  { id: 'ocbc', name: 'OCBC BANK MALAYSIA', isEWallet: false },
  { id: 'hsbc', name: 'HSBC BANK MALAYSIA BERHAD', isEWallet: false },
  { id: 'maybank', name: 'MAYBANK', isEWallet: false },
  { id: 'uob', name: 'UOB BANK', isEWallet: false }
];

export interface PaymentForm {
  fullName: string;
  icNumber: string;
  loanId: string;
  phoneNumber: string;
  email: string;
  amount: number;
}

export interface PaymentTransaction {
  id: string;
  form: PaymentForm;
  status: 'Pending' | 'Completed' | 'Failed';
  createdAt: string;
  receiptUrl?: string;
}

export function formatMYR(amount: number): string {
  if (isNaN(amount) || amount < 0) return 'RM 0.00';
  return `RM ${amount.toFixed(2)}`;
}

class PaymentService {
  private transactions: PaymentTransaction[] = [];

  public async submitPayment(form: PaymentForm): Promise<PaymentTransaction> {
    await new Promise((res) => setTimeout(res, 800));
    const tx: PaymentTransaction = {
      id: 'PAY-' + Date.now(),
      form,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };
    this.transactions.push(tx);
    return tx;
  }
}

export const paymentService = new PaymentService();
