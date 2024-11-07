import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private _fb = inject(FormBuilder);
  private _authService = inject(AuthService);

  loginForm = this._fb.group({
    username: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]],
  });

  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }

  formSubmitted(): void {
    this.loginForm.markAllAsTouched();
    if (!this.loginForm.valid) {
      return;
    }

    this._authService
      .login(this.username?.value!, this.password?.value!)
      .subscribe((res) => {
        const authHeader = res.headers.get('Authorization');

        if (!authHeader) {
          return;
        }
        localStorage.setItem('hop_token', authHeader);
      });
  }
}
