// =====================================================================
// CAPA DE ACCESO A DATOS (repositorio) - ms-cursos
// Única capa que ejecuta consultas SQL sobre la tabla cursos en MySQL.
// =====================================================================
const pool = require('../utils/db');

async function findAll(filtros = {}) {
  let sql = 'SELECT id, codigo, nombre, creditos, cupo, semestre FROM cursos';
  const condiciones = [];
  const valores = [];

  if (filtros.semestre) {
    condiciones.push('semestre = ?');
    valores.push(String(filtros.semestre).trim());
  }

  if (condiciones.length > 0) {
    sql += ' WHERE ' + condiciones.join(' AND ');
  }

  sql += ' ORDER BY id ASC';
  const [filas] = await pool.query(sql, valores);
  return filas;
}

async function findById(id) {
  const [filas] = await pool.query(
    'SELECT id, codigo, nombre, creditos, cupo, semestre FROM cursos WHERE id = ?',
    [id]
  );
  return filas.length > 0 ? filas[0] : null;
}

async function findByCodigo(codigo) {
  const [filas] = await pool.query(
    'SELECT id, codigo, nombre, creditos, cupo, semestre FROM cursos WHERE codigo = ?',
    [String(codigo).trim()]
  );
  return filas.length > 0 ? filas[0] : null;
}

async function create(curso) {
  const [resultado] = await pool.query(
    'INSERT INTO cursos (codigo, nombre, creditos, cupo, semestre) VALUES (?, ?, ?, ?, ?)',
    [curso.codigo, curso.nombre, curso.creditos, curso.cupo, curso.semestre]
  );
  return findById(resultado.insertId);
}

async function update(id, curso) {
  const [resultado] = await pool.query(
    'UPDATE cursos SET codigo = ?, nombre = ?, creditos = ?, cupo = ?, semestre = ? WHERE id = ?',
    [curso.codigo, curso.nombre, curso.creditos, curso.cupo, curso.semestre, id]
  );
  if (resultado.affectedRows === 0) return null;
  return findById(id);
}

async function remove(id) {
  const cursoExistente = await findById(id);
  if (!cursoExistente) return null;

  const [resultado] = await pool.query('DELETE FROM cursos WHERE id = ?', [id]);
  return resultado.affectedRows > 0 ? cursoExistente : null;
}

module.exports = {
  findAll,
  findById,
  findByCodigo,
  create,
  update,
  remove,
};