export type Language = 'ms' | 'en' | 'zh';

export const LANGUAGES: { code: Language; name: string; flag: string }[] = [
  { code: 'ms', name: 'Bahasa Malaysia', flag: '🇲🇾' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'zh', name: '中文', flag: '🇨🇳' }
];

const translations: Record<Language, Record<string, string>> = {
  ms: {
    // Nav
    'nav.home': 'Utama',
    'nav.apply': 'Mohon Pinjaman',
    'nav.pay': 'Buat Bayaran',
    'nav.records': 'Rekod Permohonan',
    'nav.help': 'Bantuan',
    'nav.login': 'Log Masuk',
    'nav.logout': 'Log Keluar',
    'nav.account': 'Akaun Saya',

    // Login
    'login.title': 'Selamat Datang ke DuitJom',
    'login.subtitle': 'Urus permohonan pinjaman dan pembayaran anda dengan lebih mudah dalam satu tempat.',
    'login.google': 'Continue with Google',
    'login.email_magic': 'Login Email',
    'login.email_password': 'Log Masuk dengan Kata Laluan',
    'login.email_placeholder': 'Masukkan e-mel anda',
    'login.password_placeholder': 'Masukkan kata laluan anda',
    'login.register': 'Daftar Akaun Baru',
    'login.forgot': 'Lupa Kata Laluan?',
    'login.submit_magic': 'Hantar Pautan Log Masuk',
    'login.submit_password': 'Log Masuk',
    'login.or': 'atau',
    'login.sending': 'Menghantar...',
    'login.authenticating': 'Mengesahkan...',
    'login.success_magic_title': 'Pautan Log Masuk Dihantar',
    'login.success_magic_desc': 'Sila semak e-mel anda untuk pautan log masuk.',

    // Welcome popup
    'welcome.title': 'Selamat kembali ke DuitJom!',
    'welcome.desc': 'Urus permohonan pinjaman dan pembayaran anda dengan lebih mudah dalam satu tempat.',
    'welcome.continue': 'Teruskan',

    // Dashboard
    'dash.card_a_title': 'Mohon Pinjaman',
    'dash.card_a_desc': 'Pilih pakej dan lengkapkan permohonan pinjaman anda.',
    'dash.card_a_btn': 'Mohon Sekarang',
    'dash.card_b_title': 'Teruskan ke Pembayaran',
    'dash.card_b_desc': 'Buat pembayaran untuk pinjaman sedia ada anda.',
    'dash.card_b_btn': 'Buat Bayaran',
    'dash.records_title': 'Rekod Permohonan Anda',
    'dash.no_records': 'Anda belum mempunyai permohonan.',
    'dash.loading_records': 'Memuatkan rekod permohonan...',
    'dash.last_updated': 'Kemas kini terakhir:',
    'dash.retry': 'Cuba Lagi',

    // Features
    'feat.title': 'Perkhidmatan Kami',
    'feat.loan.title': 'Permohonan Pinjaman',
    'feat.loan.desc': 'Kelulusan pantas dengan pelbagai pilihan pakej khas.',
    'feat.payment.title': 'Pembayaran Mudah',
    'feat.payment.desc': 'Pelbagai kaedah bayaran termasuk DuitNow QR dan Perbankan Dalam Talian.',
    'feat.status.title': 'Semakan Status',
    'feat.status.desc': 'Jejak status permohonan anda secara terus dan real-time.',
    'feat.support.title': 'Sokongan Pelanggan',
    'feat.support.desc': 'Pasukan kami sedia membantu anda bila-bila masa.',

    // Loan Steps
    'step.1': 'Pilih Pakej',
    'step.2': 'Data Peribadi',
    'step.3': 'Nombor WhatsApp',
    'step.4': 'Butiran Bank & Kenalan',
    'step.5': 'Dokumen & Video',
    'step.6': 'Pengesahan',

    // Package step
    'pkg.title': 'Pilih Pakej Pinjaman',
    'pkg.desc': 'Pilih pakej yang sesuai dengan keperluan anda.',
    'pkg.label': 'JUMLAH PINJAMAN',
    'pkg.interest': 'Faedah — 0%',
    'pkg.tenure': 'Tempoh Pinjaman — 7 hari',
    'pkg.fee': 'Yuran Transaksi & Perkhidmatan',
    'pkg.receive': 'Anda Terima',
    'pkg.select': 'Pilih Pakej',
    'pkg.selected': 'Dipilih',

    // Common buttons
    'btn.back': 'Kembali',
    'btn.next': 'Seterusnya',
    'btn.submit': 'Hantar Permohonan',
    'btn.change': 'Tukar',
    'btn.details': 'Lihat Butiran',
    'btn.close': 'Tutup',

    // Validation
    'val.required': 'Medan ini wajib diisi',
    'val.ic': 'Masukkan nombor MyKad anda (12 digit).',
    'val.phone': 'Masukkan 9 atau 10 digit selepas +60.',
    'val.email': 'Format e-mel tidak sah.',
    'val.amount': 'Jumlah bayaran mesti melebihi RM0.00.',

    // Status
    'status.draft': 'Draf',
    'status.received': 'Diterima',
    'status.in_review': 'Dalam Semakan',
    'status.need_doc': 'Dokumen Tambahan Diperlukan',
    'status.approved': 'Diluluskan',
    'status.rejected': 'Tidak Diluluskan',

    // Help
    'help.title': 'Pusat Bantuan DuitJom',
    'help.faq1_q': 'Berapakah tempoh kelulusan permohonan?',
    'help.faq1_a': 'Permohonan biasanya diproses dalam masa 24 jam waktu bekerja.',
    'help.faq2_q': 'Bagaimana cara membuat pembayaran balik?',
    'help.faq2_a': 'Sila ke halaman Buat Bayaran dan ikuti arahan pembayaran bank / QR.',
    'help.contact': 'Hubungi Sokongan WhatsApp'
  },
  en: {
    // Nav
    'nav.home': 'Home',
    'nav.apply': 'Apply Loan',
    'nav.pay': 'Make Payment',
    'nav.records': 'Application Records',
    'nav.help': 'Help Center',
    'nav.login': 'Sign In',
    'nav.logout': 'Sign Out',
    'nav.account': 'My Account',

    // Login
    'login.title': 'Welcome to DuitJom',
    'login.subtitle': 'Manage your loan applications and payments easily in one place.',
    'login.google': 'Continue with Google',
    'login.email_magic': 'Login Email',
    'login.email_password': 'Log In with Password',
    'login.email_placeholder': 'Enter your email address',
    'login.password_placeholder': 'Enter your password',
    'login.register': 'Register New Account',
    'login.forgot': 'Forgot Password?',
    'login.submit_magic': 'Send Login Link',
    'login.submit_password': 'Log In',
    'login.or': 'or',
    'login.sending': 'Sending...',
    'login.authenticating': 'Authenticating...',
    'login.success_magic_title': 'Login Link Sent',
    'login.success_magic_desc': 'Please check your email for the login link.',

    // Welcome popup
    'welcome.title': 'Welcome back to DuitJom!',
    'welcome.desc': 'Manage your loan applications and payments easily in one place.',
    'welcome.continue': 'Continue',

    // Dashboard
    'dash.card_a_title': 'Apply for Loan',
    'dash.card_a_desc': 'Choose a package and complete your loan application.',
    'dash.card_a_btn': 'Apply Now',
    'dash.card_b_title': 'Proceed to Payment',
    'dash.card_b_desc': 'Make a payment for your existing loan.',
    'dash.card_b_btn': 'Make Payment',
    'dash.records_title': 'Your Application Records',
    'dash.no_records': 'You have no applications yet.',
    'dash.loading_records': 'Loading application records...',
    'dash.last_updated': 'Last updated:',
    'dash.retry': 'Retry',

    // Features
    'feat.title': 'Our Services',
    'feat.loan.title': 'Loan Application',
    'feat.loan.desc': 'Fast approval with tailored loan packages.',
    'feat.payment.title': 'Easy Payments',
    'feat.payment.desc': 'Multiple payment options including DuitNow QR and Online Banking.',
    'feat.status.title': 'Status Tracker',
    'feat.status.desc': 'Track your application status directly in real-time.',
    'feat.support.title': 'Customer Support',
    'feat.support.desc': 'Our dedicated team is ready to assist you anytime.',

    // Loan Steps
    'step.1': 'Select Package',
    'step.2': 'Personal Data',
    'step.3': 'WhatsApp Number',
    'step.4': 'Bank & Contact Info',
    'step.5': 'Docs & Video',
    'step.6': 'Confirmation',

    // Package step
    'pkg.title': 'Select Loan Package',
    'pkg.desc': 'Choose the package that suits your needs.',
    'pkg.label': 'LOAN AMOUNT',
    'pkg.interest': 'Interest — 0%',
    'pkg.tenure': 'Loan Tenure — 7 days',
    'pkg.fee': 'Transaction & Service Fee',
    'pkg.receive': 'You Receive',
    'pkg.select': 'Select Package',
    'pkg.selected': 'Selected',

    // Common buttons
    'btn.back': 'Back',
    'btn.next': 'Next',
    'btn.submit': 'Submit Application',
    'btn.change': 'Change',
    'btn.details': 'View Details',
    'btn.close': 'Close',

    // Validation
    'val.required': 'This field is required',
    'val.ic': 'Enter your MyKad number (12 digits).',
    'val.phone': 'Enter 9 or 10 digits after +60.',
    'val.email': 'Invalid email format.',
    'val.amount': 'Payment amount must be greater than RM0.00.',

    // Status
    'status.draft': 'Draft',
    'status.received': 'Received',
    'status.in_review': 'Under Review',
    'status.need_doc': 'Additional Documents Required',
    'status.approved': 'Approved',
    'status.rejected': 'Not Approved',

    // Help
    'help.title': 'DuitJom Help Center',
    'help.faq1_q': 'What is the approval timeframe?',
    'help.faq1_a': 'Applications are usually processed within 24 business hours.',
    'help.faq2_q': 'How do I make a repayment?',
    'help.faq2_a': 'Please go to Make Payment page and follow the bank/QR instructions.',
    'help.contact': 'Contact WhatsApp Support'
  },
  zh: {
    // Nav
    'nav.home': '主页',
    'nav.apply': '申请贷款',
    'nav.pay': '进行付款',
    'nav.records': '申请记录',
    'nav.help': '帮助中心',
    'nav.login': '登录',
    'nav.logout': '登出',
    'nav.account': '我的账户',

    // Login
    'login.title': '欢迎来到 DuitJom',
    'login.subtitle': '在一个地方轻松管理您的贷款申请和付款。',
    'login.google': '使用 Google 继续',
    'login.email_magic': 'Login Email',
    'login.email_password': '使用密码登录',
    'login.email_placeholder': '请输入您的电子邮件',
    'login.password_placeholder': '请输入您的密码',
    'login.register': '注册新账户',
    'login.forgot': '忘记密码？',
    'login.submit_magic': '发送登录链接',
    'login.submit_password': '登录',
    'login.or': '或',
    'login.sending': '发送中...',
    'login.authenticating': '验证中...',
    'login.success_magic_title': '登录链接已发送',
    'login.success_magic_desc': '请检查您的电子邮件以获取登录链接。',

    // Welcome popup
    'welcome.title': '欢迎回到 DuitJom！',
    'welcome.desc': '在一个地方轻松管理您的贷款申请和付款。',
    'welcome.continue': '继续',

    // Dashboard
    'dash.card_a_title': '申请贷款',
    'dash.card_a_desc': '选择配套并完成您的贷款申请。',
    'dash.card_a_btn': '立即申请',
    'dash.card_b_title': '继续前往付款',
    'dash.card_b_desc': '为您现有的贷款进行付款。',
    'dash.card_b_btn': '进行付款',
    'dash.records_title': '您的申请记录',
    'dash.no_records': '您目前没有申请记录。',
    'dash.loading_records': '正在加载申请记录...',
    'dash.last_updated': '最后更新：',
    'dash.retry': '重试',

    // Features
    'feat.title': '我们的服务',
    'feat.loan.title': '贷款申请',
    'feat.loan.desc': '快速批准，提供多种定制贷款配套。',
    'feat.payment.title': '便捷付款',
    'feat.payment.desc': '多种付款方式，包括 DuitNow QR 和网上银行。',
    'feat.status.title': '状态查询',
    'feat.status.desc': '实时跟踪您的申请状态。',
    'feat.support.title': '客户支持',
    'feat.support.desc': '我们的团队随时准备为您提供帮助。',

    // Loan Steps
    'step.1': '选择配套',
    'step.2': '个人资料',
    'step.3': 'WhatsApp 号码',
    'step.4': '银行与联系人',
    'step.5': '文件与视频',
    'step.6': '确认',

    // Package step
    'pkg.title': '选择贷款配套',
    'pkg.desc': '选择最适合您需求的配套。',
    'pkg.label': '贷款金额',
    'pkg.interest': '利息 — 0%',
    'pkg.tenure': '贷款期限 — 7天',
    'pkg.fee': '交易与服务费',
    'pkg.receive': '您实得',
    'pkg.select': '选择配套',
    'pkg.selected': '已选择',

    // Common buttons
    'btn.back': '返回',
    'btn.next': '下一步',
    'btn.submit': '提交申请',
    'btn.change': '更换',
    'btn.details': '查看详情',
    'btn.close': '关闭',

    // Validation
    'val.required': '此项为必填项',
    'val.ic': '请输入您的 MyKad 号码（12 位数字）。',
    'val.phone': '在 +60 后输入 9 或 10 位数字。',
    'val.email': '无效的电子邮件格式。',
    'val.amount': '付款金额必须大于 RM0.00。',

    // Status
    'status.draft': '草稿',
    'status.received': '已收到',
    'status.in_review': '审核中',
    'status.need_doc': '需要补充文件',
    'status.approved': '已批准',
    'status.rejected': '未通过',

    // Help
    'help.title': 'DuitJom 帮助中心',
    'help.faq1_q': '申请审批需要多久？',
    'help.faq1_a': '申请通常会在 24 工作小时内处理。',
    'help.faq2_q': '如何进行还款？',
    'help.faq2_a': '请前往进行付款页面，并按照银行/二维码说明操作。',
    'help.contact': '联系 WhatsApp 客服'
  }
};

type Listener = (lang: Language) => void;

class I18nService {
  private currentLang: Language = 'ms';
  private listeners: Set<Listener> = new Set();

  constructor() {
    const saved = typeof localStorage !== 'undefined' ? localStorage.getItem('duitjom_lang') as Language : null;
    if (saved && (saved === 'ms' || saved === 'en' || saved === 'zh')) {
      this.currentLang = saved;
    }
  }

  public getLanguage(): Language {
    return this.currentLang;
  }

  public setLanguage(lang: Language): void {
    if (this.currentLang !== lang) {
      this.currentLang = lang;
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('duitjom_lang', lang);
      }
      this.notify();
    }
  }

  public t(key: string, fallback?: string): string {
    const dict = translations[this.currentLang] || translations.ms;
    return dict[key] || translations.ms[key] || fallback || key;
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener(this.currentLang));
  }
}

export const i18n = new I18nService();
