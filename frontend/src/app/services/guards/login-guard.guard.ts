import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LoginService } from '../login/login.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuardGuard implements CanActivate {

  constructor(public usuarioService : LoginService,
              public router : Router){

  }

  canActivate() : boolean {

   
    if(this.usuarioService.isLogged()){
      console.log("Paso el guard");
      return true;
    }
    console.log("Bloqueado por el guard");
    this.router.navigate(['/login']);
    return false;
  }
}
