const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// Referencia al Modelo en donde se autentica un usuario
const Usuarios = require('../models/usuarios');

// Local strategy . login y pass
passport.use(
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email,password,done) => {
            try {
                const usuario = await Usuarios.findOne({
                    where: { 
                        email,
                        activo: 1
                    }
                });
                console.log(usuario);
                // Si password incorrecto
                if(!usuario.verificarPassword(password)){
                    return done(null,false,{
                        message: 'Password incorrecto'
                    })
                }
                return done(null,usuario);
            } catch (error) {
                return done(null,false,{
                    message: 'Esa cuenta no existe'
                })
            }
        }
    )
);

// Serializar el usuario
passport.serializeUser((usuario,callback) =>{
    callback(null,usuario);
})
// Deserializar el usuario
passport.deserializeUser((usuario,callback) => {
    callback(null,usuario);
});

module.exports = passport;