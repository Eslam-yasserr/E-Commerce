import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import{TranslateService} from '@ngx-translate/core';
@Injectable({
  providedIn: 'root',
})
export class MyTranslateService {
  constructor(private translateService: TranslateService , @Inject(PLATFORM_ID) private ID :object) {
  if(isPlatformBrowser(ID)){
      // 1-set defult lang
    this.translateService.setDefaultLang('en');
    // 2- get lang from local storage
    const savedLang = localStorage.getItem('myLang');
    // 3-use lang
    if (savedLang) {
      this.translateService.use(savedLang);
    }

    // 4-changeDirection
    this.changeDirection()
  }
  }


  changeDirection():void{
    if(localStorage.getItem('myLang')=='en'){
      document.documentElement.setAttribute('dir', 'ltr');
      document.documentElement.setAttribute('lang', 'en');
    }
    else if(localStorage.getItem('myLang')=='ar'){
       document.documentElement.setAttribute('dir', 'rtl');
       document.documentElement.setAttribute('lang', 'ar');
    }
  }


  changeLanguage(lang:string):void{
    // 1- save localStorage ==lang
    localStorage.setItem('myLang',lang)

// 2- use this lang
this.translateService.use(lang)

// 3- change direction
this.changeDirection()
  }
}
