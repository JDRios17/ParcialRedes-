// =====================================================================
// CAPA DE SERVICIO (lógica de negocio) - ms-cursos
// Aplica reglas de negocio y validaciones sin depender de HTTP ni SQL.
// =====================================================================
const repo = require('../repositories/cursos.repository');
const { validarCurso, construirCurso } = require('../models/cursos');
const HttpError = require('../utils/http-error');

function validarIdEntero(idParam) {
  const id = Number(idParam);
  if (!Number.isInteger(id) || id <= 0) {
    throw new HttpError(400, 'El parámetro id debe ser un número entero positivo');
  }
  return id;
}

async function listar(filtros = {}) {
  return repo.findAll(filtros);
}

async function obtener(idParam) {
  const id = validarIdEntero(idParam);
  const curso = await repo.findById(id);
  if (!curso) {
    throw new HttpError(404, `No existe el curso con id ${id}`);
  }
  return curso;
}

async function crear(datos) {
  const errores = validarCurso(datos);
  if (errores.length > 0) {
    throw new HttpError(400, 'Datos inválidos', errores);
  }

  const curso = construirCurso(datos);

  const existente = await repo.findByCodigo(curso.codigo);
  if (existente) {
    throw new HttpError(409, `Ya existe un curso con el código ${curso.codigo}`);
  }

  return repo.create(curso);
}

async function actualizar(idParam, datos) {
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

  const actualizado = await repo.update(id, cursoActualizado);
  if (!actualizado) {
    throw new HttpError(404, `No existe el curso con id ${id}`);
  }

  return actualizado;
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