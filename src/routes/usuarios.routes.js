import { Router } from 'express';
import { verificarToken, verificarAdministrador } from '../middlewares/validateToken.js';
import { validarCamposRegisterAprendiz, validarCamposRegisterProfesional, validarCamposAuch } from '../middlewares/validateAuchts.js';
import { registroUsuarioAprendiz, registroUsuarioAdministrador, registroUsuarioProfesional, loginUsuarioProfesional, loginUsuarioAprendiz, loginUsuarioAdministrador, solicitudAccesoProfesional, aceptarProfesional, verUsuario, verUsuariosProfesionales, rechazarProfesional, solicitudRechazadasProfesional, verUsuarios} from '../controllers/usuarios.controllers.js';

// imagenes
import multer from 'multer';
import { storage } from '../middlewares/cloudinary.js';
const upload = multer({
    storage: storage
})

const router = Router();

router.post("/registrarAdministrador", validarCamposRegisterProfesional, verificarToken, verificarAdministrador,  registroUsuarioAdministrador);

//
const inputProfesional = upload.fields([{name: 'imgProfesional'}]);
router.post("/registrarProfesional", inputProfesional, validarCamposRegisterProfesional, registroUsuarioProfesional);

//
const inputAprendiz = upload.fields([{name: 'imgAprendiz'}]);
router.post("/registrarAprendiz", inputAprendiz, validarCamposRegisterAprendiz,  registroUsuarioAprendiz);

router.post("/loginProfesional", validarCamposAuch, loginUsuarioProfesional);
router.post("/loginAprendiz", validarCamposAuch, loginUsuarioAprendiz);
router.post("/loginAdministrador", validarCamposAuch, loginUsuarioAdministrador);
router.get("/solicitudesProfesional", verificarToken, verificarAdministrador,  solicitudAccesoProfesional);
router.put("/aceptarProfesional/:id", verificarToken, verificarAdministrador,  aceptarProfesional);
router.get("/solicitudesRechazadasProfesional",verificarToken, verificarAdministrador,solicitudRechazadasProfesional)
router.put("/rechazarProfesional/:id", verificarToken,verificarAdministrador,rechazarProfesional);
router.get("/usuario/:id", verUsuario);
router.get("/verUsuarios", verUsuarios);
router.get("/verUsuariosProfesionales", verUsuariosProfesionales)



export default router;