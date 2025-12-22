import { Injectable, inject } from '@angular/core';
import { signal } from '@angular/core';
import { Auth, authState, User, signInWithEmailAndPassword } from '@angular/fire/auth';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user = signal<User | null>(null);
  auth = inject(Auth);
  initialized = signal(false);

  constructor() {
    authState(this.auth)
      .pipe(takeUntilDestroyed())
      .subscribe((user) => {
        this.user.set(user);
        this.initialized.set(true);
      });
  }

  async login(email: string, senha: string) {
    return await signInWithEmailAndPassword(this.auth, email, senha);
  }

  isLoggedIn() {
    return !!this.user();
  }

  async logout() {
    return await this.auth.signOut();
  }
}
