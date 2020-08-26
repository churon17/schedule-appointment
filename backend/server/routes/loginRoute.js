/*===================================
Libraries
=====================================*/
const BCRYPT = require('bcryptjs');
let express =  require('express');
const JWT = require('jsonwebtoken');
let under_score = require('underscore');
/*===================================
Models
=====================================*/
let Medico = require('../models/medico/medico');
let Usuario = require('../models/usuario');
/*===================================
Own
=====================================*/
let helpers = require('../helpers/functions');

/*===================================
Variables
=====================================*/
const APP = express();
let  { verifyToken } = require('../middlewares/authentication');


/*===================================
Renovar Token
=====================================*/
APP.get('/renuevaToken', verifyToken, (request, response)=>{

    let token = JWT.sign({
        usuario : request.usuario
    }, process.env.SEED, {expiresIn : process.env.EXPIRES});

    let finalUser = {
        user : request.usuario,
        token,
        menu : obtenerMenu(request.usuario.role)
    }

    return helpers.successMessage(response, 200,finalUser) ;
});

/*===================================
Login
Params:
    -userName,
    -password
=====================================*/
APP.post('/', (request, response)=>{

    let body = infoBody(request.body);

    if(!body.userName || !body.password){
        return helpers.errorMessage(response, 400, "Se necesita toda la información");
    }

    const USERNAME = body.userName;
    const PASSWORD = body.password;

    const CURRENT_ROLE = helpers.verifyRole(USERNAME);
    
    let currentPerson = CURRENT_ROLE === process.env.MED_ROLE ? Medico : Usuario;

    let getOptions = {};

    if (CURRENT_ROLE === process.env.MED_ROLE ){
        getOptions = {
            'estado': true, 
            'correo' : USERNAME
        }
    }else{
        getOptions = {
            'estado': true, 
            'userName' : USERNAME
        }
    }

    currentPerson.findOne(getOptions, (error, person) =>{

        if(error){
            return helpers.errorMessage(response, 500, "Ocurrió un error al loguearse", error);
        }

        if(!person){
            return helpers.errorMessage(response, 400, "(Username) o contraseña incorrectas");
        }

        if(!BCRYPT.compareSync(PASSWORD, person.password)){
            return helpers.errorMessage(response, 400, "Username o (contraseña) incorrectas");
        }   

        let user = {
            role : CURRENT_ROLE,
            person
        }

        let token = JWT.sign({
            usuario : user
        }, process.env.SEED, {expiresIn : process.env.EXPIRES});

        let finalUser = {
            user,
            token,
            menu : obtenerMenu(CURRENT_ROLE)
        }

        return helpers.successMessage(response, 200, finalUser);
    });
});


APP.post('/google', async(request, response) =>{

    let email = request.body.email;
    let nombre = request.body.nombre;
    let foto = request.body.foto;

    Usuario.findOne( {'estado' : true, 'correo' : email}, (error, usuarioEncontrado) =>{

        if(error){
            return helpers.errorMessage(response, 500, "Ocurrió un error al loguearse", error);
        }

        if(usuarioEncontrado){
            let user = {
                role : process.env.USER_ROLE,
                person : usuarioEncontrado
            }

            let token = JWT.sign({
                usuario : user
            }, process.env.SEED, {expiresIn : process.env.EXPIRES});

            let finalUser = {
                message : "YES",
                user,
                token,
                menu : obtenerMenu(process.env.USER_ROLE)
            }

            return helpers.successMessage(response, 200, finalUser);

        }else{
            let usuario = {};
            usuario.nombre = nombre;
            usuario.email = email;
            usuario.foto = foto;
            
            let finalUser = {
                message : "NO",
                usuario
            }  
            return helpers.successMessage(response, 200, finalUser);
        }
    });
});

/*===================================
Métodos Auxiliares
=====================================*/
let infoBody = (body) => {
    
    return under_score.pick(body, 
                            [
                            'userName', 
                            'password',
                            ]);
}


function obtenerMenu(rol){
    menu = [
        {
            titulo : 'Principal',
            icono : 'mdi mdi-gauge',
            submenu : [
                { titulo : 'Dashboard', url: '/dashboard'},     
            ]
        },
        {
            titulo : 'Citas',
            icono : 'fa fa-address-book',
            submenu : [
                { titulo : 'Citas', url: '/citas'},
                { titulo : 'Citas Diarias', url: '/citasDiarias'},
                { titulo : 'Citas Realizadas', url: '/citasRealizadas'}
            ]
        },
    ];

    if(rol === process.env.USER_ROLE){
        menu[1].submenu.unshift({ titulo : 'Agendar Cita', url: '/solicitarCita'});
    }

    return menu;
}
module.exports = APP;



