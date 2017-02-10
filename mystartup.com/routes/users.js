'use strict'

const express = require('express')
const router = express.Router()
const db = require('../libs/db.js')
const config = require('../config.json')

router.get('/', function (req, res, next) {
  res.send('respond with a resource')
})

router.get('/delete', function (req, res, next) {
  res.render('delete', {
    config: config,
    user: req.session.user,
    error: null,
    active: '/delete'
  })
})

router.post('/delete', function (req, res, next) {
  console.log(req.body)

  if (req.body.pwd !== req.session.user.pwd) {
    res.render('delete', {
      config: config,
      user: req.session.user,
      error: 'Password mismatch',
      active: '/delete'
    })
    return
  }

  if (db.user.remove(req.session.user.email) === false) {
    res.render('delete', {
      config: config,
      user: req.session.user,
      error: 'Internal error',
      active: '/delete'
    })
  }

  req.session.user = null
  res.redirect('/')
})

router.get('/login', function (req, res, next) {
  res.render('login', {
    config: config,
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
      config: config,
      user: null,
      error: 'Can\'t find email',
      active: '/login'
    })
  } else {
    if (ret.pwd !== req.body.pwd) {
      res.render('login', {
        config: config,
        user: null,
        error: 'Password mismatch',
        active: '/login'
      })
    } else {
      req.session.user = {
        email: ret.email,
        accessToken: ret.accessToken,
        refreshToken: ret.refreshToken,
        pwd: ret.pwd,
        timestamp: ret.timestamp,
        tokenExpires: ret.tokenExpires,
        akcuid: ret.akcuid
      }
      console.log('done:', req.session.user)
      res.redirect('/mylights')
    }
  }
})

router.get('/logout', function (req, res, next) {
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
    config: config,
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
    tokenExpires: new Date(curDate.getTime() + req.session.akcuser.expires_in * 1000),
    akcuid: req.session.akcuser.id
  })

  if (ret.error) {
    req.session.akcuser = null
  }

  console.log('save result:', ret)

  res.render('signup', {
    config: config,
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
