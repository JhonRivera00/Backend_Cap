import Solicitudes from "../models/Solicitudes.js";
import Notificaciones from "../models/Notificaciones.js";
import Usuario from "../models/Usuario.js";
import moment from 'moment'
import { fechaLocal } from './../funciones/fechaLocal.js';

let ultimoTiempoSolicitud = {};

export const crearSolicitud = async (req, res) => {
  try {
    const { fechaSolicitada, motivo, id_aprendiz, id_profesional } = req.body;
    if (!fechaSolicitada || !motivo || !id_aprendiz || !id_profesional) {
      return res.status(400).json("Todos los datos son requeridos");
    }
    
    if (ultimoTiempoSolicitud[id_aprendiz]) {
      const tiempoTranscurrido = moment().diff(ultimoTiempoSolicitud[id_aprendiz], 'minutes');
      if (tiempoTranscurrido < 30) {
        return res.status(400).json("Debes esperar al menos 30 minutos antes de crear otra solicitud");
      }
    }
    
    const solicitudesModel = new Solicitudes(req.body);
    await solicitudesModel.save();
    
    ultimoTiempoSolicitud[id_aprendiz] = moment();
    
    res.status(200).json("Solicitud enviada correctamente");
  } catch (error) {
    console.log(error);
    return res.status(500).json("Error en el servidor");
  }
};

export const verSolicitudes = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioAdmin = await Usuario.findById(id).populate("rol");

    const esAdmin = usuarioAdmin.rol.some(
      (rol) => rol.nombre === "administrador"
    );

    if (!esAdmin) {
      return res.status(400).json("No eres Administrador");
    }

    const misSolicitudes = await Solicitudes.find({
      "estado.pendiente": true,
      "estado.aceptada": false,
      "estado.aplazada": false,
    }).populate({
      path: "id_aprendiz id_profesional",
      populate: {
        path: "programa",
      },
    });

    if (!misSolicitudes) {
      return res.status(400).json("Error al ver las solicitudes");
    }

    res.status(200).json(misSolicitudes);
  } catch (error) {
    console.log(error);
    return res.status(500).json(" Error en el servidor ");
  }
};

export const aceptarSolicitud = async (req, res) => {
  try {
    const { id } = req.params;
    const solicitudAceptada = await Solicitudes.findByIdAndUpdate(id, {
      "estado.pendiente": false,
      "estado.aceptada": true,
      "estado.aplazada": false,
    });
    if (!solicitudAceptada) {
      return res.status(400).json("No se pudo aceptar la solicitud");
    }

    const usuario = solicitudAceptada.id_aprendiz;
   const cadenaFecha = fechaLocal(solicitudAceptada.fechaSolicitada)
    const contenido = `Tu solicitud ha sido aceptada, la fecha de la atención sera ${cadenaFecha}`;
    
    const usuarioProfesional = solicitudAceptada.id_profesional;
    const notificacionModel = new Notificaciones();
    notificacionModel.titulo = "Solicitud Aceptada";
    notificacionModel.contenido = contenido;
    notificacionModel.usuarioId = usuario;
    notificacionModel.fechaAplazada = cadenaFecha;
    notificacionModel.profesionalId = usuarioProfesional
    await notificacionModel.save();

    const contenidoProfesional = `Tienes una una nueva cita para la fecha ${cadenaFecha}`;

    const notificacionProfesionalModel = new Notificaciones();
    notificacionProfesionalModel.titulo = " Nueva Charla ";
    notificacionProfesionalModel.contenido = contenidoProfesional;
    notificacionProfesionalModel.fechaAplazada = cadenaFecha;
    notificacionProfesionalModel.usuarioId = usuarioProfesional;
    await notificacionProfesionalModel.save();

    res.status(200).json("Solicitud Aceptada");
  } catch (error) {
    console.log(error);
    return res.status(500).json(" Error en el servidor ");
  }
};

export const aplazarSolicitud = async (req, res) => {
  try {
    const { id } = req.params;
    const { motivo, nuevaFecha, nuevoProfesional } = req.body;
    if (!motivo || !nuevaFecha) {
      return res.status(400).json("Se requiere un motivo y nueva fecha");
    }
    const solicitudAplazada = await Solicitudes.findByIdAndUpdate(
      id,
      {
        nuevaFechaPropuesta: nuevaFecha,
        motivoAplazamiento: motivo,
        "estado.pendiente": false,
        "estado.aceptada": false,
        "estado.aplazada": true,
        id_profesional: nuevoProfesional,
      },
      { new: true }
    );

    if (!solicitudAplazada) {
      return res.status(400).json("No se pudo aplazar la solicitud");
    }
    const usuario = solicitudAplazada.id_aprendiz;
   const cadenaFecha = fechaLocal(solicitudAplazada.nuevaFechaPropuesta)

    const contenido = `Tu solicitud a sido aplazada, la nueva fecha de atencion es ${cadenaFecha}`;

    const notificacionModel = new Notificaciones();
    notificacionModel.titulo = "Solicitud Aplazada";    
    notificacionModel.contenido = contenido;
    notificacionModel.usuarioId = usuario;
    notificacionModel.fechaAplazada = cadenaFecha;
    notificacionModel.profesionalId = nuevoProfesional
    notificacionModel.motivo = motivo;
    await notificacionModel.save();


    const usuarioProfesional = solicitudAplazada.id_profesional;
    const contenidoProfesional = `Tienes una una nueva cita para el dia ${cadenaFecha}`;

    const notificacionProfesionalModel = new Notificaciones();
    notificacionProfesionalModel.titulo = "Nueva Charla";
    notificacionProfesionalModel.contenido = contenidoProfesional;
    notificacionProfesionalModel.usuarioId = usuarioProfesional
    notificacionProfesionalModel.fechaAplazada = cadenaFecha;
    notificacionProfesionalModel.aprendizId = usuario;
    await notificacionProfesionalModel.save();

    res.status(200).json("Solicitud Aplazada");
  } catch (error) {
    console.log(error);
    return res.status(500).json(" Error en el servidor ");
  }
};

export const verSolicitudesProfesional = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioProfesional = await Usuario.findById(id).populate("rol");

    const esProfesional = usuarioProfesional.rol.some(
      (rol) => rol.nombre === "profesional"
    );

    if (!esProfesional) {
      return res.status(400).json("No eres un Profesional");
    }

    const misSolicitudes = await Solicitudes.find({
      id_profesional: id,
      "estado.pendiente": true,
      "estado.aceptada": false,
      "estado.aceptada": false,
    });
    if (!misSolicitudes) {
      return res.status(400).json("Error al ver mis solicitudes");
    }

    res.status(200).json(misSolicitudes);
  } catch (error) {
    console.log(error);
    return res.status(500).json(" Error en el servidor ");
  }
};
