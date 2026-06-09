import mongoose from 'mongoose'

const metaSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  materiaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Materia', required: true },
  horas: { type: Number, required: true },
  periodo: { type: String, default: 'Semanal' },
  inicio: { type: String, required: true },
  fim: { type: String, required: true },
}, { timestamps: true })

export default mongoose.model('Meta', metaSchema)