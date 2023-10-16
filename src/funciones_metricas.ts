import { leerArchivo } from "./fichero/readFile";
import { minVal, maxVal } from "./fichero/readFile";
import { metrica, numeroVecinos, prediccionBool} from "./main";

import * as ss from 'simple-statistics';

export var matrizResultado: (number | '-')[][] = [];
export var MatrizSinNormalizar: (number | '-')[][] = [];

export type datosType = {
  usuario: number, // Número de fila del usuario
  media: number,  // Media de los valores del usuario de la matriz de utilidad
  similitud: number // Similitud entre el usuario y el usuario de la fila con la incognita
  valor?: number // Valor de la columna de la incognita
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
  //?console.log("Posiciones de los guiones: ", posiciones);
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
  // primer for, tantas iteraciones como filas con guiones.
  // sólo hacemos una vez por fila
  // comparamos esta fila con el resto de filas
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
    // ? actualizamos matriz inicial? serían las predicciones adecuadas?
    for (let k = 0; k < columnasConGuion.length; k++) { //* Predicción para cada una de las incógnitas de la fila
     prediccion(resultado[0], resultado[1], columnasConGuion[k], matriz, fila_actual);
    }

  }
}



export function filtradoMetrica (matriz: (number | '-')[][], filaPrincipal: number): [datosType[], number] {
  let matrizCorrelacion: number[][] = [];
  let datosFinalesUsuario: datosType[] = [];

  const principalFilaComparar: (number | '-')[] = matriz[filaPrincipal]; //* Obtención de la fila del usuario a comparar con los demás
  console.log('Usuario a comparar: ', principalFilaComparar);

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

      //? comprobamos que hay suficientes valores para comparar
      if (principalFilaComparar.length == 0 || vecinoSinGuiones.length == 0) {
        console.log('No se puede comparar, no hay suficientes valores');
      }
      
      if (metrica === 1) { //* Pearson
        let similitud = ss.sampleCorrelation(principalFilaCompararSinGuiones, vecinoSinGuiones);
        coeficientes.push(similitud);
        let datosUsuario: datosType = { usuario: i, media: media(vecino) , similitud: similitud };
        datosFinalesUsuario.push(datosUsuario);
        metricaString = "Pearson";
      } else if (metrica === 2) { //* Distancia coseno
        let similitud = distanciaCoseno(principalFilaCompararSinGuiones, vecinoSinGuiones);
        coeficientes.push(similitud);
        let datosUsuario: datosType = { usuario: i, media: media(vecino) , similitud: similitud };
        datosFinalesUsuario.push(datosUsuario);
        metricaString = "Coseno";
      } else if (metrica === 3) {//* Distancia euclidea
        let similitud = distanciaEuclidea(principalFilaCompararSinGuiones, vecinoSinGuiones);
        coeficientes.push(similitud);
        let datosUsuario: datosType = { usuario: i, media: media(vecino) , similitud: similitud };
        datosFinalesUsuario.push(datosUsuario);
        metricaString = "Euclidea";
      } 
      
    }
  }

  console.log('Similitudes ', metricaString , " ", coeficientes);
  return [datosFinalesUsuario, media(principalFilaComparar)];

}


//  * Distancia coseno.
//  */
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
  console.log('numerador: ', numerador);
  console.log('denominador: ', denominador);

  const distancia = numerador / denominador;

  console.log('distancia: ', distancia);
  // habría que llamar a la función para cada comparación.
  // Además de guardar el nuevo valor como similitud.
  return distancia;

}


//  * Distancia Euclidea.
//  */
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


export function media(usuario: (number|'-')[]): number {
  const usuarioSinGuion: number[] = [];
  for (const dato of usuario) {
    if (dato != '-') {
      usuarioSinGuion.push(dato);
    }
  }
  
  return ss.mean(usuarioSinGuion);
}


/**
 * Función que calcula una predicción. Simple o con la media.
 */

export function prediccion(datos: datosType[], mediaprincipalFilaComparar: number, posicionColumna: number, matriz: (number | '-')[][], numeroFila: number): void {
  // Ordenar los datos de mayor a menor
  datos.sort((a, b) => b.similitud - a.similitud);
  // Seleccionar los vecinos
  let vecinosSeleccionados: datosType[] = [];
  for (let i = 0; i < numeroVecinos; i++) {
    if (matriz[datos[i].usuario][posicionColumna] != '-') {
      datos[i].valor = matriz[datos[i].usuario][posicionColumna] as number;
      vecinosSeleccionados.push(datos[i]);
    }
    else { //! PENDIENTE DEL CORREO CON LA CONTESTACIÓN.
      continue;
    }
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


export function prediccionSimple(vecinosSeleccionados: datosType[], fila: number, columna: number): void {

  let numerador: number = 0;
  let denominador: number = 0;
  for (const vecino of vecinosSeleccionados) {
    numerador += vecino.similitud * vecino.valor;
    // valor absoluto de la similitud
    denominador += Math.abs(vecino.similitud);
  }
  var prediccion: number = numerador / denominador;
  
  console.log('Prediccion: ', prediccion);

  // Actualizar prediccion matrizResultado redondeado a 3 decimales

  prediccion = Math.round(prediccion * 1000) / 1000;
  matrizResultado[fila][columna] = prediccion;

}

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
  
  console.log('prediccion: ', prediccion);

  prediccion = Math.round(prediccion * 1000) / 1000;
  matrizResultado[fila][columna] = prediccion;
  // Actualizar prediccion matrizResultado
}
