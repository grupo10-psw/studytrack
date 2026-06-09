import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import materiasRouter from './routes/materias.js'
import sessoesRouter from './routes/sessoes.js'
import metasRouter from './routes/metas.js'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

app.use('/materias', materiasRouter)
app.use('/sessoes',  sessoesRouter)
app.use('/metas',    metasRouter)

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB conectado')
    app.listen(process.env.PORT || 3001, () => {
      console.log(`🚀 Servidor rodando em http://localhost:${process.env.PORT || 3001}`)
    })
  })
  .catch(err => console.error('❌ Erro MongoDB:', err))