import { DatePipe, TitleCasePipe } from '@angular/common';
import { AuthService } from '../../core/services/auth/auth.service';
import { Iorder } from '../../shared/interfaces/iorder';
import { PaymentService } from './../../core/services/payment/payment.service';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-allorders',
  imports: [TitleCasePipe, DatePipe, RouterLink,TranslatePipe],
  templateUrl: './allorders.component.html',
  styleUrl: './allorders.component.scss',
})
export class AllordersComponent implements OnInit {
  private paymentService = inject(PaymentService);
  private authService = inject(AuthService);
  private ngxSpinnerService = inject(NgxSpinnerService);
  orders: Iorder[] = [];
  userData: any;

  ngOnInit(): void {
    this.authService.getUserData();
    this.userData = this.authService.userData;
    this.userOrders(this.userData.id);
  }

  userOrders(id: string): void {
    this.ngxSpinnerService.show();
    this.paymentService.getUserOrders(id).subscribe({
      next: (res) => {
        this.orders = res;
        console.log(this.orders);
        this.ngxSpinnerService.hide();
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
}
