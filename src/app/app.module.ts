import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { provideHttpClient, withInterceptorsFromDi, withFetch } from '@angular/common/http';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes), LoginComponent, ProfileComponent],
  providers: [provideHttpClient(withInterceptorsFromDi(), withFetch())],
})
export class AppRoutingModule {}
