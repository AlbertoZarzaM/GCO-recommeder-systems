import { metrica, numeroVecinos, prediccionBool} from "./main";
import { salidaFichero } from "./main";
import { escribirFichero } from "./fichero/readFile";


import * as ss from 'simple-statistics';

export var matrizResultado: (number | '-')[][] = [];
export var MatrizSinNormalizar: (number | '-')[][] = [];

/**
 * datosType: tipo de datos que se van a utilizar para guardar los datos de cada usuario.
 * usuario: número de fila del usuario.
 * media: media de los valores del usuario de la matriz de utilidad.
 * similitud: similitud entre el usuario y el usuario de la fila con la incógnita.
 * valor: valor de la columna de la incógnita.
 */
export type datosType = {
  usuario: number, // Número de fila del usuario
  media: number,  // Media de los valores del usuario de la matriz de utilidad
  similitud: number // Similitud entre el usuario y el usuario de la fila con la incognita
  valor?: number // Valor de la columna de la incognita
}

/**
 * Funcion que pasa la matriz de utilidad a un string.
 * @param matriz matriz de utilidad
 * @returns matriz en formato string
 */
export function matrizAString (matriz: (number | '-')[][]): string {
 
  let matrizString = "";
  for(let i = 0; i < matriz.length; i++){
      for(let j = 0; j < matriz[i].length; j++){
          matrizString += matriz[i][j] + " ";
      }
      matrizString += "\n";
  }
  return matrizString;
}

/**
 * Funcion que localiza y extrae los guiones de la matriz.
 */
export function guion(matriz: (number | '-')[][]): [number, number][] {
  let posiciones: [number, number][] = [];
  for (let i = 0; i < matriz.length; i++) {
    for (let j = 0; j < matriz[0].length; j++) {
      if (matriz[i][j] == "-") {
        posiciones.push([i, j]);
      }
    }
  }
  return posiciones;
}

/**
 * Función para obtener los índices de las filas en las que hay guiones independientemente de la columna
 */
export function filasGuion(posiciones: [number, number][]): number[] {
  let filas: number[] = [];
  for (let i = 0; i < posiciones.length; i++) {
    if (!filas.includes(posiciones[i][0])) {
      filas.push(posiciones[i][0]);
    }
  }
  return filas;
}

/**
 * función que se encargar de llamar las veces necesarias a la función que calcula la similitud para cada uno de los usuarios principales, es decir, con incógnitas.
 */
export function gestionarLlamadasSimilitudes(filasConGuion: number[], matriz: (number | '-')[][], posicionesGuiones: [number, number][]) {

  matrizResultado = matriz;
  
  for (let i = 0; i < filasConGuion.length; i++) {
    const fila_actual = filasConGuion[i];
    // Obtención de columnas con guiones de la fila actual
    let columnasConGuion: number[] = [];

    // Obtención de columnas con guiones de la fila actual
    for (let j = 0; j < posicionesGuiones.length; j++) {
      if (posicionesGuiones[j][0] == fila_actual) {
        columnasConGuion.push(posicionesGuiones[j][1]);
      }
    }

    let resultado: [datosType[], number] = filtradoMetrica(matriz, fila_actual);

    // * Pasamos a resolver las incógnitas de esta fila
    for (let k = 0; k < columnasConGuion.length; k++) { //* Predicción para cada una de las incógnitas de la fila
      prediccion(resultado[0], resultado[1], columnasConGuion[k], matriz, fila_actual);
    }

  }
}


/**
 * filtradoMetrica: función que se encarga de filtrar la matriz de utilidad para obtener los datos necesarios para calcular la similitud entre el usuario principal y el resto de usuarios.
 * @param matriz matriz de utilidad
 * @param filaPrincipal fila del usuario principal
 */
