import cloudinary from "cloudinary";
import Eventos from "../models/Eventos.js";

export const crearEvento = async (req, res) => {
  try {
    const { titulo, descripcion, multimedia, fecha_inicio, fecha_final, tipo } = req.body;
    if (!titulo || !descripcion || !multimedia || !fecha_inicio || !fecha_final || !tipo) {
      return res.status(400).json("Todos los datos son requeridos");
    }

    let idImg = null;
    let urlImg = null;

    if (req.files.eventoImg) {
      const fotoEvento = await cloudinary.uploader.upload(
        req.files.eventoImg[0].path
      );
      idImg = fotoEvento.public_id;
      urlImg = fotoEvento.secure_url;
    }
    
    const eventoModel = new Eventos(req.body);
    eventoModel.imagen.idImg = idImg;
    eventoModel.imagen.urlImg = urlImg;
    await eventoModel.save();

    res.status(200).json("Evento Creado Correctamente");
  } catch (error) {
    console.log(error);
    return res.status(500).json(" Error en el servidor ");
  }
};

export const verEventos = async (req, res) => {
  try {
    const eventos = await Eventos.find().sort({ tipo: "1" }).lean();
    if (!eventos) {
      return res.status(400).json(" Error al traer los datos ");
    }

    const eventosFiltrados = eventos.filter(evento => evento.tipo !== "cronograma");

    res.status(200).json(eventosFiltrados);
  } catch (error) {
    console.log(error);
    return res.status(500).json(" Error en el servidor ");
  }
};

export const verEventosCrono = async (req, res) => {
  try {
    const eventos = await Eventos.find().lean();
    if (!eventos) {
      return res.status(400).json(" Error al traer los datos ");
    }
    
    const eventosFiltrados = eventos.filter(evento => evento.tipo === "cronograma");

    res.status(200).json(eventosFiltrados);
  } catch (error) {
    console.log(error);
    return res.status(500).json(" Error en el servidor ");
  }
};

export const actualizaEvento = async(req, res)=>{
  try {
    const { id } = req.params;
    const eventoActualizado = await Eventos.findByIdAndUpdate(id, req.body);
    if(!eventoActualizado){
      return res.status(400).json(" No se pudo actualizar el evento ");
    }

    res.status(200).json("Evento Actualizado");

  } catch (error) {
    console.log(error);
    return res.status(500).json(" Error en el servidor ");
  }
}
