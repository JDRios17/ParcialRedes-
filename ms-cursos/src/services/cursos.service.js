// =====================================================================
// CAPA DE SERVICIO (lógica de negocio) - ms-cursos
// Aplica reglas de negocio, validación con ms-docentes y composición.
// =====================================================================
const repo = require('../repositories/cursos.repository');
const { validarCurso, construirCurso } = require('../models/cursos');
const {
  validarDocenteParaAsignacion,
  obtenerDocentePorId,
  obtenerDocentesPorIds,
} = require('../clients/docentes.client');
const HttpError = require('../utils/http-error');

function validarIdEntero(idParam) {
  const id = Number(idParam);
  if (!Number.isInteger(id) || id <= 0) {
    throw new HttpError(400, 'El parámetro id debe ser un número entero positivo');
  }
  return id;
}

async function listar(filtros = {}, token) {
  const cursos = await repo.findAll(filtros);
  const idsDocentes = cursos.map((c) => c.docente_id);
  const { mapaDocentes, aviso } = await obtenerDocentesPorIds(idsDocentes, token);

  const items = cursos.map((curso) => ({
    ...curso,
    docente: mapaDocentes.get(Number(curso.docente_id)) || null,
  }));

  if (aviso) {
    return {
      data: items,
      aviso,
    };
  }

  return items;
}

async function obtener(idParam, token) {
  const id = validarIdEntero(idParam);
  const curso = await repo.findById(id);
  if (!curso) {
    throw new HttpError(404, `No existe el curso con id ${id}`);
  }

  const { docente, aviso } = await obtenerDocentePorId(curso.docente_id, token);
  const respuesta = {
    ...curso,
    docente,
  };

  if (aviso) {
    respuesta.aviso = aviso;
  }

  return respuesta;
}

async function crear(datos, token) {
  const errores = validarCurso(datos);
  if (errores.length > 0) {
    throw new HttpError(400, 'Datos inválidos', errores);
  }

  const curso = construirCurso(datos);

  const existente = await repo.findByCodigo(curso.codigo);
  if (existente) {
    throw new HttpError(409, `Ya existe un curso con el código ${curso.codigo}`);
  }

  const docente = await validarDocenteParaAsignacion(curso.docente_id, token);
  const creado = await repo.create(curso);

  return {
    ...creado,
    docente,
  };
}

async function actualizar(idParam, datos, token) {
  const id = validarIdEntero(idParam);

  const errores = validarCurso(datos);
  if (errores.length > 0) {
    throw new HttpError(400, 'Datos inválidos', errores);
  }

  const cursoActual = await repo.findById(id);
  if (!cursoActual) {
    throw new HttpError(404, `No existe el curso con id ${id}`);
  }

  const cursoActualizado = construirCurso(datos);

  const otroConMismoCodigo = await repo.findByCodigo(cursoActualizado.codigo);
  if (otroConMismoCodigo && Number(otroConMismoCodigo.id) !== id) {
    throw new HttpError(409, `Ya existe otro curso con el código ${cursoActualizado.codigo}`);
  }

  const docente = await validarDocenteParaAsignacion(cursoActualizado.docente_id, token);
  const actualizado = await repo.update(id, cursoActualizado);
  if (!actualizado) {
    throw new HttpError(404, `No existe el curso con id ${id}`);
  }

  return {
    ...actualizado,
    docente,
  };
}

async function eliminar(idParam) {
  const id = validarIdEntero(idParam);
  const eliminado = await repo.remove(id);
  if (!eliminado) {
    throw new HttpError(404, `No existe el curso con id ${id}`);
  }
  return eliminado;
}

module.exports = {
  listar,
  obtener,
  crear,
  actualizar,
  eliminar,
};