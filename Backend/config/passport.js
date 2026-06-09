import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import User from '../models/User.js'

export default function configurePassport(passport) {
  const secret = process.env.JWT_SECRET

  if (!secret) {
    throw new Error('JWT_SECRET não foi definido no arquivo .env')
  }

  const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secret,
  }

  passport.use(
    new JwtStrategy(opts, async (payload, done) => {
      try {
        const user = await User.findById(payload.id).select('-password')

        if (!user) {
          return done(null, false)
        }

        return done(null, user)
      } catch (err) {
        return done(err, false)
      }
    })
  )
}