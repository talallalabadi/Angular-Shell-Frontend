import { Routes } from '@angular/router';

import { Home } from './pages/home/home';
import { Search } from './pages/search/search';
import { Reports } from './pages/reports/reports';
import { Help } from './pages/help/help';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'search', component: Search },
  { path: 'reports', component: Reports },
  { path: 'help', component: Help },
];

