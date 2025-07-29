import { Component, OnInit, inject } from '@angular/core';
import {AbstractControl,FormBuilder,FormControl, FormGroup,ReactiveFormsModule, Validators} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PaymentService } from '../../core/services/payment/payment.service';



@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export class CheckoutComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly formBuilder = inject(FormBuilder);
  private readonly paymentService = inject(PaymentService);
  isLoading: boolean = false;
  isSuccess: boolean = false;
  isError: boolean = false;
  cartId: string = '';
  isLeaving: boolean = false;
  provinces: string[] = [
    'Cairo',
    'Giza',
    'Alexandria',
    'Dakahlia',
    'Sharqia',
    'Qalyubia',
    'Kafr El Sheikh',
    'Gharbia',
    'Menoufia',
    'Beheira',
    'Fayoum',
    'Beni Suef',
    'Minya',
    'Asyut',
    'Sohag',
    'Qena',
    'Luxor',
    'Aswan',
    'Red Sea',
    'Matruh',
    'New Valley',
    'North Sinai',
    'South Sinai',
  ];

  paymentForm!: FormGroup;

  ngOnInit(): void {
    this.paymentForm = this.formBuilder.group({
      details: [null, [Validators.required]],
      phone: [
        null,
        [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)],
      ],
      city: [null, [Validators.required]],
    });

    this.activatedRoute.paramMap.subscribe({
      next: (res) => {
        this.cartId = res.get('id')!;
        console.log(this.cartId);
      },
      error: (err) => {
        console.log('err');
      },
    });
  }

  submitForm(): void {
     this.isLoading = true;
     this.isSuccess = false;
     this.isError = false;
    console.log(this.paymentForm.value);
    this.paymentService
      .checkOutSession(this.cartId, this.paymentForm.value)
      .subscribe({
        next: (res) => {
           this.isLoading = false;
           this.isSuccess = true;
          console.log(res);
          if (res.status === 'success') {
            open(res.session.url, '_self');
          }
            setTimeout(() => (this.isSuccess = false), 2000);
        },
        error: (err) => {
          console.log(err);
           this.isLoading = false;
           this.isError = true;

           setTimeout(() => (this.isError = false), 2000);
        },
      });
  }
}
