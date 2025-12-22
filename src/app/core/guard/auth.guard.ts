import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';

export const authGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return toObservable(auth.initialized).pipe(
    filter(Boolean),
    map(() => (auth.isLoggedIn() ? true : router.parseUrl('/auth')))
  );
};
