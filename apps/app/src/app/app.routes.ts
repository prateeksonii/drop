import { Route } from '@angular/router';
import { authGuard } from './auth/auth.guard';

export const appRoutes: Route[] = [
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./auth/login/login.component').then((c) => c.LoginComponent),
      },
      {
        path: 'signup',
        loadComponent: () =>
          import('./auth/signup/signup.component').then(
            (c) => c.SignupComponent
          ),
      },
    ],
  },
  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full',
  },
  {
    path: 'app',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./app/app.component').then((c) => c.AppComponent),
  },
];
