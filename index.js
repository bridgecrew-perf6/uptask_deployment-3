const express = require('express');
const req = require('express/lib/request');
const res = require('express/lib/response');
const routes = require('./routes');
const path = require('path');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');
// Importar variables env
require('dotenv').config({path: 'variables.env'});

// helpers con funciones
const helpers = require('./helpers');

// Crear la conexión a la BD
const db = require('./config/db');

// Importar el modelo
require('./models/Proyectos');
require('./models/Tareas');
require('./models/usuarios')

db.sync()
    .then(()=>console.log('Conectado al server'))
    .catch(error=>console.log(error))
// crear una app de express
const app = express();

// donde cargar los archivos estatidos
app.use(express.static('public'));

// habilitar pug
app.set('view engine','pug');

// Habilitar bodyparser para leer datos del formulario
app.use(bodyParser.urlencoded({extended:true}));

// Añadir la carpeta de las vistas
app.set('views',path.join(__dirname,'./views'));

// Agregar Flash messages
app.use(flash());

app.use(cookieParser());

// Agregar Express session para navegar
app.use(session({
    secret: 'supersecreto',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// pasar var dump

app.use((req,res,next)=>{
    console.log(req.user);
    res.locals.vardump = helpers.vardump;
    res.locals.mensajes = req.flash();
    res.locals.usuario = {...req.user} || null;
    next();
});

app.use('/', routes());

// Servidor y Puerto
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;

app.listen(port, host, () => {
    console.log('El servidor esta funcionando');
});