import { Route } from '@vaadin/router';
import './views/login-view.js';
import './views/dashboard-view.js';
import './views/apply-loan-view.js';
import './views/payment-view.js';
import './views/help-view.js';
import './not-found/not-found.js';

export const routes: Route[] = [
  { path: '/', component: 'app-dashboard-view' },
  { path: '/login', component: 'app-login-view' },
  { path: '/dashboard', component: 'app-dashboard-view' },
  { path: '/mohon-pinjaman', component: 'app-apply-loan-view' },
  { path: '/buat-bayaran', component: 'app-payment-view' },
  { path: '/rekod-permohonan', component: 'app-dashboard-view' },
  { path: '/bantuan', component: 'app-help-view' },
  { path: '(.*)', component: 'app-not-found' }
];
