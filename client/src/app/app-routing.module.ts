import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { ProductsComponent } from './pages/catalog/products/products.component';
import { CategoriesComponent } from './pages/catalog/categories/categories.component';
import { BrandsComponent } from './pages/catalog/brands/brands.component';
import { CartComponent } from './pages/cart/cart.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { LoyaltyComponent } from './pages/loyalty/loyalty.component';
import { DiscountComponent } from './pages/discount/discount.component';
import { HomeComponent } from './pages/home/home.component';
import { UsersComponent } from './pages/admin/users/users.component';
import { AuthComponent } from './pages/account/auth/auth.component';
import { ProfileComponent } from './pages/account/profile/profile.component';
import { DiscountsComponent } from './pages/admin/discounts/discounts.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },

  { path: 'home', component: HomeComponent },

  { path: 'catalog/products', component: ProductsComponent },
  { path: 'catalog/categories', component: CategoriesComponent },
  { path: 'catalog/brands', component: BrandsComponent },

  { path: 'cart', component: CartComponent },
  { path: 'orders', component: OrdersComponent },
  { path: 'loyalty', component: LoyaltyComponent },
  { path: 'discount', component: DiscountComponent },

  { path: 'account/auth', component: AuthComponent },
  { path: 'account/profile', component: ProfileComponent },

  { path: 'admin/dashboard', component: DashboardComponent },
  { path: 'admin/users', component: UsersComponent },
  { path: 'admin/products', component: ProductsComponent },
  { path: 'admin/orders', component: OrdersComponent },
  { path: 'admin/discounts', component: DiscountsComponent },

  { path: '**', redirectTo: '/home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
