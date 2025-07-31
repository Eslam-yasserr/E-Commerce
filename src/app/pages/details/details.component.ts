import { Iproduct } from './../../shared/interfaces/iproduct';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../core/services/products/products.service';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../core/services/cart/cart.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-details',
  imports: [CurrencyPipe,TranslatePipe],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
})
export class DetailsComponent implements OnInit {
  isLoading: boolean = false;
  isSuccess: boolean = false;
  isError: boolean = false;
  prodId: any;
  currentImage: string = '';
  prodData: Iproduct | any;

  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly productsService = inject(ProductsService);
  private readonly cartService = inject(CartService);
  private readonly toastrService = inject(ToastrService);
  private readonly ngxSpinnerService = inject(NgxSpinnerService);

  ngOnInit(): void {
        this.ngxSpinnerService.show();

    this.activatedRoute.paramMap.subscribe({
      next: (res) => {
        this.prodId = res.get('id');

        this.productsService.getSpecificProduct(this.prodId).subscribe({
          next: (res) => {
            this.prodData = res.data;

            if (this.prodData?.imageCover) {
              this.currentImage = this.prodData.imageCover;
            }
            this.ngxSpinnerService.hide(); }
          ,
          error: (err) => {
            console.log(err);
          },
        });
      },
    });
  }

  changeImage(img: string) {
    this.currentImage = img;
  }

  getDiscount(product: Iproduct): number | null {
    if (product.priceAfterDiscount != null) {
      const discount =
        ((product.price - product.priceAfterDiscount) / product.price) * 100;
      return Math.round(discount);
    }
    return null;
  }

  addProductToCart(id: string): void {
    this.isLoading = true;
    this.isError = false;
    this.isSuccess = false;

    this.cartService.addProductToCart(id).subscribe({
      next: (res) => {
        this.isSuccess = true;
        this.isLoading = false;
        console.log(res);
        this.toastrService.success(res.message, 'FreshCart');
        this.cartService.cartNumber.set(res.numOfCartItems);

      },
      error: (err) => {
        this.isLoading = false;
        this.isError = true;
        console.log(err);
        setTimeout(() => (this.isError = false), 3000);
        this.toastrService.success(err.message, 'FreshCart');
      },
    });
  }
}
