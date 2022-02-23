const passport = require('passport');
const Usuarios = require('../models/usuarios');
const crypto = require('crypto');
const sequelize  = require('sequelize');
const bcrypt = require('bcrypt-nodejs');
const Op = sequelize.Op
const enviarEmail = require('../handlers/email');

exports.autenticarUsuario = passport.authenticate('local',{
    successRedirect: '/',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos campos son obligatorios'
});

// Función revisar si Usr esta autenticado
exports.usuarioAutenticado = (req,res, next) => {
// Si esta autenticado adelante
if(req.isAuthenticated()) {
    return next();
}
// Si no esta autenticado
return res.redirect('/iniciar-sesion');
} 

//Función para cerrar sesión
exports.cerrarSesion = (req,res) => {
    req.session.destroy(()=>{
        res.redirect('/iniciar-sesion');
    })
}

// Genera Token si Usr es valido
exports.enviarToken = async (req,res) => {
    // Validar si existe Usr
    const {email} = req.body
    const usuario = await Usuarios.findOne({where: { email }});
    
    // Si no hay usuario
    if(!usuario) {
        req.flash('error', 'No existe usuario');
        res.redirect('/reestablecer');
    }

    // Generrar Token
    usuario.token = crypto.randomBytes(20).toString('hex');
    usuario.expiracion = Date.now() + 3600000;

    // Guardar token
    await usuario.save();

    const reseturl = `http://${req.headers.host}/reestablecer/${usuario.token}`;
   // console.log(reseturl)

    // Enviar correo con el token
    await enviarEmail.enviar({
        usuario,
        subject: 'Password Reset',
        reseturl,
        archivo: 'reestablecer-password'
    });

    // Terminar envío
    req.flash('correcto', 'Se envió correo, revisar...');
    res.redirect('/iniciar-sesion');
}

exports.validarToken = async (req,res) => {
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token
        }
    });

    // Si no hay Usr

    if(!usuario) {
        req.flash('error', 'No valido');
        res.redirect('/reestablecer');
    }

    // Formulario para generar uevo password
    res.render('resetPassword', {
        nombrePagina: 'Reestabler nuevo password'
    });
}
// Cambiar el nuevo password
exports.actualizarPassword = async (req, res) => {
    // Verifica el token y fecha expiración
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token,
            expiracion: {
                [Op.gte] : Date.now()
            }
        }
    });
    if(!usuario) {
        req.flash('error', 'No valido');
        res.render('/reestablecer');
    }

    // Hashear password
    usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    usuario.token = null;
    usuario.expiracion = null;

    await usuario.save();

    req.flash('correcto', 'Tu password se ha cambiado');
    res.redirect('/iniciar-sesion');

}