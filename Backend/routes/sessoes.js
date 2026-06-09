import express from 'express'
import Sessao from '../models/Sessao.js'
import { requireAuth } from '../middleware/auth.js'

const router = express.Router()

router.get('/', requireAuth, async (req, res) => {
  try {
    const sessoes = await Sessao.find({ userId: req.user._id }).sort({ data: -1, createdAt: -1 })
    res.json(sessoes)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.post('/', requireAuth, async (req, res) => {
  try {
    const sessao = await Sessao.create({
      ...req.body,
      userId: req.user._id,
    })

    res.status(201).json(sessao)
  } catch (e) {
    res.status(400).json({ error: e.message })
  }
})

router.put('/:id', requireAuth, async (req, res) => {
  try {
    const sessao = await Sessao.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    )

    if (!sessao) {
      return res.status(404).json({ error: 'Sessão não encontrada' })
    }

    res.json(sessao)
  } catch (e) {
    res.status(400).json({ error: e.message })
  }
})

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const sessao = await Sessao.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    })

    if (!sessao) {
      return res.status(404).json({ error: 'Sessão não encontrada' })
    }

    res.json({ ok: true })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

export default router