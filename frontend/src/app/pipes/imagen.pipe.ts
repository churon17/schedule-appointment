import { Pipe, PipeTransform } from '@angular/core';
import { URL_SERVICIOS } from '../config/config';

@Pipe({
  name: 'imagen'
})
export class ImagenPipe implements PipeTransform {

  transform(image: string, tipo : string = "usuario"): any {
    
    let url = `${URL_SERVICIOS}/img`;

    if(!image){
      return `${url}/usuario/xxx`;
    }

    if(image.indexOf('https')>= 0){
      return image;
    }

    switch (tipo) {
      case 'usuario':
        url = `${url}/usuarios/${image}`;
        break;
      case 'admin':
        url = `${url}/admin/${image}`;
        break;
      case 'medico':
        url = `${url}/medicos/${image}`;
        break;
      default:
        console.log("Tipo de imagen no existe");
        url = `${url}/usuario/xxx`;
        break;
    }
    return url;
  }

}
