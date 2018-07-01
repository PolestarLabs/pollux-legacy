const fs = require("fs");
const gear = require('../../gearbox.js')
const paths = require("../../paths.json");
const Canvas = require("canvas");
const opentype = require("opentype.js");
const drawText = require("node-canvas-text").default;
const locale = require('../../../utils/multilang_b');
const mm = locale.getT();




const init= async function run(msg,userDB,DB) {


    const canvas = new Canvas.createCanvas(330,119);
    const ctx = canvas.getContext('2d');

    let pouch = await gear.getCanvas(paths.BUILD+"pouch.png")
    let avi = await gear.getCanvas(msg.author.avatarURL||msg.author.defaultAvatarURL)
                ctx.font = "900 15px Whitney"
                ctx.fillStyle = "#222";

                await ctx.drawImage(avi, 290,15,25,25);
                await ctx.drawImage(pouch,0,0);

                await ctx.fillText(msg.member.displayName, 90, 32);
                ctx.font = "900 45px Whitney"
                await ctx.fillText(gear.miliarize(msg.author.dDATA.modules.jades||0,true), 104, 100);


   await msg.channel.send({
                    files: [{
                        attachment: await canvas.toBuffer(),
                        name: "pouch.png"
                    }]
                })
  }



  module.exports = {
     pub:true,
     cmd: "pouch",
     perms: 3,
     init: init,
     cat: 'money'
 };
