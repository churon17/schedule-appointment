import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../services/login/login.service';
import { CitaService } from '../../../services/cita/cita.service';
import { Router } from '@angular/router';
import { Cita } from 'src/app/models/cita.model';
import { Usuario } from 'src/app/models/usuario.model';
import { Medico } from '../../../models/med.model';

@Component({
  selector: 'app-citas-realizadas',
  templateUrl: './citas-realizadas.component.html',
  styles: []
})
export class CitasRealizadasComponent implements OnInit {

  currentCita: Cita;
  currentPaciente: Usuario;
  currentMedico: Medico;

  diagnostico: string;
  motivo: string;
  receta: string;

  totalCitas = 0;
  desde = 0;

  citas: Cita[] = [];

  citasReady: boolean;
  mostrarDetallesMed: boolean;
  mostrarDetallesUser: boolean;
  mostrarCitas: boolean;

  esUser: boolean;
  esMed: boolean;

  constructor(public loginService: LoginService,
              public citaService: CitaService,
              public router: Router) { }

  ngOnInit() {
    this.loadRole();
  }

  cargarCitasRealizadasMedico(){
    this.citaService.cargarCitasRealizadasMedico(this.loginService.currentUser.external_id, this.desde)
                    .subscribe((response: any) => {
                      console.log(response);
                      this.citas = response.data.citas;
                      this.totalCitas = response.data.conteo;
                      this.citasReady = true;
                    });
  }

  cargarCitasRealizadasPaciente(){
    this.citaService.cargarCitasRealizadasUser(this.loginService.currentUser.external_id, this.desde)
                    .subscribe((response: any) => {
                      console.log(response);
                      this.citas = response.data.citas;
                      this.totalCitas = response.data.conteo;
                      this.citasReady = true;
                    });
  }

  cambiarDesde(valor: number) {
    const desde = this.desde + valor;
    if ( desde >= this.totalCitas){
      return;
    }
    if (desde < 0){
      return;
    }

    this.desde += valor;
    this.loadRole();
  }


  loadRole(){
    if (this.loginService.role === 'USER_ROLE'){
      this.esUser = true;
      this.cargarCitasRealizadasPaciente();
    }
    if (this.loginService.role === 'MED_ROLE'){
      this.esMed = true;
      this.cargarCitasRealizadasMedico();
    }
    this.mostrarCitas = true;
  }

  verDetallesCitaMed(cita: Cita){
    this.mostrarCitas = false;
    this.currentCita = cita;
    this.mostrarDetallesMed = true;
    this.currentPaciente = this.currentCita.paciente;
    // this.currentConsulta = this.currentCita.consulta;
  }

  verDetallesCitaUser(cita: Cita){
    this.mostrarCitas = false;
    this.currentCita = cita;
    this.mostrarDetallesUser = true;
    this.currentMedico = this.currentCita.medico;
    // this.currentConsulta = this.currentCita.consulta;
  }

  verCitasNuevamente(){
    this.mostrarCitas = true;
    this.desde = 0;
    this.loadRole();
    this.mostrarDetallesMed = false;
    this.mostrarDetallesUser = false;
    this.currentCita = null;
    this.currentPaciente = null;
    this.currentMedico = null;
  }
}