export function filtradoMetrica (matriz: (number | '-')[][], filaPrincipal: number): [datosType[], number] {
  let matrizCorrelacion: number[][] = [];
  let datosFinalesUsuario: datosType[] = [];

  const principalFilaComparar: (number | '-')[] = matriz[filaPrincipal]; //* Obtención de la fila del usuario a comparar con los demás

  if(salidaFichero) {
    escribirFichero('Fila principal a comparar: ' + principalFilaComparar + '\n' + 'Fila: ' + filaPrincipal + '\n');
  } else {
    console.log('USUARIO A COMPARAR: ', principalFilaComparar, ' Fila: ', filaPrincipal);
  }

  const coeficientes: number[] = []; // similitudes.
  let metricaString: string = "";
  for (let i = 0; i < matriz.length; i++) {
    // La fila del usuario a comparar se obvia
    if (i != filaPrincipal) {
      const vecino: (number|'-') [] = matriz[i] as number[]; //fila del usuario B CON GUIONES
      const vecinoSinGuiones: number[] = []; //fila del usuario B SIN GUIONES
      const principalFilaCompararSinGuiones: number[] = []; //fila del usuario A SIN GUIONES
      
      //En el mismo for vamos a mirar si en alguna de las 2 filas hay un guion.
      for (let j = 0; j < principalFilaComparar.length; ++j) {
        if (principalFilaComparar[j] != '-' && vecino[j] != '-') {
          principalFilaCompararSinGuiones.push(principalFilaComparar[j] as number);
          vecinoSinGuiones.push(vecino[j] as number);
        } 
        // si hay un guion no hacemos nada, pasamos a la siguiente columna.
      }

      // comprobamos que hay suficientes valores para comparar
      if (principalFilaComparar.length == 0 || vecinoSinGuiones.length == 0) {
        console.log('No se puede comparar, no hay suficientes valores');
        process.exit(1);
      }
      
      if (metrica === 1) { //* Pearson
        let similitud = correlacionPearson(principalFilaCompararSinGuiones, vecinoSinGuiones);
        coeficientes.push(similitud);
        let datosUsuario: datosType = { usuario: i, media: media(vecino) , similitud: similitud };
        datosFinalesUsuario.push(datosUsuario);
        metricaString = "Pearson";
      } 
      else if (metrica === 2) { //* Distancia coseno
        let similitud = distanciaCoseno(principalFilaCompararSinGuiones, vecinoSinGuiones);
        coeficientes.push(similitud);
        let datosUsuario: datosType = { usuario: i, media: media(vecino) , similitud: similitud };
        datosFinalesUsuario.push(datosUsuario);
        metricaString = "Coseno";
      } 
      else if (metrica === 3) { //* Distancia euclidea
        let similitud = distanciaEuclidea(principalFilaCompararSinGuiones, vecinoSinGuiones);
        coeficientes.push(similitud);
        let datosUsuario: datosType = { usuario: i, media: media(vecino) , similitud: similitud };
        datosFinalesUsuario.push(datosUsuario);
        metricaString = "Euclidea";
      } 
      
    }
  }

  if(salidaFichero) {
    escribirFichero('Similitudes ' + metricaString + ' ' + coeficientes + '\n');
  } else {
    console.log('Similitudes ', metricaString , " ", coeficientes); 
  }
  return [datosFinalesUsuario, media(principalFilaComparar)];

}

/**
 * Función que calcula la correlación de Pearson.
 * @param arrayA array de números
 * @param arrayB array de números
 * @returns correlación de Pearson
 */
export function correlacionPearson(arrayA: number[], arrayB:number[]): number {
    const cov = ss.sampleCovariance(arrayA, arrayB);
    const astd = ss.sampleStandardDeviation(arrayA);
    const bstd = ss.sampleStandardDeviation(arrayB);
    const mutiplicacion = astd * bstd;
    if (mutiplicacion == 0) {
      return 0;
    } else {
      return cov / mutiplicacion;
    }
}



/**
 * Función que calcula la distancia del coseno.
 * @param arrayA array de números
 * @param arrayB array de números
 * @returns distancia del coseno
 * 
 */
export function distanciaCoseno(arrayA: (number | '-')[], arrayB: (number | '-')[]): number {

  let numerador: number = 0;
  let denominador: number = 0;
  let denominadorA: number = 0;
  let denominadorB: number = 0;

  for (let i = 0; i < arrayA.length; i++) {

    if (arrayA[i] != "-" && arrayB[i] != "-") {

      numerador += (arrayA[i] as number) * (arrayB[i] as number);
      denominadorA += (arrayA[i] as number) * (arrayA[i] as number);
      denominadorB += (arrayB[i] as number) * (arrayB[i] as number);
    }

  }

  denominador = Math.sqrt(denominadorA) * Math.sqrt(denominadorB);

  const distancia = numerador / denominador;

  return distancia;

}


/**
 * Función que calcula la distancia euclidea.
 * @param arrayA array de números
 * @param arrayB array de números
 * @returns distancia euclidea
 * 
 */
export function distanciaEuclidea(arrayA: (number | '-')[], arrayB: (number | '-')[]): number {

  //? sqrt(sumatorio (r(u,i) - r(v,i))^2)
  let resultado: number = 0;
  let sumatorio: number = 0;

  for (let i = 0; i < arrayA.length; i++) {
    if (arrayA[i] != "-" && arrayB[i] != "-") { // no haría falta comprobar, ya se ha filtrado.
      sumatorio += Math.pow((arrayA[i] as number) - (arrayB[i] as number), 2);
    }
  }

  resultado = Math.sqrt(sumatorio);
  return resultado;
}

