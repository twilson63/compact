var Promise = require('bluebird')
var nano = require('nano')
var R = require('ramda')

module.exports = function (dbUrl) {
  var db = Promise.promisifyAll(nano(dbUrl))
  // create view if exists
  putIfExists(db, doc, '_design/compact')
  
  return R.composeP(
    compactDocs, 
    db.bulkAsync,
    docsObj,
    R.map(R.path(['value'])),
    R.path(['rows']), 
    R.nth(0),
    db.viewAsync
  )

  function compactDocs () { 
    return db.compactAsync() 
  }

  function docsObj (docs) {
    return { docs: docs }
  }

}

function putIfExists (db, doc, id) {
  return db.getAsync(id)
    .then(null, function(e) {
      return db.insertAsync(doc(), id)
    })
}

function doc () {
  var view = function (doc) {
  if (doc.expires_in < (new Date()).toISOString()) {
    emit(doc._id, {
        _id: doc._id,
        _rev: doc._rev,
        _deleted: true
    })
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

