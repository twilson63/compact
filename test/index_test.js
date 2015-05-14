var compact = require('../')

var c = compact('https://admin:jackdogbyte@couchdb-eirenerx-dev.eirenerx.com/cloudq')
setTimeout(function () {
  c('compact', 'docs')
    .then(function (res) {
      console.log(res)
    }, function (err) {
      console.log(err)
    })
}, 5000)
