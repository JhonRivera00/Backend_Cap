import { Router } from 'express';
import { crearSolicitud, verSolicitudesProfesional, aceptarSolicitud, aplazarSolicitud, verSolicitudes} from '../controllers/solicitudes.controllers.js';
import { verificarAdministrador, verificarToken } from '../middlewares/validateToken.js';

const router = Router();

router.post("/crearSolicitud", crearSolicitud);
router.get("/verSolicitudes/:id",verSolicitudes)
router.get("/solicitudes/:id", verSolicitudesProfesional);
router.put("/solicitudesAceptar/:id", aceptarSolicitud);
router.put("/solicitudesAplazar/:id", aplazarSolicitud);


export default router;