const express = require('express');
const router = express.Router();

// importar express validator
const { body } = require('express-validator');

// importar el controlador
const proyectosControler = require('../controlers/proyectosControler');
const tareasControler = require('../controlers/tareasControler');
const usuariosControler = require('../controlers/usuariosControler');
const authControler = require('../controlers/authControler');

module.exports = function(){
    // ruta para el home

    router.get('/',authControler.usuarioAutenticado,
    proyectosControler.proyectosHome);
    router.get('/nuevo-proyecto',authControler.usuarioAutenticado,
    proyectosControler.formularioProyecto);
    router.post('/nuevo-proyecto',authControler.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().withMessage('El nombre es Obligatorio').escape(),
        proyectosControler.nuevoProyecto
        );

    //listar proyecto
    router.get('/proyectos/:url',authControler.usuarioAutenticado,
    proyectosControler.proyectoPorUrl);

    // Actualizar el proyecto
    router.get('/proyecto/editar/:id', authControler.usuarioAutenticado,
    proyectosControler.formularioEditar);
    router.post('/nuevo-proyecto/:id',authControler.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(),
        proyectosControler.actualizarProyecto
        );

    //Eliminar Proyecto

    router.delete('/proyectos/:url',authControler.usuarioAutenticado,
    proyectosControler.eliminarProyecto);

    // Tareas
    router.post('/proyectos/:url',authControler.usuarioAutenticado,
    tareasControler.agregarTarea)

    // Actualizar tarea
    router.patch('/tareas/:id', authControler.usuarioAutenticado,
    tareasControler.cambiarEstadoTarea);

    // Eliminar tarea
    router.delete('/tareas/:id', authControler.usuarioAutenticado,
    tareasControler.eliminarTarea);
    
    // Crear cta usuario
    router.get('/crear-cuenta',usuariosControler.formCrearCuenta);
    router.post('/crear-cuenta',usuariosControler.crearCuenta);
    router.get('/confirmar/:correo',usuariosControler.confirmarCuenta);

    // Iniciar sesión
    router.get('/iniciar-sesion',usuariosControler.formIniciarSesion);
    router.post('/iniciar-sesion',authControler.autenticarUsuario);
    
    // Cerrar sesión
    router.get('/cerrar-sesion',authControler.cerrarSesion);
    
    // Reestablecer password
    router.get('/reestablecer',usuariosControler.formReestablecerPassword);
    router.post('/reestablecer',authControler.enviarToken);
    router.get('/reestablecer/:token',authControler.validarToken);
    router.post('/reestablecer/:token',authControler.actualizarPassword);
    return router;
}
//export default router