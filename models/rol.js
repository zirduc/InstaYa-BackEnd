
const { model, Schema } = require('mongoose');

const RoleSchema = new Schema({
    rol: {
        type: String,
        required: [true, 'El rol es obligatorio']
    }
});

module.exports = model('role', RoleSchema);