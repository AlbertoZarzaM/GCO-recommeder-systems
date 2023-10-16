"use strict";
/**
 * Gestión del fichero de entrada
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizarMatriz = exports.leerArchivo = exports.maxVal = exports.minVal = void 0;
// npm install fs-extra
var fs = require("fs");
// valor minimo de puntuacion asignable por un usuario a un item
exports.minVal = 0;
// valor maximo de puntuacion asignable por un usuario a un item
exports.maxVal = 0;
function leerArchivo(ruta) {
    try {
        var contenido = fs.readFileSync(ruta, 'utf-8');
        var lineas = contenido.split('\n'); // Divide el contenido en lineas
        exports.minVal = parseFloat(lineas.shift()); // Valor mínimo
        exports.maxVal = parseFloat(lineas.shift()); // Valor máximo
        console.log('Valor minimo:', exports.minVal);
        console.log('Valor maximo:', exports.maxVal);
        var matriz = [];
        for (var _i = 0, lineas_1 = lineas; _i < lineas_1.length; _i++) {
            var linea = lineas_1[_i];
            // Procesa cada linea
            var elementosArray = linea.split(" ");
            // console.log('Linea:', elementosArray);
            var lineaFloat = [];
            for (var _a = 0, elementosArray_1 = elementosArray; _a < elementosArray_1.length; _a++) {
                var elemento = elementosArray_1[_a];
                if (elemento == '-') {
                    lineaFloat.push(elemento);
                }
                else {
                    lineaFloat.push(parseFloat(elemento));
                }
            }
            matriz.push(lineaFloat);
        }
        console.log('Matriz', matriz);
        return matriz;
    }
    catch (error) {
        console.error('Error al leer el archivo');
        process.exit(1);
    }
}
exports.leerArchivo = leerArchivo;
/**
 * Función que normaliza la matriz entre 0 y 1
 * Recibe una matriz de números y guiones, valor mínimo y valor máximo
 * @returns matriz normalizada entre 0 y 1.
 */
function normalizarMatriz(matriz_aux, minVal, maxVal) {
    var matriz_normalizada = [];
    // Recorremos la matriz
    for (var i = 0; i < matriz_aux.length; i++) {
        var fila = [];
        for (var j = 0; j < matriz_aux[i].length; j++) {
            if (matriz_aux[i][j] == '-') {
                fila.push('-');
            }
            else {
                fila.push((matriz_aux[i][j] - minVal) / (maxVal - minVal));
            }
        }
        matriz_normalizada.push(fila);
    }
    return matriz_normalizada;
}
exports.normalizarMatriz = normalizarMatriz;
//ALBERTO FUNCION ITERAR SEGUN LOS GUINES QUE HAYA EN LA MATRIZ 
//? TAREAS
/**
 * guardar todas las posiciones de los guiones en una cola
 * normalizar la matriz entre 0 y 1.
 *
 * ! Decidir si ir actualizando los valores de la matriz o seguir con la original.
 * ? Se utilizan las columnas que tienen guión?
 *
 * 1 2 - 3 4
 * - 2 3 4 5
 * 1 2 3 4 -
 *
 * ¿se quitan todas las columnas con guion?
 * ¿solo se quitan entre las filas que se están comparando?
 *
 * Al final desnormalizar la matriz
 * Hacer las funciones iterativas
 *
 */
//leerArchivo('./fichero-ejemplo.txt'); // Reemplaza 'archivo.txt' con la ruta de tu archivo.
