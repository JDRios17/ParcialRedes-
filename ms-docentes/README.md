# ms-docentes · Contrato de la API

Microservicio **proveedor** del examen del Módulo 3 (solo lectura). Puerto: **3012**.
Lo consulta el microservicio de cursos, que guarda el atributo `docente_id`.

## Cómo ejecutarlo

Requisitos: Node.js 22.9 o superior, MySQL 8 y ms-usuarios corriendo (para obtener tokens).

1. Como root en MySQL:

```sql
CREATE DATABASE docentes_db;
CREATE USER 'docentes_user'@'localhost' IDENTIFIED BY 'una-clave-segura';
GRANT ALL PRIVILEGES ON docentes_db.* TO 'docentes_user'@'localhost';
```

2. `mysql -u docentes_user -p docentes_db` y luego `SOURCE db/schema.sql;`
3. `npm install`
4. Copiar `.env.example` como `.env`. `JWT_SECRET` debe ser **la misma de ms-usuarios**.
5. `npm run dev`

## Representación

```json
{"id": 1, "nombre_completo": "Marta Lucía Gil", "email": "mgil@uni.edu.co", "activo": true}
```

## Atributos

| Atributo | Tipo |
|---|---|
| id | entero |
| nombre_completo | texto |
| email | texto |
| activo | booleano |

## Endpoints

Todas las peticiones llevan `Authorization: Bearer <token>`. Cualquier rol autenticado puede consultar.

| Operación | Método | URI | Respuesta exitosa | Errores |
|---|---|---|---|---|
| Listar | GET | /docentes | 200 arreglo | 401 |
| Consultar por lotes | GET | /docentes?ids=1,3 | 200 arreglo (solo los que existen) | 400 · 401 |
| Obtener | GET | /docentes/:id | 200 objeto | 400 · 401 · 404 |

## Datos iniciales

| id | nombre_completo | email | activo |
|---|---|---|---|
| 1 | Marta Lucía Gil | mgil@uni.edu.co | true |
| 2 | Jorge Andrés Rey | jrey@uni.edu.co | true |
| 3 | Paula Viveros | pviveros@uni.edu.co | false |
| 4 | Hernán Cárdenas | hcardenas@uni.edu.co | true |

## Para el consumidor

La carpeta `para-el-consumidor/` trae `docentes.client.js` con la función `pedir()` ya escrita (token y tiempo de espera). Se copia en `ms-cursos/src/clients/` y se completa.

## Frontend del examen

La carpeta `frontend/` trae `index.html`, ya configurado para ms-cursos y ms-docentes. No se modifica: se copia al `DocumentRoot` del host virtual del examen en servidor2, y desde Windows se abre `http://examen.<dominio>/`. La página inicia sesión por `/api/usuarios/login` y muestra los listados de `/api/cursos` y `/api/docentes` por el mismo nombre, así que no necesita CORS.

## Me consultan

| Me consulta | Peticiones que me hace |
|---|---|
| ms-cursos | `GET /docentes/:id` (validar) · `GET /docentes?ids=…` (componer) |
