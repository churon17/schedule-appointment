import { Component, OnInit,  EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoginService } from '../../services/login/login.service';
import { CitaService } from '../../services/cita/cita.service';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  styles: []
})
export class HistorialComponent implements OnInit {

  forma : FormGroup;

  @Output() registro = new EventEmitter<boolean>();

  constructor(public loginService : LoginService,
              public citaService : CitaService,
              public usuarioService : UsuarioService,
              public router : Router) { }

  ngOnInit() {
    this.forma = new FormGroup({
      enfermedades : new FormControl("11DACD", Validators.required),
      enfermedadesHereditarias : new FormControl(5, Validators.required),
      habitos : new FormControl("Jean Carlos", Validators.required)
    });
  }

  registrarHistorial(){
    
    if(this.forma.invalid) return;
    
    let valueForm = this.forma.value;

    let historia = {
      enfermedades : valueForm.enfermedades,
      enfermedadesHereditarias : valueForm.enfermedadesHereditarias,
      habitos : valueForm.habitos,
      medico : this.loginService.currentUser.external_id
    }
    this.usuarioService.ingresarHistorialUsuario(this.citaService.currentCita.paciente.external_id, historia)
                        .subscribe(response =>{
                       
                            this.registro.emit(true);
                        });

  }

}
