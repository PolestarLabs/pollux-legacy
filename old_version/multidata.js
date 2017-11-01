var multilevel = require('multilevel');
var net = require('net');
var level = require('level');

var LDBdatabase = require("djs-collection-persistent");

var DB = new LDBdatabase({
    name: "DB"
});
var userDB = new LDBdatabase({
    name: "userDB"
});
var ecoDB = new LDBdatabase({
    name: "ecoDB"
});
var statistics = new LDBdatabase({
    name: "statistics"
});



net.createServer(function (con) {
  con.pipe(multilevel.server(DB)).pipe(con);
}).listen(3064);

net.createServer(function (con) {
  con.pipe(multilevel.server(userDB)).pipe(con);
}).listen(3164);


net.createServer(function (con) {
  con.pipe(multilevel.server(ecoDB)).pipe(con);
}).listen(3264);


net.createServer(function (con) {
  con.pipe(multilevel.server(statistics)).pipe(con);
}).listen(3364);

