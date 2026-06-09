import express from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const router = express.Router()

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Preencha nome, email e senha' })
    }

    const emailLower = email.toLowerCase().trim()

    const userExists = await User.findOne({ email: emailLower })

    if (userExists) {
      return res.status(400).json({ error: 'E-mail já cadastrado' })
    }

    const user = await User.create({
      name: name.trim(),
      email: emailLower,
      password,
    })

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    return res.status(201).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Informe email e senha' })
    }

    const emailLower = email.toLowerCase().trim()

    const user = await User.findOne({ email: emailLower })

    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas' })
    }

    const passwordOk = await user.comparePassword(password)

    if (!passwordOk) {
      return res.status(401).json({ error: 'Credenciais inválidas' })
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    return res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
})

export default router