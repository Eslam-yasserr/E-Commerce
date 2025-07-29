import { Routes } from '@angular/router';
import { BlankComponent } from './layout/blank/blank.component';
import { AuthComponent } from './layout/auth/auth.component';
import { authGuard } from './core/guards/auth/auth.guard';
import { loggedGuard } from './core/guards/logged/logged.guard';

export const routes: Routes = [

      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: '',component: AuthComponent,title: 'auth',canActivate:[loggedGuard],children: [
          { path: 'login', loadComponent:()=>import('./pages/login/login.component').then((c)=>c.LoginComponent), title: 'login' },
          { path: 'register', loadComponent:()=>import('./pages/register/register.component').then((c)=>c.RegisterComponent), title: 'register' },
          { path: 'forgot', loadComponent:()=>import('./shared/components/ui/forgot/forgot.component').then((c)=>c.ForgotComponent), title: 'forgot' },
        ],
      },
      {path: '',component: BlankComponent,title: 'blank',canActivate:[authGuard ] ,children: [
          { path: 'home', loadComponent:()=>import('./pages/home/home.component').then((c)=>c.HomeComponent), title: 'home' },
          { path: 'cart', loadComponent:()=>import('./pages/cart/cart.component').then((c)=>c.CartComponent), title: 'cart' },
          { path: 'products', loadComponent:()=>import('./pages/products/products.component').then((c)=>c.ProductsComponent), title: 'products' },
          {path: 'categories',loadComponent:()=>import('./pages/categories/categories.component').then((c)=>c.CategoriesComponent),title: 'categories',},
          { path: 'brands', loadComponent:()=>import('./pages/brands/brands.component').then((c)=>c.BrandsComponent), title: 'brands' },
          { path: 'wishlist', loadComponent:()=>import('./pages/wishlist/wishlist.component').then((c)=>c.WishlistComponent), title: 'wishlist' },
          { path: 'allorders', loadComponent:()=>import('./pages/allorders/allorders.component').then((c)=>c.AllordersComponent), title: 'allorders' },
          { path: 'checkout/:id', loadComponent:()=>import('./pages/checkout/checkout.component').then((c)=>c.CheckoutComponent), title: 'checkout' },
          { path: 'details/:id', loadComponent:()=>import('./pages/details/details.component').then((c)=>c.DetailsComponent), title: 'details' }, ],},
      { path: '**', loadComponent:()=>import('./pages/not-found/not-found.component').then((c)=>c.NotFoundComponent), title: 'not found' },
    ];
