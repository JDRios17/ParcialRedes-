# ParcialRedes- — Preparación Módulo 3 (`ms-usuarios` y `ms-cursos`)

Repositorio de preparación para la evaluación del Módulo 3 (Redes y Servicios Multimedia). Contiene el microservicio base `ms-usuarios` (puerto `3001`) y el microservicio asignado `ms-cursos` (puerto `3011`).

## Configuración y ejecución de `ms-cursos`

1. **Instalar dependencias:**

```bash
npm install
```

2. **Crear el archivo `.env`** (no se sube a Git) a partir de `.env.example`:

```env
PORT=3011
HOST=127.0.0.1

DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=cursos_db
DB_USER=root
DB_PASSWORD=

JWT_SECRET=RiosEsUnLoboDomesticado
```

3. **Crear y poblar la base de datos `cursos_db`** ejecutando `db/schema.sql` en MySQL/MariaDB.

4. **Iniciar el servicio:**

```bash
npm start
```

Escucha en `http://127.0.0.1:3011` y registra en consola cada petición recibida (método, ruta y código de respuesta).

## Autenticación y roles

* El login se realiza en `ms-usuarios` (`POST http://127.0.0.1:3001/usuarios/login`).
* Todas las rutas de `/cursos` exigen token JWT en la cabecera `Authorization: Bearer <token>`.
* `GET` está permitido para cualquier rol autenticado.
* `POST`, `PUT` y `DELETE` están restringidos al rol `administrador`.

## Contrato de datos (`cursos`)

* `id`: entero autoincremental (`PK`).
* `codigo`: texto (`VARCHAR(30)`), obligatorio y único (`409` si ya existe).
* `nombre`: texto (`VARCHAR(120)`), obligatorio.
* `creditos`: entero entre `1` y `6` (inclusive).
* `cupo`: entero mayor que `0`.
* `semestre`: texto con formato `AAAA-1` o `AAAA-2` (`^[0-9]{4}-(1|2)$`).

> **Nota:** esta entidad no contiene campos `*_id` hacia otros microservicios en esta etapa de preparación.

## Endpoints

* `GET /cursos` — Lista todos los cursos (`200`). Soporta filtro opcional `?semestre=AAAA-1` o `?semestre=AAAA-2`.
* `GET /cursos/:id` — Obtiene un curso por `id` (`200`, o `404` si no existe / `400` si el ID no es válido).
* `POST /cursos` — Crea un curso (`201` al crear; `400` por datos inválidos; `409` por `codigo` duplicado).
* `PUT /cursos/:id` — Actualiza un curso existente (`200`, `400`, `404` o `409`).
* `DELETE /cursos/:id` — Elimina un curso por `id` (`200` o `204`, o `404` si no existe).

## Colección de Postman

La colección con el flujo de login y los casos de prueba se encuentra en `ms-cursos/docs/Parcial3-ms-cursos.postman_collection.json`.
