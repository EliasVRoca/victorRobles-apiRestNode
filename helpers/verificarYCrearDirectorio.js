import fs from 'fs'
export async function verificarYCrearDirectorio (ruta, nombreCarpeta) {
  // Ruta completa del directorio
  const directorio = `${ruta}/${nombreCarpeta}`

  try {
    // Verificamos si la carpeta existe
    await fs.promises.stat(ruta)
  } catch (error) {
    // Si la carpeta no existe, la creamos
    console.log({ msg: 'El directorio a raiz a verificar no existe', error })
  }

  try {
    // Verificamos si el directorio existe
    await fs.promises.stat(directorio)
  } catch (error) {
    // Si el directorio no existe, lo creamos
    await fs.promises.mkdir(directorio)
    console.log(`Directorio creado: ${directorio}`)
  }
}
