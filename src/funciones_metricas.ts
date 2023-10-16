import { leerArchivo } from "./fichero/readFile";
import { minVal, maxVal } from "./fichero/readFile";
import * as ss from 'simple-statistics';

export type datosType = {
  usuario: number, // Número de fila del usuario
  media: number,  // Media de los valores del usuario de la matriz de utilidad
  valor: number,  // Valor de la columna con la incognita
  similitud: number // Similitud entre el usuario y el usuario de la fila con la incognita
}


/**
 * Funcion que localiza y extrae los guiones de la matriz.
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
    //!console.log("Posiciones de los guiones: ", posiciones);
    return posiciones;
}



/**
 * Correlacion de pearson
 */
export function correlacionPearson(matriz: (number | '-') [][]):[datosType[], number] {
    let matrizCorrelacion: number[][] = [];
    let datosFinalesUsuario: datosType[] = [];
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
          let similitud = ss.sampleCorrelation(filaCompararSinGuion, otroUsuarioSinColumna);
          coeficientes.push(similitud);
          let datosUsuario: datosType = {usuario: i, media: ss.mean(otroUsuario), valor: otroUsuario[posiciones.at(0)[1]] as number, similitud: similitud};
          
          datosFinalesUsuario.push(datosUsuario);
        }
      }

      console.log('coeficientes: ', coeficientes);
      return [datosFinalesUsuario, ss.mean(filaCompararSinGuion)];
      // export type datosType = {
      //   usuario: number, // Número de fila del usuario
      //   media: number,  // Media de los valores del usuario de la matriz de utilidad
      //   valor: number,  // Valor de la columna con la incognita
      //   similitud: number // Similitud entre el usuario y el usuario de la fila con la incognita
      // }

    }
    else {
        console.log("Sin implementar aún");

        
    }
}

export function filtradodistanciaCoseno(matriz: (number | '-') [][]): [datosType[], number] {
  let matrizCorrelacion: number[][] = [];
  let datosFinalesUsuario: datosType[] = [];
  const posiciones: [number, number][] = guion(matriz);
  if (posiciones.length == 1) {
    const usuarioComparar: (number|'-') [] = matriz[Number(posiciones.at(0)[0])];
      console.log('Usuario a comparar: ', usuarioComparar);
      let filaCompararSinGuion: (number)[] = []; // Fila del usuario a comparar obviando el guión
      for (const elemento of usuarioComparar) {
        if (elemento != '-') {
          filaCompararSinGuion.push(elemento);
        }
      }
      console.log('filaCompararSinGuion: ', filaCompararSinGuion);

      
      const similitudes: number [] = [];
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
         let similitud = distanciaCoseno(filaCompararSinGuion, otroUsuarioSinColumna);
         similitudes.push(similitud);
         let datosUsuario: datosType = {usuario: i, media: ss.mean(otroUsuario), valor: otroUsuario[posiciones.at(0)[1]] as number, similitud: similitud};
         
         datosFinalesUsuario.push(datosUsuario);
       }
     }

     console.log('Similitudes con distancia coseno: ', similitudes);
     return [datosFinalesUsuario, ss.mean(filaCompararSinGuion)];
  }
}

/**
 * Distancia coseno.
 */

export function distanciaCoseno (arrayA: (number | '-') [], arrayB: (number | '-') []): number {

  let numerador: number = 0;
  let denominador: number = 0;
  let denominadorA: number = 0;
  let denominadorB: number = 0;

  for (let i = 0; i < arrayA.length; i++) {

    if (arrayA[i] != "-" && arrayB[i] != "-" ) {
      
      numerador += (arrayA[i] as number) * (arrayB[i] as number);
      denominadorA += (arrayA[i] as number) * (arrayA[i] as number);
      denominadorB += (arrayB[i] as number) * (arrayB[i] as number);
    }
    
  }

  denominador = Math.sqrt(denominadorA) * Math.sqrt(denominadorB);
  console.log('numerador: ', numerador);
  console.log('denominador: ', denominador);

  const distancia = numerador/denominador;

  console.log('distancia: ', distancia);
  // habría que llamar a la función para cada comparación.
  // Además de guardar el nuevo valor como similitud.
  return distancia;


}

