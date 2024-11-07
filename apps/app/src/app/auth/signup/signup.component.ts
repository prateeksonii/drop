import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  AbstractControlOptions,
  AsyncValidatorFn,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  of,
  switchMap,
} from 'rxjs';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent implements OnInit {
  private _fb = inject(FormBuilder);
  private _authService = inject(AuthService);
  private _cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.signupForm.get('username')?.statusChanges.subscribe(() => {
      this._cdr.markForCheck();
    });
  }

  usernameValidator(
    control: AbstractControl,
    authService: AuthService
  ): Observable<ValidationErrors | null> {
    return authService.checkUsernameAvailability(control.value).pipe(
      map((res) => {
        if (!res)
          return {
            unavailable: true,
          };
        return null;
      })
    );
  }

  signupForm = this._fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    username: [
      '',
      {
        validators: [Validators.required],
        asyncValidators: [(c) => this.usernameValidator(c, this._authService)],
        updateOn: 'blur',
      } satisfies AbstractControlOptions,
    ],
    password: ['', [Validators.required, Validators.minLength(4)]],
  });

  get name() {
    return this.signupForm.get('name');
  }

  get email() {
    return this.signupForm.get('email');
  }

  get password() {
    return this.signupForm.get('password');
  }

  get username() {
    return this.signupForm.get('username');
  }

  formSubmitted(): void {
    this.signupForm.markAllAsTouched();
    if (!this.signupForm.valid) {
      return;
    }

    this._authService
      .signUp(
        this.name?.value!,
        this.email?.value!,
        this.password?.value!,
        this.username?.value!
      )
      .subscribe((res) => {
        this._authService
          .login(this.email?.value!, this.password?.value!)
          .subscribe((res) => {
            console.log(res);
          });
      });
  }
}
