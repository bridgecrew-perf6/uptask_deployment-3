const nodemailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice');
const htmlToText = require('html-to-text');
const util = require('util');
const emailConfig = require('../config/email');

let transport = nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    auth: {
      user: emailConfig.user, // generated ethereal user
      pass: emailConfig.pass // generated ethereal password
    }
  });
// generar HTML para correo
const generarHTML = (archivo, opciones = {}) => {
    const html = pug.renderFile(`${__dirname}/../views/emails/${archivo}.pug`, opciones)
    // pug.renderFile(``);
    return juice(html);
}
exports.enviar = async (opciones) => {
    // send mail with defined transport object
    const html = generarHTML(opciones.archivo, opciones);
    const text = htmlToText.fromString(html);
    let info = {
        from: 'UpTask <no-reply@uptask.com>', // sender address
        to: opciones.usuario.email, 
        subject: opciones.subject, 
        text, 
        html
    };

    const enviarEmail = util.promisify(transport.sendMail, transport);
    return enviarEmail.call(transport, info);
    
}
  

  
