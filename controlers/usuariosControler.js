const Usuarios = require('../models/usuarios')
const enviarEmail = require('../handlers/email');
exports.formCrearCuenta = (req,res) => {
    res.render('crearCuenta',{
        nombrePagina: 'Crear Cta Usuario'
    })
}

exports.formIniciarSesion = (req,res) => {
    const { error } = res.locals.mensajes;
    res.render('iniciarSesion',{
        nombrePagina: 'Inicar sesión de Usuario',
        error
    })
}
exports.crearCuenta = async (req,res) => {
    // Leer datos formulario
    const { email,password} = req.body;

    try {
        // Crear el usuario en BD
        await Usuarios.create({
        email,
        password
        });

        // Crear una URL de confirmación
        const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`;

        // Crear el objeto de usuario
        const usuario = {
            email
        }
        
        // Enviar email
        await enviarEmail.enviar({
            usuario,
            subject: 'Confirma tu cuenta UpTast',
            confirmarUrl,
            archivo: 'confirmar-cuenta'
        });
        //console.log(enviarEmail);
        // Redirigir al usuario
        req.flash('correcto', 'Se envió correo, confirmando tu cuenta');
        res.redirect('/iniciar-sesion');

    } catch (error) {
        req.flash('error', error.errors.map(error => error.message));
        res.render('crearCuenta', {
            mensajes: req.flash(),
            nombrePagina : 'Cuenta ya existe, cambiar',
            email,
            password
        })
    }
}
exports.formReestablecerPassword = (req,res) => {
    res.render('reestablecer', {
        nombrePagina: 'Reestablecer tu password'
    })
}
// Cambiar el estado de una cuenta usr
exports.confirmarCuenta = async (req,res) => {
    const usuario = await Usuarios.findOne({
        where: {
            email: req.params.correo
        }
    });

    if(!usuario) {
        req.flash('error','No valido')
        res.redirect('/crear-cuenta');
    }

    usuario.activo = 1;
    await usuario.save();

    req.flash('correcto', 'Cuenta activada');
    res.redirect('/iniciar-sesion');
}