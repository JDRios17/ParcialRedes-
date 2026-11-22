// =====================================================================
// CAPA DE CONTROLADOR (HTTP) - ms-cursos
// Adapta req/res/next y delega la lógica de negocio a cursos.service.js.
// =====================================================================
const cursosService = require('../services/cursos.service');

async function listar(req, res, next) {
  try {
    const filtros = {
      semestre: req.query.semestre,
    };
    const cursos = await cursosService.listar(filtros);
    return res.status(200).json(cursos);
  } catch (error) {
    return next(error);
  }
}

async function obtener(req, res, next) {
  try {
    const curso = await cursosService.obtener(req.params.id);
    return res.status(200).json(curso);
  } catch (error) {
    return next(error);
  }
}

async function crear(req, res, next) {
  try {
    const cursoCreado = await cursosService.crear(req.body);
    return res.status(201).json(cursoCreado);
  } catch (error) {
    return next(error);
  }
}

async function actualizar(req, res, next) {
  try {
    const cursoActualizado = await cursosService.actualizar(req.params.id, req.body);
    return res.status(200).json(cursoActualizado);
  } catch (error) {
    return next(error);
  }
}

async function eliminar(req, res, next) {
  try {
    await cursosService.eliminar(req.params.id);
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  listar,
  obtener,
  crear,
  actualizar,
  eliminar,
};