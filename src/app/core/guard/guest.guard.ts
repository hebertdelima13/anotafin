import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { filter, map } from 'rxjs/operators';
import { toObservable } from '@angular/core/rxjs-interop';

export const guestGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return toObservable(auth.initialized).pipe(
    filter(Boolean),
    map(() => (auth.isLoggedIn() ? router.parseUrl('/') : true))
  );
};
