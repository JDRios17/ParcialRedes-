// =====================================================================
// CLIENTE HTTP de ms-docentes, para el microservicio de cursos.
// Ubicación: ms-cursos/src/clients/docentes.client.js
// Variable en .env de ms-cursos: DOCENTES_URL=http://127.0.0.1:3012
// =====================================================================
const HttpError = require('../utils/http-error');
const DOCENTES_URL = process.env.DOCENTES_URL;

// Hace una petición GET a ms-docentes reenviando el token del usuario.
// Devuelve la respuesta de fetch, o null si ms-docentes no respondió.
async function pedir(ruta, token) {
  try {
    return await fetch(`${DOCENTES_URL}${ruta}`, {
      headers: { Authorization: token },     // el token de la petición original
      signal: AbortSignal.timeout(3000),      // no esperar más de 3 segundos
    });
  } catch (error) {
    return null;                              // ms-docentes caído o sin responder
  }
}

function formatearDocente(docente) {
  if (!docente || typeof docente !== 'object') return null;
  return {
    id: docente.id,
    nombre_completo: docente.nombre_completo,
    email: docente.email,
  };
}

// Tarea 2 y Tarea 3: valida existencia (400), disponibilidad (503) y estado activo (409)
async function validarDocenteParaAsignacion(docenteId, token) {
  const respuesta = await pedir(`/docentes/${docenteId}`, token);

  if (!respuesta) {
    throw new HttpError(503, 'El servicio ms-docentes no está disponible');
  }

  if (respuesta.status === 404) {
    throw new HttpError(400, `El docente con id ${docenteId} no existe`);
  }

  if (!respuesta.ok) {
    throw new HttpError(503, `Error al consultar ms-docentes (estado ${respuesta.status})`);
  }

  const docente = await respuesta.json();

  if (docente.activo === false || docente.activo === 0) {
    throw new HttpError(409, `El docente con id ${docenteId} está inactivo y no puede asignarse`);
  }

  return formatearDocente(docente);
}

// Tarea 4: obtiene un docente para GET /cursos/:id
async function obtenerDocentePorId(docenteId, token) {
  if (!docenteId) {
    return { docente: null, aviso: 'El curso no tiene docente_id asignado' };
  }

  const respuesta = await pedir(`/docentes/${docenteId}`, token);
  if (!respuesta) {
    return { docente: null, aviso: 'No se pudo consultar ms-docentes (servicio no disponible)' };
  }

  if (respuesta.status === 404) {
    return { docente: null, aviso: `Docente con id ${docenteId} no encontrado en ms-docentes` };
  }

  if (!respuesta.ok) {
    return { docente: null, aviso: `ms-docentes respondió con estado ${respuesta.status}` };
  }

  const docente = await respuesta.json();
  return { docente: formatearDocente(docente), aviso: null };
}

// Tarea 4: obtiene varios docentes en UNA sola petición ?ids= para GET /cursos
async function obtenerDocentesPorIds(ids, token) {
  const idsUnicos = [...new Set((ids || []).filter((id) => Number.isInteger(Number(id)) && Number(id) > 0).map(Number))];
  const mapaDocentes = new Map();

  if (idsUnicos.length === 0) {
    return { mapaDocentes, aviso: null };
  }

  const queryIds = encodeURIComponent(idsUnicos.join(','));
  const respuesta = await pedir(`/docentes?ids=${queryIds}`, token);

  if (!respuesta) {
    return {
      mapaDocentes,
      aviso: 'No se pudo consultar ms-docentes (servicio no disponible)',
    };
  }

  if (!respuesta.ok) {
    return {
      mapaDocentes,
      aviso: `ms-docentes respondió con estado ${respuesta.status}`,
    };
  }

  const datos = await respuesta.json();
  const lista = Array.isArray(datos) ? datos : Array.isArray(datos?.data) ? datos.data : [];

  for (const item of lista) {
    if (item && item.id !== undefined) {
      mapaDocentes.set(Number(item.id), formatearDocente(item));
    }
  }

  return { mapaDocentes, aviso: null };
}

module.exports = {
  pedir,
  validarDocenteParaAsignacion,
  obtenerDocentePorId,
  obtenerDocentesPorIds,
};