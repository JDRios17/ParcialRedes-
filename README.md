ParcialRedes- — Preparación Módulo 3 (ms-usuarios, ms-cursos y ms-docentes)
Repositorio de preparación para la evaluación del Módulo 3 (Redes y Servicios Multimedia). Contiene el microservicio base ms-usuarios (puerto 3001), el microservicio asignado ms-cursos (puerto 3011) y el microservicio proveedor ms-docentes (puerto 3012).

Configuración y ejecución de ms-cursos
Instalar dependencias:

Bash
npm install
Crear el archivo .env (no se sube a Git) a partir de .env.example:

Fragmento de código
PORT=3011
HOST=127.0.0.1

DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=cursos_db
DB_USER=root
DB_PASSWORD=

JWT_SECRET=RiosEsUnLoboDomesticado
DOCENTES_URL=http://127.0.0.1:3012
Crear y poblar la base de datos cursos_db ejecutando db/schema.sql en MySQL/MariaDB.

Iniciar el servicio:

Bash
npm run dev
(O npm start según el script configurado). Escucha en [http://127.0.0.1:3011](http://127.0.0.1:3011) y registra en consola cada petición recibida (método, ruta y código de respuesta).

Autenticación y roles
El login se realiza en ms-usuarios (POST [http://127.0.0.1:3001/usuarios/login](http://127.0.0.1:3001/usuarios/login)).

Todas las rutas de /cursos exigen token JWT en la cabecera Authorization: Bearer <token>.

GET está permitido para cualquier rol autenticado.

POST, PUT y DELETE están restringidos al rol administrador.

Al comunicarse con ms-docentes, ms-cursos reenvía el token de autorización del usuario en la cabecera Authorization.

Contrato de datos (cursos)
id: entero autoincremental (PK).

codigo: texto (VARCHAR(30)), obligatorio y único (409 si ya existe).

nombre: texto (VARCHAR(120)), obligatorio.

creditos: entero entre 1 y 6 (inclusive).

cupo: entero mayor que 0.

semestre: texto con formato AAAA-1 o AAAA-2 (^[0-9]{4}-(1|2)$).

docente_id: entero positivo (INT NOT NULL, > 0), obligatorio. Referencia al recurso docente expuesto por ms-docentes ([http://127.0.0.1:3012](http://127.0.0.1:3012)).

Integración y reglas con ms-docentes
Cliente HTTP: src/clients/docentes.client.js (usa DOCENTES_URL y reenvía el token del usuario).

Al crear (POST /cursos) y actualizar (PUT /cursos/:id):

Si el docente no existe en ms-docentes (404 en proveedor) → responde 400.

Si el docente está inactivo (activo: false) → responde 409.

Si ms-docentes no responde o falla la conexión → responde 503.

Al consultar (GET /cursos/:id y GET /cursos):

Compone cada curso con docente: { id, nombre_completo, email }.

En GET /cursos, consulta los docentes en una sola petición usando ?ids=....

Si ms-docentes no responde en consultas GET, responde 200 con docente: null y un campo aviso indicando que el servicio proveedor no estuvo disponible.

Endpoints
GET /cursos — Lista todos los cursos (200) compuestos con su docente (o docente: null + aviso si ms-docentes no responde). Soporta filtro opcional ?semestre=AAAA-1 o ?semestre=AAAA-2.

GET /cursos/:id — Obtiene un curso por id (200 con docente, o 404 si no existe / 400 si el ID no es válido).

POST /cursos — Valida y crea un curso (201 al crear; 400 por datos inválidos o docente_id inexistente; 409 por codigo duplicado o docente inactivo; 503 si ms-docentes no responde).

PUT /cursos/:id — Valida y actualiza un curso existente (200, 400, 404, 409 o 503).

DELETE /cursos/:id — Elimina un curso por id (200 o 204, o 404 si no existe).

Colección de Postman
La colección con el flujo de login y los casos de prueba se encuentra en ms-cursos/docs/Parcial3-ms-cursos.postman_collection.json.