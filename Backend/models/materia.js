import mongoose from 'mongoose'

const materiaSchema = new mongoose.Schema({
  nome:    { type: String, required: true, trim: true },
  cor:     { type: String, default: '#3A6FD8' },
  desc:    { type: String, default: '' },
  horas:   { type: Number, default: 6 },
  periodo: { type: String, default: 'Semana' },
}, { timestamps: true })

export default mongoose.model('Materia', materiaSchema)