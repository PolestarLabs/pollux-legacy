var multilevel = require('multilevel');
var net = require('net');
var level = require('level');

var db = level('/');
var db = level('/');
var db = level('/');

net.createServer(function (con) {
  
  con.pipe(multilevel.server(db)).pipe(con);
  
}).listen(3000);