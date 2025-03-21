const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const projectSchema = new mongoose.Schema({
  _id: { type: Number },
  name: { type: String, required: true,},
  description: { type: String, trim: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: {
    type: String,
    enum: ['active', 'completed', 'on-hold'],
    default: 'active',
  },
  categories: [{ type: String, trim: true }],
  createdBy: {
    type: {
      _id: { type: String, required: true }, 
      name: { type: String, required: true },
    },
    required: true,
  },
}, { timestamps: true });

projectSchema.plugin(AutoIncrement, { inc_field: '_id' });

module.exports = mongoose.model('Project', projectSchema);