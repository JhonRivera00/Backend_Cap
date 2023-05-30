import Notificaciones from "../models/Notificaciones.js";
import Pqrs from "../models/Pqrs.js";

// Esto es para el usuairo tipo aprendiz
export const misPqrs = async(req, res)=>{
    try {
        const { id } = req.params;
        const pqrs = await Pqrs.find({id_usuario: id});
        res.status(200).json(pqrs);
    } catch (error) {
        console.log(error);
        return res.status(500).json("Error en el sevridor");
    }
}

// Esto es patra el usuario tipo administrador
export const verPqrsPendientes = async(req, res)=>{
    try {
        const pqrs = await Pqrs.find({
            "estado.pendiente": true,
            "estado.respondida": false
        }).populate({
            path: 'id_usuario',
            populate:{
                path:'programa'
            }
        })
        res.status(200).json(pqrs);
    } catch (error) {
        console.log(error);
        return res.status(500).json("Error en el sevridor");
    }
}

// Esto es para el usuario tipo aprendiz
export const crearPqrs = async(req, res)=>{
    try {
        const { id_usuario, tipo, motivo } = req.body;
        if( !id_usuario || !tipo || !motivo ){
            return res.status(400).json("Todos los datos son requeridos")
        }
        const motivoModel = new Pqrs(req.body);
        await motivoModel.save();

        res.status(200).json("Tu PQRS a sido creada satisfactoriamente");

    } catch (error) {
        console.log(error);
        return res.status(500).json("Error en el sevridor");
    }
}


// Esto e spar el usuario tipo administrador 
export const responderPqrs = async(req, res)=>{
    try {
        const { id } = req.params;  
        const { respuesta } = req.body;
        if(!respuesta){
            return res.status(400).json("Todos los datos son requeridos")
        }
        const pqrsRes = await Pqrs.findByIdAndUpdate(id, {
            respuesta: respuesta,
            "estado.pendiente": false,
            "estado.respondida": true,
        });
        const usuario = pqrsRes.id_usuario
        const motivo = pqrsRes.tipo
       console.log(pqrsRes)

        const notificacionModel = new Notificaciones()
        notificacionModel.titulo = "Respuesta PQRS";    
        notificacionModel.contenido = respuesta;
        notificacionModel.motivo = motivo;
        notificacionModel.usuarioId = usuario;
        await notificacionModel.save();
        
        res.status(200).json("Pqrs respondida exitodamente");

    } catch (error) {
        console.log(error);
        return res.status(500).json("Error en el sevridor");
    }
}