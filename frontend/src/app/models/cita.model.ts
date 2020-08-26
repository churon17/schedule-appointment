import { Usuario } from './usuario.model';
import { Medico } from './med.model';
export class Cita {
    constructor(
      public medico: Medico,
      public paciente: Usuario,
      public fecha: string,
      public hora: string,
      public precioConsulta: number,
      public id?: string,
      public external_id?: string)
    {}
}
