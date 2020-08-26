import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { LoginService } from '../../services/login/login.service';
import { UsuarioService } from '../../services/usuario/usuario.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: []
})
export class ProfileComponent implements OnInit {

  usuario : Usuario;

  imagenSubir : File;

  imagenTemp : string;

  tipoFoto : string = "";

  esUser : boolean;
  esAdmin : boolean;
  constructor(public loginService : LoginService,
              public usuarioService : UsuarioService) {
    this.usuario = loginService.currentUser;
    this.tipoFoto = loginService.role === "ADMIN_ROLE" ? 'admin' : loginService.role === "MED_ROLE" ? "medico" : "usuarios";
  }

  ngOnInit() {
    this.esUser = this.loginService.role === "USER_ROLE";
    this.esAdmin = this.loginService.role === "ADMIN_ROLE";
  }

  guardar(usuario : Usuario){


    this.usuario.nombres = usuario.nombres;
    this.usuario.correo = usuario.correo;
    this.usuario.direccion = usuario.correo;
    this.usuario.edad = usuario.edad;
    this.usuario.telefono = usuario.telefono;

    this.usuarioService.actualizarUsuario(this.usuario).subscribe();
  }

  seleccionImagen(file : File){
    if(!file){
      this.imagenSubir = file;
      return;
    }

    if(file.type.indexOf('image') < 0){
      Swal.fire('Error', 'Por favor selecciona una imagen', 'error');
      this.imagenSubir = null;
      return;
    }

    this.imagenSubir = file;

    let reader = new FileReader();

    let urlImagenTemp = reader.readAsDataURL(file);

    reader.onloadend = () => this.imagenTemp = reader.result.toString();
  }

  canbiarImagen(){
    this.usuarioService.cambiarImagen(this.imagenSubir, this.usuario.external_id);
  }

}
