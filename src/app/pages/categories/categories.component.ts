import { Component, inject, OnInit } from '@angular/core';
import { CategoriesService } from '../../core/services/categories/categories.service';
import { Icategories } from '../../shared/interfaces/icategories';
import { TranslatePipe } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { log } from 'console';
import { ISubCategory } from '../../shared/interfaces/isub-category';

@Component({
  selector: 'app-categories',
  imports: [TranslatePipe],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
})
export class CategoriesComponent implements OnInit {
  private readonly categoriesService = inject(CategoriesService);

  private readonly ngxSpinnerService = inject(NgxSpinnerService);
  isModalOpen = false;
  selectedCate: any = null;

  myCate: Icategories[] = [];
  subCategories: ISubCategory[] = [];
  isCategoryClicked = false;

  ngOnInit(): void {
    this.callCate();
  }

  callCate() {
    this.ngxSpinnerService.show();

    this.categoriesService.getCategories().subscribe({
      next: (res) => {
        console.log(res.data);
        this.myCate = res.data;
        this.ngxSpinnerService.hide();
      },
      error: (er) => {
        console.error(er);
        this.ngxSpinnerService.hide();
      },
    });
  }


  getAllSubCategriesCategory(id: string): void {
    this.ngxSpinnerService.show();

    this.isCategoryClicked = true;
    this.categoriesService.getAllSubCategoriesOnCategory(id).subscribe({
      next: (res) => {
        console.log(res);
        this.subCategories = res.data;

        this.ngxSpinnerService.hide();
      },
      error: (err) => {
        console.error(err);
        this.ngxSpinnerService.hide();
      },
    });
  }
}
