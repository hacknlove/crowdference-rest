const Joi = require('joi')

module.exports = function (server) {

  server.regexs = {
    testUrl: /^(https?:\/\/)?[\da-z-]+\.+[\da-z-.]+([/?#][^ ]*)?$/i
  }

  server.validations = {
    testUrl: Joi.string().regex(server.regexs.testUrl).required()
  }

  server.end = function end (codigo, mensaje, res) {
    if (process.env.NODE_ENV === 'development') {
      console.log(codigo, mensaje)
      const err = new Error()
      console.error(err.stack)
    }
    res.status(codigo).json({
      error: mensaje
    })
    res.end()
  }

  server.validate = function (opciones, res, next) {
    const validacion = Joi.validate(opciones.data, opciones.schema)
    if (!validacion.error) {
      return next()
    }
    opciones = Object.assign({
      codigo: 400,
      mensaje: validacion.error.details[0].message
    }, opciones)
    if (opciones.debug) {
      opciones.debug.details = validacion.error.details
      opciones.debug._object = validacion.error._object
    }
    server.end(opciones.codigo, opciones.mensaje, res)
  }
}
