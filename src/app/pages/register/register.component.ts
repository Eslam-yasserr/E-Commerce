import { AuthService } from './../../core/services/auth/auth.service';
import { Component, inject } from '@angular/core';
import {AbstractControl,FormControl, FormGroup,ReactiveFormsModule,Validators,} from '@angular/forms';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-register',
    imports: [ReactiveFormsModule,TranslatePipe],
    templateUrl: './register.component.html',
    styleUrl: './register.component.scss',
})
export class RegisterComponent {

  registerForms: FormGroup = new FormGroup(
    {
      name: new FormControl(null, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20),
      ]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^[A-Z][a-z0-9]{6,}$/),
      ]),
      rePassword: new FormControl(null, [Validators.required]),
      phone: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^01[0125][0-9]{8}$/),
      ]),
    },
    { validators: this.confirmPassword }
  );

  confirmPassword(group: AbstractControl) {
    const password = group.get('password')?.value;
    const rePassword = group.get('rePassword')?.value;


    if (password === rePassword) {
      return null;
    } else {
      return { mismatch: true };
    }
  }
  private readonly authService = inject(AuthService);
  private readonly router =inject(Router)
  isLodaing: boolean = false;
  isSuccess: boolean = false;
  isError: boolean = false;
  isLeaving:boolean = false;

  errMsg: string = '';
  succMsg:string =''

  submitForm() {
    this.isLodaing = true;
    this.isError = false;
    this.isSuccess = false;

    if (this.registerForms.invalid) {
      this.isLodaing = false;
      return;
    }


    this.authService.signUp(this.registerForms.value).subscribe({
      next: (res) => {
        this.isLodaing = false;
        this.isSuccess = true;
        this.errMsg = '';
        console.log(res);
        this.succMsg = res.message;

        this.isLeaving = true;

        setTimeout(() => {
          this.router.navigate(['/login']);
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
