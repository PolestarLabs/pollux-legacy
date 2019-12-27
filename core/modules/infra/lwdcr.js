const gear = require('../../gearbox.js');
const fs = require('fs');
const request = require('request');

const download = async function(uri, filename, callback){
  request.head(uri, async function(err, res, body){
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);

    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};



const cmd = 'ping';
const init = async function (message) {
  console.log('poo')

  if (message.channel.id!='364811796776878091')return;
  try {

    let nwurl = await gear.getImg(message, true);
    let ts = "lewd-" + Date.now();
    await download(nwurl, '/root/v7/resources/imgres/lewd/' + message.author.id + "-" + ts + '.png', function (x) {
      message.reply(gear.emoji('yep') + "Lewdle Uploaded Successfully!")
    });

  } catch (e) {
    console.error(e)
  }


};
module.exports = {
  cool: 10,
  pub: false,
  cmd: cmd,
  perms: 3,
  init: init,
  cat: 'infra'
};
