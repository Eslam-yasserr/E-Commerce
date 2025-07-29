import { Component, input, OnInit } from '@angular/core';
import { FlowbiteService } from '../../core/services/flowbite/flowbite.service';
import { initFlowbite } from 'flowbite';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MyTranslateService } from '../../core/services/myTranslate/my-translate.service';
import { CartService } from '../../core/services/cart/cart.service';


@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, TranslatePipe],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  constructor(
    private flowbiteService: FlowbiteService,
    private authService: AuthService,
    private myTranslateService: MyTranslateService,
    private translateService: TranslateService,
    private cartService: CartService
  ) {}
  numOfItems: number = 0;
  isLoggedIn = input<boolean>(true);

  ngOnInit(): void {
    this.flowbiteService.loadFlowbite((flowbite) => {
      initFlowbite();
    });

    this.cartService.cartNumber.subscribe(
      {
        next: (value) => {
          this.numOfItems = value;
        }
      }
    )

    this.cartService.getLoggedUserCart().subscribe({
      next:(res)=>{
        console.log(res);
        this.cartService.cartNumber.next(res.numOfCartItems);
      },
      error:(err)=>{
        console.log(err);
      }
    })
  }

  signOut() {
    this.authService.signOut();
  }

  changeLang(lang: string): void {
    this.myTranslateService.changeLanguage(lang);
    const dropdown = document.getElementById('dropdownNavbar');
    if (dropdown && !dropdown.classList.contains('hidden')) {
      dropdown.classList.add('hidden');
    }
  }

  currentLang(lang: string) {
    return this.translateService.currentLang == lang;
  }
}
