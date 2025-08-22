import { Routes } from '@angular/router';
import { LibraryComponent } from './pages/library/library.component';
import { LogsComponent } from './pages/logs/logs.component';
import { InvalidComponent } from './pages/invalid/invalid.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'library',
    pathMatch: 'full',
  },
  {
    path: 'library',
    component: LibraryComponent,
  },
  {
    path: 'logs',
    component: LogsComponent,
  },
  {
    path: 'invalid-files',
    component: InvalidComponent,
  },
];
