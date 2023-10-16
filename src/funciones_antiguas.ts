// export function filtradodistanciaCoseno(matriz: (number | '-')[][]): [datosType[], number] {
//   let matrizCorrelacion: number[][] = [];
//   let datosFinalesUsuario: datosType[] = [];
//   const posiciones: [number, number][] = guion(matriz);
//   if (posiciones.length == 1) {
//     const principalFilaComparar: (number | '-')[] = matriz[Number(posiciones.at(0)[0])];
//     console.log('Usuario a comparar: ', principalFilaComparar);
//     let filaCompararSinGuion: (number)[] = []; // Fila del usuario a comparar obviando el guión
//     for (const elemento of principalFilaComparar) {
//       if (elemento != '-') {
//         filaCompararSinGuion.push(elemento);
//       }
//     }
//     console.log('filaCompararSinGuion: ', filaCompararSinGuion);
//     const similitudes: number[] = [];
//     for (let i = 0; i < matriz.length; i++) {
//       // La fila del usuario a comparar se obvia
//       if (i != posiciones.at(0)[0]) {
//         const vecino: number[] = matriz[i] as number[];
//         const vecinoSinColumna: number[] = [];
//         for (let j = 0; j < vecino.length; ++j) {
//           if (j != posiciones.at(0)[1]) {
//             vecinoSinColumna.push(vecino[j]);
//           }
//         }
//         let similitud = distanciaCoseno(filaCompararSinGuion, vecinoSinColumna);
//         similitudes.push(similitud);
//         let datosUsuario: datosType = { usuario: i, media: ss.mean(vecino), valor: vecino[posiciones.at(0)[1]] as number, similitud: similitud };

//         datosFinalesUsuario.push(datosUsuario);
//       }
//     }

//     console.log('Similitudes con distancia coseno: ', similitudes);
//     return [datosFinalesUsuario, ss.mean(filaCompararSinGuion)];
//   }
// }



// export function filtradodistanciaEuclidea(matriz: (number | '-')[][]): [datosType[], number] {
//   let matrizCorrelacion: number[][] = [];
//   let datosFinalesUsuario: datosType[] = [];
//   const posiciones: [number, number][] = guion(matriz);
//   if (posiciones.length == 1) {
//     const principalFilaComparar: (number | '-')[] = matriz[Number(posiciones.at(0)[0])];
//     console.log('Usuario a comparar: ', principalFilaComparar);
//     let filaCompararSinGuion: (number)[] = []; // Fila del usuario a comparar obviando el guión
//     for (const elemento of principalFilaComparar) {
//       if (elemento != '-') {
//         filaCompararSinGuion.push(elemento);
//       }
//     }
//     console.log('filaCompararSinGuion: ', filaCompararSinGuion);

//     const similitudes: number[] = [];
//     for (let i = 0; i < matriz.length; i++) {
//       // La fila del usuario a comparar se obvia
//       if (i != posiciones.at(0)[0]) {
//         const vecino: number[] = matriz[i] as number[];
//         const vecinoSinColumna: number[] = [];
//         for (let j = 0; j < vecino.length; ++j) {
//           if (j != posiciones.at(0)[1]) {
//             vecinoSinColumna.push(vecino[j]);
//           }
//         }
//         let similitud = distanciaEuclidea(filaCompararSinGuion, vecinoSinColumna);
//         similitudes.push(similitud);
//         let datosUsuario: datosType = { usuario: i, media: ss.mean(vecino), valor: vecino[posiciones.at(0)[1]] as number, similitud: similitud };

//         datosFinalesUsuario.push(datosUsuario);
//       }
//     }

//     console.log('Similitudes con distancia euclidea: ', similitudes);
//     return [datosFinalesUsuario, ss.mean(filaCompararSinGuion)];
//   }
// }

/**
 * Correlacion de pearson
 */
// export function correlacionPearson(matriz: (number | '-')[][], filaPrincipal: number): [datosType[], number] {
//   let matrizCorrelacion: number[][] = [];
//   let datosFinalesUsuario: datosType[] = [];

//   const principalFilaComparar: (number | '-')[] = matriz[filaPrincipal]; //* Obtención de la fila del usuario a comparar con los demás
//   console.log('Usuario a comparar: ', principalFilaComparar);

//   const coeficientes: number[] = []; // similitudes.
  
//   for (let i = 0; i < matriz.length; i++) {
//     // La fila del usuario a comparar se obvia
//     if (i != filaPrincipal) {
//       const vecino: (number|'-') [] = matriz[i] as number[]; //fila del usuario B CON GUIONES
//       const vecinoSinGuiones: number[] = []; //fila del usuario B SIN GUIONES
//       const principalFilaCompararSinGuiones: number[] = []; //fila del usuario A SIN GUIONES
      
//       //En el mismo for vamos a mirar si en alguna de las 2 filas hay un guion.
//       for (let j = 0; j < principalFilaComparar.length; ++j) {
//         if (principalFilaComparar[j] != '-' && vecino[j] != '-') {
//           principalFilaCompararSinGuiones.push(principalFilaComparar[j] as number);
//           vecinoSinGuiones.push(vecino[j] as number);
//         } 
//         // si hay un guion no hacemos nada, pasamos a la siguiente columna.
//       }

//       //? comprobamos que hay suficientes valores para comparar
//       if (principalFilaComparar.length == 0 || vecinoSinGuiones.length == 0) {
//         console.log('No se puede comparar, no hay suficientes valores');
//       }


//       let similitud = ss.sampleCorrelation(principalFilaCompararSinGuiones, vecinoSinGuiones);
//       coeficientes.push(similitud);
//       let datosUsuario: datosType = { usuario: i, media: media(vecino) , similitud: similitud };

//       datosFinalesUsuario.push(datosUsuario);
//     }
//   }

//   console.log('Similitudes por correlación de pearson: ', coeficientes);
//   return [datosFinalesUsuario, media(principalFilaComparar)];

// }