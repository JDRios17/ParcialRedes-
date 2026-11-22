// =====================================================================
// CAPA DE RUTAS - ms-cursos
// Exige token en todas las rutas; GET para cualquier rol autenticado;
// POST, PUT y DELETE solo para el rol 'administrador'.
// =====================================================================
const { Router } = require('express');
const router = Router();
const controller = require('../controllers/cursos.controller');
const { verificarToken, requiereRol } = require('../middlewares/auth');

// Todas las rutas exigen token válido
router.use(verificarToken);

// Consulta: cualquier rol autenticado con token válido
router.get('/', controller.listar);
router.get('/:id', controller.obtener);

// Escritura y eliminación: solo rol administrador
router.post('/', requiereRol('administrador'), controller.crear);
router.put('/:id', requiereRol('administrador'), controller.actualizar);
router.delete('/:id', requiereRol('administrador'), controller.eliminar);

module.exports = router;