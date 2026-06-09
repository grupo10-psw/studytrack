import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import passport from 'passport'

import configurePassport from './config/passport.js'
import authRoutes from './routes/auth.js'
import materiasRouter from './routes/materias.js'
import sessoesRouter from './routes/sessoes.js'
import metasRouter from './routes/metas.js'

const app = express()

app.use(cors())
app.use(express.json())

app.use(passport.initialize())
configurePassport(passport)

app.get('/', (req, res) => {
  res.json({ message: 'API do StudyTrack rodando 🚀' })
})

app.use('/auth', authRoutes)
app.use('/materias', materiasRouter)
app.use('/sessoes', sessoesRouter)
app.use('/metas', metasRouter)

const PORT = process.env.PORT || 3001

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB conectado')
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando em http://localhost:${PORT}`)
    })
  })
  .catch((err) => {
    console.error('❌ Erro MongoDB:', err)
  })