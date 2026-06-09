import express from 'express'
import Sessao from '../models/Sessao.js'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const sessoes = await Sessao.find().sort({ data: -1 })
    res.json(sessoes)
  } catch (e) { res.status(500).json({ error: e.message }) }
})

router.post('/', async (req, res) => {
  try {
    const sessao = await Sessao.create(req.body)
    res.status(201).json(sessao)
  } catch (e) { res.status(400).json({ error: e.message }) }
})

router.put('/:id', async (req, res) => {
  try {
    const sessao = await Sessao.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!sessao) return res.status(404).json({ error: 'Sessão não encontrada' })
    res.json(sessao)
  } catch (e) { res.status(400).json({ error: e.message }) }
})

router.delete('/:id', async (req, res) => {
  try {
    await Sessao.findByIdAndDelete(req.params.id)
    res.json({ ok: true })
  } catch (e) { res.status(500).json({ error: e.message }) }
})

export default router