import { Router } from 'express';
import { verPqrsPendientes, crearPqrs, responderPqrs } from '../controllers/pqrs.controllers.js';

const router = Router();

router.get("/verPqrsPendientes", verPqrsPendientes);
router.post("/crearPqrs", crearPqrs)
router.put("/responderPqrs/:id", responderPqrs)

export default router;