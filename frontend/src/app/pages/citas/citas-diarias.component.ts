import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/service.index';
import { CitaService } from 'src/app/services/cita/cita.service';
import { Cita } from 'src/app/models/cita.model';
import { Router } from '@angular/router';
import { Medico } from '../../models/med.model';
import { MedicoService } from '../../services/medico/medico.service';

@Component({
  selector: 'app-citas-diarias',
  templateUrl: './citas-diarias.component.html',
  styles: []
})
export class CitasDiariasComponent implements OnInit {

  medicos : Medico[] = [];

  totalCitas : number = 0;
  desde : number = 0;

  citas : Cita[] ;

  esAdmin : boolean;
  esUser : boolean;
  esMed : boolean;

  desdeMedicos : number = 0;
  totalMedicos : number = 0;

  showMedicos : boolean;

  constructor(public loginService : LoginService,
              public medicoService : MedicoService,
              public citaService : CitaService,
              public router : Router) { }

  ngOnInit() {
    if(this.loginService.role === "MED_ROLE"){
      this.cargarCitasDiariasMedico();
      this.esMed = true;
    }
    if(this.loginService.role === "USER_ROLE"){
      this.cargarCitasDiariasPaciente();
      this.esUser = true;
    }
    if(this.loginService.role === "ADMIN_ROLE"){
      this.esAdmin = true;
      this.showMedicos = true;
      this.cargarMedicos();
    }

  }

  cargarMedicos(){  
    this.medicoService.cargarMedicos(this.desdeMedicos)
                        .subscribe( (response : any)=>{
                          this.totalMedicos = response.data.conteo;
                          this.medicos = response.data.medicos;
                         });
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
    this.cargarCitasDiariasMedico();
  }


  cambiarDesdeMedicos(valor : number) {
    let desde = this.desdeMedicos + valor;
    if( desde >= this.totalMedicos){
      return;
    }
    if(desde < 0){
      return;
    }

    this.desdeMedicos += valor;
    this.cargarMedicos();
  }


  cargarCitasDiariasMedico(){
    this.citaService.cargarCitasDiariasMedico(this.loginService.currentUser.external_id, this.desde).subscribe( (response : any) =>{
        
        this.citas = response.data.citas;
        this.totalCitas = response.data.conteo;

        console.log(this.citas);
    });
  }


  cargarCitasDiariasPaciente(){
    this.citaService.cargarCitasDiariasPaciente(this.loginService.currentUser.external_id, this.desde).subscribe( (response : any) =>{
        
      console.log(response);
      this.citas = response.data.citas;
      this.totalCitas = response.data.conteo;

      console.log(this.citas);
    });
  }

  /**
   * No asistio el paciente a la cita
   */
  noAsistioPaciente(cita : Cita){

    this.citaService.asistenciaNula(cita.external_id).subscribe(response =>{
      console.log(response);
      this.cargarCitasDiariasMedico();
    })

  }

  atenderCita(cita : Cita){
    this.citaService.currentCita = cita;
    localStorage.setItem('cita', JSON.stringify(cita));
    this.citaService.registrarCita(cita.external_id).subscribe(response =>{
      console.log('Cita atendida', response);
      this.router.navigate(['/realizarConsulta']);
    });
  }

  cargarCitasMedicoSeleccionado(medico){
    this.showMedicos = false;
    this.citaService.cargarCitasDiariasMedico(medico.external_id, this.desde).subscribe( (response : any) =>{
      this.citas = response.data.citas;
      this.totalCitas = response.data.conteo;

      console.log(this.citas);
     });
  }

  mostrarMedicosNuevamente(){
    this.showMedicos = true;
    this.cargarMedicos();
  }

}
