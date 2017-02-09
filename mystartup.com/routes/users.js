'use strict'

const express = require('express')
const router = express.Router()
const db = require('../libs/db.js')

router.get('/', function (req, res, next) {
  res.send('respond with a resource')
})

router.get('/login', function (req, res, next) {
  res.render('login', {
    title: 'My Startup.com',
    user: null,
    error: null,
    active: '/login'
  })
})

router.post('/login', function (req, res, next) {
  const ret = db.user.find(req.body.email)

  console.log(req.body)
  console.log(ret)

  if (ret == null) {
    res.render('login', {
      title: 'My Startup.com',
      user: null,
      error: 'Can\'t find email',
      active: '/login'
    })
  } else {
    if (ret.pwd !== req.body.pwd) {
      res.render('login', {
        title: 'My Startup.com',
        user: null,
        error: 'Password mismatch',
        active: '/login'
      })
    } else {
      req.session.user = {
        email: ret.email,
        accessToken: ret.accessToken,
        refreshToken: ret.refreshToken
      }
      console.log('done:', req.session.user)
      res.redirect('/mylights')
    }
  }
})

router.get('/logout', function (req, res, next) {
  req.logout()
  req.session.user = null
  res.redirect('/')
})

router.get('/signup', function (req, res, next) {
  let step = 1
  let error = null

  if (req.session.akcuser) {
    step = 2
  }

  if (req.session.user) {
    step = 3
    error = 'Please logout'
  }

  res.render('signup', {
    title: 'My Startup.com',
    step: step,
    user: req.session.user,
    akcuser: req.session.akcuser,
    error: error,
    active: '/signup'
  })
})

router.post('/signup', function (req, res, next) {
  const curDate = new Date()

  let ret = db.user.add({
    email: req.body.email,
    pwd: req.body.pwd,
    accessToken: req.session.akcuser.accessToken,
    refreshToken: req.session.akcuser.refreshToken,
    timestamp: new Date(),
    tokenExpires: new Date(curDate.getTime() + req.session.akcuser.expires_in * 1000)
  })

  if (ret.error) {
    req.session.akcuser = null
  }

  console.log('save result:', ret)

  res.render('signup', {
    title: 'My Startup.com',
    step: 3,
    user: req.session.user,
    akcuser: req.session.akcuser,
    error: ret.error,
    active: '/signup'
  })

  console.log('done')
})

console.log(db.user.findAll())
module.exports = router
