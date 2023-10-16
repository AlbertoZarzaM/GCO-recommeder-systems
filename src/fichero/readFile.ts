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
    
    console.log('Matriz sin normalizar', matriz);
    return normalizarMatriz(matriz, minVal, maxVal);
  } catch (error) {
    console.error('Error al leer el archivo');
    process.exit(1);
  }
}

/**
 * Función que normaliza la matriz entre 0 y 1
 * @params matriz_aux matriz a normalizar
 * @params minVal valor mínimo de la matriz
 * @params maxVal valor máximo de la matriz
 * @returns matriz normalizada entre 0 y 1.
 */
export function normalizarMatriz(matriz_aux: (number | '-')[][], minVal: number, maxVal: number) : (number | '-')[][] {
  let matriz_normalizada: (number | '-')[][] = [];

  // Recorremos la matriz
  for (let i = 0; i < matriz_aux.length; i++) {
    let fila: (number | '-')[] = [];
    for (let j = 0; j < matriz_aux[i].length; j++) {
      if (matriz_aux[i][j] == '-') {
        fila.push('-');
      } 
      else {
        fila.push(((matriz_aux[i][j] as number) - minVal) / (maxVal - minVal))
      }
    }
    matriz_normalizada.push(fila);
  }
  console.log('Matriz normalizada', matriz_normalizada);
  return matriz_normalizada;
}


//ALBERTO FUNCION ITERAR SEGUN LOS GUIONES QUE HAYA EN LA MATRIZ 






// leerArchivo('./diapositivas.txt'); // Reemplaza 'archivo.txt' con la ruta de tu archivo.
