import { Component, OnInit } from '@angular/core';
import { MedicoService, EspecialidadService } from 'src/app/services/service.index';
import { Router } from '@angular/router';
import { Especialidad } from 'src/app/models/especialidad.model';
import { Medico } from '../../../models/med.model';
import { LoginService } from '../../../services/login/login.service';
import { CitaService } from 'src/app/services/cita/cita.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';

/**
 * Calendarios
 */
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

declare var $: any;

@Component({
  selector: 'app-solicitar-cita',
  templateUrl: './solicitar-cita.component.html',
  styles: []
})
export class SolicitarCitaComponent implements OnInit {

  /**
   * Calendario
   */
  calendarOptions: any = {
    validRange: {
      start: '2017-05-01',
      end: '2017-06-01'
    },
    plugins: [dayGridPlugin, interactionPlugin],
    dateClick: (info) => {
      this.seleccionarHorario(info);
    }
  };


  /**
   * Variables Necesarias
   */
  medicosPorEspecialidad: Medico[] = [];
  currentMedico: Medico;

  especialidades: Especialidad[] = [];
  currentEspecialidad: Especialidad;

  totalEspecialidades = 0;
  desde = 0;

  desdeMedicos = 0;
  totalMedicos = 0;

  especialistasReady = false;
  calendarReady: boolean;

  /*
  Variables para la Cita
  */
  fechaSeleccionada: string;
  horaSeleccionada = 'Seleccione una Hora';
  horasDisponibles = [];

  constructor(
    public medicoService: MedicoService,
    public router: Router,
    public especialidadService: EspecialidadService,
    public citaService: CitaService,
    public loginService: LoginService) { }

  ngOnInit() {
    this.cargarEspecialidades();
  }

  cargarEspecialidades() {

    this.especialidadService.cargarEspecialidades(this.desde)
      .subscribe((response: any) => {
        console.log(response);
        this.totalEspecialidades = response.data.conteo;
        this.especialidades = response.data.especialidades;
      });
  }

  cambiarDesde(valor: number) {
    const desde = this.desde + valor;
    if (desde >= this.totalEspecialidades) {
      return;
    }
    if (desde < 0) {
      return;
    }

    this.desde += valor;
    this.cargarEspecialidades();
  }

  cambiarDesdeMedicos(valor: number) {
    const desde = this.desdeMedicos + valor;
    if (desde >= this.totalMedicos) {
      return;
    }
    if (desde < 0) {
      return;
    }

    this.desdeMedicos += valor;
    this.cargarMedicosPorEspecialidad(this.currentEspecialidad);
  }

  mostrarEspecialistas(especialidad: Especialidad) {

    this.especialistasReady = true;
    this.currentEspecialidad = especialidad;
    this.cargarMedicosPorEspecialidad(especialidad);
  }

  cargarMedicosPorEspecialidad(especialidad) {
    this.especialidadService.listarMedicosPorEspecialidad(especialidad.external_id, this.desdeMedicos)
      .subscribe((response: any) => {
        this.totalMedicos = response.data.conteo;
        this.medicosPorEspecialidad = response.data.medicos;
      });
  }

  mostrarNuevamenteEspecialidades() {
    this.especialistasReady = false;
    this.currentEspecialidad = null;
    this.cargarEspecialidades();
  }

  mostrarNuevamenteEspecialistas() {
    this.calendarReady = false;
    this.cargarMedicosPorEspecialidad(this.currentEspecialidad);
  }


  /**
   * Cragar Calendario
   */
  mostrarCalendar(medicoSeleccionado: Medico) {
    this.currentMedico = medicoSeleccionado;
    this.cargarFechaCalendar();
    this.calendarReady = true;
  }

  cargarFechaCalendar() {
    this.calendarOptions.validRange = {
      start: this.getCurrentDate('INICIO'),
      end: this.getCurrentDate('FINAL')
    };
  }



  getCurrentDate(tipo: string): string {

    const fechaActual = new Date();

    const oneMonth = 1000 * 60 * 60 * 24 * 30;

    if (tipo === 'FINAL') {
      fechaActual.setTime(fechaActual.getTime() + oneMonth);
    }

    const month = fechaActual.getMonth() + 1;

    const currentMonth = month < 10 ? `0${month}` : `${month}`;

    const date = fechaActual.getDate();

    const currentDate = date < 10 ? `0${date}` : `${date}`;

    return `${fechaActual.getFullYear()}-${currentMonth}-${currentDate}`;
  }

  /**
   * Calendario
   */
  seleccionarHorario(info) { // handler method
    this.fechaSeleccionada = info.dateStr;

    this.citaService.cargarHorasDisponibles(this.fechaSeleccionada,
      this.currentMedico.external_id).subscribe((response: any) => {

        this.horasDisponibles = response.data;

        if (this.calendarOptions.validRange.start === this.fechaSeleccionada) {
          this.horasDisponibles = this.cargarHorasReales(this.horasDisponibles);
        }

        if (this.horasDisponibles.length === 0) {
          Swal.fire('Lo lamentamos', 'El médico seleccionado no tiene disponibilidad el día de hoy', 'warning');
          return;
        }else{
          $('#exampleModal').modal('show');
        }

        console.log('Horaaas Disponibleees', this.horasDisponibles);

    });
  }


  agendarCita() {
    console.log(this.horaSeleccionada);
    if (this.horaSeleccionada === 'Seleccione una Hora') {
      Swal.fire('Error', 'Por favor seleccione una hora', 'warning');
    }

    const response = `Esta a punto de agendar una cita el día ${this.fechaSeleccionada} a las ${this.horaSeleccionada}
      con el médico ${this.currentMedico.nombres} en la especialidad de ${this.currentEspecialidad.nombre}`;

    Swal.fire({
      title: '¿Está seguro?',
      text: response,
      icon: 'warning',
      buttons: true,
      dangerMode: true
    }).then(aceptar => {

      if (aceptar) {

        const citaBody = {
          medico: this.currentMedico.external_id,
          precioConsulta: this.currentEspecialidad.precioConsulta,
          fecha: this.fechaSeleccionada,
          hora: this.horaSeleccionada
        };

        this.citaService.crearCita(this.loginService.currentUser.external_id, citaBody).subscribe(res => {
          console.log(response);
          $('#exampleModal').modal('hide');
          this.router.navigate(['/citasDiarias']);
        });
      }
    });
  }

  cargarHorasReales(arreglo: string[]) {

    const horasFinalesDisponibles = [];

    const currentHour = new Date().getHours();

    arreglo.forEach(hora => {

      // tslint:disable-next-line: radix
      const base = parseInt(hora.split(':')[0]);

      if (currentHour < base) {
        horasFinalesDisponibles.push(hora);
      }
    });

    return horasFinalesDisponibles;
  }

}
