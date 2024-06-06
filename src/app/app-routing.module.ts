import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AdminsComponent } from './admins/admins.component';
import { EditAdminComponent } from './edit-admin/edit-admin.component';
import { AppointmentsComponent } from './appointments/appointments.component';
import { EditCustomerComponent } from './edit-customer/edit-customer.component';
import { PaymentsComponent } from './payments/payments.component';
import { ProductsComponent } from './products/products.component';
import { CreateProductComponent } from './create-product/create-product.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { ServicesComponent } from './services/services.component';
import { CreateServiceComponent } from './create-service/create-service.component';
import { EditServiceComponent } from './edit-service/edit-service.component';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RevenueReportsComponent } from './revenue-reports/revenue-reports.component';
import { ServicesControlsComponent } from './services-controls/services-controls.component';
import { ViewServiceComponent } from './view-service/view-service.component';
import { ProductsControlsComponent } from './products-controls/products-controls.component';
import { ViewProductComponent } from './view-product/view-product.component';
import { AuthGuardService } from './Auth-Guard/auth-guard.service';
import { HistoryComponent } from './history/history.component';
import { RoleGuardService } from './role-guard/role-guard.service';
import { LoginAdminComponent } from './login-admin/login-admin.component';
import { RegisterAdminComponent } from './register-admin/register-admin.component';
import { RemindersComponent } from './reminders/reminders.component';
import { MessagesComponent } from './messages/messages.component';
import { MessageUsComponent } from './message-us/message-us.component';
import { AboutComponent } from './about/about.component';
import { SearchComponent } from './search/search.component';
import { ViewCustomerComponent } from './view-customer/view-customer.component';
import { ViewAdminComponent } from './view-admin/view-admin.component';





const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login-admin', component: LoginAdminComponent },
  { path: 'register-admin', component: RegisterAdminComponent, canActivate: [RoleGuardService] },
  { path: 'admins', component: AdminsComponent, canActivate: [RoleGuardService] },
  { path: 'edit-admin/:id', component: EditAdminComponent },
  { path: 'appointments', component: AppointmentsComponent, canActivate: [AuthGuardService]  },
  { path: 'edit-info/:id', component: EditCustomerComponent, canActivate: [AuthGuardService] },
  { path: 'payments', component: PaymentsComponent, canActivate: [AuthGuardService]  },
  { path: 'products', component: ProductsComponent },
  { path: 'create-product', component: CreateProductComponent, canActivate: [RoleGuardService] },
  { path: 'edit-product/:id', component: EditProductComponent, canActivate: [RoleGuardService] },
  { path: 'services', component: ServicesComponent },
  { path: 'create-service', component: CreateServiceComponent, canActivate: [RoleGuardService] },
  { path: 'edit-service/:id', component: EditServiceComponent, canActivate: [RoleGuardService] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [RoleGuardService]},
  { path: 'revenue-reports', component: RevenueReportsComponent, canActivate: [RoleGuardService]},
  { path:  'services-controls', component: ServicesControlsComponent, canActivate: [RoleGuardService]},
  { path:  'reminders', component: RemindersComponent, canActivate: [RoleGuardService]},
  { path:  'products-controls', component: ProductsControlsComponent, canActivate: [RoleGuardService]},
  { path:  'messages', component: MessagesComponent, canActivate: [RoleGuardService]},
  { path: 'history', component: HistoryComponent, canActivate: [AuthGuardService]  },
  { path: 'message-us', component: MessageUsComponent, canActivate: [AuthGuardService]  },
  { path: 'view-customer', component: ViewCustomerComponent, canActivate: [AuthGuardService]  },
  { path: 'view-admin/:id', component: ViewAdminComponent, canActivate: [RoleGuardService]  },
  { path: 'edit-admin/:id', component: EditAdminComponent, canActivate: [RoleGuardService] },
  { path: 'about', component: AboutComponent },
  { path:  'view-service/:id', component: ViewServiceComponent},
  { path:  'view-product/:id', component: ViewProductComponent},
  { path: 'search', component: SearchComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' },
  { path: '**', redirectTo: '/login-admin', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
