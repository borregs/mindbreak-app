# mindbreak-app

### PROPUESTA DE PROYECTO: APLICACION WEB “MANIPULACION DE IMAGENES”

Objetivo general: 
desarrollar una aplicacion web para facilitar la eliminacion de fondos de imagenes de manera sencilla mediante la integracion de IA.

Objetivos especificos:
1. Definir una arquitectura para la aplicacion web con el fin de facilitar el proceso de desarrollo
2. Diseñar conjuntos de wireframes para la visualizacion de la interfaz grafica de la APP
3. Programar el prototipo minimo viable para la evaluacion mediante pruebas establecidas.

# Requerimientos de proyecto

Requerimientos del juego de rompecabezas (versión un jugador)
Requerimientos Funcionales (RF)

1. **Carga de imágenes**
    - 1.1: El sistema permitirá que el usuario seleccione una imagen desde su dispositivo.
    - 1.2: El sistema ofrecerá imágenes predeterminadas en caso de que el usuario no suba una propia.
2. **Generación del rompecabezas**
    - 2.1: El sistema dividirá la imagen en piezas de acuerdo con la dificultad seleccionada (ejemplo: 3x3, 5x5, 7x7).
    - 2.2: El sistema desordenará automáticamente las piezas para iniciar el juego.
3. **Interacción del jugador**
    - 3.1: El usuario podrá arrastrar y soltar piezas para reacomodarlas en el tablero.
    - 3.2: El sistema deberá permitir rotar piezas si la modalidad de dificultad lo requiere (opcional para futuro).
    - 3.3: El sistema mostrará el progreso del rompecabezas (ejemplo: número de piezas bien colocadas).
4. **Finalización del juego**
    - 4.1: El sistema detectará cuando todas las piezas estén colocadas en la posición correcta.
    - 4.2: Al completar el rompecabezas, el sistema mostrará un mensaje de felicitación y/o una animación de éxito.
5. **Opciones adicionales**
    - 5.1: El sistema permitirá reiniciar el rompecabezas en cualquier momento.
    - 5.2: El sistema permitirá elegir la dificultad antes de iniciar la partida.
    - 5.3: El sistema mostrará un temporizador opcional para medir el tiempo que tardó el usuario.
6. **Sistema removedor de fondo**
- 1: El sistema se encontrará en una sección separada del rompecabezas.
- 2: Tendrá la capacidad de eliminar el fondo de una imagen proporcionada por el usuario.

## Requerimientos No Funcionales (RNF)

1. **Usabilidad**
    - 1.1: La interfaz deberá ser intuitiva y fácil de usar, con instrucciones claras.
    - 1.2: El sistema deberá ser responsivo, es decir, funcionar correctamente en PC, Tablet y móvil.
2. **Rendimiento**
    - 2.1: El sistema deberá generar el rompecabezas en menos de 3 segundos después de subir la imagen.
    - 2.2: El tiempo de respuesta al mover una pieza no deberá superar los 200 ms.
3. **Compatibilidad**
    - 3.1: El sistema deberá ser compatible con los navegadores principales (Chrome, Firefox, Edge).
    - 3.2: El juego deberá funcionar sin necesidad de instalar aplicaciones adicionales (solo navegador).
4. **Seguridad**
    - 4.1: Las imágenes cargadas por el usuario no deberán almacenarse en un servidor (solo uso temporal en el navegador).
    - 4.2: El sistema deberá evitar la ejecución de archivos maliciosos al cargar imágenes.
5. **Estabilidad**
    - 5.1: El sistema no deberá presentar errores críticos que detengan el juego durante la sesión.
    - 5.2: En caso de error, el sistema deberá permitir reiniciar la partida sin perder acceso al juego.
  
## a) Hardware requerido para funcionamiento
Servidor
•	Procesador: 2 núcleos a 2.0 GHz o superior
•	Memoria RAM: 4 GB mínimo
•	Almacenamiento: 20 GB disponible
•	Conexión a Internet estable
Equipos del Usuario
•	Computadora con procesador Intel Core i3 o equivalente
•	Memoria RAM: 4 GB mínimo
•	Conexión a Internet: 5 Mbps mínimo
•	Resolución de pantalla: 1366x768 mínimo

## b) Software y navegadores compatibles
Navegadores Web (Únicos Garantizados)
El sistema funcionará correctamente en:
•	Google Chrome versión 90 o superior
•	Mozilla Firefox versión 88 o superior
•	Microsoft Edge versión 90 o superior
•	Safari versión 14 o superior

Para correr el programa

Después de instalar nodejs

```
npm install (instalar librerías)
npm run dev
```