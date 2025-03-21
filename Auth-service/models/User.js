const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const UserSchema = new mongoose.Schema({
    _id: { type: Number },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'membre', 'invité'], default: 'membre' },
    isBlocked: { type: Boolean, default: false }
}, { timestamps: true });

UserSchema.plugin(AutoIncrement, { inc_field: '_id' });

module.exports = mongoose.model('User', UserSchema);
