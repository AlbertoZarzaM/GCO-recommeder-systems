import { desnormalizarMatriz, leerArchivo, maxVal, minVal } from "./fichero/readFile";
import * as readline from 'readline';
// import { correlacionPearson, filtradodistanciaCoseno, filtradodistanciaEuclidea } from "./funciones_metricas";
import {filasGuion, matrizResultado } from "./funciones_metricas";
import { prediccion } from "./funciones_metricas";
import { guion } from "./funciones_metricas";
import { gestionarLlamadasSimilitudes } from "./funciones_metricas";
// import { distanciaEuclidea } from "./funciones_metricas";
// import{ distanciaCoseno } from "./funciones_metricas";


export var metrica: number = 0;
export var numeroVecinos: number = 0;
export var nombreFichero: string = ' ';
export var prediccionBool: boolean = false;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

/**
 * Función inicial
 */
function inicial() : void {
  console.log('Bienvenido al programa de filtrado colaborativo')

  
    // pedir métrica
    rl.question('Por favor, introduzca la métrica sobre la que quiere hacer el cálculo (1: Pearson 2: Coseno 3: Euclídea): ', (answer) => {
        console.log(`Ha introducido: ${answer}`);
        metrica = parseInt(answer);
        if ( (metrica < 1) || (metrica > 3) ) {
            console.log('Error: la métrica debe ser 1, 2 o 3');
            process.exit(1);
        }

        // pedir nombre de fichero
        rl.question('Introduzca el nombre del fichero de entrada: ', (answer) => {
        console.log(`Fichero: ${answer}`);
        nombreFichero = answer;
        const matrizOriginal: (number | '-') [][] = leerArchivo(nombreFichero);
        const posicionesGuiones: [number, number] [] = guion(matrizOriginal);
        const filasGuiones: number [] = filasGuion(posicionesGuiones);

        // Fichero incorrecto lo amnejamos dentro de la función leerArchivo.

            // pedir numero de vecinos
            rl.question('Introduzca el número de vecinos considerado: ', (answer) => {
                console.log(`Numero de vecinos: ${answer}`);
                numeroVecinos = parseInt(answer);

                // si el numero de vecinos es menor que 1, o mayor que el numero de usuarios, error.
                // -1 porque una fila es la del usuario con guión.
                // ! que pasa si tenemos más de una fila con guión.
                if ( (numeroVecinos < 1) ||  (numeroVecinos > (matrizOriginal.length - 1)) ) {
                    console.log('Error: el numero de vecinos debe ser mayor que 0 y menor que el numero de usuarios');
                    // salir del programa
                    process.exit(1);
                }
            
                // pedir tipo de predicción (simple o con la media).

                rl.question('Introduzca tipo de prediccion, simple (1) o con la media (2): ', (answer) => {
                    answer = answer.toLowerCase();
                    console.log(`prediccion: ${answer}`);
                    if (answer === '1') {
                        prediccionBool = false; // si la predicción es simple, false.
                    }
                    else if (answer === '2') {
                        prediccionBool = true; // si la prediccion es con la media, true.
                    }
                    else {
                        console.log('Error: Tipo de predicción no válido.');
                        process.exit(1);
                    }
                    // prueba
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

                    rl.close();
                });
            });
        });
    });
    

  
}

inicial()



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