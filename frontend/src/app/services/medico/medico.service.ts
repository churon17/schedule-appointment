import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Medico } from '../../models/med.model';
import { URL_SERVICIOS } from 'src/app/config/config';
import { LoginService } from '../login/login.service';
import { SettingsService } from '../settings/settings.service';
import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  readonly MED_URL = `${URL_SERVICIOS}/medico`;

  constructor(
    public http: HttpClient,
    public loginService: LoginService,
    public subirImagenService: SubirArchivoService,
    public settingService: SettingsService) { }

  /**
   * Método para crear un nuevo médico, hace petición al servidor.
   * @param medico recibe como parámetro un objeto de tipo Médico
   */
  crearMedico(medico: Medico){

    const url = `${this.MED_URL}/ingresar`;

    const headers = this.establecerHeaders();

    return this.http.post(url, medico, {headers})
                    .pipe(map((response: any) => {

                      const mensaje = `Correo: ${response.data.correo}, la contraseña por defecto es la cédula`;

                      this.settingService.showSuccessMessage(mensaje);

                    }));
  }


  actualizarMédico(medico: Medico){

    const headers = this.establecerHeaders();

    const url = `${this.MED_URL}/modificar/${medico.external_id}`;

    console.log(url);

    return this.http.put(url, medico, {headers})
                    .pipe(map((res: any) => {

                      Swal.fire('Usuario actualizado', 'Se ha actualizado todo correctamente', 'success');
                      return true;

                    }));

  }

  cargarMedicoConEspecialidades(external){

    const headers = this.establecerHeaders();

    const url = `${this.MED_URL}/listarMedico/${external}`;

    return this.http.get(url, {headers});
  }

  cargarMedicos(desde: number){

    const headers = this.establecerHeaders();

    const url = `${this.MED_URL}/listar?desde=${desde}`;

    return this.http.get(url, {headers});
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

  /**
   * Permite vrificar si la cédula ya existe en el servidor
   * @param cedula parámetro necesario para comparar
   */
  verifyCedula(cedula: string) {

    const url = `${this.MED_URL}/verifyCedula/${cedula}`;

    return this.http.get(url);
  }
}
