import { Schema, model } from 'mongoose';
import bcryptjs from 'bcryptjs';

const usuarioSchema = new Schema(
    {
        nombres:{
            type: String,
            required: true
        },
        apellidos:{
            type: String,
            required: true
        },
        documento:{
            tipo:{
                type: String,
                required: true
            },
            numeroDocumento:{
                type: Number,
                required: true,
                unique: true
            }
        },
        correo:{
            type: String,
            required: true,
            unique: true
        },
        password:{
            type: String,
            required: true
        },
        numTelefono:{
            type: Number,
            required: true
        },
        rol:[{
            ref: "Roles",
            type: Schema.Types.ObjectId
        }],
        profesion:{
            type: String,
            default: null
        },
        programa:{
            ref: "Programas",
            type: Schema.Types.ObjectId,
            default: null
        },
        estado:{
            aceptado:{
                type: Boolean,
                default: true
            },
            habilitado:{
                type: Boolean,
                default: true
            }
        }
    },
    {
        versionKey: false
    }
)

usuarioSchema.methods.hasPassword = async(contrasena)=>{
    const salt = await bcryptjs.genSalt(10);
    return await bcryptjs.hash(contrasena, salt);
}

usuarioSchema.statics.validatePassword = async(contrasena, passwordUser)=>{
    return await bcryptjs.compare(contrasena, passwordUser);
}

export default model("Usuarios", usuarioSchema);