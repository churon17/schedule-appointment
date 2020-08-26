import { Injectable } from '@angular/core';
import {  CanActivate, Router } from '@angular/router';
import { LoginService } from '../login/login.service';

@Injectable({
  providedIn: 'root'
})
export class UserGuard implements   CanActivate {

  constructor(public loginService: LoginService,
              public router: Router ){
  }

  canActivate(){
    if (this.loginService.role === 'USER_ROLE' ){
      return true;
    }
    this.loginService.logout();
    return false;
  }
}
