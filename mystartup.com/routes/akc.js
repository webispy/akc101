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
    // console.log('profile = ', profile)
    // settings.data.akc.usertoken = accessToken
    // settings.data.akc.userid = profile.id
    return done(null, profile)
  }
)

passport.use(strategy)

router.get('/login', passport.authenticate('artikcloud'))

router.get('/callback', passport.authenticate('artikcloud'),
  (req, res) => {
    console.log('req.user:', req.user)
    res.redirect('/signup')
  })

module.exports = router
