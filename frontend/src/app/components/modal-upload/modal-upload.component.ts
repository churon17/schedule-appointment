import { Component, OnInit } from '@angular/core';
import { SubirArchivoService } from '../../services/subir-archivo/subir-archivo.service';
import { ModalUploadService } from './modal-upload.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-modal-upload',
  templateUrl: './modal-upload.component.html',
  styles: []
})
export class ModalUploadComponent implements OnInit {

  imagenSubir: File;

  imagenTemp: string;

  constructor(public subirArchivoService: SubirArchivoService,
              public modalUploadService: ModalUploadService) {
    console.log('Modal listo');
  }

  ngOnInit() {
  }

  seleccionImagen(file: File){
    if (!file){
      this.imagenSubir = null;
      return;
    }

    if (file.type.indexOf('image') < 0){
      Swal.fire('Error', 'Por favor selecciona una imagen', 'error');
      this.imagenSubir = null;
      return;
    }

    this.imagenSubir = file;

    const reader = new FileReader();

    const urlImagenTemp = reader.readAsDataURL(file);

    reader.onloadend = () => this.imagenTemp = reader.result.toString();
  }

  subirImagen(){
    this.subirArchivoService.subirArchivo(this.imagenSubir, this.modalUploadService.tipo, this.modalUploadService.id )
                            .then(response => {
                                this.modalUploadService.notificacion.emit(response);
                                this.cerrarModal();
                            })
                            .catch(error => {
                              console.log('Error en la carga');
                              this.cerrarModal();
                            });
  }

  cerrarModal(){
    this.imagenTemp = null;
    this.imagenSubir = null;

    this.modalUploadService.ocultarModal();
  }

}
