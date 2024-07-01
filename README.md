# multi-chat
chat app with different providers

# Requisitos previos
el usuario debe crear una base de datos en postgres llamada multi-chat
verificar que tenga una version de node instalada superior o igual a 16.0 puedes verificarlo con `node -v` en consola
# Instalacion
-  descargar el repositorio
-  ir a la carpeta raíz del proyecto en consola
-  correr el comando de instalación `npm i`
-  debemos reemplazar en el archivo .env de la carpeta api el valor de los datos de la base de datos con los tuyos
-  en el front mover a la carpeta front el archivo .env que se le facilitará por dm
-  correr ambas instacias (front, api) con `npm run dev:api` luego `npm run dev:front`
-  el proyecto debería funcionar correctamente
# puesta en producción
-  en la carpeta root correr los scripts `npm run build:api` luego `npm run build:front` en ese orden
-  luego el script `npm run serve`
