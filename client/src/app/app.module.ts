import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NbThemeModule, NbLayoutModule, NbIconModule, NbUserModule, NbSidebarModule, NbMenuModule, NbSelectModule, NbContextMenuModule, NbCardModule, NbInputModule, NbButtonModule, NbToast, NbToastrModule, NbDialogModule, NbBadgeModule, NbTagModule, NbStepperModule, NbTabsetModule, NbListModule, NbTooltipModule } from '@nebular/theme';
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
import { ViewProfileComponent } from './pages/account/profile/profile.component';
import { EditProfileComponent } from './pages/account/profile/edit-profile.component';
import { UsersComponent } from './pages/admin/users/users.component';
import { ProductsAdminComponent } from './pages/admin/products/products-admin.component';
import { DiscountsComponent } from './pages/admin/discounts/discounts.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BaseModalComponentComponent } from './@core/services-components/base-modal-component/base-modal-component.component';
import { EditProductComponent } from './pages/admin/products/edit-product/edit-product.component';
import { AddProductComponent } from './pages/admin/products/add-product/add-product.component';
import { NgxTagComponent } from './@core/services-components/ngx-tag/ngx-tag.component';
import { LoginComponent } from './pages/account/auth/login/login.component';
import { RegisterComponent } from './pages/account/auth/register/register.component';
import { NgxImgUploadComponent } from './@core/services-components/ngx-img-upload/ngx-img-upload.component';
import { NgxPagingComponent } from './@core/services-components/ngx-paging/ngx-paging.component';
import { SortLabelPipe } from './@core/pipe/sort-label.pipe';
import { EditUserComponent } from './pages/admin/users/edit-user/edit-user.component';
import { UpdateLoyaltyModalComponent } from './pages/admin/users/update-loyalty/update-loyalty-modal/update-loyalty-modal.component';
import { EditRoleModalComponent } from './pages/admin/users/role-user/edit-role-modal/edit-role-modal.component';
import { ConfirmDialogBaseBodyComponent } from './@core/services-components/confirm-dialog-base-body/confirm-dialog-base-body.component';
import { NgxGaugeDashBoardComponent } from './@core/services-components/ngx-gauge-dash-board/ngx-gauge-dash-board.component';
import { AdminOrdersComponent } from './pages/admin/orders/admin-orders.component';
import { ViewOrderComponent } from './pages/admin/orders/view-order/view-order.component';
import { NgChartsModule } from 'ng2-charts';

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
    HomeComponent,
    ProductsComponent,
    CategoriesComponent,
    BrandsComponent,
    CartComponent,
    OrdersComponent,
    LoyaltyComponent,
    DiscountComponent,
    ViewProfileComponent,
    EditProfileComponent,
    UsersComponent,
    DiscountsComponent,
    ProductsAdminComponent,
    BaseModalComponentComponent,
    EditProductComponent,
    AddProductComponent,
    NgxTagComponent,
    LoginComponent,
    RegisterComponent,
    NgxImgUploadComponent,
    NgxPagingComponent,
    SortLabelPipe,
    EditUserComponent,
    UpdateLoyaltyModalComponent,
    EditRoleModalComponent,
    ConfirmDialogBaseBodyComponent,
    NgxGaugeDashBoardComponent,
    AdminOrdersComponent,
    ViewOrderComponent
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
    NgChartsModule,
    NbDialogModule.forRoot(),
    NbToastrModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    TranslateModule,
    NbTooltipModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
