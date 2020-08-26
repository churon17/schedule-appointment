/**
 * Used Libraries
 */
let express =  require('express');


/**
 * Impor Routes files
 */
let rolRoutes = require('./rolRoute');
let usuarioRoutes = require('./usuarioRoute');
let medicoRoutes = require('./medicoRoutes/medicoRoute');
let especialidadRoute  = require('./medicoRoutes/especialidadRoute');
let citaRoute = require('./citaRoute');
let loginRoute = require('./loginRoute');
let uploadRoute = require('./uploadRoute');
let imageRoute = require('./imageRoute');

let APP = express();

/**
 * Routes
 */
APP.use('/rol', rolRoutes);
APP.use('/persona', usuarioRoutes);
APP.use('/medico', medicoRoutes);
APP.use('/especialidad', especialidadRoute);
APP.use('/cita', citaRoute);
APP.use('/login',loginRoute );
APP.use('/upload', uploadRoute);
APP.use('/img', imageRoute);

module.exports = APP;

