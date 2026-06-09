import express from 'express'
import Materia from '../models/Materia.js'
import { requireAuth } from '../middleware/auth.js'

const router = express.Router()

router.get('/', requireAuth, async (req, res) => {
  try {
    const materias = await Materia.find({ userId: req.user._id }).sort({ createdAt: 1 })
    res.json(materias)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.post('/', requireAuth, async (req, res) => {
  try {
    const materia = await Materia.create({
      ...req.body,
      userId: req.user._id,
    })
    res.status(201).json(materia)
  } catch (e) {
    res.status(400).json({ error: e.message })
  }
})

router.put('/:id', requireAuth, async (req, res) => {
  try {
    const materia = await Materia.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    )

    if (!materia) return res.status(404).json({ error: 'Matéria não encontrada' })
    res.json(materia)
  } catch (e) {
    res.status(400).json({ error: e.message })
  }
})

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const materia = await Materia.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    })

    if (!materia) return res.status(404).json({ error: 'Matéria não encontrada' })
    res.json({ ok: true })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

export default router