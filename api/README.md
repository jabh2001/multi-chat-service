backend for multi-chat api

## Ejemplo de un Archivo .env

```dotenv
# Las variables de entorno se definen en formato KEY=VALUE

# database config
DB_USER="postgres"
DB_HOST="localhost"
DB_NAME="multi-chat"
DB_PASSWORD="123456"
DB_PORT="5432"
NODE_ENV="dev"

# db config para los test, en caso de querer dejar intacta la otra
DB_TEST_USER="postgres"
DB_TEST_HOST="localhost"
DB_TEST_NAME="test-multi-chat"
DB_TEST_PASSWORD="123456"
DB_TEST_PORT="5432"

# tokens, keys y passwords
JWT_SECRET_KEY="YOURSECRETKEYGOESHERE"
USER_ADMIN_PASSWORD="a super secret admin password"
SUPER_AUTH_ADMIN_TOKEN="superauthadmintoken"