/*===================================
Libraries
=====================================*/
let mongoose = require('mongoose');
let unique_validator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let usuarioSchema = new Schema(
	{	
		external_id : {
		type : String,
		required : true
		},
		estado : {
				type : Boolean,
				required : [true, 'Se requiere el estado']
		},
		userName : {
			type: String,
			required: true,
			unique: true
		},
		nombresProp : {
			type: String,
			required: [true, 'Los nombres del propietario de la mascota es necesario'],
		},
		nombres : {
			type : String,
			required : [true, 'Nombres de la mascota es necesario']
		},
		edad : {
			type : Number,
			required : [true, 'La edad de la mascota es necesaria']
		},
		genero : {
			type : Boolean,
			required : [true, 'El género de la mascota es necesario']
		},
		telefono : {
			type : String,       
			required : [true, 'El teléfono del proietario de la mascota es necesario']
		},
		direccion : {
				type : String,
				required : [true, 'La dirección de la mascota es necesaria']
		},
		password : {
			type : String,
			required : [true, 'La contraseña del propietario de la mascota es necesaria']
		},
		foto : {
				type : String,
				required : false
		},
		correo : {
			type : String,
			required : [true, 'El correo del propietario de la  mascota es necesario']
		},
		citas: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Cita'
			}
		],
		rol : 
		{
				type: Schema.Types.ObjectId,
				ref : 'Rol' 
		},       
		created_At : {
				type : Date,
				required : [true, 'El created_At es requerido']
		},
		updated_At : {
				type : Date,
				required : [true, 'El updated_At es requerido']
		}
	}
);

usuarioSchema.plugin(unique_validator, { message: '{PATH} debe de ser único' });

usuarioSchema.methods.toJSON = function () {
	let usuario = this;
	let usuarioObject = usuario.toObject();
	delete usuarioObject.password;
	delete usuarioObject.created_At;
	delete usuarioObject.updated_At;
	delete usuarioObject.rol;
	delete usuarioObject.estado;
	return usuarioObject;
}

module.exports = mongoose.model('Usuario', usuarioSchema);

