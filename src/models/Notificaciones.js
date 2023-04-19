import { Schema, model } from "mongoose";

const notificacionesSchema = new Schema(
  {
    contenido: {
      type: String,
    },
    usuarioId: {
      ref: "Usuarios",
      type: Schema.Types.ObjectId
    }
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export default model("Notificaciones", notificacionesSchema);
