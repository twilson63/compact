var Promise = require('bluebird')
var nano = require('nano')
var R = require('ramda')

module.exports = function (dbUrl) {
  var db = Promise.promisifyAll(nano(dbUrl))

  // create view if exists
  putIfExists(db, doc, '_design/compact')

  return function () {
    return R.pipeP(
      db.viewAsync,
      R.nth(0),
      R.path(['rows']),
      R.map(R.path(['value'])),
      docsObj,
      db.bulkAsync,
      compactDocs
    )('compact', 'docs')
  }

  function compactDocs () {
    return db.compactAsync()
  }

  function docsObj (docs) {
    return { docs: docs }
  }
}

// check if view exists, if not the add it
function putIfExists (db, doc, id) {
  return db.getAsync(id)
    .then(null, function (e) {
      return db.insertAsync(doc(), id)
    })
}

// couchdb view that checks for expired documents
function doc () {
  var view = function (doc) {
  if (doc.expires_in < (new Date()).toISOString()) {
    emit(doc._id, { _id: doc._id, _rev: doc._rev, _deleted: true }) // eslint-disable-line
  }
}.toString()
  return {
    _id: '_design/compact',
    language: 'javascript',
    views: {
      docs: {
        map: view
      }
    }
  }
}
