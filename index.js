import connection from './db/connection.js'
import articuloRoutes from './routes/articuloRoutes.js'
import express from 'express'
import cors from 'cors'
import 'dotenv/config'

// Conectando a la base de datos
connection()

// Crear servidor express
const app = express()

// Configurar cores
app.use(cors())

// Convertir body a objeto js
app.use(express.json())
// Recibir los datos con content-type app/json
app.use(express.urlencoded({ extended: true }))

// Rutas
app.use('/api', articuloRoutes)

// Rutas de pruebas
app.get('/', (_req, res) => {
  return res.status(200).send(
    '<h1>Bienvenido a home</h1>'
  )
})
app.get('/probando', (_req, res) => {
  return res.status(200).json({ msg: 'Hola pringado' })
})

// Crear y escuchar el puerto con express
app.listen(process.env.PORT | 0, function () {
  console.log('Servidor corriendo en el puerto: http://localhost:' + this.address().port)
})