/**
 * Función que calcula la media de un usuario.
 * @param usuario array de números
 * @returns media del usuario
 * 
 */
export function media(usuario: (number|'-')[]): number {
  const usuarioSinGuion: number[] = [];
  for (const dato of usuario) {
    if (dato != '-') {
      usuarioSinGuion.push(dato);
    }
  }
  let mediaUsuario: number = 0;
  if (usuarioSinGuion.length != 0) {
  mediaUsuario = ss.mean(usuarioSinGuion);
  }
  return mediaUsuario; 
}


/**
 * Función que calcula una predicción. Simple o con la media.
 */
export function prediccion(datos: datosType[], mediaprincipalFilaComparar: number, posicionColumna: number, matriz: (number | '-')[][], numeroFila: number): void {
  // Ordenar los datos de mayor a menor (similitudes)
  datos.sort((a, b) => b.similitud - a.similitud);
  // Seleccionar los vecinos
  let vecinosSeleccionados: datosType[] = [];
  for (let i = 0; i < numeroVecinos; i++) {
    if (matriz[datos[i].usuario][posicionColumna] != '-') {
      datos[i].valor = matriz[datos[i].usuario][posicionColumna] as number;
      vecinosSeleccionados.push(datos[i]);
    }
    else { //* Si el vecino tiene una incógnita en esa columna, se descarta.
      continue;
    }
  }
  
  //? Al final del todo, si todos los vecinos tienen incógnitas en esa columna, no se puede hacer.
  if (vecinosSeleccionados.length == 0) {
    console.log('No se puede hacer la predicción para la incógnita', numeroFila, posicionColumna, 'porque todos los vecinos tienen incógnitas en esa columna \nContinuan el resto de predicciones');
    matrizResultado[numeroFila][posicionColumna] = '-';
  
    if (salidaFichero) {
      let vecinoString: string = vecinosSeleccionados.map((vecino) => vecino.usuario).join(', ');
      escribirFichero('Vecinos seleccionados (número de fila): ' + vecinoString + '\n');
    }
    else {
      console.log('Vecinos seleccionados: ', vecinosSeleccionados); 
    }  

    // si prediccion es false, se calcula con los valores
    // si prediccion es true, se calcula con la media
    if (prediccionBool === false) {
      // (sumatorio de (similitud * valor)) / sumatorio de similitudes
      prediccionSimple(vecinosSeleccionados, numeroFila, posicionColumna);
    }
    else {
      prediccionMedia(vecinosSeleccionados, mediaprincipalFilaComparar, numeroFila, posicionColumna);
    }
  }

}

/**
 * Función que calcula la predicción con los valores.
 * @param vecinosSeleccionados vecinos seleccionados
 * @param fila fila de la incógnita
 * @param columna columna de la incógnita
 * 
 */
export function prediccionSimple(vecinosSeleccionados: datosType[], fila: number, columna: number): void {

  let numerador: number = 0;
  let denominador: number = 0;
  for (const vecino of vecinosSeleccionados) {
    numerador += vecino.similitud * vecino.valor;
    // valor absoluto de la similitud
    denominador += Math.abs(vecino.similitud);
  }

  var prediccion: number = numerador / denominador;
  
  if (salidaFichero) {
    escribirFichero('Prediccion: ' + prediccion + '\n');
  } else {
    console.log('Prediccion: ', prediccion);
  }



  matrizResultado[fila][columna] = prediccion;

}

/**
 * Función que calcula la predicción con la media.
 * @param vecinosSeleccionados vecinos seleccionados
 * @param mediaprincipalFilaComparar media del usuario principal
 * @param fila fila de la incógnita
 * @param columna columna de la incógnita
 * 
 * 
 */
export function prediccionMedia(vecinosSeleccionados: datosType[], mediaprincipalFilaComparar: number, fila: number, columna: number): void {

  let numerador: number = 0;
  let denominador: number = 0;

  const media: number = mediaprincipalFilaComparar;
  for (const vecino of vecinosSeleccionados) {
    numerador += vecino.similitud * (vecino.valor - vecino.media);
    // valor absoluto de la similitud
    denominador += Math.abs(vecino.similitud);
  }
  var prediccion: number = media + (numerador / denominador);
  
  if (salidaFichero) {
    escribirFichero('Prediccion: ' + prediccion + '\n');
  } else {
    console.log('prediccion: ', prediccion); 
  }


  matrizResultado[fila][columna] = prediccion;
  // Actualizar prediccion matrizResultado

}