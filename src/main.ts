import { desnormalizarMatriz, leerArchivo, maxVal, minVal } from "./fichero/readFile";
import {filasGuion, matrizResultado } from "./funciones_metricas";
import { guion } from "./funciones_metricas";
import { gestionarLlamadasSimilitudes } from "./funciones_metricas";


export var metrica: number = 0;
export var numeroVecinos: number = 0;
export var nombreFichero: string = ' ';
export var prediccionBool: boolean = false;



/**
 * Función inicial
 */
export function inicial(matrizOriginal: (number | '-')[][], opciones: [number, number, number]) : void {

    console.log("inicial")
    const posicionesGuiones: [number, number] [] = guion(matrizOriginal);
    const filasGuiones: number [] = filasGuion(posicionesGuiones);

    //* Damos valores a las opciones
    metrica = opciones[0];
    numeroVecinos = opciones[1];
    prediccionBool = opciones[2] == 1 ? false : true;

    console.log('predicción', prediccionBool);

    if (metrica === 1 || metrica === 2 ||metrica === 3) {
        console.log('Metrica', metrica, '; (1) Pearson (2) Coseno (3) Euclidea');
        console.log('numero de vecinos: ' + numeroVecinos);
        console.log('nombre fichero: ' + nombreFichero);
        console.log('prediccion: ' + prediccionBool);
    
        gestionarLlamadasSimilitudes(filasGuiones, matrizOriginal, posicionesGuiones);
    }
    else {
        console.log('Error: métrica no válida.');
        process.exit(1);
    }

    console.log('Matriz Resultado normalizada:');
    console.log(matrizResultado);

    desnormalizarMatriz(matrizResultado, minVal, maxVal);


}




/**
 * REQUISITOS 
 * La matriz de utilidad con la predicción de los elementos faltantes en la matriz original.
 * La similaridad entre cada usuario y sus vecinos de acuerdo a la métrica elegida.
 * Los vecinos seleccionados en el proceso de predicción.
 * El cálculo de cada predicción de la matriz de utilidad en base a los vecinos seleccionados.
 */

/**
 * 
 * 

- 7 5 7 -
4 4 6 6 -
0 2 4 5 5
3 - 6 7 7


*/