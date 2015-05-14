# twilson63/compact

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

This is a specialized function that creates a view that looks for an attr on each document called `expires_in` - this attribute is a ISO String of a datetime.  This view compares the expires in date to the current date and 
determines if the document is expired.  If the document is expired it shows in the view and the value object represents the deleted document for the given document.  When the returned method is executed it will run the view and perform a bulk delete on all documents that match the expired criteria.  Then it will perform a full compact on the database.  The main purpose of this module is to enable a time to live feature for a queue system called `cloudq` - this time to live feature enables the documents to be processed for a certain period in time then they are removed.

## usage

``` js
var c = require('@twilson63/compact')(<couchdb database url>)

c().then(success, failure)
```




