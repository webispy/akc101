'use strict'

const express = require('express')
const router = express.Router()

router.get('/', function (req, res, next) {
  if (req.session.user === undefined ||
    req.session.user === null) {
    res.redirect('/users/login')
  } else {
    res.render('mylights', {
      title: 'My Startup.com',
      user: req.session.user,
      active: '/mylights'
    })
  }
})

module.exports = router
