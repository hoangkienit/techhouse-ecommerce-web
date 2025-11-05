import { MatSnackBar } from '@angular/material/snack-bar';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NbThemeModule, NbLayoutModule, NbIconModule, NbUserModule, NbSidebarModule, NbMenuModule, NbSelectModule, NbContextMenuModule, NbCardModule, NbInputModule, NbButtonModule, NbToast, NbToastrModule, NbDialogModule, NbBadgeModule, NbTagModule, NbStepperModule, NbTabsetModule, NbListModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { HeaderComponent } from './layouts/header/header.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { DashboardComponent } from './pages/admin/dashboard/dashboard.component';

import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { CommonModule } from '@angular/common';
import { LoadingDirective } from './@core/directives/loading.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './pages/home/home.component';
import { ProductsComponent } from './pages/catalog/products/products.component';
import { CategoriesComponent } from './pages/catalog/categories/categories.component';
import { BrandsComponent } from './pages/catalog/brands/brands.component';
import { CartComponent } from './pages/cart/cart.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { LoyaltyComponent } from './pages/loyalty/loyalty.component';
import { DiscountComponent } from './pages/discount/discount.component';
import { ProfileComponent } from './pages/account/profile/profile.component';
import { UsersComponent } from './pages/admin/users/users.component';
import { DiscountsComponent } from './pages/admin/discounts/discounts.component';
import { AuthComponent } from './pages/account/auth/auth.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';

// Hàm loader cho ngx-translate
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    DashboardComponent,
    LoadingDirective,
    AuthComponent,
    HomeComponent,
    ProductsComponent,
    CategoriesComponent,
    BrandsComponent,
    CartComponent,
    OrdersComponent,
    LoyaltyComponent,
    DiscountComponent,
    ProfileComponent,
    UsersComponent,
    DiscountsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NbThemeModule.forRoot({ name: 'default' }),
    NbLayoutModule,
    NbEvaIconsModule,
    NbIconModule,
    NbUserModule,
    NbSidebarModule.forRoot(),
    NbMenuModule.forRoot(),
    HttpClientModule,
    NbSelectModule,
    NbContextMenuModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NbCardModule,
    NbInputModule,
    NbButtonModule,
    NbBadgeModule,
    NbTagModule,
    NbStepperModule,
    NbTabsetModule,
    NbListModule,
    MatSnackBarModule,
    NbDialogModule.forRoot(),
    NbToastrModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
