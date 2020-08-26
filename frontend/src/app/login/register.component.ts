import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms'

import Swal from 'sweetalert2/dist/sweetalert2.js';

import { UsuarioService } from '../services/service.index';
import { Usuario } from '../models/usuario.model';
import { Router } from '@angular/router';

declare function init_plugins();

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./login.component.css']
})
export class RegisterComponent implements OnInit {

  forma: FormGroup;

  googleUserPhoto: string = null;

  equalEmail: any = {};
  equalCedula: any = {};

  constructor(public usuarioService: UsuarioService,
              public router: Router) { }


  ngOnInit() {
    init_plugins();
    this.forma = new FormGroup({
      nombresProp : new FormControl("Jean Carlos", Validators.required),
      nombres : new FormControl("Alarcón Ochoa", Validators.required),
      userName : new FormControl("sashita", Validators.required),
      edad : new FormControl(21, Validators.required),
      email : new FormControl("", [Validators.required,
                                    Validators.email]),
      direccion : new FormControl("Cdla. Clodoveo Jaramillo", Validators.required),
      genero : new FormControl("Masculino", Validators.required),
      telefono : new FormControl("0959782810", Validators.required),
      password : new FormControl("123456", Validators.required),
      password2 : new FormControl("123456", Validators.required),
      condiciones : new FormControl(false)
    },
    {
      validators : this.sonIguales('password', 'password2')
    }
    );

    this.loadCurrentUser();
    this.deleteCurrentUser();
  }

  calcularEdad(fecha) {
    var hoy = new Date();
    var cumpleanos = new Date(fecha);
    var edad = hoy.getFullYear() - cumpleanos.getFullYear();
    var m = hoy.getMonth() - cumpleanos.getMonth();

    if (m < 0 || (m === 0 && hoy.getDate() < cumpleanos.getDate())) {
        edad--;
    }
    return edad;
}

  registrarUsuario(){

    if(this.forma.invalid){
      return;
    }

    if (!this.forma.value.condiciones) {
      Swal.fire('Importante', 'Debe de aceptar los terminos y condiciones', 'warning');
      return;
    }

    if (this.equalCedula.equal){
      Swal.fire('Error', this.equalCedula.mensaje , 'error');
      return;
    }

    if (this.equalEmail.equal){
      Swal.fire('Error', this.equalEmail.mensaje , 'error');
      return;
    }

    const valueForm = this.forma.value;

    let genero = (valueForm.genero === "Masculino") ? true : false;

    let edad = this.calcularEdad(valueForm.edad);

    let usuario = new Usuario(
      valueForm.nombres,
      valueForm.nombresProp,
      valueForm.userName,
      edad,
      valueForm.email,
      valueForm.password,
      valueForm.direccion,
      genero,
      valueForm.telefono
    );

    if(this.googleUserPhoto !== null){
      usuario.foto = this.googleUserPhoto;
    }

    this.usuarioService.crearUsuario(usuario)
          .subscribe( response => {
            this.router.navigate(['/login']);
          });
  }



  sonIguales(campo : string, campo1 : string){
    return ( group : FormGroup) =>{

        let pass1 = group.controls[campo].value;
        let pass2 = group.controls[campo1].value;

        if(pass1 === pass2){
          return null;
        }

        return {
          sonIguales : true,
        };
    }
  }



  loadCurrentUser(){

    let email = localStorage.getItem('currentEmail');
    let nombre = localStorage.getItem('currentNombre');
    this.googleUserPhoto = localStorage.getItem('currentPhoto');
    if( email && nombre){
      this.forma.controls['nombres'].setValue(nombre);
      this.forma.controls['email'].setValue(email);
    }
  }

  deleteCurrentUser(){
    localStorage.removeItem('currentEmail');
    localStorage.removeItem('currentNombre');
  }
}
