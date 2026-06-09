import express from 'express'
import Meta from '../models/Meta.js'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const metas = await Meta.find().sort({ createdAt: 1 })
    res.json(metas)
  } catch (e) { res.status(500).json({ error: e.message }) }
})

router.post('/', async (req, res) => {
  try {
    const meta = await Meta.create(req.body)
    res.status(201).json(meta)
  } catch (e) { res.status(400).json({ error: e.message }) }
})

router.put('/:id', async (req, res) => {
  try {
    const meta = await Meta.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!meta) return res.status(404).json({ error: 'Meta não encontrada' })
    res.json(meta)
  } catch (e) { res.status(400).json({ error: e.message }) }
})

router.delete('/:id', async (req, res) => {
  try {
    await Meta.findByIdAndDelete(req.params.id)
    res.json({ ok: true })
  } catch (e) { res.status(500).json({ error: e.message }) }
})

export default router