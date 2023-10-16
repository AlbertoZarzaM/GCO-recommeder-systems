"use strict";
/**
 * Gestión del fichero de entrada
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.desnormalizarMatriz = exports.normalizarMatriz = exports.leerArchivo = exports.maxVal = exports.minVal = void 0;
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
        console.log('Matriz sin normalizar', matriz);
        desnormalizarMatriz(normalizarMatriz(matriz, exports.minVal, exports.maxVal), exports.minVal, exports.maxVal);
        return normalizarMatriz(matriz, exports.minVal, exports.maxVal);
    }
    catch (error) {
        console.error('Error al leer el archivo');
        process.exit(1);
    }
}
exports.leerArchivo = leerArchivo;
/**
 * Función que normaliza la matriz entre 0 y 1
 * @params matriz_aux matriz a normalizar
 * @params minVal valor mínimo de la matriz
 * @params maxVal valor máximo de la matriz
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
    console.log('Matriz normalizada', matriz_normalizada);
    return matriz_normalizada;
}
exports.normalizarMatriz = normalizarMatriz;
function desnormalizarMatriz(matrizNormalizada, minVal, maxVal) {
    var matrizDesnormalizada = [];
    // Recorremos la matriz
    for (var i = 0; i < matrizNormalizada.length; i++) {
        var fila = [];
        for (var j = 0; j < matrizNormalizada[i].length; j++) {
            if (matrizNormalizada[i][j] == '-') {
                fila.push('-');
            }
            else {
                // minVal=1, maxVal=5
                // 2 desnormalizada = 0.25 normalizada
                console.log('valor*(max-min)+min');
                console.log(matrizNormalizada[i][j], '*', maxVal, '-', minVal, '+', minVal, '=', (matrizNormalizada[i][j] * (maxVal - minVal)) + minVal);
                fila.push((matrizNormalizada[i][j] * (maxVal - minVal)) + minVal);
            }
        }
        matrizDesnormalizada.push(fila);
    }
    console.log('Matriz desnormalizada', matrizDesnormalizada);
    return matrizDesnormalizada;
}
exports.desnormalizarMatriz = desnormalizarMatriz;
leerArchivo('../../diapositivas.txt');
// leerArchivo('./diapositivas.txt'); // Reemplaza 'archivo.txt' con la ruta de tu archivo.
