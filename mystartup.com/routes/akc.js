'use strict'

const express = require('express')
const passport = require('passport')
const ARTIKCloudStrategy = require('passport-artikcloud')

const router = express.Router()

const strategy = new ARTIKCloudStrategy({
  clientID: process.env.client_id,
  clientSecret: process.env.client_secret,
  callbackURL: '/akc/callback'
},
  (accessToken, refreshToken, params, profile, done) => {
    profile.refreshToken = refreshToken
    profile.expires_in = params.expires_in
    return done(null, profile)
  }
)

passport.use(strategy)

router.get('/login', passport.authenticate('artikcloud'))
router.get('/callback', function (req, res, next) {
  passport.authenticate('artikcloud',
    function (err, user, info) {
      if (err) {
        return res.json(401, err)
      }

      req.session.akcuser = user

      res.redirect('/users/signup')
    })(req, res, next)
})

module.exports = router
