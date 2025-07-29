import { Component, inject, OnInit } from '@angular/core';
import { BrandsService } from '../../core/services/brands/brands.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { TranslatePipe } from '@ngx-translate/core';


@Component({
  selector: 'app-brands',
  imports: [TranslatePipe],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.scss',
})
export class BrandsComponent implements OnInit {
  private brandsService = inject(BrandsService);
  private readonly ngxSpinnerService = inject(NgxSpinnerService);
  isModalOpen = false;
  selectedBrand: any = null;
  myBrands: any;
  ngOnInit(): void {
    this.ngxSpinnerService.show();
    this.getBrands();
  }

  getBrands() {
    this.brandsService.getBrands().subscribe({
      next: (res) => {
        console.log(res.data);
        this.myBrands = res.data;
        this.ngxSpinnerService.hide();
      },
      error: (er) => {
        console.error(er);
        this.ngxSpinnerService.hide();
      },
    });
  }

  getSpecificbrand(id: string): void {
    this.ngxSpinnerService.show();
    this.brandsService.getSpecificBrand(id).subscribe({
      next: (res) => {
        this.selectedBrand = res.data;
        console.log(res.data);
        this.ngxSpinnerService.hide();
      },
      error: (er) => {
        console.error(er);
        this.ngxSpinnerService.hide();
      },
    });
  }
  openModal(id: string): void {
    this.isModalOpen = true;
    this.getSpecificbrand(id);
  }
  closeModal(): void {
    this.isModalOpen = false;
    this.selectedBrand = null;
  }
}
