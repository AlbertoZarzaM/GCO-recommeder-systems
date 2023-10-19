import {inicial} from "./main";
import {leerArchivo} from "./fichero/readFile";

function procesado() {
  const fileInput = document.getElementById('fileInput') as HTMLInputElement;
  const file = fileInput.files[0];

  const metrica = document.getElementById('metrica') as HTMLInputElement;
  const numeroVecinos = document.getElementById('numeroVecinos') as HTMLInputElement;
  const prediccion = document.getElementById('prediccion') as HTMLInputElement;
    
  let metricaValue: number = 0;
  let numeroVecinosValue: number = 0;
  let prediccionValue: number = 0;

  if (metrica.value === "1") {
    metricaValue = 1;
  } else if (metrica.value === "2") {
    metricaValue = 2;
  } else if (metrica.value === "3") {
    metricaValue = 3;
  }

  numeroVecinosValue = parseInt(numeroVecinos.value);

  if (prediccion.value === "1") {
    prediccionValue = 1;
  } else if (prediccion.value === "2") {
    prediccionValue = 2;
  }

  const resultDiv = document.getElementById('result');

  if (!file) {
    resultDiv.textContent = "Por favor, seleccione un archivo.";
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const fileContent = e.target.result as string;
    procesarFicheroOpciones(fileContent, [metricaValue, numeroVecinosValue, prediccionValue]);
    console.log("aqui")
  };
  reader.readAsText(file);
}

function procesarFicheroOpciones(fileContent: string, opciones: [number, number, number]) {
  console.log("Contenido del archivo:", fileContent)
  console.log("Opciones:", opciones)
  let matriz: (number | '-')[][] = leerArchivo(fileContent);
  inicial(matriz, opciones);
}
