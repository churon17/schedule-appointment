import { Injectable } from '@angular/core';
import {  CanActivate, Router } from '@angular/router';
import { LoginService } from '../login/login.service';

@Injectable({
  providedIn: 'root'
})
export class MedGuard implements  CanActivate {

  constructor(public loginService: LoginService,
              public router: Router ){
  }

  canActivate(){
    if (this.loginService.role === 'MED_ROLE'){
      return true;
    }
    this.loginService.logout();
    return false;
  }

}
