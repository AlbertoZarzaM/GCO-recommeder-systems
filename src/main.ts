import { desnormalizarMatriz, leerArchivo, maxVal, minVal } from "./fichero/LecturaEscritura";
import {filasGuion, matrizResultado } from "./funciones_metricas";
import { guion } from "./funciones_metricas";
import { gestionarLlamadasSimilitudes } from "./funciones_metricas";
import { matrizAString } from "./funciones_metricas";
import { escribirFichero } from "./fichero/LecturaEscritura";
import yargs from 'yargs';


/**
 * Variables globales que se utilizan en el programa
 */
export var metrica: number = 0;
export var numeroVecinos: number = 0;
export var nombreFichero: string = " ";
export var prediccionBool: boolean = false;
export var nombreFicheroSalida: string = " ";
export var salidaFichero: boolean = false;




/**
 * Función inicial
 */
export function inicial(matrizOriginal: (number | '-')[][], opciones: [number, number, number]) : void {
    const posicionesGuiones: [number, number] [] = guion(matrizOriginal);
    const filasGuiones: number [] = filasGuion(posicionesGuiones);

    //* Damos valores a las opciones
    metrica = opciones[0];
    numeroVecinos = opciones[1];
    prediccionBool = opciones[2] == 1 ? false : true;

    if (metrica === 1 || metrica === 2 ||metrica === 3) {
        gestionarLlamadasSimilitudes(filasGuiones, matrizOriginal, posicionesGuiones);
    }
    else {
        console.log('Error: métrica no válida.');
        process.exit(1);
    }
    
    if(salidaFichero){
        //Pasamos la matriz resultado a string
        let opcionesIniciales: string = 'Metrica: ' + metrica + '\n' + 'Numero de vecinos: ' + numeroVecinos + '\n' + 'Nombre fichero: ' + nombreFichero + '\n' + 'Prediccion: ' + prediccionBool + '\n';
        escribirFichero("\nOpciones del usuario: \n" + opcionesIniciales);
        escribirFichero("Matriz resultado normalizada \n" + matrizAString(matrizResultado));
        
    }
    else {
        console.log('Metrica', metrica, '; (1) Pearson (2) Coseno (3) Euclidea');
        console.log('numero de vecinos: ' + numeroVecinos);
        console.log('nombre fichero: ' + nombreFichero);
        console.log('Prediccion: ' + prediccionBool);
        console.log('Matriz de utilidad resultado normalizada:');
        console.log(matrizResultado);
    } 
    desnormalizarMatriz(matrizResultado, minVal, maxVal);


}

/**
 * Función que gestiona el paso de parámetros por línea de comadnos siguiendo el estándar POSIX.
 */
function opcionesPOSIX() {
    const argv = yargs(process.argv.slice(0))
        .option('f', {
            alias: 'file',
            describe: 'Nombre del fichero',
            type: 'string',
            demandOption: true,
        })
        .option('m', {
            alias: 'metric',
            describe: 'Número de la métrica',
            coerce: (arg) => {
                if (![1, 2, 3].includes(arg)) {
                  throw new Error('La opción debe ser 1, 2 o 3');
                }
                return arg;
            },
            type: 'number',
            choices: [1, 2, 3],
            demandOption: true,
        })
        .option('n', {
            alias: 'neighbors',
            describe: 'Número de vecinos',
            type: 'number',
            demandOption: true,
        })
        .option('t', {
            alias: 'type',
            describe: 'Tipo de predicción',
            coerce: (arg) => {
                if (![1, 2].includes(arg)) {
                  throw new Error('La opción debe ser (1) Predicción simple o Predicción de diferencia con media (2)');
                }
                return arg;
            },
            type: 'number',
            choices: [1,2],
            demandOption: true,
        })
        .option('o', {
            alias: 'output',
            describe: 'Nombre del fichero de salida',
            type: 'string',
        })
        .option('help', {
            describe: 'Muestra la ayuda',
        }).epilog('Métrica(-m): Pearson (1) | Distancia Coseno (2) | Distancia Euclídea (3) \nPredicción(-t): Simple (1) | Media (2) ').argv;
    nombreFichero = argv['f'];
    metrica = argv['m'];
    numeroVecinos = argv['n'];
    prediccionBool = argv['t']=== 1 ? false : true;
    if(argv['o'] != undefined){
        nombreFicheroSalida = argv['o'];
        salidaFichero = true;
    }
    // Llamada a la función inicial
    inicial(leerArchivo(nombreFichero), [metrica, numeroVecinos, prediccionBool ? 0 : 1]);
}


/**
 * Punto de inicio del programa
 */
opcionesPOSIX();