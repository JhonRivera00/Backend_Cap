import { Router } from 'express';
import { verificarToken, verificarAdministrador } from '../middlewares/validateToken.js';
import { validarCamposRegisterAprendiz, validarCamposRegisterProfesional, validarCamposAuch } from '../middlewares/validateAuchts.js';
import { registroUsuarioAprendiz, registroUsuarioAdministrador, registroUsuarioProfesional, loginUsuarioProfesional, loginUsuarioAprendiz, loginUsuarioAdministrador, solicitudAccesoProfesional, aceptarProfesional, verUsuario } from '../controllers/usuarios.controllers.js';

const router = Router();

router.post("/registrarAdministrador", validarCamposRegisterProfesional, verificarToken, verificarAdministrador,  registroUsuarioAdministrador);
router.post("/registrarProfesional", validarCamposRegisterProfesional, registroUsuarioProfesional);
router.post("/registrarAprendiz", validarCamposRegisterAprendiz, registroUsuarioAprendiz);

router.post("/loginProfesional", validarCamposAuch, loginUsuarioProfesional);
router.post("/loginAprendiz", validarCamposAuch, loginUsuarioAprendiz);
router.post("/loginAdministrador", validarCamposAuch, loginUsuarioAdministrador);
router.get("/solicitudesProfesional", verificarToken, verificarAdministrador,  solicitudAccesoProfesional);
router.put("/aceptarProfesional/:id", verificarToken, verificarAdministrador,  aceptarProfesional);
router.get("/usuario/:id", verUsuario);


export default router;