/*===================================
Libraries
=====================================*/
const BCRYPT = require('bcryptjs');
let express = require('express');
let under_score = require('underscore');
const { v4: UUID } = require('uuid');
/*===================================
Models
=====================================*/
let Rol = require('../models/rol');
let Usuario = require('../models/usuario');
/*===================================
Own
=====================================*/
let helpers = require("../helpers/functions");
let { verifyToken, verifyUser } = require('../middlewares/authentication');

/*===================================
Variables
=====================================*/
const APP = express();

/*===================================
Listar todos la lista de personas activas
=====================================*/
APP.get('/mostrarPersona/:external_id', (request, response) => {

	let external_id = request.params.external_id;

	Usuario.findOne({ 'estado': true, 'external_id': external_id })
		.populate({
			path: 'citas',
			match: { 'estado': true }
		})
		.exec((error, usuarioEncontrado) => {

			if (error) {
				return helpers.errorMessage(response, 500, 'Error al obtener la lista de mascotas', error);
			}

			if (!usuarioEncontrado) {
				return helpers.errorMessage(response, 400, 'No existe la mascota');
			}
			return helpers.successMessage(response, 200, usuarioEncontrado);
		});
});

/*===================================
Ingresar una nueva mascota 
required Params:
nombres, edad, genero
telefono, direccion, correo, password, 
optional Params:
foto
=====================================*/
APP.post('/ingresar', (request, response) => {

	let usuarioBody = infoBody(request.body);

	if (under_score.isEmpty(usuarioBody)) {
		return helpers.errorMessage(response, 400, 'Ingrese los parámetros necesarios de la persona');
	}

	Rol.findOne({ 'nombre': 'USER_ROLE' }, (error, rolEncontrado) => {

		if (error) {
			return helpers.errorMessage(response, 500, 'Error en el servidor', error);
		}
		if (!rolEncontrado) {
			return helpers.errorMessage(response, 400, 'No se ha encontrado el rol');
		}
		if (usuarioBody.password) {
			usuarioBody.password = BCRYPT.hashSync(usuarioBody.password, 10);
		}

		usuarioBody.external_id = UUID();
		usuarioBody.estado = true;
		usuarioBody.created_At = new Date();
		usuarioBody.updated_At = new Date();
		usuarioBody.rol = rolEncontrado.id;

		let usuario = new Usuario(usuarioBody);

		usuario.save((error, usuarioGuardado) => {

			if (error) {
				return helpers.errorMessage(response, 400, 'Error al guardar la persona', error);
			}

			return helpers.successMessage(response, 201, usuarioGuardado);
		});
	});

});

/*===================================
Modificar una mascota existente.
external_id del usuario
optional Params:
nombres, edad, genero, telefono
dirección, password, foto
=====================================*/
APP.put('/modificar/:external_id', [verifyToken, verifyUser], (request, response) => {

	let external_id = request.params.external_id;

	let usuarioBody = request.body;

	if (under_score.isEmpty(usuarioBody)) {
		return helpers.errorMessage(response, 400, 'No hay nada que modificar');
	}

	Usuario.findOne({ 'external_id': external_id, 'estado': true }, (error, usuarioEncontrado) => {

		if (error) {
			return helpers.errorMessage(response, 500, 'Error en el servidor', error);
		}
		if (!usuarioEncontrado) {
			return helpers.errorMessage(response, 400, 'No se ha encontrado la persona');
		}

		usuarioEncontrado.nombres = usuarioBody.nombres || usuarioEncontrado.nombres;
		usuarioEncontrado.edad = usuarioBody.edad || usuarioEncontrado.edad;
		usuarioEncontrado.genero = usuarioBody.genero || usuarioEncontrado.genero;
		usuarioEncontrado.telefono = usuarioBody.telefono || usuarioEncontrado.telefono;
		usuarioEncontrado.direccion = usuarioBody.direccion || usuarioEncontrado.direccion;
		usuarioEncontrado.correo = usuarioBody.correo || usuarioEncontrado.correo;
		usuarioEncontrado.nombresProp = usuarioBody.nombresProp || usuarioEncontrado.nombresProp;
	
		if (usuarioBody.password) {
			usuarioEncontrado.password = BCRYPT.hashSync(usuarioBody.password, 10);
		}
		usuarioEncontrado.foto = usuarioBody.foto || usuarioEncontrado.foto;
		usuarioEncontrado.updated_At = new Date();

		usuarioEncontrado.save((error, usuarioModificado) => {
			if (error) {
				return helpers.errorMessage(response, 400, 'Error al modificar la persona', error);
			}
			return helpers.successMessage(response, 200, usuarioModificado);
		});
	});
});


APP.get('/verifyUserName/:userName', (request, response) => {

	let userName = request.params.userName;

	Usuario.findOne({ 'estado': true, 'userName': userName }, (error, userNameEncontrado) => {

		if (error) {
			return helpers.errorMessage(response, 500, 'Sucedio un error', error);
		}
		if (!userNameEncontrado) {
			let send = {
				equal: false
			}

			return helpers.successMessage(response, 200, send);
		} else {
			let send = {
				equal: true,
				mensaje: 'El userName ya existe'
			}
			return helpers.successMessage(response, 200, send);
		}
	});
});


/******************************************************************************************************
                                    Métodos Auxiliares
*******************************************************************************************************/
let infoBody = (body) => {

	return under_score.pick(body,
		[	
			'userName',
			'nombres',
			'edad',
			'genero',
			'telefono',
			'direccion',
			'correo',
			'password',
			'foto',
			'nombresProp'
		]);
}

module.exports = APP;