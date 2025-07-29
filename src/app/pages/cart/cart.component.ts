import { Component, inject, OnInit } from '@angular/core';
import { CartService } from '../../core/services/cart/cart.service';
import { Icart } from '../../shared/interfaces/icart';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-cart',
  imports: [CurrencyPipe, RouterLink,TranslatePipe],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent implements OnInit {
  private readonly cartService = inject(CartService);
  private readonly ngxSpinnerService = inject(NgxSpinnerService);
  isLoading: boolean = true;
  cartDetials: Icart | null = null;

  ngOnInit(): void {
    this.getLoggedCart();
  }

  getLoggedCart(): void {
    this.ngxSpinnerService.show();

    this.cartService.getLoggedUserCart().subscribe({
      next: (res) => {
        console.log(res.data);
        this.cartDetials = res.data;
        this.isLoading = false;
        this.ngxSpinnerService.hide();
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      },
    });
  }

  deleteItem(id: string): void {
    this.ngxSpinnerService.show();
    this.cartService.removeSpecificCartItem(id).subscribe({
      next: (res) => {
        console.log(res);
        this.cartDetials = res.data;
        this.ngxSpinnerService.hide();
        this.cartService.cartNumber.next(res.numOfCartItems)
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  updateQuantity(id: string, quantity: any): void {
        this.ngxSpinnerService.show();

    this.cartService.updateCartProductQuantity(id, quantity).subscribe({
      next: (res) => {
        console.log(res);
        this.cartDetials = res.data;
            this.ngxSpinnerService.hide();
        this.cartService.cartNumber.next(res.numOfCartItems);

      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  deleteCart(): void {
    this.ngxSpinnerService.show();

    this.cartService.clearUserCart().subscribe({
      next: (res) => {
        console.log(res);
        this.cartDetials = null;
        this.ngxSpinnerService.hide();
        this.cartService.cartNumber.next(0);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
}
