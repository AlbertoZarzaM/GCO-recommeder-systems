# Gestión del conocimiento en las organizaciones
Instrucciones de instalación de dependencias, despliegue, etc. del software creado.
Descripción del código desarrollado.
Ejemplo de uso.











### Guia de instalación
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash

exec bash -l

nvm install 20.8.0 

npm install --global typescript


### Ejemplo de ejecución
node dist/main.js -f ficheros-pruebas/ejemplo-0.txt -m 1 -n 2 -t 1 -o salida-3.txt