import { Router } from 'express';
import { misNotificaciones, notificacionesAbiertas } from '../controllers/notificaciones.controllers.js';

const router = Router();

router.get("/notificaciones/:id", misNotificaciones);
router.put("/notificacionVista/:id", notificacionesAbiertas)

export default router;