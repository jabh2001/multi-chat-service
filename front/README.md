# multi-chat
chat app with different providers

## Ejemplo de un Archivo .env

```dotenv
# Las variables de entorno se definen en formato KEY=VALUE

# esta es la url de la api backend en modo desarrollo, en realidad solo debe cambiar el puerto
VITE_API_URL=http://127.0.0.1:3000/api
VITE_SSE_URL=http://127.0.0.1:3000/listen
VITE_WS_URL=ws://localhost:3000/ws/conversation/
VITE_PROD_WS_URL=ws://localhost:3000/ws/conversation/

# si la aplicación esta siendo servido por el mismo backend dejarlo así, sino debe reemplazarlo por la url pertinente
VITE_PROD_API_URL=/api