export function filtradodistanciaEuclidea(matriz: (number | '-') [][]): [datosType[], number] {
  let matrizCorrelacion: number[][] = [];
  let datosFinalesUsuario: datosType[] = [];
  const posiciones: [number, number][] = guion(matriz);
  if (posiciones.length == 1) {
    const usuarioComparar: (number|'-') [] = matriz[Number(posiciones.at(0)[0])];
      console.log('Usuario a comparar: ', usuarioComparar);
      let filaCompararSinGuion: (number)[] = []; // Fila del usuario a comparar obviando el guión
      for (const elemento of usuarioComparar) {
        if (elemento != '-') {
          filaCompararSinGuion.push(elemento);
        }
      }
      console.log('filaCompararSinGuion: ', filaCompararSinGuion);

      const similitudes: number [] = [];
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
         let similitud = distanciaEuclidea(filaCompararSinGuion, otroUsuarioSinColumna);
         similitudes.push(similitud);
         let datosUsuario: datosType = {usuario: i, media: ss.mean(otroUsuario), valor: otroUsuario[posiciones.at(0)[1]] as number, similitud: similitud};
         
         datosFinalesUsuario.push(datosUsuario);
       }
     }

     console.log('Similitudes con distancia euclidea: ', similitudes);
     return [datosFinalesUsuario, ss.mean(filaCompararSinGuion)];
  }
}

/**
 * Distancia Euclidea.
 */
export function distanciaEuclidea (arrayA: (number | '-') [], arrayB: (number | '-') []): number {

  //? sqrt(sumatorio (r(u,i) - r(v,i))^2)
  let resultado: number = 0;
  let sumatorio: number = 0;

  for (let i = 0; i < arrayA.length; i++) {
    if (arrayA[i] != "-" && arrayB[i] != "-" ) { // no haría falta comprobar, ya se ha filtrado.
      sumatorio += Math.pow((arrayA[i] as number) - (arrayB[i] as number), 2);
    }
  }
  
  resultado = Math.sqrt(sumatorio);
  return resultado;
}


export function media (datos: datosType[]): number {
  let suma: number = 0;
  for (const dato of datos) {
    suma += dato.valor;
  }
  return suma/datos.length;
}


/**
 * Función que calcula una predicción. Simple o con la media.
 */

export function prediccion(prediccion: boolean, datos: datosType[], vecinos: number, mediaUsuarioComparar: number): void {
  // Ordenar los datos de mayor a menor
  datos.sort((a,b) => b.similitud-a.similitud);
  // Seleccionar los vecinos
  let vecinosSeleccionados: datosType[] = [];
  for (let i = 0; i < vecinos; i++) {
    vecinosSeleccionados.push(datos[i]);
  }
  console.log('Los vecinos más parecidos son: \n', vecinosSeleccionados);
  // return vecinosSeleccionados

  // si prediccion es false, se calcula con los valores
  // si prediccion es true, se calcula con la media
  if (prediccion === false) {
    // (sumatorio de (similitud * valor)) / sumatorio de similitudes
    prediccionSimple(vecinosSeleccionados);
  }
  else {
    prediccionMedia(vecinosSeleccionados, mediaUsuarioComparar);
  }

}


export function prediccionSimple (vecinosSeleccionados: datosType[]): void {
  
  let numerador: number = 0;
  let denominador: number = 0;
  for (const vecino of vecinosSeleccionados) {
    numerador += vecino.similitud * vecino.valor;
    // valor absoluto de la similitud
    denominador += Math.abs(vecino.similitud);
  }
  const prediccion: number = numerador/denominador;
  console.log('prediccion: ', prediccion);
}

export function prediccionMedia (vecinosSeleccionados: datosType[], mediaUsuarioComparar: number): void {

  let numerador: number = 0;
  let denominador: number = 0;

  const media: number = mediaUsuarioComparar;


  for (const vecino of vecinosSeleccionados) {
    numerador += vecino.similitud * (vecino.valor - vecino.media);
    // valor absoluto de la similitud
    denominador += Math.abs(vecino.similitud);
  }
  const prediccion: number = media + (numerador/denominador);
  console.log('prediccion: ', prediccion);
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