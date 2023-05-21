import cloudinary from "cloudinary";
import Eventos from "../models/Eventos.js";


export const crearEvento = async (req, res) => {
  try {
    const { titulo, descripcion, fecha_inicio, fecha_final, tipo } = req.body;
    if (!titulo || !descripcion || !fecha_inicio || !fecha_final || !tipo) {
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

    let idPdf = null;
    let urlPdf = null;

    if (req.files.pdf) {
      const pdfEvento = await cloudinary.uploader.upload(
        req.files.pdf[0].path,
        {

          resource_type: 'raw',
          public_id: `evento_pdf_${Date.now()}`,
          folder: 'eventos',
          overwrite: true,
          resource_type: 'auto',

        }
      );
      idPdf = pdfEvento.public_id;
      urlPdf = pdfEvento.secure_url;
    }

    const eventoModel = new Eventos(req.body);
    eventoModel.imagen.idImg = idImg;
    eventoModel.imagen.urlImg = urlImg;
    eventoModel.pdf.idPdf = idPdf;
    eventoModel.pdf.urlPdf = urlPdf;
    await eventoModel.save();

    res.status(200).json("Evento Creado Correctamente");
  } catch (error) {
    console.log(error);
    return res.status(500).json(" Error en el servidor ");
  }
};

export const verEventos = async (req, res) => {
  try {
    const eventos = await Eventos.find();
    if (!eventos) {
      return res.status(400).json(" Error al traer los datos ");
    }

    res.status(200).json(eventos);
  } catch (error) {
    console.log(error);
    return res.status(500).json(" Error en el servidor ");
  }
};


export const actualizarEvento = async (req, res) => {
  try {
    const { tipo, titulo, fecha_inicio, fecha_final, descripcion, lugar } = req.body;
    const { id } = req.params;


    if (req.files.eventoImg && req.files.pdf) {

      let idImg = null;
      let urlImg = null;
      let idPdf = null;
      let urlPdf = null;
      const pdfEvento = await cloudinary.uploader.upload(
        req.files.pdf[0].path,
        {

          resource_type: 'raw',
          public_id: `evento_pdf_${Date.now()}`,
          folder: 'eventos',
          overwrite: true,
          resource_type: 'auto',

        }
      )
      idPdf = pdfEvento.public_id;
      urlPdf = pdfEvento.secure_url;

      const fotoEvento = await cloudinary.uploader.upload(req.files.eventoImg[0].path);
      idImg = fotoEvento.public_id;
      urlImg = fotoEvento.secure_url;


      await Eventos.findByIdAndUpdate(id, {

        'imagen.idImg': idImg,
        'imagen.urlImg': urlImg,
        'tipo': tipo,
        'titulo': titulo,
        'lugar': lugar,
        'fecha_inicio': fecha_inicio,
        'fecha_final': fecha_final,
        'pdf.idPdf': idPdf,
        'pdf.urlPdf': urlPdf,
        'descripcion': descripcion

      }, { new: true });
    } else if (req.files.eventoImg && !req.files.pdf) {
      let idImg = null;
      let urlImg = null;

      const fotoEvento = await cloudinary.uploader.upload(req.files.eventoImg[0].path);
      idImg = fotoEvento.public_id;
      urlImg = fotoEvento.secure_url;

      await Eventos.findByIdAndUpdate(id, {

        'imagen.idImg': idImg,
        'imagen.urlImg': urlImg,
        'tipo': tipo,
        'titulo': titulo,
        'lugar': lugar,
        'fecha_inicio': fecha_inicio,
        'fecha_final': fecha_final,
        'descripcion': descripcion

      }, { new: true });


    } else if (req.files.pdf && !req.files.eventoImg) {
      let idPdf = null;
      let urlPdf = null;
      const pdfEvento = await cloudinary.uploader.upload(
        req.files.pdf[0].path,
        {

          resource_type: 'raw',
          public_id: `evento_pdf_${Date.now()}`,
          folder: 'eventos',
          overwrite: true,
          resource_type: 'auto',

        }

      )
      idPdf = pdfEvento.public_id;
      urlPdf = pdfEvento.secure_url;

      await Eventos.findByIdAndUpdate(id, {

        'tipo': tipo,
        'titulo': titulo,
        'lugar': lugar,
        'fecha_inicio': fecha_inicio,
        'fecha_final': fecha_final,
        'pdf.idPdf': idPdf,
        'pdf.urlPdf': urlPdf,
        'descripcion': descripcion

      }, { new: true });


    }

    else {

      await Eventos.findByIdAndUpdate(id, {
        'tipo': tipo,
        'titulo': titulo,
        'fecha_inicio': fecha_inicio,
        'fecha_final': fecha_final,
        'lugar': lugar,
        'descripcion': descripcion

      }, { new: true });
    }
    res.status(200).json("Evento Actualizado");
  } catch (error) {
    console.log(error);
    return res.status(500).json("Error en el servidor");
  }
}



