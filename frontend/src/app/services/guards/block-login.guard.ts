import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LoginService } from '../login/login.service';
@Injectable({
  providedIn: 'root'
})
export class BlockLoginGuard implements  CanActivate {

  constructor(
    public usuarioService: LoginService,
    public router: Router)
  {}

  canActivate(): boolean {

    if (!this.usuarioService.isLogged()){
      return true;
    }
    return false;
  }
}
