import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login/login.service';
import { CitaService } from '../../services/cita/cita.service';
import { Cita } from '../../models/cita.model';

@Component({
  selector: 'app-citas',
  templateUrl: './citas.component.html',
  styles: []
})
export class CitasComponent implements OnInit {

  totalCitas : number = 0;
  desde : number = 0;

  esUser : boolean;
  esMed : boolean;

  citas : Cita[] = [];

  constructor(public loginService : LoginService,
              public citaService : CitaService) { }

  ngOnInit() {
    this.loadRole();
  }

  cambiarDesde(valor : number) {
    let desde = this.desde + valor;
    if( desde >= this.totalCitas){
      return;
    }
    if(desde < 0){
      return;
    }

    this.desde += valor;
    this.loadRole();
  }

  loadRole(){
    if(this.loginService.role === "USER_ROLE"){
      this.esUser = true;
      this.cargarCitasPaciente();
    }
    if(this.loginService.role === "MED_ROLE"){
      this.esMed = true;
      this.cargarCitasMedico();
    }
  }

  cargarCitasPaciente(){
    this.citaService.cargarTodasLasCitasPaciente(this.loginService.currentUser.external_id, this.desde).subscribe( (response : any) =>{
        this.citas = response.data.citas;
        this.totalCitas = response.data.conteo;
    });
  }
  cargarCitasMedico(){
    this.citaService.cargarTodasLasCitasMedico(this.loginService.currentUser.external_id, this.desde).subscribe( (response : any) =>{
      console.log(response.data.citas);
      this.citas = response.data.citas;
      this.totalCitas = response.data.conteo;
  });
  }

}
