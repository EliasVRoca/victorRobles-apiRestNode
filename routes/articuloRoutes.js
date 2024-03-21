import express from 'express'
import multer from 'multer'
import { listar, crear, curso, prueba, uno, borrar, actualizar, subir, imagen, buscador } from '../controllers/articuloController.js'
import { verificarYCrearDirectorio } from '../helpers/verificarYCrearDirectorio.js'

const router = express.Router()

// validando si existe la carpeta imagens
verificarYCrearDirectorio('../', 'images')
// Configuracion para multer
const almacenamiento = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, './images/')
  },
  filename: (_req, file, cb) => {
    cb(null, 'articulo' + Date.now() + file.originalname)
  }
})
const subidas = multer({ storage: almacenamiento })

// Rutas de prueba
router.get('/ruta-de-prueba', prueba)
router.get('/curso', curso)

// Rutas utiles
router.post('/crear', crear)

router.get('/articulos/:ultimos?', listar)
router.get('/articulo/:id', uno)
router.delete('/articulo/:id', borrar)
router.put('/articulo/:id', actualizar)
router.post('/subir-imagen/:id', [subidas.single('file0')], subir)
router.get('/imagen/:fichero', imagen)
router.get('/buscar/:busqueda', buscador)

export default router
