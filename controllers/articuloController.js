import ArticuloSchema from '../models/ArticuloSchema.js'
import { validarArticulo } from '../helpers/validar.js'
import fs from 'fs'
import path from 'path'

export const prueba = (_req, res) => {
  return res.status(200).json({
    msg: 'Soy una acción de prueba en mi controlador articulos'
  })
}

export const curso = (_req, res) => {
  return res.status(200).json([
    {
      curso: 'Master en react',
      autor: 'Victor Robles WEB',
      url: 'victorrovles.es/master-react'
    },
    {
      curso: 'Master en angular',
      autor: 'Victor Robles WEB',
      url: 'victorrovles.es/master-anguular'
    }
  ])
}

export const crear = async (req, res) => {
  // Recoger parametros por post a guardar
  const parametros = req.body
  // Validar datos
  try {
    validarArticulo(parametros)
  } catch (error) {
    return res.status(400).json({
      status: 'error',
      msg: 'Faltan datos por enviar'

    })
  }

  // Crear el objeto al guardar
  const articulo = new ArticuloSchema(parametros)

  // Asignar valores a objeto basado en el modelo (manual o automatico)
  // AUTOMATICO

  // Guardar articulo en la base de datos
  try {
    const articuloGuardado = await articulo.save()

    // Devolver resultado
    return res.status(200).json({
      status: 'success',
      parametros: articuloGuardado,
      msg: 'Artículo creado con exito'
    })
  } catch (error) {
    return res.status(400).json({
      status: 'error',
      msg: 'Nos se ha guardado el artículo'

    })
  }
}

export const listar = async (req, res) => {
  try {
    const articles = await ArticuloSchema.find({}).limit(req.params.ultimos ? req.params.ultimos : '').sort({ fecha: -1 }).exec()

    if (!articles || articles.length === 0) {
      return res.status(404).json({
        status: 'error',
        msg: "Couldn't find articles"
      })
    }

    return res.status(200).send({
      status: 'success',
      msg: '',
      parametroUrl: req.params.ultimos | '',
      articles
    })
  } catch (error) {
    return res.status(400).json({
      status: 'error',
      msg: 'An error occurred while fetching articles'
    })
  }
}

export const uno = async (req, res) => {
  const id = req.params.id

  // Buscar el articulo en la base de datos
  try {
    const articulo = await ArticuloSchema.findById(id).exec()

    return res.status(200).send({
      status: 'success',
      msg: '',
      article: articulo
    })
  } catch (error) {
    return res.status(404).json({
      status: 'error',
      error,
      msg: 'An error occurred while fetching article'
    })
  }
}
export const borrar = async (req, res) => {
  const id = req.params.id

  // Buscar el articulo en la base de datos
  try {
    const articulo = await ArticuloSchema.findOneAndDelete({ _id: id }).exec()

    return res.status(200).send({
      status: 'success',
      msg: 'Articulo borrado',
      article: articulo
    })
  } catch (error) {
    return res.status(404).json({
      status: 'error',
      error,
      msg: 'Error al intertar borrar el articulo'
    })
  }
}

export const actualizar = async (req, res) => {
  const id = req.params.id

  // Recoger parametros por post a guardar
  const parametros = req.body

  // Validar datos
  try {
    validarArticulo(parametros)
  } catch (error) {
    return res.status(400).json({
      status: 'error',
      error,
      msg: 'Faltan datos por enviar o datos incorrectos'

    })
  }

  // Buscar y actualizar articulo
  try {
    const articulo = await ArticuloSchema.findOneAndUpdate({ _id: id }, req.body, { new: true })
    return res.status(200).send({
      status: 'success',
      msg: 'Articulo actualizado',
      article: articulo
    })
  } catch (error) {
    return res.status(400).json({
      status: 'error',
      error,
      msg: 'Error al intentar actualizar el articulo'

    })
  }
}

export const subir = async (req, res) => {
  if (!req.file) {
    return res.status(404).json({
      status: 'error',
      msg: 'Petición invalida'
    })
  }
  // Nombre de archivo
  const archivo = req.file.originalname

  // Extension del archivo
  // eslint-disable-next-line no-useless-escape
  const archivoSplit = archivo.split('\.')
  const extension = archivoSplit[1].toLowerCase()
  const EXTENSIONES_IMAGENES = [
    'jpg',
    'jpeg',
    'png',
    'gif',
    'bmp',
    'webp',
    'ico',
    'svg',
    'tif',
    'tiff',
    'heic',
    'heif',
    'psd',
    'ai',
    'eps',
    'raw',
    'dng',
    'cr2',
    'nef',
    'arw',
    'srw',
    'pef',
    'x3f'
  ]

  // Comprobar extencion correcta
  if (!EXTENSIONES_IMAGENES.includes(extension)) {
    fs.unlink(req.file.path, (_error) => {
      return res.status(400).json({
        status: 'error',
        error: _error,
        msg: 'Error al eliminar el archivo invalido'
      })
    })
    return res.status(400).json({
      status: 'error',
      msg: 'Imagen invalida'
    })
  }

  // Si todo va bien, actualizar el articulo
  const id = req.params.id

  // Buscar y actualizar articulo
  try {
    const articulo = await ArticuloSchema.findOneAndUpdate({ _id: id }, { imagen: req.file.filename }, { new: true })
    return res.status(200).send({
      status: 'success',
      msg: 'Imagen del articulo actualizado',
      article: articulo,
      fichero: req.file
    })
  } catch (error) {
    fs.unlink(req.file.path, () => {})
    return res.status(400).json({
      status: 'error',
      error,
      msg: 'Error al intentar actualizar la imagen del articulo'

    })
  }
}

export const imagen = (req, res) => {
  const fichero = req.params.fichero
  const rutaFisica = './images/' + fichero

  // validar si existe y enviar
  fs.stat(rutaFisica, (_error, existe) => {
    if (existe) {
      return res.sendFile(path.resolve(rutaFisica))
    }

    return res.status(404).json({
      status: 'error',
      msg: 'La imagen no existe'
    })
  })
}

export const buscador = async (req, res) => {
  try {
    const busqueda = req.params.busqueda

    // Find OR

    const articulos = await ArticuloSchema.find({
      $or: [
        { titulo: { $regex: busqueda, $options: 'i' } },

        { contenido: { $regex: busqueda, $options: 'i' } }
      ]
    }).sort({ fecha: -1 }).exec()

    if (!articulos || articulos.length < 1) {
      return res.status(404).json({
        status: 'error',
        msg: 'No hay articulos que coincidan'
      })
    }
    return res.status(200).json({
      status: 'success',
      msg: 'Articulos con coincidencias',
      articulos
    })
  } catch (error) {
    return res.status(404).json({
      status: 'error',
      error,
      msg: 'Fallo algo a la hora de realizar la busqueda '
    })
  }
}
