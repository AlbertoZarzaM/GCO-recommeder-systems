import * as fs from 'fs';
import { nombreFicheroSalida } from '../main';
import { salidaFichero } from '../main';
import { matrizAString } from '../funciones_metricas';

// valor minimo de puntuacion asignable por un usuario a un item
export let minVal: number = 0;

// valor maximo de puntuacion asignable por un usuario a un item
export let maxVal: number = 0;

export function escribirFichero (contenido: string): void {
  contenido = contenido + '\n';
  fs.appendFile(nombreFicheroSalida, contenido, (error) => {
    if (error) {
      console.error('Error al escribir en el archivo:', error);
    }
  });
}

export function leerArchivo(ruta: string): (number | '-')[][] {
  try {
    const contenido = fs.readFileSync(ruta, 'utf-8');
    const lineas = contenido.split('\n'); // Divide el contenido en lineas

    
    minVal = parseFloat(lineas.shift()); // Valor mínimo
    maxVal = parseFloat(lineas.shift()); // Valor máximo
    if (salidaFichero) {
      escribirFichero('Valor minimo: ' + minVal);
      escribirFichero('Valor maximo: ' + maxVal);
    } else {
      console.log('Valor minimo:', minVal);
      console.log('Valor maximo:', maxVal);
    }

    const matriz: (number | '-')[][] = [];
    
    for (const linea of lineas) {
      // Procesa cada linea
      
      const elementosArray = linea.split(" ");

      var lineaFloat:(number | '-') [] = [];
      for (const elemento of elementosArray) {
        if (elemento == '-') {
            lineaFloat.push(elemento);
        } else if(!isNaN(parseFloat(elemento))) {
          lineaFloat.push(parseFloat(elemento));
        }
      }
      matriz.push(lineaFloat);
    }
    if (salidaFichero) {
      escribirFichero('Matriz sin normalizar \n' + matrizAString(matriz));
    } else {
      console.log('Matriz sin normalizar', matriz);
    }

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

  if (salidaFichero) {
    escribirFichero('Matriz normalizada \n' + matrizAString(matriz_normalizada));
  } else {
    console.log('Matriz normalizada', matriz_normalizada);
  }
  return matriz_normalizada;
}



/**
 * Función que desnormaliza la matriz entre 0 y 1 a su valor original
 * @params matrizNormalizada matriz a desnormalizar
 * @params minVal valor mínimo de la matriz
 * @params maxVal valor máximo de la matriz
 */
export function desnormalizarMatriz(matrizNormalizada: (number | '-')[][], minVal: number, maxVal: number): (number | '-')[][] {
  let matrizDesnormalizada: (number | '-')[][] = [];

  // Recorremos la matriz
  for (let i = 0; i < matrizNormalizada.length; i++) {
    let fila: (number | '-')[] = [];
    for (let j = 0; j < matrizNormalizada[i].length; j++) {
      if (matrizNormalizada[i][j] == '-') {
        fila.push('-');
      } 
      else {
        let elementoSinRedondeo = ((matrizNormalizada[i][j] as number) * (maxVal - minVal)) + minVal;
        let elementoRedondeado = Math.round(elementoSinRedondeo * 1000) / 1000;
        fila.push(elementoRedondeado);
      }
    }
    matrizDesnormalizada.push(fila);
  }
  
  if(salidaFichero){
    escribirFichero('Matriz desnormalizada \n' + matrizAString(matrizDesnormalizada));
  } else {
    console.log('Matriz desnormalizada', matrizDesnormalizada);
  }
  return matrizDesnormalizada;
}
