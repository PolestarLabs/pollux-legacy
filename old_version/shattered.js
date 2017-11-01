


//var level = require("djs-collection-persistent");


 

var multilevel = require('multilevel');
var net = require('net');
var leveldown = require('leveldown');
var levelup = require('levelup');


  var datab= levelup(leveldown(__dirname+"/dataFUCKINbase"));

/*

  var exp_userDB        = new level({name: "userDB"});
  var exp_ecoDB         = new level({name: "ecoDB"});
  var exp_statistics    = new level({name: "statistics"});
  const exp_events      = new level({name: "events"});
*/

  
net.createServer(function (con) {
  
  
  con.pipe(multilevel.server(datab)).pipe(con);
  
  
}).listen(3008);


  
/*
net.createServer(function (con) {
  con.pipe(multilevel.server(exp_userDB)).pipe(con);
}).listen(3120);

net.createServer(function (con) {
  con.pipe(multilevel.server(exp_ecoDB)).pipe(con);
}).listen(3130);

net.createServer(function (con) {
  con.pipe(multilevel.server(exp_statistics)).pipe(con);
}).listen(3140);

net.createServer(function (con) {
  con.pipe(multilevel.server(exp_events)).pipe(con);
}).listen(3150);
*/