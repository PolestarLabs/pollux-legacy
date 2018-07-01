const fs = require("fs");
const Canvas = require("canvas");

const gear = require("../../gearbox.js");
const paths = require("../../paths.json");
const locale = require('../../../utils/multilang_b');
const mm = locale.getT();

const cmd = 'decontaminate';

const init = async function (message) {

try{

  let Target = message.mentions.members.first() || message.member;
  let avi = (Target.user.avatarURL || Target.user.defaultAvatarURL).replace('gif', 'png');

  const canvas = new Canvas.createCanvas(700, 300);
  const tmpCtx = canvas.getContext('2d');

  const P = {
    lngs: message.lang
  }

  let args = message.content.split(/ +/).slice(1).join(' ')
  message.channel.decontamination = true

  let bkg = await gear.getCanvas(paths.BUILD + "deconshow.jpg");
  let thumbImg = new Canvas.createCanvas(150, 150)

  let pikt = await gear.getCanvas(avi);
  const ctx = thumbImg.getContext('2d');
  if (message.channel.cancer) {
    message.channel.cancer -= gear.randomize(100, 200)
  }
  tmpCtx.drawImage(bkg, 0, -50);

  ctx.save();
  ctx.beginPath();
  ctx.arc(75, 75, 75, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(pikt, 0, 0, 150, 150);
  ctx.beginPath();
  ctx.arc(0, 0, 75, 0, Math.PI * 2, true);
  ctx.clip();
  ctx.closePath();
  ctx.restore();

  tmpCtx.drawImage(thumbImg, 300, 80, 80, 80);

  P.user = message.member.displayName
  P.user2 = Target.displayName

  if (Target.id == message.author.id) {
    message.channel.send(mm('forFun.decon', P));

  } else {
    message.channel.send(mm('forFun.decon2', P));

  }
  if (args && args.split(' ')[0] == "more") {

    message.channel.send({
      files: ['https://www.thehazmatguys.com/wp-content/uploads/2016/04/28.png']
    })
    if (message.channel.cancer) {
      message.channel.cancer -= gear.randomize(1000, 10200)
    }

  } else if (args && args.includes("even more")) {
    message.channel.send({
      files: ['https://www.tdisdi.com/wp-content/uploads/2015/08/Photo-4-%C2%A9-S.-Barsky_Decon_July-2015_025.jpg']
    })
    if (message.channel.cancer) {
      message.channel.cancer -= gear.randomize(10000, 58200)
    }

  } else {

    message.channel.send({
      files: [{
        attachment: await canvas.toBuffer(),
        name: "decon.png"
                    }]
    })
  }
}catch(e){
  console.log(e)
}

}

module.exports = {
  pub: true,
  cmd: cmd,
  perms: 3,
  init: init,
  cat: 'fun'
};
