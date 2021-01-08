import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component'
import { NewRequestComponent } from './pages/new-request/new-request.component';
import { ViewRequestComponent } from './pages/view-request/view-request.component';
import { Error404Component } from './pages/error-pages/error404/error404.component'
import { Error500Component } from './pages/error-pages/error500/error500.component';


const routes: Routes = [
  { path: '', redirectTo: '/landing', pathMatch: 'full' },
  { path: 'landing' , component: LandingComponent},
  { path: 'newRequest' , component: NewRequestComponent},
  { path: 'viewRequest' , component: ViewRequestComponent},
  { path: '500', component: Error500Component },
  { path: '**', component: Error404Component },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
