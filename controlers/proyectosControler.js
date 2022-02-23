const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/tareas');


exports.proyectosHome = async (req,res)=>{
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({
        where: { usuarioId}
    });
    
    res.render('index',{
        nombrePagina : 'Proyectos',
        proyectos
    });
}

exports.formularioProyecto = async (req,res)=>{
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll();
    res.render('nuevoProyecto',{
        nombrePagina: 'Nuevo Proyecto',
        proyectos
    })
}

exports.nuevoProyecto = async (req,res)=>{
    // Enviar a la consola lo escrito
    //console.log(req.body);
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll();
    //Validar que existe algo en el body
    const {nombre} = req.body;
    let errores = [];
    if(!nombre){
        errores.push({'texto': 'Agregar un nombre'})
    }
    
    // si hay errores
    if(errores.length > 0 ){
        
       res.render('nuevoProyecto',{
           nombrePagina : 'Nuevo Proyecto',
           errores,
           proyectos
        })
    }else {
        // Si no hay errores
        // Insertar el dato en BD
        //insertar valores en un string ej: const url = slug(nombre).toLowerCase();
        const usuarioId = res.locals.usuario.id;
        await Proyectos.create({nombre,usuarioId});
        res.redirect('/');
    }
    
}

exports.proyectoPorUrl = async (req, res, next) => {
    const usuarioId = res.locals.usuario.id;
    const proyectosPromise = Proyectos.findAll({where: { usuarioId}});

    const proyectoPromise = Proyectos.findOne({
        where: {
            url: req.params.url,
            usuarioId
        }
    });

    const [proyectos,proyecto] = await Promise.all([proyectosPromise,proyectoPromise]);

    // Consultar tareas por proceso actual
    const tareas = await Tareas.findAll({
        where: {
            proyectoId: proyecto.id
        },
        include:[
            {model:Proyectos}
        ]
            
    });

   
    if(!proyecto) return next();
    // render a la vista de tareas
    res.render('tareas',{
        nombrePagina : 'Tareas del Proyecto',
        proyectos,
        proyecto,
        tareas
    })
}

exports.formularioEditar = async (req,res)=>{
    const proyectosPromise = Proyectos.findAll();

    const proyectoPromise = Proyectos.findOne({
        where: {
            id: req.params.id
        }
    });

    const [proyectos,proyecto] = await Promise.all([proyectosPromise,proyectoPromise]);
    res.render('nuevoProyecto',{
        nombrePagina : 'Editar Proyecto',
        proyectos,
        proyecto
    })
}
exports.actualizarProyecto = async (req,res)=>{
    // Enviar a la consola lo escrito
    //console.log(req.body);
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll();
    //Validar que existe algo en el body
    const {nombre} = req.body;
    let errores = [];
    if(!nombre){
        errores.push({'texto': 'Agregar un nombre'})
    }
    
    // si hay errores
    if(errores.length > 0 ){
        
       res.render('nuevoProyecto',{
           nombrePagina : 'Nuevo Proyecto',
           errores,
           proyectos
        })
    }else {
        // Si no hay errores
        // Insertar el dato en BD
        //insertar valores en un string ej: const url = slug(nombre).toLowerCase();
        await Proyectos.update(
            {nombre: nombre},
            {where: {id: req.params.id}}
            );
        res.redirect('/');
    }
    
}

exports.eliminarProyecto = async(req,res,next) => {
    //console.log(req);
    const {urlProyecto} = req.query;
    const resultado = await Proyectos.destroy({where: { url : urlProyecto}});
    if(!resultado){
        return next();
    }
    res.status(200).send('Proyecto eliminado');
}