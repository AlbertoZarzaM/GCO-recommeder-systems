import { leerArchivo } from "./fichero/readFile";
import { minVal, maxVal } from "./fichero/readFile";
import * as ss from 'simple-statistics';



/**
 * Funcion que localiza y extrae los guiones de la matriz.
 * 
 */

export function guion(matriz: (number | '-')[][]): [number, number][] {
    let posiciones: [number, number][] = [];
    for (let i = 0; i < matriz.length; i++) {
        for (let j = 0; j < matriz[0].length; j++) {
            if (matriz[i][j] == "-") {
                posiciones.push([i,j]);
            }
        }
    }
    console.log("Posiciones de los guiones: ", posiciones);
    return posiciones;
}


/**
 * Funciones para ejecutar las metricas
 * 
 */



/**
 * Correlacion de pearson
 */

export function correlacionPearson(matriz: (number | '-') [][]): void {
    let matrizCorrelacion: number[][] = [];
    
    const posiciones: [number, number][] = guion(matriz);
    if (posiciones.length == 1) {
      console.log("un guión");  

      const usuarioComparar: (number|'-') [] = matriz[Number(posiciones.at(0)[0])];
      console.log('Usuario a comparar: ', usuarioComparar);
      let filaCompararSinGuion: (number)[] = []; // Fila del usuario a comparar obviando el guión
      for (const elemento of usuarioComparar) {
        if (elemento != '-') {
          filaCompararSinGuion.push(elemento);
        }
      }
      console.log('filaCompararSinGuion: ', filaCompararSinGuion);

      
      const coeficientes: number [] = [];
      for (let i = 0; i < matriz.length; i++) {
         // La fila del usuario a comparar se obvia
        if (i != posiciones.at(0)[0]) {
          const otroUsuario: number [] = matriz[i] as number[];
          const otroUsuarioSinColumna: number[] = [];
          for (let j = 0; j < otroUsuario.length; ++j) {
            if (j != posiciones.at(0)[1]) {
              otroUsuarioSinColumna.push(otroUsuario[j]);
            }
          }
          coeficientes.push(ss.sampleCorrelation(filaCompararSinGuion, otroUsuarioSinColumna));
        }
      }

      console.log('coeficientes: ', coeficientes);
      
    }
    else {
        console.log("Sin implementar aún");
    }



  

}


/**
 * Distancia coseno.
 */



/**
 * Distancia Euclidea.
 */