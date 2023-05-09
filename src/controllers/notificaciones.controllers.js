import Notificaciones from '../models/Notificaciones.js';

export const misNotificaciones = async(req, res)=>{
    try {
        const { id } = req.params;
        const misNotis = await Notificaciones.find({ usuarioId: id }).lean();
        if(!misNotis){
            return res.status(400).json("Error al mostrar mis notificaciones");
        }
        res.status(200).json(misNotis);
    } catch (error) {
        console.log(error);
        return res.status(500).json(" Error en el servidor ");
    }
}

export const notificacionesAbiertas = async (req,res)=>{

    try {
    const {id} = req.params;
    const estadoSolicitud = await Notificaciones.findByIdAndUpdate(id, {
        "estado": true,
    });

    res.status(200).json("Notificacion vista");
        
    } catch (error) {
        console.log(error);
        return res.status(500).json("Error en el sevridor");
    }

}