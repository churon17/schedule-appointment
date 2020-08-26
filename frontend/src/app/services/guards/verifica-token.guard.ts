import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LoginService } from '../login/login.service';


@Injectable({
  providedIn: 'root'
})
export class VerificaTokenGuard implements  CanActivate{


  constructor(
    public loginService: LoginService,
    public router: Router
  ){}

  canActivate(): Promise<boolean> | boolean{

    const token = this.loginService.token;
    const payload = JSON.parse(atob(token.split('.')[1]));

    const expirado = this.isTokenExpired(payload.exp);

    if (expirado){

      this.router.navigate(['/login']);
      return false;
    }

    return this.verificaRenueva(payload.exp);
  }


  verificaRenueva(fecha_expire: number): Promise<boolean>{

    return new Promise((resolve, reject) => {
      const tokenExp = new Date(fecha_expire * 1000);
      const ahora = new Date();

      ahora.setTime( ahora.getTime() + ( 1 * 60 * 60 * 1000));

      console.log(tokenExp);
      console.log(ahora);

      if(tokenExp.getTime() > ahora.getTime()){
        resolve(true);
      }else{
        this.loginService
          .renuevaToken()
          .subscribe( () => {
            resolve(true);
          }, () => reject(false));
      }
    });
  }

  isTokenExpired(fecha_expire: number){
    const ahora = new Date().getTime() / 1000;

    if (fecha_expire < ahora){
      console.log('Es menor que ahora');
      return true;
    }
    return false;
  }

}
