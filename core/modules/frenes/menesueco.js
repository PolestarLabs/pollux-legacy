var cmd = 'menesueco';
var gear = require("../../gearbox.js");
var fs = require("fs");

var paths = require("../../paths.json");
var locale = require('../../../utils/multilang_b');
var mm = locale.getT();

var init = function (message,userDB,DB) {
    var Server = message.guild;
    var Channel = message.channel;
    var LANG = message.lang;
    var MSG = message.content
    //-------MAGIC----------------





//HELP TRIGGER
    let helpkey = mm("helpkey",{lngs:message.lang})
if (MSG.split(" ")[1]==helpkey || MSG.split(" ")[1]=="?"|| MSG.split(" ")[1]=="help"){
    return gear.usage(cmd,message,this.cat);
}
//------------

  fs.readdir(paths.BUILD+"frenes/menes_suekos/", function (err, files) {
      let rand = gear.randomize(0,files.length-1);
      var filepath = paths.BUILD+"frenes/menes_suekos/"+files[rand]

      let emb = new gear.RichEmbed
      emb.setDescription("© Século 2017 | 🇸🇪 Menes Suenkos ")
      emb.setColor("#1a167e")
    message.channel.send({embed:emb,files:[filepath]}).then(m=>{


      })

    })
  }





 module.exports = {pub:true,cmd: cmd, perms: 3, init: init, cat: 'memes'};


