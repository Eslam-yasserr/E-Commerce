import { Component, inject, OnInit } from '@angular/core';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-wishlist',
  imports: [CommonModule, RouterLink, TranslatePipe],
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss'],
})
export class WishlistComponent implements OnInit {
  products: any[] = [];
  isLoading: boolean = true;

  constructor(private wishlistService: WishlistService) {}
  private readonly ngxSpinnerService = inject(NgxSpinnerService);

  ngOnInit(): void {
    this.ngxSpinnerService.show();
    this.wishlistService.getLoggedUserWishlist().subscribe({
      next: (res) => {
        this.products = Array.isArray(res.data) ? res.data : [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);

        this.isLoading = false;
      },
    });
  }

  wishlistIds: string[] = [];

  isInWishlist(productId: string): boolean {
    return this.wishlistIds.includes(productId);
  }

  addOrRemoveFromWishlist(productId: string) {
    if (this.isInWishlist(productId)) {
      this.wishlistService.removeProductFromWishlist(productId).subscribe({
        next: () => {
          this.wishlistIds = this.wishlistIds.filter((id) => id !== productId);
          this.products = this.products.filter((p) => p._id !== productId);
        },
        error: (err) => console.error(err),
      });
    } else {
      this.wishlistService.addProductToWishlist(productId).subscribe({
        next: () => {
          this.wishlistIds.push(productId);
        },
        error: (err) => console.error(err),
      });
    }
  }

  removeFromWishlist(productId: string): void {
    this.wishlistService.removeProductFromWishlist(productId).subscribe({
      next: () => {
        this.products = this.products.filter((p) => p._id !== productId);
      },
      error: (err) => {
        console.error('Error removing product from wishlist:', err);
      },
    });
  }
}
