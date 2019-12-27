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
  let targetChannel = message.mentions.channels.first() || message.channel
  let embed= new gear.RichEmbed


  if(message.content.includes('stop')){
  embed.title = "Shitpost Feed"
  embed.description = `Shitpost Channel for this Server was deleted`
  gear.serverDB.set(Server.id,{$set:{'modules.shitpostFeed':false}})
  }
  else
    {


  embed.title = "Shitpost Feed"
  embed.description = `The channel ${targetChannel} was set as Shitpost Channel for this Server`

  gear.serverDB.set(Server.id,{$set:{'modules.shitpostFeed':targetChannel.id}})
    }

  message.channel.send({embed})

  }





 module.exports = {pub:false,cmd: cmd, perms: 3, init: init, cat: 'memes'};


