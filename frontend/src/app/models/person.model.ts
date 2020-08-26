export class Persona {

    constructor(
        public nombres : string,
        public apellidos : string,
        public cedula : string,
        public edad : Number,
        public correo : string,
        public password : string,
        public direccion : string,
        public genero : Boolean,
        public telefono : string,
        public id? : string,
        public external_id? : string,
        public rol? : string,
        public foto?: string
    ){

    }


}