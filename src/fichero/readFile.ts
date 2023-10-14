/**
 * Gestión del fichero de entrada
 */


// npm install fs-extra
import * as fs from 'fs';

// valor minimo de puntuacion asignable por un usuario a un item
export let minVal: number = 0;

// valor maximo de puntuacion asignable por un usuario a un item
export let maxVal: number = 0;


export function leerArchivo(ruta: string): (number | '-')[][] {
  try {
    const contenido = fs.readFileSync(ruta, 'utf-8');
    const lineas = contenido.split('\n'); // Divide el contenido en lineas

    
    minVal = parseFloat(lineas.shift()); // Valor mínimo
    maxVal = parseFloat(lineas.shift()); // Valor máximo
    
    console.log('Valor minimo:', minVal);
    console.log('Valor maximo:', maxVal);
    
    var matriz: (number | '-')[][] = [];
    
    for (const linea of lineas) {
      // Procesa cada linea
      const elementosArray = linea.split(" ");
      // console.log('Linea:', elementosArray);

      var lineaFloat:(number | '-') [] = [];
      for (const elemento of elementosArray) {
        if (elemento == '-') {
            lineaFloat.push(elemento);
        } else {
            lineaFloat.push(parseFloat(elemento));
        }
      }
      matriz.push(lineaFloat);
    }
    
    console.log('Matriz', matriz);
    return matriz;
  } catch (error) {
    console.error('Error al leer el archivo');
    process.exit(1);
  }
}



//leerArchivo('./fichero-ejemplo.txt'); // Reemplaza 'archivo.txt' con la ruta de tu archivo.
