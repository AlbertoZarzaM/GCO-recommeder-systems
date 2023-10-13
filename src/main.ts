import { leerArchivo } from "./fichero/readFile";
import * as readline from 'readline';
import { correlacionPearson } from "./funciones_metricas";


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

/**
 * Función inicial
 */
function inicial() : void {
  console.log('Bienvenido al programa de filtrado colaborativo')

  let metrica: number = 0;
  let numeroVecinos: number = 0;
  let nombreFichero: string = ' ';
  let prediccion: boolean = false;
  
    // pedir métrica
    rl.question('Por favor, introduzca la métrica sobre la que quiere hacer el cálculo (1: Pearson 2: Coseno 3: Euclídea): ', (answer) => {
        console.log(`Ha introducido: ${answer}`);
        metrica = parseInt(answer);
        
        // pedir nombre de fichero
        rl.question('Introduzca el nombre del fichero de entrada: ', (answer) => {
        console.log(`Fichero: ${answer}`);
        nombreFichero = answer;

            // pedir numero de vecinos
            rl.question('Introduzca el número de vecinos considerado: ', (answer) => {
                console.log(`Numero de vecinos: ${answer}`);
                //
                //! considerar que el numero de vecinos debe ser menor al que tenemos...
                //
                numeroVecinos = parseInt(answer);
            
                // pedir tipo de predicción (simple o con la media).

                rl.question('Introduzca tipo de prediccion, simple (1) o con la media (2): ', (answer) => {
                    answer = answer.toLowerCase();
                    console.log(`prediccion: ${answer}`);
                    if (answer === '1') {
                    prediccion = false; // si la predicción es simple, false.
                    }
                    else if (answer === '2') {
                    prediccion = true; // si la prediccion es con la media, true.
                    }
                        console.log('aquí')
                        // prueba
                        if (metrica === 1) {
                        console.log('metrica pearson');
                        console.log('numero de vecinos: ' + numeroVecinos);
                        console.log('nombre fichero: ' + nombreFichero);
                        console.log('prediccion: ' + prediccion);
                        let matriz_aux: (number | '-') [][] = leerArchivo(nombreFichero);
                        correlacionPearson(matriz_aux);
                        }
                    rl.close();
                });
            });
        });
    });
    

  
}

inicial()