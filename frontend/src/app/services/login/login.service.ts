import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { URL_SERVICIOS } from 'src/app/config/config';
import { map, catchError } from 'rxjs/operators';
import { Usuario } from '../../models/usuario.model';
import { Router } from '@angular/router';
import { SettingsService } from '../settings/settings.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  currentUser: Usuario;
  menu: any;
  token: string;
  role: string;


  constructor(
    public http: HttpClient,
    public router: Router,
    public settingService: SettingsService
  ){
    this.cargarStorage();
  }

  isLogged = () => (this.token.length > 5) ? true : false;

  cargarStorage(){
    if (localStorage.getItem('token')){

      this.token = localStorage.getItem('token');
      this.currentUser = JSON.parse(localStorage.getItem('user'));
      this.role = localStorage.getItem('role');
      this.menu = JSON.parse(localStorage.getItem('menu'));

    }else{

      this.token = '';
      this.currentUser = null;
      this.role = '';
      this.menu = null;

    }
  }

  login(usuario: {userName: string, password: string }, recordar: boolean = false) {

    if (recordar) {
        localStorage.setItem('email', usuario.userName);
    }else{
        localStorage.removeItem('email');
    }

    const url = `${URL_SERVICIOS}/login`;

    return this.http.post(url, usuario)
                    .pipe(map((response : any)=>{
                      let data = response.data;
                      this.guardarOnStorage(data);
                      return true;
                    }),
                    catchError(error => {
                      this.settingService.showNormalError(error);
                      throw error;
                    }));
  }

  loginGoogle(email : any){
    const url = `${URL_SERVICIOS}/login/google`;
    return this.http.post(url, email)
                    .pipe(map((response: any)=>{
                          console.log('GOOGLE', response);
                          const data = response.data;

                          if (data.message === "YES"){
                            this.guardarOnStorage(data);
                            return true;
                          }
                          localStorage.setItem('currentEmail', data.usuario.email);
                          localStorage.setItem('currentNombre', data.usuario.nombre);
                          localStorage.setItem('currentPhoto', data.usuario.foto);
                          return false;
                      }));

  }

  guardarOnStorage(data : any){
    localStorage.setItem('role', data.user.role);
    localStorage.setItem('token', data.token);
    localStorage.setItem('id', data.user.person.external_id);
    localStorage.setItem('user', JSON.stringify(data.user.person));
    localStorage.setItem('menu', JSON.stringify(data.menu));

    this.role = data.user.role;
    this.menu = data.menu;
    this.currentUser = data.user.person;
    this.token = data.token;
  }

  guardarOnStorageBeforeLogin(data : any){
    localStorage.setItem('user', JSON.stringify(data));
    this.currentUser = data;
  }


  logout(){
    this.currentUser = null;
    this.token = '';
    this.menu = [];

    localStorage.removeItem('role');
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    localStorage.removeItem('user');
    localStorage.removeItem('menu');
    this.router.navigate(['/login']);
  }

  renuevaToken(){

    let url = `${URL_SERVICIOS}/login/renuevaToken`;
    let headers = new HttpHeaders().set('token', this.token);

    return this.http.get(url, {headers : headers})
                    .pipe(map((response : any) =>{

                      let data = response.data;
                      this.guardarOnStorage(data);
                      console.log('Token renovado');
                      return true;
                    }),
                    catchError(error =>{
                      console.log(error);
                      this.settingService.showNormalError('No fue posible renovar el token');
                      this.router.navigate(['/login']);
                      throw error;
                    }));
  }
}
