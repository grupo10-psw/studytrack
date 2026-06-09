import express from 'express'
import Materia from '../models/Materia.js'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const materias = await Materia.find().sort({ createdAt: 1 })
    res.json(materias)
  } catch (e) { res.status(500).json({ error: e.message }) }
})

router.post('/', async (req, res) => {
  try {
    const materia = await Materia.create(req.body)
    res.status(201).json(materia)
  } catch (e) { res.status(400).json({ error: e.message }) }
})

router.put('/:id', async (req, res) => {
  try {
    const materia = await Materia.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!materia) return res.status(404).json({ error: 'Matéria não encontrada' })
    res.json(materia)
  } catch (e) { res.status(400).json({ error: e.message }) }
})

router.delete('/:id', async (req, res) => {
  try {
    await Materia.findByIdAndDelete(req.params.id)
    res.json({ ok: true })
  } catch (e) { res.status(500).json({ error: e.message }) }
})

export default router