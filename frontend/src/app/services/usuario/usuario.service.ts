import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { URL_SERVICIOS } from 'src/app/config/config';
import { map, catchError } from 'rxjs/operators';
import { LoginService } from '../login/login.service';
import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';
import { SettingsService } from '../settings/settings.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {


  constructor(
    public http: HttpClient,
    public loginService: LoginService,
    public subirImagenService: SubirArchivoService,
    public settingService: SettingsService)
  {}

  crearUsuario( usuario: Usuario){

    const url = `${URL_SERVICIOS}/persona/ingresar`;

    return this.http.post(url, usuario)
                    .pipe(map((response: any) => {

                      this.message(usuario.correo);

                      return response;
                    }),
                    catchError(error => {
                      this.settingService.showNormalError(error);
                      throw error;
                    }));
  }

  actualizarUsuario(usuario: Usuario){

    const token =  this.loginService.token;

    const headers = new HttpHeaders().set('token', token);

    const url = `${URL_SERVICIOS}/persona/modificar/${usuario.external_id}`;

    console.log(url);

    return this.http
                .put(url, usuario, {headers})
                .pipe(map((response: any) => {

                  const user = response.data;
                  this.loginService.guardarOnStorageBeforeLogin(user);
                  Swal.fire('Usuario actualizado', 'Se ha actualizado todo correctamente', 'success');

                  return true;
                }));


  }

  message(body: string){

    let mensaje = `Usuario creado ${body}, para mayor seguridad necesitamos que inicies sesión`;

    if (localStorage.getItem('currentPhoto')){

      mensaje = localStorage.getItem('currentPhoto') ? `${mensaje} nuevamente` : mensaje;
      localStorage.removeItem('currentPhoto');
    }

    Swal.fire('Correcto', mensaje , 'success');
  }

  cambiarImagen( file: File, id: string){
    const role = localStorage.getItem('role');
    this.subirImagenService
        .subirArchivo(file, role , id)
        .then( (response: any) => {

          this.loginService.currentUser.foto = response.data.foto;
          Swal.fire('Correcto', 'Imagen actualizada', 'success');
          this.loginService.guardarOnStorageBeforeLogin(response.data);

        })
        .catch(error => {
          console.log(error);
        });
  }

  cargarUsuarios(desde: number){

    const token =  this.loginService.token;

    const headers = new HttpHeaders().set('token', token);

    const url = `${URL_SERVICIOS}/persona/listar?desde=${desde}`;

    return this.http.get(url, {headers});
  }

  buscarUsuarios(termino: string){

    const url = `${URL_SERVICIOS}/busqueda/coleccion/usuarios/${termino}`;

    return this.http.get(url)
                    .pipe(map((response: any) => response.usuarios));

  }

  findUser(external: string){

    const url = `${URL_SERVICIOS}/persona/mostrarPersona/${external}`;

    return this.http.get(url);

  }

  borrarUsuario(external_id: string){

    const token =  this.loginService.token;

    const headers = new HttpHeaders().set('token', token);

    const url = `${URL_SERVICIOS}/persona/eliminar/${external_id}`;

    return this.http
                .put(url, null, {headers})
                .pipe(map((res: any) => {
                  Swal.fire('Usuario eliminado', 'El usuario ha sido eliminado correctamente', 'success');
                  return true;
                }));

  }

  verifyUserName(userName: string) {

    const url = `${URL_SERVICIOS}/persona/verifyUserName/${userName}`;

    return this.http.get(url);
  }

  verifyCedula(cedula: string) {

    const url = `${URL_SERVICIOS}/persona/verifyCedula/${cedula}`;

    return this.http.get(url);
  }

  cargarHistorialUsuario(external_usuario){
    const token =  this.loginService.token;

    const headers = new HttpHeaders().set('token', token);

    const url = `${URL_SERVICIOS}/persona/obtenerHistorial/${external_usuario}`;

    return this.http.get(url, {headers});
  }

  ingresarHistorialUsuario(external_usuario, historial: any){

    const token =  this.loginService.token;

    const headers = new HttpHeaders().set('token', token);

    const url = `${URL_SERVICIOS}/persona/agregarHistorial/${external_usuario}`;

    return this.http.post(url, historial, {headers});
  }

  obtenerHistorialPaciente(external_usuario){

    const token =  this.loginService.token;

    const headers = new HttpHeaders().set('token', token);

    const url = `${URL_SERVICIOS}/persona/obtenerHistorial/${external_usuario}`;

    return this.http.get(url, {headers});
  }

}
