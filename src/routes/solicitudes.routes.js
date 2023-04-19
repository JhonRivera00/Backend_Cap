import { Router } from 'express';
import { crearSolicitud, verSolicitudesProfesional, aceptarSolicitud, aplazarSolicitud} from '../controllers/solicitudes.controllers.js';

const router = Router();

router.post("/crearSolicitud", crearSolicitud);
router.get("/solicitudes/:id", verSolicitudesProfesional);
router.put("/solicitudesAceptar/:id", aceptarSolicitud);
router.put("/solicitudesAplazar/:id", aplazarSolicitud);


export default router;