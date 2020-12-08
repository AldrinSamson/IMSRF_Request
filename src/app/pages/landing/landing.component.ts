import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent {

  loginForm: any;

  constructor(  private formBuilder: FormBuilder
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', []],
      password: ['',]
    });
  }

  login() {
  }


}
