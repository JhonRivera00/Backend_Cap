import { Router } from 'express';
import { misNotificaciones } from '../controllers/notificaciones.controllers.js';

const router = Router();

router.get("/notificaciones/:id", misNotificaciones);

export default router;