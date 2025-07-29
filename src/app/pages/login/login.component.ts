import { AuthService } from './../../core/services/auth/auth.service';
import { Component, inject } from '@angular/core';
import {FormControl, FormGroup,ReactiveFormsModule,Validators,} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule ,RouterLink,TranslatePipe],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [
      Validators.required,
    ]),
  });

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  isLodaing: boolean = false;
  isSuccess: boolean = false;
  isError: boolean = false;
  isLeaving: boolean = false;
  errMsg: string = '';
  succMsg: string = '';

  submitForm() {
    this.isLodaing = true;
    this.isError = false;
    this.isSuccess = false;

    if (this.loginForm.invalid) {
      this.isLodaing = false;
      return;
    }

    this.authService.signIn(this.loginForm.value).subscribe({
      next: (res) => {
        this.isLodaing = false;
        this.isSuccess = true;
        this.errMsg = '';
        console.log(res);
        this.succMsg = res.message;
        this.isLeaving = true;


        // 1)save token
        localStorage.setItem('myToken',res.token)


        // 2)decode token
        this.authService.getUserData()


          // 3)navigate to login
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 1000);
      },

      error: (err) => {
        this.isLodaing = false;
        this.isError = true;
        console.log(err.error.message);
        this.errMsg = err.error.message;
        setTimeout(() => (this.isError = false), 3000);
      },
    });
  }
}

