import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard'; 


export const routes: Routes = [
  // Rota para o módulo/componentes de autenticação
  {
    path: 'auth',
    children: [
      { 
        path: 'login', 
        loadComponent: () => import('./auth/login/login').then(c => c.LoginComponent) 
      },
      { 
        path: 'register', 
        loadComponent: () => import('./auth/register/register').then(c => c.RegisterComponent) 
      }
    ]
  },

  // Rota para o Dashboard, protegida pelo AuthGuard
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard').then(c => c.DashboardComponent),
    canActivate: [authGuard] // Protege esta rota
  },

  // Rota padrão: redireciona para o dashboard. O guard vai interceptar e mandar para o login se não estiver autenticado.
  { 
    path: '', 
    redirectTo: '/dashboard', 
    pathMatch: 'full' 
  },

  // Rota coringa: qualquer outra URL também redireciona para o dashboard.
  { 
    path: '**', 
    redirectTo: '/dashboard' 
  }
];