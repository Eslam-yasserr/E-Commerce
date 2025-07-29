import { Component, inject, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProductsService } from '../../core/services/products/products.service';
import { Iproduct } from '../../shared/interfaces/iproduct';
import { CategoriesService } from '../../core/services/categories/categories.service';
import { CartService } from '../../core/services/cart/cart.service';
import { ToastrService } from 'ngx-toastr';
import { TranslatePipe } from '@ngx-translate/core';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SerchPipe } from '../../shared/pipes/search.pipe';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    TranslatePipe,
    CurrencyPipe,
    RouterLink,
    FormsModule,
    NgxPaginationModule,
    DecimalPipe,
    SerchPipe,
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent implements OnInit {
  private readonly ngxSpinnerService = inject(NgxSpinnerService);
  private readonly productsService = inject(ProductsService);
  private readonly cartService = inject(CartService);
  private readonly toastrService = inject(ToastrService);

  searchItem: string = '';
  isLodaing: boolean = false;
  isSuccess: boolean = false;
  isError: boolean = false;
  myProduct: Iproduct[] = [];

  currentPage: number = 1;
  itemsPerPage: number = 12;

  ngOnInit(): void {
    this.callProducts();
  }

  callProducts() {
    this.ngxSpinnerService.show();
    this.productsService.getProducts().subscribe({
      next: (res) => {
        console.log(res.data);
        this.myProduct = res.data;
        this.ngxSpinnerService.hide();
      },
      error: (er) => {
        console.error(er);
        this.ngxSpinnerService.hide();
      },
    });
  }

  addProductToCart(product: any): void {
    product.isLoading = true;
    product.isSuccess = false;
    product.isError = false;

    this.cartService.addProductToCart(product._id).subscribe({
      next: (res) => {
        product.isLoading = false;
        product.isSuccess = true;
        console.log(res);
        setTimeout(() => (product.isSuccess = false), 2000);
        this.toastrService.success(res.message, 'FreshCart');
        this.cartService.cartNumber.next(res.numOfCartItems);
      },
      error: (err) => {
        product.isLoading = false;
        product.isError = true;
        console.log(err);
        setTimeout(() => (product.isError = false), 2000);
        this.toastrService.error(err.message, 'FreshCart');
      },
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
