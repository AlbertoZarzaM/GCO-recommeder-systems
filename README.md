# Gestión del conocimiento en las organizaciones

## Práctica 4: Sistemas de Recomendación. Métodos de filtrado colaborativo


#### Autores:
- Ismael Martín Herrera (alu0101397375@ull.edu.es)
- Alberto Zarza Martín (alu0101412993@ull.edu.es)
- Marco Antonio Barroso Hormiga (alu0101386560@ull.edu.es)

### Guía de instalación

Para poder ejecutar el programa, deberemos seguir los siguientes pasos:
1. Instalar NVM (Node Version Manager): 
``` bash
  wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
  exec bash -l
```
2. A continuación, instalaremos la versión de node que vamos a utilizar:
``` bash
  nvm install 20.8.0 
```
3. Instalaremos TypeScript:
``` bash
  npm install --global typescript
```

4. Instalaremos las dependencias del proyecto:
``` bash
  npm install
```

### Descripción del código desarrollado

El código desarrollado se encuentra en el directorio src en el que se encuentran los siguientes ficheros:

- ```main.ts```: Fichero principal del programa. En este fichero se encuentra la función main que se encarga de parsear los argumentos de entrada y llamar a la función que se encarga de ejecutar el algoritmo.

- ```funciones_metricas.ts```: En este fichero se encuentran las funciones que se encargan de calcular las distintas métricas que se piden en el enunciado. 

Estas funciones son:
  - **distanciaCoceno**: Calcula la distancia del coseno entre dos vectores.
  - **distanciaEuclidea**: Calcula la distancia euclidea entre dos vectores.
  - **correlacionPearson**: Calcula la correlación de Pearson entre dos vectores.
  - **matrizAString**: Convierte una matriz a un string para poder escribirla en un fichero.
  - **media**: Calcula la media de un vector.
  - **prediccionMedia**: Calcula la predicción de un usuario para un item utilizando la media de los ratings del usuario.
  - **prediccionSimple**: Calcula la predicción de un usuario para un item utiliz
  - **prediccion**: Se encarga de calcular la predicción de un usuario utilizando las dos funciones anteriores.
  - **filtradoMetrica**: función que se encarga de filtrar la matriz de utilidad para obtener los datos necesarios para calcular la similitud   entre el usuario principal y el resto de usuarios.
  - **gestionarLlamadasSimilitud**: función que se encargar de llamar las veces necesarias a la función que calcula la similitud para cada uno de los usuarios principales, es decir, con incógnitas.
  - **filasGuion**: Función para obtener los índices de las filas en las que hay guiones independientemente de la columna
  - **guion**: Funcion que localiza y extrae las posiciones de los guiones de la matriz.

- **Directorio** ```./src/fichero/```: en este directorio se encuentra el fichero ```LecturaEscritura.ts``` que se encarga de leer el fichero de entrada y convertirlo en una matriz de utilidad. 

### Ejemplo de ejecución

``` bash
  node dist/main.js -f ficheros-pruebas/ejemplo-0.txt -m 1 -n 2 -t 1 -o salida-3.txt
```