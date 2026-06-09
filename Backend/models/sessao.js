import mongoose from 'mongoose'

const sessaoSchema = new mongoose.Schema({
  materiaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Materia', required: true },
  data:      { type: String, required: true },
  inicio:    { type: String, required: true },
  fim:       { type: String, required: true },
  obs:       { type: String, default: '' },
}, { timestamps: true })

export default mongoose.model('Sessao', sessaoSchema)