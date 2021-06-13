import { NgModule } from '@angular/core';
import { Routes, RouterModule , ExtraOptions} from '@angular/router';
import { AuthGuardService } from '@shared';
import { LandingComponent } from './pages/landing/landing.component'
import { MainComponent } from './pages/main/main.component'
import { Error404Component } from './pages/error-pages/error404/error404.component'
import { Error500Component } from './pages/error-pages/error500/error500.component';
import { PolicyComponent } from './pages/policy/policy.component';
import { TermsAndConditionsComponent } from './pages/terms-and-conditions/terms-and-conditions.component';
import { LandingHomeComponent } from './pages/landing-home/landing-home.component';
import { LandingFaqComponent } from './pages/landing-faq/landing-faq.component';
const routerOptions: ExtraOptions = {
  scrollPositionRestoration: 'enabled',
  anchorScrolling: 'enabled',
  scrollOffset: [0, 64],
};


const routes: Routes = [
  { path: '', redirectTo: '/landing', pathMatch: 'full' },
  { path: 'landing' , component: LandingHomeComponent},
  { path: 'faq' , component: LandingFaqComponent},
  { path: 'login' , component: LandingComponent},
  { path: 'privacy-policies' , component: PolicyComponent},
  { path: 'terms-conditions' , component: TermsAndConditionsComponent},
  { path: 'main' , component: MainComponent, canActivate: [AuthGuardService]},
  { path: '500', component: Error500Component },
  { path: '**', component: Error404Component },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, routerOptions)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
