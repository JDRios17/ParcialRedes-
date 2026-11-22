// =====================================================================
// MODELO DE DOMINIO - ms-cursos
// Valida los datos de entrada y normaliza/construye el objeto curso.
// No tiene ningún campo de referencia a otra entidad (*_id).
// =====================================================================

const REGEX_SEMESTRE = /^\d{4}-(1|2)$/;

function esEnteroPositivo(valor) {
  return typeof valor === 'number' && Number.isInteger(valor) && valor > 0;
}

function validarCurso(datos = {}, { parcial = false } = {}) {
  const errores = [];

  if (!parcial || Object.prototype.hasOwnProperty.call(datos, 'codigo')) {
    if (typeof datos.codigo !== 'string' || datos.codigo.trim().length === 0) {
      errores.push('El campo codigo es obligatorio y debe ser un texto no vacío');
    }
  }

  if (!parcial || Object.prototype.hasOwnProperty.call(datos, 'nombre')) {
    if (typeof datos.nombre !== 'string' || datos.nombre.trim().length === 0) {
      errores.push('El campo nombre es obligatorio y debe ser un texto no vacío');
    }
  }

  if (!parcial || Object.prototype.hasOwnProperty.call(datos, 'creditos')) {
    if (
      typeof datos.creditos !== 'number' ||
      !Number.isInteger(datos.creditos) ||
      datos.creditos < 1 ||
      datos.creditos > 6
    ) {
      errores.push('El campo creditos debe ser un número entero entre 1 y 6');
    }
  }

  if (!parcial || Object.prototype.hasOwnProperty.call(datos, 'cupo')) {
    if (!esEnteroPositivo(datos.cupo)) {
      errores.push('El campo cupo debe ser un número entero mayor que 0');
    }
  }

  if (!parcial || Object.prototype.hasOwnProperty.call(datos, 'semestre')) {
    if (typeof datos.semestre !== 'string' || !REGEX_SEMESTRE.test(datos.semestre.trim())) {
      errores.push('El campo semestre es obligatorio y debe tener el formato AAAA-1 o AAAA-2');
    }
  }

  return errores;
}

function construirCurso(datos = {}) {
  const curso = {};

  if (datos.codigo !== undefined) {
    curso.codigo = String(datos.codigo).trim();
  }
  if (datos.nombre !== undefined) {
    curso.nombre = String(datos.nombre).trim();
  }
  if (datos.creditos !== undefined) {
    curso.creditos = Number(datos.creditos);
  }
  if (datos.cupo !== undefined) {
    curso.cupo = Number(datos.cupo);
  }
  if (datos.semestre !== undefined) {
    curso.semestre = String(datos.semestre).trim();
  }

  return curso;
}

module.exports = {
  validarCurso,
  construirCurso,
};