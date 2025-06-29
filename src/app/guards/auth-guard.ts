import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true; // Se o usuário está logado, permite o acesso à rota
  } else {
    // Se não está logado, redireciona para a página de login e bloqueia a rota
    router.navigate(['/auth/login']);
    return false;
  }
};