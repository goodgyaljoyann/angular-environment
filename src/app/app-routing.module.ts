import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'admins', component: AdminsComponent },
  { path: 'create-admin', component: CreateAdminComponent },
  { path: 'edit-admin/:id', component: EditAdminComponent },
  { path: 'appointments', component: AppointmentsComponent },
  { path: 'create-appointment', component: CreateAppointmentComponent },
  { path: 'edit-appointment/:id', component: EditAppointmentComponent },
  { path: 'customers', component: CustomersComponent },
  { path: 'create-customer', component: CreateCustomerComponent },
  { path: 'edit-customer/:id', component: EditCustomerComponent },
  { path: 'locations', component: LocationsComponent },
  { path: 'create-location', component: CreateLocationComponent },
  { path: 'edit-location/:id', component: EditLocationComponent },
  { path: 'payments', component: PaymentsComponent },
  { path: 'create-payment', component: CreatePaymentComponent },
  { path: 'edit-payment/:id', component: EditPaymentComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'create-product', component: CreateProductComponent },
  { path: 'edit-product/:id', component: EditProductComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'create-service', component: CreateServiceComponent },
  { path: 'edit-service/:id', component: EditServiceComponent },
  { path: 'dashboard', component: DashboardComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
