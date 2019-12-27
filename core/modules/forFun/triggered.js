const GIFEncoder = require('gif-encoder');
const gear = require('../../gearbox.js')
const paths = require("../../paths.json");
const Canvas = require("canvas");


const init = async function run(msg, userDB, DB) {


  const Server = msg.guild
        let now = new Date().getTime();


            await gear.serverDB.set(Server.id, {$set:{'modules.putometro_last': now}});

  let mx = Math.round((now-(await gear.serverDB.findOne({id:msg.guild.id})).modules.putometro_last) / 1000 / 60 / 60 / 60 / 24 )||0;
await gear.serverDB.set(Server.id, {$set:{'modules.putometro_max': mx}});


  
  
msg.channel.startTyping()

  const canvas = new Canvas.createCanvas(250, 250);
  const ctx = canvas.getContext('2d');

  var GifEncoder = require('gif-encoder');
  var gif = new GifEncoder(250, 250);
  gif.writeHeader();
  gif.setRepeat(0);
  gif.highWaterMark = 800000000
  gif.setTransparent(0x000000);
  gif.setFrameRate(60)

  function pad(num, size) {
    var s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
  }
  let dir = './resources/imgres/gif/lvup/'

  const buffers = [];
  gif.on('data', data => buffers.push(data));
  gif.once('end', () => {
    let xD = Buffer.concat(buffers)
    msg.channel.send({
      files: [{
        attachment: xD,
        name: "200percentputaralhasso.gif"
                    }]
    }).then(m => {
      msg.channel.stopTyping()
    })
  });
  
  let intensity = msg.content.split(/ +/)[1];
  let targo = msg.content.split(/ +/)[0];
  let MAX_DISPLACE = intensity||15
  msg2 = msg
  msg2.content = targo
  let Target = await gear.getTarget(msg2);
  let x = await gear.getCanvas(paths.BUILD + 'trigger.png');
  let avit = Target.displayAvatarURL({format:'png'})|| Target.displayAvatarURL;
  avit= avit.replace(/(gif|webp)/g,'png');
  let y = await gear.getCanvas(avit);
  for (let iter = 0; iter < 15; iter++) {

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let d = gear.randomize(10, MAX_DISPLACE);

    ctx.save();
    let disp_X = gear.randomize(0, d);
    let disp_Y = gear.randomize(0, d);

    ctx.globalAlpha = 8;
    ctx.drawImage(y, -d + disp_X, -d + disp_Y, 250 + d, 250 + d);
    ctx.drawImage(x, 0, 0, 250, 250);
    ctx.globalAlpha = 0.3;
    ctx.drawImage(x, (-d / 2) + disp_X, 0, 250, 250);
    ctx.globalAlpha = 1;

     gif.addFrame(ctx.getImageData(0, 0, 250, 250).data);
  }
  gif.finish();

}


module.exports = {
  pub: true,
  cmd: "triggered",
  perms: 3,
  botperms: ["ATTACH_FILES"],
  init: init,
  cat: 'forFun'
};
