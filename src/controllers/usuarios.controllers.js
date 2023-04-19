import Usuario from "../models/Usuario.js";
import Roles from "../models/Roles.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";

export const registroUsuarioAdministrador = async (req, res) => {
  try {
    const { tipo, numeroDocumento, contrasena, rol } = req.body;

    const usuarioAdministrador = new Usuario(req.body);
    usuarioAdministrador.documento.tipo = tipo;
    usuarioAdministrador.documento.numeroDocumento = numeroDocumento;
    usuarioAdministrador.password = await usuarioAdministrador.hasPassword(
      contrasena
    );

    if (rol) {
      const rolesExistentes = await Roles.find({ nombre: { $in: rol } });
      usuarioAdministrador.rol = rolesExistentes.map((rol) => rol._id);
    }

    const usuarioSave = usuarioAdministrador.save();

    res.status(200).json({
      messagge: "Administrador Registrado Correctamente",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json(" Error en el servidor ");
  }
};

export const registroUsuarioProfesional = async (req, res) => {
  try {
    const { tipo, numeroDocumento, contrasena, rol } = req.body;

    const usuarioProfesional = new Usuario(req.body);
    usuarioProfesional.documento.tipo = tipo;
    usuarioProfesional.documento.numeroDocumento = numeroDocumento;
    usuarioProfesional.password = await usuarioProfesional.hasPassword(
      contrasena
    );

    if (rol) {
      usuarioProfesional.estado.aceptado = false;
      usuarioProfesional.estado.habilitado = false;
      const rolesExistentes = await Roles.find({ nombre: { $in: rol } });
      usuarioProfesional.rol = rolesExistentes.map((rol) => rol._id);
    }

    await usuarioProfesional.save();

    res.status(200).json({
      messagge: "Profesional Registrado Correctamente",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json(" Error en el servidor ");
  }
};

export const registroUsuarioAprendiz = async (req, res) => {
  try {
    const { tipo, numeroDocumento, contrasena } = req.body;

    const usuarioAprendiz = new Usuario(req.body);
    usuarioAprendiz.documento.tipo = tipo;
    usuarioAprendiz.documento.numeroDocumento = numeroDocumento;
    usuarioAprendiz.password = await usuarioAprendiz.hasPassword(contrasena);

    const rolExistente = await Roles.findOne({ nombre: "aprendiz" });
    usuarioAprendiz.rol = [rolExistente._id];

    const usuarioSave = usuarioAprendiz.save();

    const token = jwt.sign({ id: usuarioSave._id }, JWT_SECRET, {
      expiresIn: 86400,
    });

    res.status(200).json({
      token: token,
      messagge: "Usuario Creado Correctamente",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json(" Error en el servidor ");
  }
};

export const loginUsuarioProfesional = async (req, res) => {
  try {
    const { correo, contrasena } = req.body;
    const usuarioExistente = await Usuario.findOne({ correo: correo }).populate(
      "rol"
    );
    if (!usuarioExistente) {
      return res.status(400).json("Correo Incorrecto");
    }

    const validatePassword = await Usuario.validatePassword(
      contrasena,
      usuarioExistente.password
    );
    if (!validatePassword) {
      return res.status(400).json("Contraseña Incorrecta");
    }

    const aceptado = usuarioExistente.estado.aceptado;
    const habilitado = usuarioExistente.estado.habilitado;
    if (!aceptado || !habilitado) {
      return res.status(400).json("!Debes esperar a ser acepetado!");
    }

    const tieneRolProfesional = usuarioExistente.rol.some(
      (rol) => rol.nombre === "profesional"
    );
    const tieneRolAdministrador = usuarioExistente.rol.some(
      (rol) => rol.nombre === "administrador"
    );
    if (!tieneRolProfesional && !tieneRolAdministrador) {
      return res.status(400).json("!No Autorizado!");
    }

    const token = jwt.sign({ id: usuarioExistente._id }, JWT_SECRET, {
      expiresIn: 86400,
    });

    res.status(200).json({
      token: token,
      messagge: "!Login Profesional Correcto!",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json(" Error en el servidor ");
  }
};

export const loginUsuarioAprendiz = async (req, res) => {
  try {
    const { correo, contrasena } = req.body;
    const usuarioExistente = await Usuario.findOne({ correo: correo }).populate(
      "rol"
    );
    if (!usuarioExistente) {
      return res.status(400).json("Correo Incorrecto");
    }

    const validatePassword = await Usuario.validatePassword(
      contrasena,
      usuarioExistente.password
    );
    if (!validatePassword) {
      return res.status(400).json("Contraseña Incorrecta");
    }

    const tieneRolAprendiz = usuarioExistente.rol.some(
      (rol) => rol.nombre === "aprendiz"
    );
    const tieneRolAdministrador = usuarioExistente.rol.some(
      (rol) => rol.nombre === "administrador"
    );
    if (!tieneRolAprendiz && !tieneRolAdministrador) {
      return res.status(400).json("!No Autorizado!");
    }

    const token = jwt.sign({ id: usuarioExistente._id }, JWT_SECRET, {
      expiresIn: 86400,
    });

    res.status(200).json({
      token: token,
      messagge: "!Login Aprediz Correcto!",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json(" Error en el servidor ");
  }
};

export const loginUsuarioAdministrador = async (req, res) => {
  try {
    const { correo, contrasena } = req.body;
    const usuarioExistente = await Usuario.findOne({ correo: correo }).populate(
      "rol"
    );
    if (!usuarioExistente) {
      return res.status(400).json("Correo Incorrecto");
    }

    const validatePassword = await Usuario.validatePassword(
      contrasena,
      usuarioExistente.password
    );
    if (!validatePassword) {
      return res.status(400).json("Contraseña Incorrecta");
    }

    const tieneRolAdministrador = usuarioExistente.rol.some(
      (rol) => rol.nombre === "administrador"
    );
    if (!tieneRolAdministrador) {
      return res.status(400).json("!No Autorizado!");
    }

    const token = jwt.sign({ id: usuarioExistente._id }, JWT_SECRET, {
      expiresIn: 86400,
    });

    res.status(200).json({
      token: token,
      messagge: "!Login Administrador Correcto!",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json(" Error en el servidor ");
  }
};

export const solicitudAccesoProfesional = async (req, res) => {
  try {
    const usuarios = await Usuario.find({"estado.aceptado": false, "estado.habilitado": false }).populate("rol");

    if (!usuarios) {
      return res
        .status(400)
        .json("!Error al traer las solicitdes de acceso como profesional!");
    }

    const usuariosConRolProfesional = [];

    usuarios.forEach((usuario) => {
      if (usuario.rol && usuario.rol.length > 0) {
        usuario.rol.forEach((rol) => {
          if (rol.nombre === "profesional") {
            usuariosConRolProfesional.push(usuario);
          }
        });
      }
    });

    res.status(200).json(usuariosConRolProfesional);
  } catch (error) {
    console.log(error);
    return res.status(500).json(" Error en el servidor ");
  }
};

export const aceptarProfesional = async (req, res) => {
  try {
    const { id } = req.params;
    const profesionaAceptado = await Usuario.findByIdAndUpdate(id, {
      "estado.aceptado": true,
      "estado.habilitado": true,
    });
    if (!profesionaAceptado) {
      return res.status(400).json("!No Se pudo aceptar el profesional!");
    }
    res.status(200).json("Profesional Aceptado");
  } catch (error) {
    console.log(error);
    return res.status(500).json(" Error en el servidor ");
  }
};


export const verUsuario = async(req, res)=>{
  try {
    const { id } = req.params;
    const usuario = await Usuario.findById(id).populate("rol");

    if(!usuario){
      return res.status(400).json("Error al traer el usuario");
    }

    res.status(200).json(usuario);
  } catch (error) {
    console.log(error);
    return res.status(500).json(" Error en el servidor ");
  }
}