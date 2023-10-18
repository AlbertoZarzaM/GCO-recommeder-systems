import { desnormalizarMatriz, leerArchivo, maxVal, minVal } from "./fichero/readFile";
import {filasGuion, matrizResultado } from "./funciones_metricas";
import { guion } from "./funciones_metricas";
import { gestionarLlamadasSimilitudes } from "./funciones_metricas";
import yargs from 'yargs';


export var metrica: number = 0;
export var numeroVecinos: number = 0;
export var nombreFichero: string = " ";
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
            type: 'number',
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
            type: 'number',
            demandOption: true,
        })
        .option('help', {
            describe: 'Muestra la ayuda',
        }).argv;
    nombreFichero = argv['f'];
    metrica = argv['m'];
    numeroVecinos = argv['n'];
    prediccionBool = argv['t']=== 1 ? false : true;

    // Llamada a la función inicial
    inicial(leerArchivo(nombreFichero), [metrica, numeroVecinos, prediccionBool ? 0 : 1]);
}

opcionesPOSIX();