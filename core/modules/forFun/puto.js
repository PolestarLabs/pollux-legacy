const fs = require("fs");
const Canvas = require("canvas");

const gear = require("../../gearbox.js");
const paths = require("../../paths.json");
const locale = require('../../../utils/multilang_b');
const mm = locale.getT();

const cmd = 'puto';

const init = async function (message) {

  const canvas = new Canvas.createCanvas(482, 270);
  const ctx = canvas.getContext('2d');

  const P = {
    lngs: message.lang
  }

  const Server = message.guild;

  let now = new Date().getTime();

  if (!Server.dDATA.modules.putometro_last) {
    await gear.serverDB.set(Server.id, {
      $set: {
        'modules.putometro_last': now
      }
    });
  };

  let a = Math.round((now - Server.dDATA.modules.putometro_last) / 1000 / 60 / 60 / 60 / 24) || 0;

  if (!Server.dDATA.modules.putometro_max) {
    await gear.serverDB.set(Server.id, {
      $set: {
        'modules.putometro_max': 0
      }
    });
  }else{
if(Server.dDATA.modules.putometro_max<a||!Server.dDATA.modules.putometro_max){

    await gear.serverDB.set(Server.id, {
      $set: {
        'modules.putometro_max': a
      }
    })
  };

}


  let s = a||Server.dDATA.modules.putometro_max || 0;



  let puto = await gear.getCanvas(paths.BUILD + "puto.jpg");
  await ctx.drawImage(puto, 0, 0, 482, 270);
  let tagA = await gear.tag(ctx, a, "900 32px WhitneyHTF-Black", "#534e77");
  let tagB = await gear.tag(ctx, s, "900 32px WhitneyHTF-Black", "#534e77");
  await ctx.drawImage(tagA.item, 235, 25);
  await ctx.drawImage(tagB.item, 322, 65);
  message.channel.send({
    files: [{
      attachment: await canvas.toBuffer(),
      name: "puto.png"
                    }]
  })

}

module.exports = {
  pub: true,
  cmd: cmd,
  perms: 3,
  init: init,
  cat: 'fun'
};
