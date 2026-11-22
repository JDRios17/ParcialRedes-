// =====================================================================
// Configuración de la aplicación Express - ms-cursos
// Registra middlewares, log de peticiones (método, ruta, código),
// rutas de /cursos y manejo centralizado de errores.
// =====================================================================
const express = require('express');
const cursosRoutes = require('./routes/cursos.routes');

const app = express();

// Convierte el cuerpo JSON de la petición en req.body
app.use(express.json());

// Registro de cada petición recibida: método, ruta y código de respuesta
app.use((req, res, next) => {
  const inicio = Date.now();
  res.on('finish', () => {
    const duracion = Date.now() - inicio;
    console.log(
      `${new Date().toLocaleTimeString()} ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duracion}ms)`
    );
  });
  next();
});

// Endpoint de salud para verificar que el microservicio está activo
app.get('/health', (req, res) => {
  res.status(200).json({ servicio: 'ms-cursos', estado: 'ok' });
});

// Rutas principales del recurso
app.use('/cursos', cursosRoutes);

// Cualquier otra ruta: 404 Not Found
app.use((req, res) => {
  res.status(404).json({
    error: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
  });
});

// Manejo centralizado de errores (HttpError y errores inesperados)
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      error: 'El cuerpo de la petición no es un JSON válido',
    });
  }

  const status = err.status || 500;
  if (status === 500) {
    console.error(err);
  }

  const respuesta = { error: err.message || 'Error interno del servidor' };
  if (err.detalles) {
    respuesta.detalles = err.detalles;
  }

  return res.status(status).json(respuesta);
});

module.exports = app;