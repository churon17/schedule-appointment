import { Injectable } from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor() { }

  showNormalError(error: any){
    Swal.fire('Error', error.error.mensaje, 'error');
  }

  showDetailedError(error: any){
    Swal.fire();
  }

  showSuccessMessage(message){
    Swal.fire('Correcto', message, 'success');
  }
}
