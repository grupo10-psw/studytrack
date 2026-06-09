import express from 'express'
import Meta from '../models/Meta.js'
import { requireAuth } from '../middleware/auth.js'

const router = express.Router()

router.get('/', requireAuth, async (req, res) => {
  try {
    const metas = await Meta.find({ userId: req.user._id }).sort({ createdAt: 1 })
    res.json(metas)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.post('/', requireAuth, async (req, res) => {
  try {
    const meta = await Meta.create({
      ...req.body,
      userId: req.user._id,
    })

    res.status(201).json(meta)
  } catch (e) {
    res.status(400).json({ error: e.message })
  }
})

router.put('/:id', requireAuth, async (req, res) => {
  try {
    const meta = await Meta.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    )

    if (!meta) {
      return res.status(404).json({ error: 'Meta não encontrada' })
    }

    res.json(meta)
  } catch (e) {
    res.status(400).json({ error: e.message })
  }
})

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const meta = await Meta.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    })

    if (!meta) {
      return res.status(404).json({ error: 'Meta não encontrada' })
    }

    res.json({ ok: true })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

export default router