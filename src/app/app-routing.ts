import { Route } from '@vaadin/router';
import './not-found/not-found.js';
import './view-1/view-1';
import './view-2/view-2';
import './view-3/view-3';
import './child-view/child-view';

export const routes: Route[] = [
  { path: 'child-view', component: 'app-child-view', name: 'Child View' },
  { path: 'view-3', component: 'app-view-3', name: 'View3' },
  { path: 'view-2', component: 'app-view-2', name: 'View2' },
  { path: 'view-1', component: 'app-view-1', name: 'View1' },
  { path: '', redirect: 'view-1' },
  // The fallback route should always be after other alternatives.
  { path: '(.*)', component: 'app-not-found' }
];
