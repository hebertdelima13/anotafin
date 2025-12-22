import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../core/services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-page',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './auth.page.html',
  styleUrl: './auth.page.scss',
})
export class AuthPage {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);
  error = signal<string | null>(null);
  hide = signal(true);

  authForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.minLength(5)]],
  });

  showPassword() {
    this.hide.set(!this.hide());
  }

  async login() {
    const { email, senha } = this.authForm.value;

    if (this.authForm.invalid) return;

    try {
      this.error.set('');
      await this.authService.login(email!, senha!);
      this.router.navigateByUrl('/');
    } catch (err: any) {
      if (err.code === 'auth/invalid-credential') {
        this.error.set('Verifique seu e-mail ou senha.');
      }
    }
  }
}
