import validator from 'validator'

export const validarArticulo = (parametros) => {
  const validarTitulo = !validator.isEmpty(parametros.titulo)
  const validarContenido = !validator.isEmpty(parametros.contenido)

  if (!validarContenido || !validarTitulo) {
    throw new Error('No se ha validado la informacion !!')
  }
}
