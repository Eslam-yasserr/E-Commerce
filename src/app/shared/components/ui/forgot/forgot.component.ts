import { Component, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { ForgotService } from '../../../../core/services/forgot/forgot.service';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-forgot',
  imports: [ReactiveFormsModule,TranslatePipe],
  templateUrl: './forgot.component.html',
  styleUrl: './forgot.component.scss',
})
export class ForgotComponent {
  private readonly forgotService = inject(ForgotService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly ngxSpinnerService = inject(NgxSpinnerService);

  step: number = 1;
  isLoading: boolean = false;
  errMsg: string = '';
  isSuccess: boolean = false;
  isError: boolean = false;
  isLeaving: boolean = false;
  succMsg: string = '';
  forgotPassForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required]),
  });

  verifyCodeForm: FormGroup = new FormGroup({
    resetCode: new FormControl(null, [Validators.required]),
  });

  resetPassForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required]),
    newPassword: new FormControl(null, [Validators.required]),
  });

  forgotPass() {
    this.ngxSpinnerService.show()
    let emailValue = this.forgotPassForm.get('email')?.value;
    this.resetPassForm.get('email')?.patchValue(emailValue);

    this.forgotService.forgotPass(this.forgotPassForm.value).subscribe({
      next: (res) => {
        this.errMsg = '';

        if (res.statusMsg === 'success') {
          this.step = 2;
        }
    this.ngxSpinnerService.hide();

      },
      error: (err) => {
        console.log(err);
        this.errMsg = err.error.message;
      },
    });
  }

  verifyCode() {
    this.ngxSpinnerService.show();
    this.forgotService.verifyResetCode(this.verifyCodeForm.value).subscribe({
      next: (res) => {
        this.errMsg = '';

        if (res.status === 'Success') {
          this.step = 3;
        }
        this.ngxSpinnerService.hide();
      },
      error: (err) => {
        console.log(err);
        this.errMsg = err.error.message;
      },
    });
  }

  resetPass() {
    this.isLoading = true;
    this.errMsg = '';

    this.forgotService.resetPass(this.resetPassForm.value).subscribe({
      next: (res) => {
        localStorage.setItem('myToken', res.token);
        this.authService.getUserData();
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.errMsg = err.error?.message || 'Something went wrong';
        this.isLoading = false;
      },
    });
  }
}
