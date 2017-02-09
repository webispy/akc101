'use strict'

const express = require('express')
const router = express.Router()
const ad = require('../libs/akcdevice')
const config = require('../config.json')

router.post('/:did/:action', function (req, res, next) {
  console.log(req.params)
  ad.sendAction(req.params.did, req.params.action, req.session.user.accessToken)
    .then(function (repos) {
      console.log(repos)
      res.end()
    })
    .catch(function (err) {
      console.error(err)
      res.status(500).send(err)
    })
})

function renderDevices (req, res) {
  console.log(req.session.devices)
  res.render('mylights', {
    config: config,
    user: req.session.user,
    devices: req.session.devices,
    active: '/mylights'
  })
}

router.get('/refresh', function (req, res, next) {
  req.session.devices = null
  res.redirect('/mylights')
})

router.get('/', function (req, res, next) {
  if (req.session.user === undefined ||
    req.session.user === null) {
    res.redirect('/users/login')
    return
  }

  const user = req.session.user

  if (req.session.devices) {
    renderDevices(req, res)
    return
  }

  ad.getUserDevices(user.akcuid, user.accessToken)
    .then(function (repos) {
      req.session.devices = (JSON.parse(repos)).data.devices
      renderDevices(req, res)
    })
    .catch(function (err) {
      console.error(err)
      req.session.devices = []
      renderDevices(req, res)
    })
})

module.exports = router
