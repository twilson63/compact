# compact

Simple removes any document with an expires in flag and compacts the database

## usage

``` js
var c = require('@twilson63/compact')('http://localhost:5984/cloudq')

c('compact', 'docs')
  .then(success, failure)
```

