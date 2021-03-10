import { Component, OnInit } from '@angular/core';
import { AuthService } from '@shared'

@Component({
  selector: 'app-error404',
  templateUrl: './error404.component.html',
  styleUrls: ['./error404.component.scss']
})
export class Error404Component implements OnInit {
  homeRoute

  constructor(private readonly authService: AuthService) {

      this.homeRoute = '/main'

  }

  ngOnInit() {
  }

}
