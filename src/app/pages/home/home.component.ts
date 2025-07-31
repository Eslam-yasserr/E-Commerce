import { CategoriesService } from './../../core/services/categories/categories.service';
import { Component, inject, OnInit } from '@angular/core';
import { ProductsService } from '../../core/services/products/products.service';
import { Iproduct } from '../../shared/interfaces/iproduct';
import { Icategories } from '../../shared/interfaces/icategories';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { SerchPipe } from '../../shared/pipes/search.pipe';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../core/services/cart/cart.service';
import { DecimalPipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
// import { NgxSpinnerService } from 'ngx-spinner';
import { TranslatePipe } from '@ngx-translate/core';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';

@Component({
  selector: 'app-home',
  imports: [
    CarouselModule,
    RouterLink,
    CurrencyPipe,
    SerchPipe,
    FormsModule,
    DecimalPipe,
    TranslatePipe,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  private readonly categoriesService = inject(CategoriesService);
  private readonly cartService = inject(CartService);
  private readonly toastrService = inject(ToastrService);
  // private readonly ngxSpinnerService = inject(NgxSpinnerService);
  private readonly wishlistService = inject(WishlistService);

  searchItem: string = '';
  isLodaing: boolean = false;
  isSuccess: boolean = false;
  isError: boolean = false;
  myProduct: Iproduct[] = [];
  myCate: Icategories[] = [];
  cartNumber: number = 0;
  products: any[] = [];
  wishlistIds: string[] = [];

  ngOnInit(): void {
    this.callProducts();
    this.callCate();
    this.getUserWishlist();
    this.wishlistService.getLoggedUserWishlist().subscribe({
      next: (res) => {
        this.products = res.data;
      },
    });
  }
  customOptions = {
    loop: true,
    margin: 20,
    nav: true,
    navSpeed: 700,
    pullDrag: false,
    mouseDrag: true,
    touchDrag: true,
    rtl: true,
    dots: false,
    autoplay: true,
    autoplayTimeout: 3000,
    autoplayHoverPause: true,
    navText: [
      '<i class="fa-solid fa-angle-right"></i>',
      '<i class="fa-solid fa-angle-left"></i>',
    ],
    responsive: {
      0: { items: 2 },
      640: { items: 3 },
      1024: { items: 6 },
    },
  };

  mainSliderOption: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    rtl: true,
    dots: false,
    autoplay: true,
    autoplayTimeout: 2000,
    autoplayHoverPause: true,
    navSpeed: 700,
    navText: ['', ''],
    items: 1,
    nav: false,
  };

  callProducts() {
    this.productsService.getProducts().subscribe({
      next: (res) => {
        console.log(res.data);
        this.myProduct = res.data;
      },
      error: (er) => {
        console.error(er);
      },
    });
  }

  callCate() {
    this.categoriesService.getCategories().subscribe({
      next: (res) => {
        console.log(res.data);
        this.myCate = res.data;
      },
      error: (er) => {
        console.error(er);
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
        this.cartService.cartNumber.set(res.numOfCartItems);
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

  getUserWishlist() {
    this.wishlistService.getLoggedUserWishlist().subscribe({
      next: (res) => {
        this.wishlistIds = res.data.map((item: any) => item._id);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  isInWishlist(productId: string): boolean {
    return this.wishlistIds.includes(productId);
  }

  addProductToWishlist(productId: string) {
    if (this.isInWishlist(productId)) {
      this.wishlistService.removeProductFromWishlist(productId).subscribe({
        next: () => {
          this.wishlistIds = this.wishlistIds.filter((id) => id !== productId);
        },
        error: (err) => {
          console.error(err);
        },
      });
    } else {
      this.wishlistService.addProductToWishlist(productId).subscribe({
        next: () => {
          this.wishlistIds.push(productId);
        },
        error: (err) => {
          console.error(err);
        },
      });
    }
  }
}
