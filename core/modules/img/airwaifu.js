
const getter = require("booru-getter");
const fs = require("fs");
const gear = require("../../gearbox.js")
var locale = require('../../../utils/multilang_b');
var mm = locale.getT();

var cmd = 'airwaifu';
var emb = new gear.Discord.RichEmbed();

var init = function (message) {
var Server = message.guild;
var Channel = message.channel;
var Author = message.author;
var Target = message.mentions.users.first() || Author;
var MSG = message.content;
if (Author.bot) return;

  var LANG = message.lang;

    var success = mm('forFun.airwaifu',{lngs:LANG})
    var fail = mm('forFun.booru404',{lngs:LANG})
try{
//HELP TRIGGER
    let helpkey = mm("helpKeyword",{lngs:LANG})

if (MSG.split(" ")[1]==helpkey || MSG.split(" ")[1]=="?"|| MSG.split(" ")[1]=="help"){
    return gear.usage(cmd,message,this.cat);
}
//------------
}catch(e){gear.hook.send(e.error)}
    let query = 'airplane+-comic+-animated'
    //console.log("AIRWAIFU INVOKED by " + Author + "-------------\n")

    getter.getRandom(query, (url) => {

        if (url === undefined) {
            message.reply("Não achei nada com essas tags :(")
        } else {
            //message.reply('http:' + url)
            emb.setImage(url)



            emb.setColor('#a47ee2')
            emb.setTitle(':airplane: This is your Airwaifu')


            message.channel.send({embed:emb}).then(async function (m) {
               await  m.react('👍').catch();

                await m.react('👎').catch();

               await m.react('❤').catch();

                await m.react('😠').catch();

            }).catch(e=> {let a = (new Error); gear.errLog(e,__filename,a.stack.toString())})
        }
    })


};

 module.exports = {pub:true,cmd: cmd, perms: 3, init: init, cat: 'img'};


