import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

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
import { CreateCustomerComponent } from './create-customer/create-customer.component';
import { EditCustomerComponent } from './edit-customer/edit-customer.component';
import { LocationsComponent } from './locations/locations.component';
import { CreateLocationComponent } from './create-location/create-location.component';
import { EditLocationComponent } from './edit-location/edit-location.component';
import { PaymentsComponent } from './payments/payments.component';
import { CreatePaymentComponent } from './create-payment/create-payment.component';
import { EditPaymentComponent } from './edit-payment/edit-payment.component';
import { ProductsComponent } from './products/products.component';
import { CreateProductComponent } from './create-product/create-product.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { ServicesComponent } from './services/services.component';
import { CreateServiceComponent } from './create-service/create-service.component';
import { EditServiceComponent } from './edit-service/edit-service.component';
import { HeaderComponent } from './header/header.component';
import { DashboardComponent } from './dashboard/dashboard.component';



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
    CreateCustomerComponent,
    EditCustomerComponent,
    LocationsComponent,
    CreateLocationComponent,
    EditLocationComponent,
    PaymentsComponent,
    CreatePaymentComponent,
    EditPaymentComponent,
    ProductsComponent,
    CreateProductComponent,
    EditProductComponent,
    ServicesComponent,
    CreateServiceComponent,
    EditServiceComponent,
    HeaderComponent,
    DashboardComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
