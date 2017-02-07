'use strict'

const express = require('express')
const router = express.Router()

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'My Startup.com', user: req.user })
})

router.get('/signup', function (req, res, next) {
  res.render('signup', { title: 'My Startup.com', user: req.user })
})

module.exports = router
