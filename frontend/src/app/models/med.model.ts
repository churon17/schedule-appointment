import { Persona } from './person.model';
import { Especialidad } from './especialidad.model';

export class  Medico extends Persona{

    constructor(
      public numeroRegistro: string,
      public citasDiarias: number,
      nombres: string,
      apellidos: string,
      cedula: string,
      edad: number,
      correo: string,
      password: string,
      direccion: string,
      genero: boolean,
      telefono: string,
      public sueldo: number,
      id?: string,
      external_id?: string,
      rol?: string,
      foto?: string,
      public especialidades?: Especialidad[]
    ){

      super(
        nombres,
        apellidos,
        cedula,
        edad,
        correo,
        password,
        direccion,
        genero,
        telefono,
        id,
        external_id,
        rol,
        foto,
      );
  }
}
