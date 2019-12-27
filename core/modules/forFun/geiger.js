const fs = require("fs");
const Canvas = require("canvas");

const gear = require("../../gearbox.js");
const paths = require("../../paths.json");
//const locale = require('../../../utils/multilang_b');
//const mm = locale.getT();

const cmd = 'geiger';

const init = async function (message) {

  try{
  const canvas = new Canvas.createCanvas(300, 500);
  const ctx = canvas.getContext('2d');

  const P = {
    lngs: message.lang
  }


  let rand = gear.randomize(0,1000)
  let num ;

  switch(true){
    case rand==1000:
      num = "CANCER"
      break;
    case rand>950:
      num = gear.randomize(0,999999)
      break;
    case rand>900:
      num = gear.randomize(0,100000)
      break;
    case rand>850:
      num = gear.randomize(0,10000)
      break;
    default:
      num = gear.randomize(0,350)
             }
   //num=42 ;
  let randmin = gear.randomize(200,800)
  if (message.channel.decontamination){
    num = num -randmin>0? num-randmin:0;
    message.channel.decontamination = false;

  }
    if( message.channel.cancer > 0){
      num = message.channel.cancer+Math.floor((1+num)-200)
    }

  let geiger = await gear.getCanvas(paths.BUILD + "geiger.png");
  let needle = Canvas.createCanvas(116,116);
   const ctx2 = needle.getContext('2d');
  let needle_p = await gear.getCanvas(paths.BUILD + "cen_needle.png");
  await ctx.drawImage(geiger, 0, 0, 300, 500);

  ctx2.translate(58, 58);
    let pointer = num>350 ? 120 : num / 3
    let light = num>350
  let light_p = await gear.getCanvas(paths.BUILD + "geig_lite.png");
    let warn = num>10000
  let warn_p = await gear.getCanvas(paths.BUILD + "geig_radio.png");

    if(light){
      await ctx.drawImage(light_p, 0,0);
    }
    if(warn){
      await ctx.drawImage(warn_p, 0,0);
    }
    
  ctx2.rotate(Math.PI / 180*(-60+pointer));
  ctx2.translate(-58, -58);
  await ctx2.drawImage(needle_p, 0, 0, 116,116);

  await ctx.drawImage(needle, 84, 77, 116,116);

if(gear.randomize(1,10)==10){
   message.channel.cancer-=10000
}
   
    
    
   setTimeout(function(){
     
   message.channel.cancer=0;
   },30000)

    
  let tagA = await gear.tag(ctx, 888888, "34px 'digital-7'", "#59652d");
  let tagB = await gear.tag(ctx, num, "34px 'digital-7'", "#111114");

  await ctx.drawImage(tagA.item, 90, 224);
  await ctx.drawImage(tagB.item, 90-tagB.width+90, 224);

    P.percentage=gear.miliarize(Math.floor(Math.pow(num/350*100,2)/100));
    P.radiation=gear.miliarize(num);
    P.user = message.member.displayName

    message.channel.cancer = num +50

    await message.channel.send(mm('forFun.cancer',P));
  await gear.wait(2);
  await message.channel.send({
    files: [{
      attachment: await canvas.toBuffer(),
      name: "geiger.png"
                    }]
  })
  await gear.wait(1);

    await message.channel.send(mm('forFun.geiger',P));

}catch(e){
  console.error(e)
}
}

module.exports = {
  pub: true,
  cmd: cmd,
  perms: 3,
  init: init,
  cat: 'fun'
};
