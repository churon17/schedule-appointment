import { Persona } from './person.model';

export class  Usuario extends Persona{

    constructor(  nombres : string,
         apellidos : string,
         cedula : string,
         edad : Number,
         correo : string,
         password : string,
         direccion : string,
         genero : Boolean,
         telefono : string,
         id? : string,
         external_id? : string,
         rol? : string,
         foto?: string,
         ){

        super(nombres, 
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
            foto
        );
    }
    



}