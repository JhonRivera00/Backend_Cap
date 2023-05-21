import { Router } from 'express';
// controllers
import { actualizarEvento, crearEvento, verEventos} from '../controllers/eventos.controllers.js';
// Verificaciones
import { verificarToken, verificarAdministrador } from '../middlewares/validateToken.js';
// imagenes
import multer from 'multer';
import { storage } from '../middlewares/cloudinary.js';
const upload = multer({
    storage: storage
})

const router = Router();

const inputImg = upload.fields([{ name: 'eventoImg', maxCount: 1 },{ name: 'pdf', maxCount: 1 }]);
router.post("/crearEventos", verificarToken, verificarAdministrador, inputImg, crearEvento);
router.get("/verEventos", verEventos);
router.put("/actualizarEvento/:id", verificarToken, verificarAdministrador,inputImg, actualizarEvento);
  

export default router;