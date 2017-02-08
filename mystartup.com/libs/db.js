const Realm = require('realm')
const util = require('util')
const EventEmitter = require('events')

const UserSchema = {
  name: 'User',
  primaryKey: 'email',
  properties: {
    email: 'string',
    accessToken: 'string',
    refreshToken: 'string',
    pwd: 'string',
    timestamp: 'date'
  }
}

const db = new Realm({
  path: 'db.realm',
  schema: [UserSchema]
})

function Controller (schema) {
  EventEmitter.call(this)

  this.schema = schema
  this.all = db.objects(this.schema)
/*
  this.all.addListener((items, changes) => {
    console.log('all changes:', changes)
    console.log(changes.insertions)
    console.log(changes.modifications)
    console.log(changes.deletions)
    this.emit('changed', items, changes)
  })
*/
}

util.inherits(Controller, EventEmitter)

Controller.prototype.find = function (email) {
  return db.objects(this.schema).filtered('email == "' + email + '"')[0]
}

Controller.prototype.findAll = function () {
  return this.all
}

Controller.prototype.add = function (prop) {
  let obj = null
  let error = null

  db.write(() => {
    try {
      obj = db.create(this.schema, prop)
    } catch (e) {
      console.error(e)
      error = e
    }
  })

  return { object: obj, error: error }
}

Controller.prototype.remove = function (email) {
  let obj = this.find(email)
  if (obj === undefined) {
    return false
  }

  let result = false
  db.write(() => {
    try {
      db.delete(obj)
      result = true
    } catch (e) {
      console.error(e)
    }
  })

  return result
}

Controller.prototype.update = function (email, prop) {
  let obj = this.find(email)
  if (obj === undefined) {
    console.error('can\'t find object')
    return false
  }

  db.write(() => {
    try {
      obj = db.create(this.schema, Object.assign(prop, { email: email }), true)
    } catch (e) {
      console.error(e)
    }
  })

  return true
}

module.exports.user = new Controller('User')
