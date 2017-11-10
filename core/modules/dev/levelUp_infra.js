const GifEncoder = require('gif-encoder');
const gear = require('../../gearbox.js')
const paths = require("../../paths.json");
const Canvas = require("canvas");
const locale = require('../../../utils/multilang_b');
const mm = locale.getT();
const userDB=gear.userDB;
const DB=gear.serverDB;

const init= async function run(msg) {

const canvas = new Canvas.createCanvas(400, 225);
const ctx = canvas.getContext('2d');

let gif = new GifEncoder(400, 225);
  gif.writeHeader();
  gif.setRepeat(-1);
  gif.highWaterMark=800000000
  gif.setTransparent(0x000000);
    gif.setFrameRate(18)

  function pad(num, size) {
    let s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}
  const buffers = [];
  gif.on('data', data => buffers.push(data));
  gif.once('end', () => {
  let xD = Buffer.concat(buffers)
    msg.channel.send({
      files: [{attachment:  xD,name: "LevelUP.gif"}]
    });
  });

  let dir='./resources/imgres/gif/lvup/'

  let Target = msg.mentions.users.first()||msg.author;
  let ID=await userDB.findOne({id:Target.id});
  let tag = await gear.tag(ctx,ID.modules.level,'900 30px Sans','#2b2b2b');
  let tagV = await gear.tag(ctx,Target.tag,'18px Whitney','#818181');
  let avit = Target.avatarURL || Target.defaultAvatarURL;
  avit= avit.replace('gif','png');
  let y = await gear.getCanvas(avit);
  let widVE
  let s=1

      let wid=tag.width>35?35:tag.width;
      let widV=tagV.width>75?75:tagV.width;
      let widNew = 0
      let posx=180-(tag.width/2)

  for (let iter=0;iter<49;iter++){
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let x = await gear.getCanvas(dir + 'alpha/Comp 4_'+pad(iter, 5)+'.png');
    ctx.save();
    await ctx.drawImage(x, 0, 0);
    ctx.globalCompositeOperation = "source-in";

    var data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var i = 0;
    while (i < data.data.length) {
      let pix = data.data
      pix[i] = 255 - pix[i]; // red
      pix[i + 1] = 255 - pix[i + 1]; // green
      pix[i + 2] = 255 - pix[i + 2]; // blue
      var rgb = data.data[i++] + data.data[i++] + data.data[i++];
      data.data[i++] = rgb / 3;
    }
    ctx.putImageData(data, 0, 0);
    ctx.globalCompositeOperation = "source-atop";
    await ctx.drawImage(y, 30, 60,160-(iter*2)+(48*2),160-(iter*2)+(48*2));
    ctx.globalCompositeOperation = "destination-atop";

  let xx = await gear.getCanvas(dir+'frame/Comp 5_'+pad(iter, 5)+".png");
  await ctx.drawImage(xx,0,0);

      ctx.restore()

    if (iter >= 18) {
      ctx.globalAlpha = 0.1 * s++
        ctx.drawImage(tag.item, posx, 80, wid, tag.height);
      ctx.globalAlpha = 1;
    }
        if (iter >= 11) {
      ctx.globalAlpha = 0.1 * s++
      ctx.rotate(-1.0472)
      ctx.drawImage(tagV.item, -100, 72, widV, tagV.height);
      ctx.rotate(1.0472)
      ctx.globalAlpha = 1;
    }

    await gif.addFrame(ctx.getImageData(0, 0, 400, 225).data);
  }

gif.finish();

}

  module.exports = {
     pub:true,
     cmd: "drawcards",
     perms: 3,
     init: init,
     cat: 'forFun'
 };
