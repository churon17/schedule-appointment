import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SettingsService } from '../settings/settings.service';
import { URL_SERVICIOS } from 'src/app/config/config';
import { LoginService } from '../login/login.service';
import { Cita } from 'src/app/models/cita.model';

@Injectable({
  providedIn: 'root'
})
export class CitaService {

  currentCita: Cita;

  readonly CITA_URL = `${URL_SERVICIOS}/cita`;

  constructor(
    private http: HttpClient,
    private settingService: SettingsService,
    private loginService: LoginService) {

      this.currentCita = JSON.parse(localStorage.getItem('cita'));
  }

  /**
   * Método que nos ayuda a establecer los headers dentro de cada petición
   * Especificamente establece el TOKEN del actual usuario
   */
  establecerHeaders(): any{
    const token = this.loginService.token;

    const headers = new HttpHeaders().set('token', token);

    return headers;
  }

  crearCita(external_usuario: string, cita: any){

    const headers = this.establecerHeaders();

    const url = `${this.CITA_URL}/ingresar/${external_usuario}`;

    return this.http.post(url, cita, {headers});
  }

  cargarHorasDisponibles(fecha, external_medico){

    const headers = this.establecerHeaders();

    const url = `${this.CITA_URL}/horasDisponibles/${external_medico}`;

    const body = {
        fecha
    }

    return this.http.post(url, body, {headers});
  }

  cargarTodasLasCitasPaciente(external_paciente, desde: number){

    const headers = this.establecerHeaders();

    const url = `${this.CITA_URL}/listarCitasPaciente/${external_paciente}?desde=${desde}`;

    return this.http.get(url, {headers});
  }

  cargarTodasLasCitasMedico(external_medico, desde: number){

    const headers = this.establecerHeaders();

    const url = `${this.CITA_URL}/listarCitas/${external_medico}?desde=${desde}`;

    return this.http.get(url, {headers});
  }


  cargarCitasDiariasMedico(external_medico, desde: number){

    const headers = this.establecerHeaders();

    const url = `${this.CITA_URL}/listarCitasDiariasMed/${external_medico}?desde=${desde}`;

    return this.http.get(url, {headers});
  }

  cargarCitasDiariasPaciente(external_paciente, desde: number){

    const headers = this.establecerHeaders();

    const url = `${this.CITA_URL}/listarCitasDiariasPaciente/${external_paciente}?desde=${desde}`;

    return this.http.get(url, {headers});
  }

  asistenciaNula(external_cita){
    const headers = this.establecerHeaders();

    const url = `${this.CITA_URL}/asistencia/${external_cita}`;

    return this.http.put(url, null, {headers});
  }

  registrarCita(external_cita){
    const headers = this.establecerHeaders();

    const url = `${this.CITA_URL}/realizarCita/${external_cita}`;

    return this.http.put(url, null, {headers});
  }


  cargarCitasRealizadasMedico(external_medico, desde: number){
    const headers = this.establecerHeaders();

    const url = `${this.CITA_URL}/listarCitasRealizadas/${external_medico}?desde=${desde}`;

    return this.http.get(url, {headers});
  }

  cargarCitasRealizadasUser(external_user, desde: number){
    const headers = this.establecerHeaders();

    const url = `${this.CITA_URL}/listarCitasRealizadasUser/${external_user}?desde=${desde}`;

    return this.http.get(url, {headers});
  }

}
