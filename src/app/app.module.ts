import { NgModule } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage'
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';

import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { MatFormFieldModule } from '@angular/material/form-field';
import { AlertService, AuthGuardService, AuthService, ValidationService } from '@shared';
import { firebaseKeys } from './firebase.config';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { SpinnerComponent } from './shared/spinner/spinner.component';
import { ContentAnimateDirective } from './shared/directives/content-animate.directive';

import { ToasterComponent } from './shared/toaster/toaster.component';
import { ControlMessagesComponent } from './shared/control-messages/control-messages.component';
import { LandingComponent, NewRequestDialogComponent, ViewRequestDialogComponent } from './pages/landing/landing.component';
import { NewRequestComponent } from './pages/new-request/new-request.component';
import { ViewRequestComponent } from './pages/view-request/view-request.component';

@NgModule({
  declarations: [
    AppComponent,
    SpinnerComponent,
    ContentAnimateDirective,
    ToasterComponent,
    ControlMessagesComponent,
    LandingComponent,
    NewRequestComponent,
    ViewRequestComponent,
    NewRequestDialogComponent,
    ViewRequestDialogComponent
  ],
  imports: [
    AngularFireModule.initializeApp(firebaseKeys),
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireAuthModule,
    MatFormFieldModule,

  ],
  providers: [
    AlertService,
    AuthGuardService,
    AuthService,
    ValidationService,
    AngularFireStorage,
    BrowserAnimationsModule,
    BrowserModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
