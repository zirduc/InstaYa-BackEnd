const { model, Schema } = require('mongoose');

const OrdenSchema = new Schema({
    uid: { type: Schema.Types.ObjectId, ref: 'Usuario', required: [true, 'El id del usuario es requerido'] },
    usuario_enviador: {
        nombre: { type: String, required: [true, 'El nombre es obligatorio'] },
        apellido: { type: String, required: [true, 'El apellido es obligatorio'] },
        cedula: { type: String, required: [true, 'La cedula es obligatoria'] }
    },
    usario_receptor: {
        nombre: { type: String, required: [true, 'El nombre es obligatorio'] },
        apellido: { type: String, required: [true, 'El apellido es obligatorio'] },
        cedula: { type: String, required: [true, 'La cedula es obligatoria'] }
    },
    disponibilidad_horaria: {
        desde: { type: String, required: [true, 'desde es obligatorio'] },
        hasta: { type: String, required: [true, 'hasta es obligatorio'] },
    },
    direcciones: {
        direccionEnvio: { type: String, required: [true, 'La dirección de envío es obligatoria'] },
        direccionRecogida: { type: String, required: [true, 'La dirección de recogida es obligatoria'] }
    },
    carga: {
        altura: { type: String, required: [true, 'La altura es obligatoria'] },
        largo: { type: String, required: [true, 'El largo es obligatorio'] },
        mercancia: { type: String, required: [true, 'El tipo de mercancía es obligatorio'] },
        peso: { type: String, required: [true, 'El peso es obligatorio'] }
    },
    comentarios: { type: String },
    estado: {
        type: String,
        enum: {
            values: ['Guardado', 'Cancelado', 'Cumplido'],
            message: '{VALUE} no es valido'
        }
    }
});

module.exports = model('ordene', OrdenSchema)