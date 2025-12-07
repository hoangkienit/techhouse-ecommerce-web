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
import { ViewProfileComponent } from './pages/account/profile/profile.component';
import { EditProfileComponent } from './pages/account/profile/edit-profile.component';
import { DiscountsComponent } from './pages/admin/discounts/discounts.component';
import { ProductsAdminComponent } from './pages/admin/products/products-admin.component';
import { LoginComponent } from 'src/app/pages/account/auth/login/login.component';
import { RegisterComponent } from 'src/app/pages/account/auth/register/register.component';
import { AdminOrdersComponent } from './pages/admin/orders/admin-orders.component';
import { LogoutComponent } from './pages/account/auth/logout/logout.component';
import { DetailProdComponent } from './pages/catalog/products/detail-prod/detail-prod.component';
import { ResetRequestComponent } from './pages/account/auth/reset/reset-request.component';
import { ResetPasswordComponent } from './pages/account/auth/reset/reset-password.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },

  { path: 'home', component: HomeComponent },

  { path: 'catalog/products', component: ProductsComponent },
  { path: 'products/detail', component: DetailProdComponent },
  { path: 'catalog/categories', component: CategoriesComponent },
  { path: 'catalog/brands', component: BrandsComponent },

  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'orders', component: OrdersComponent },
  { path: 'loyalty', component: LoyaltyComponent },
  { path: 'discount', component: DiscountComponent },

  {
    path: 'account/auth',
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
{ path: 'reset-password/:token', component: ResetPasswordComponent },
      { path: 'reset-request', component: ResetRequestComponent },
      { path: 'reset-password', component: ResetPasswordComponent },
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  },

  { path: 'account/profile', component: ViewProfileComponent },
  { path: 'account/edit-profile', component: EditProfileComponent },
  { path: 'admin/dashboard', component: DashboardComponent },
  { path: 'admin/users', component: UsersComponent },
  { path: 'admin/products', component: ProductsAdminComponent },
  { path: 'admin/orders', component: AdminOrdersComponent },
  { path: 'admin/discounts', component: DiscountsComponent },
  { path: 'account/logout', component: LogoutComponent },
  { path: '**', redirectTo: '/home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
