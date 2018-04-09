const gear = require('./gearbox.js');
const fs = require('fs'),
      request = require('request');

const download = async function(uri, filename, callback){
  request.head(uri, async function(err, res, body){
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);

    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};

var cmd = 'curate';


var init = function (message) {
    console.log('lewdstart')


};

 module.exports = {pub:false,cmd: cmd, perms: 3, init: init, cat: 'infra'};


