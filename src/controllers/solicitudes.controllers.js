import Solicitudes from "../models/Solicitudes.js";
import Notificaciones from "../models/Notificaciones.js";
import Usuario from '../models/Usuario.js';

export const crearSolicitud = async (req, res) => {
  try {
    const { fechaSolicitada, motivo, id_aprendiz, id_profesional } = req.body;
    if ( !fechaSolicitada || !motivo || !id_aprendiz || !id_profesional ) {
      return res.status(400).json("Todos los datos son requeridos");
    }
    const solicitudesModel = new Solicitudes(req.body);
    await solicitudesModel.save();

    res.status(200).json("Solicitud enviada correctamente");
  } catch (error) {
    console.log(error);
    return res.status(500).json(" Error en el servidor ");
  }
};

export const verSolicitudesProfesional = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioProfesional = await Usuario.findById(id).populate("rol");

    const esProfesional = usuarioProfesional.rol.some(rol => rol.nombre === 'profesional');

    if(!esProfesional){
      return res.status(400).json("No eres un Profesional");
    }
    
    const misSolicitudes = await Solicitudes.find({ 
      id_profesional: id, 
      "estado.pendiente": true, 
      "estado.aceptada": false, 
      "estado.aceptada": false 
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
    const contenido = `Tu solicitud a sido aceptada, la fecha de la atención sera ${solicitudAceptada.fechaSolicitada}`;

    const notificacionModel = new Notificaciones();
    notificacionModel.contenido = contenido;
    notificacionModel.usuarioId = usuario;
    await notificacionModel.save();

    res.status(200).json("Solicitud Aceptada");
  } catch (error) {
    console.log(error);
    return res.status(500).json(" Error en el servidor ");
  }
};

export const aplazarSolicitud = async (req, res) => {
  try {
    const { id } = req.params;
    const { motivo, nuevaFecha } = req.body;
    if (!motivo || !nuevaFecha) {
      return res.status(400).json("Se requiere un motivo y nueva fecha");
    }
    const solicitudAplazada = await Solicitudes.findByIdAndUpdate(id, {
      nuevaFechaPropuesta: nuevaFecha,
      motivoAplazamiento: motivo,
      "estado.pendiente": false,
      "estado.aceptada": false,
      "estado.aplazada": true,
    });

    if (!solicitudAplazada) {
      return res.status(400).json("No se pudo aplazar la solicitud");
    }

    const usuario = solicitudAplazada.id_aprendiz;
    const contenido = `Tu solicitud a sido aplazada, la nueva fecha de atencion es ${solicitudAplazada.nuevaFechaPropuesta}`;

    const notificacionModel = new Notificaciones();
    notificacionModel.contenido = contenido;
    notificacionModel.usuarioId = usuario;
    await notificacionModel.save();

    res.status(200).json("Solicitud Aplazada");
  } catch (error) {
    console.log(error);
    return res.status(500).json(" Error en el servidor ");
  }
};

