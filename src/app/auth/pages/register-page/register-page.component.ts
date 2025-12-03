import { AuthService } from '@/auth/services/auth.service';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register-page',
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './register-page.component.html',
})
export class RegisterPageComponent { 

  fb = inject(FormBuilder);
  authService = inject(AuthService);

  hasError = signal(false);
  isRegistered = signal(false);
  errorMessage = signal('');

  registerForm = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(1)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });


  onSubmit(): void {
    this.hasError.set(false);
    const { fullName, email, password } = this.registerForm.value;

    if (!fullName || !email || !password) return;

    this.authService.register(fullName, email, password).subscribe({
      next: () => {
        this.isRegistered.set(true);
        setTimeout(() => this.isRegistered.set(false), 3000);
      },
      error: (error) => {
        this.errorMessage.set(error.error.message ?? 'Registration failed');
        this.hasError.set(true);
        setTimeout(() => this.hasError.set(false), 3000);
      }, 
      complete: () => {
        this.registerForm.reset();
      }
    });

  }


}
