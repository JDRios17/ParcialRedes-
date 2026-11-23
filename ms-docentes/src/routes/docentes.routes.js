// CAPA DE PRESENTACIÓN: rutas de docentes (solo lectura, cualquier rol autenticado)
const { Router } = require('express');
const controller = require('../controllers/docentes.controller');
const { verificarToken } = require('../middlewares/auth');

const router = Router();

router.use(verificarToken);                // todas las rutas exigen token

router.get('/', controller.listar);       // GET /docentes  y  GET /docentes?ids=1,3
router.get('/:id', controller.obtener);   // GET /docentes/:id

module.exports = router;
