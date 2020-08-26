import { Injectable } from '@angular/core';
import { LoginService } from '../login/login.service';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  menu: any;

  constructor(public loginService: LoginService) {
  }

  loadMenu(){
    this.menu = this.loginService.menu;
  }
}
