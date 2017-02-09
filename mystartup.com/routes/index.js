'use strict'

const express = require('express')
const router = express.Router()

router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'My Startup.com',
    user: req.session.user,
    active: '/'
  })
})

router.get('/shop', function (req, res, next) {
  res.render('shop', {
    title: 'My Startup.com',
    user: req.session.user,
    active: '/shop'
  })
})

module.exports = router
