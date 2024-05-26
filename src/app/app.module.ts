import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ReactiveFormsModule } from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AdminsComponent } from './admins/admins.component';
import { CreateAdminComponent } from './create-admin/create-admin.component';
import { EditAdminComponent } from './edit-admin/edit-admin.component';
import { AppointmentsComponent } from './appointments/appointments.component';
import { CreateAppointmentComponent } from './create-appointment/create-appointment.component';
import { EditAppointmentComponent } from './edit-appointment/edit-appointment.component';
import { CustomersComponent } from './customers/customers.component';
import { EditCustomerComponent } from './edit-customer/edit-customer.component';
import { LocationsComponent } from './locations/locations.component';
import { CreateLocationComponent } from './create-location/create-location.component';
import { EditLocationComponent } from './edit-location/edit-location.component';
import { PaymentsComponent } from './payments/payments.component';
import { ProductsComponent } from './products/products.component';
import { CreateProductComponent } from './create-product/create-product.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { ServicesComponent } from './services/services.component';
import { CreateServiceComponent } from './create-service/create-service.component';
import { EditServiceComponent } from './edit-service/edit-service.component';
import { HeaderComponent } from './header-admins/header.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RevenueReportsComponent } from './revenue-reports/revenue-reports.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ServicesControlsComponent } from './services-controls/services-controls.component';
import { MatDialogModule } from '@angular/material/dialog';
import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';
import { HeaderMainComponent } from './header-main/header-main.component';
import { FooterComponent } from './footer/footer.component';
import { ViewServiceComponent } from './view-service/view-service.component';
import { ProductsControlsComponent } from './products-controls/products-controls.component';
import { DeleteProductDialogComponent } from './delete-product-dialog/delete-product-dialog.component';
import { ViewProductComponent } from './view-product/view-product.component';
import { DebitCardPaymentComponent } from './debit-card-payment/debit-card-payment.component';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { HistoryComponent } from './history/history.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { LoginAdminComponent } from './login-admin/login-admin.component';
import { RegisterAdminComponent } from './register-admin/register-admin.component';
import { RemindersComponent } from './reminders/reminders.component';




@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    AdminsComponent,
    CreateAdminComponent,
    EditAdminComponent,
    AppointmentsComponent,
    CreateAppointmentComponent,
    EditAppointmentComponent,
    CustomersComponent,
    EditCustomerComponent,
    LocationsComponent,
    CreateLocationComponent,
    EditLocationComponent,
    PaymentsComponent,
    ProductsComponent,
    CreateProductComponent,
    EditProductComponent,
    ServicesComponent,
    CreateServiceComponent,
    EditServiceComponent,
    HeaderComponent,
    DashboardComponent,
    RevenueReportsComponent,
    ServicesControlsComponent,
    DeleteDialogComponent,
    HeaderMainComponent,
    FooterComponent,
    ViewServiceComponent,
    ProductsControlsComponent,
    DeleteProductDialogComponent,
    ViewProductComponent,
    DebitCardPaymentComponent,
    HistoryComponent,
    ConfirmationDialogComponent,
    LoginAdminComponent,
    RegisterAdminComponent,
    RemindersComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    NgxPaginationModule,
    MatDialogModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    CommonModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
