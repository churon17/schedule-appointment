import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from 'src/app/config/config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginService } from '../login/login.service';
import { SettingsService } from '../settings/settings.service';

@Injectable({
  providedIn: 'root'
})
export class EspecialidadService {

  readonly ESPECIALIDAD_URL = `${URL_SERVICIOS}/especialidad`;

constructor(
  public http: HttpClient,
  public loginService: LoginService,
  public settingService: SettingsService
  ) { }

  /**
   * Método que nos ayuda a establecer los headers dentro de cada petición
   * Especificamente establece el TOKEN del actual usuario
   */
  establecerHeaders(): any{
    const token = this.loginService.token;

    const headers = new HttpHeaders().set('token', token);

    return headers;
  }

  cargarEspecialidades(desde: number = 0){

    const headers = this.establecerHeaders();

    const url = `${this.ESPECIALIDAD_URL}/listar?desde=${desde}`;

    return this.http.get(url, { headers });
  }


  cargarEspecialidadesDistintas(external_id, desde: number = 0){

    const headers = this.establecerHeaders();

    const url = `${this.ESPECIALIDAD_URL}/listarEspecialidades/${external_id}?desde=${desde}`;

    return this.http.get(url, { headers });

  }

  listarMedicosPorEspecialidad(external_especialidad, desde){
    const headers = this.establecerHeaders();

    const url = `${this.ESPECIALIDAD_URL}/listarDeterminadaEspecialidad/${external_especialidad}?desde=${desde}`;

    return this.http.get(url, { headers  });
  }
}
