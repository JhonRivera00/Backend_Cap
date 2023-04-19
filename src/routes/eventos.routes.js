import { Router } from 'express';

// controllers
import { crearEvento, verEventos, verEventosCrono, actualizaEvento } from '../controllers/eventos.controllers.js';

// Verificaciones
import { verificarToken, verificarAdministrador } from '../middlewares/validateToken.js';

// imagenes
import multer from 'multer';
import { storage } from '../middlewares/cloudinary.js';
const upload = multer({
    storage: storage
})

const router = Router();

const input = upload.fields([{name: 'eventoImg'}]);
router.post("/crearEventos", verificarToken, verificarAdministrador, input, crearEvento);

router.get("/verEventos", verEventos);
router.get("/verEventosCronograma", verEventosCrono);
router.put("/actualizarEvento/:id", verificarToken, verificarAdministrador, actualizaEvento);

export default router;