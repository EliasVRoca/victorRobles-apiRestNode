import { Schema, model } from 'mongoose'

const ArticuloSchema = Schema({
  titulo: { type: String, require: true },
  contenido: { type: String, require: true },
  fecha: { type: Date, default: Date.now },
  imagen: { type: String, default: 'default.png' }
})

export default model('Articulo', ArticuloSchema, 'articulos')
