const fs = require("fs");
const gear = require('../../gearbox.js')
const paths = require("../../paths.js");
const PixelCore = require('canvasutil').PixelCore
const pixelProcessor = new PixelCore();
const Pixly = require("pixel-util");
const Canvas = require("canvas");
const locale = require('../../../utils/multilang_b');
const mm = locale.getT();



const init= async function run(msg,userDB,DB,target,chan) {

    const canvas = new Canvas(800, 600);
    const ctx = canvas.getContext('2d');

     target = target||msg.author 
  try{
    
     chan = chan    || msg.channel
  }catch(e){
    return;
  }
  
  let frame = await gear.getCanvas(paths.BUILD+"poly_greet.png")
  let phot = await gear.getCanvas((target.avatarURL||target.defaultAvatarURL))
  
  ctx.drawImage(phot,367,340,134,134)
  ctx.fillStyle= "#ff74ef"
  if(target.dDATA){
  ctx.fillStyle= Target.dDATA.modules.favcolor || "#ff74ef"
  }
  
  ctx.fillRect(511,430,205,50);
  ctx.drawImage(frame,0,0)
                ctx.font = "900 30px Whitney, Sans"
  let name =  await gear.tag(ctx,target.tag,ctx.font,"#b2b2b2")

  
  let weid =  name.width > 185 ? 185 : name.width 
  ctx.drawImage(name.item,516,382,weid,name.height)
  
                ctx.font = "900 38px Wurper Comics, Sans"
                ctx.fillStyle = "#272727";
  
  let phrases = [
                "Hey everyone,|say hello to|our new friend!"
                ,"Hey guys,|someone just arrived|let's greet them!"
                ,"Oh, who's there?,|welcome to the Server.|Make yourself at home!"
                ,"Um, hi!|We were just waiting|for you!"
                ,"We have a newcomer!|I guess we should|all say hi!"
                ]
  let lns=phrases[gear.randomize(0,4)].split("|")
                let line1 = await gear.tag(ctx,lns[0],ctx.font,ctx.fillStyle)
                let line2 = await gear.tag(ctx,lns[1],ctx.font,ctx.fillStyle)
                let line3 = await gear.tag(ctx,lns[2],ctx.font,ctx.fillStyle)
                
                let h = line1.height
                let wid =  line1.width > 315 ? 315 : line1.width 
  ctx.drawImage(line1.item,535-(wid/2),100,wid,h)
                wid =  line2.width > 367 ? 367 : line2.width 
  ctx.drawImage(line2.item,535-(wid/2),140,wid,h)
                wid =  line3.width > 317 ? 317 : line3.width 
  ctx.drawImage(line3.item,535-(wid/2),180,wid,h)
                //await ctx.fillText("Hey everyone! Say hello to our new friend", 0, 12);
  
    
   await chan.send({
                    files: [{
                        attachment: await canvas.toBuffer(),
                        name: "welcome.png"
                    }]
                })
  }
  
  
  
  module.exports = {
     pub:true,
     cmd: "drawcards",
     perms: 3,
     init: init,
     cat: 'forFun'
 };
