var test = require('tap').test
var rewire = require('rewire')

var compact = rewire('../')

test('scenario: view exists and 2 documents need to be deleted', function (t) {
  compact.__set__('nano', nanoMock)
  var c = compact('foobar')
  setTimeout(function () {
    c().then(function (res) {
        t.ok(res.ok)
        t.end()
      }, function (err) {
        console.log(err)
        t.ok(false)
        t.end()
      })
  }, 50)

  function nanoMock () {
    var viewResults = [{ rows: [
      { value: { _id: 1, _rev: 2, _deleted: true }},
      { value: { _id: 2, _rev: 2, _deleted: true }}
    ]}]
    return {
      view: function (name, view, cb) {
        cb(null, viewResults)
      },
      get: function (id, cb) {
        cb(null, { ok: true })
      },
      bulk: function (docs, cb) {
        t.deepEquals(docs, { docs: [ { _id: 1, _rev: 2, _deleted: true }, { _id: 2, _rev: 2, _deleted: true } ] })
        cb(null, { ok: true })
      },
      compact: function (cb) {
        cb(null, { ok: true })
      }
    }
  }
})
