'use strict'

const express = require('express')
const router = express.Router()
const config = require('../config.json')

router.get('/', function (req, res, next) {
  res.render('index', {
    config: config,
    user: req.session.user,
    active: '/'
  })
})

router.get('/shop', function (req, res, next) {
  res.render('shop', {
    config: config,
    user: req.session.user,
    active: '/shop'
  })
})

module.exports = router
