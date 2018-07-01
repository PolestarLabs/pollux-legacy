const gear = require("../../gearbox.js");
const getter = require("booru-getter")

var locale = require('../../../utils/multilang_b');
var mm = locale.getT();

var cmd = 'safe';

var init = function (message,userDB,DB) {
var Server = message.guild;
var Channel = message.channel;
var Author = message.author;
if (Author.bot) return;
var Member = Server.member(Author);
var Target = message.mentions.users.first() || Author;
var MSG = message.content;
var bot = message.botUser
var args = MSG.split(' ').slice(1)[1]
var LANG = message.lang;

//-------MAGIC----------------

        //HELP TRIGGER
    let helpkey = mm("helpkey",{lngs:message.lang})
if (message.content.split(/ +/)[1]==helpkey || message.content.split(/ +/)[1]=="?"|| message.content.split(/ +/)[1]=="help"){
    return gear.usage(cmd,message,this.cat);
}
//------------
    var emb =    new gear.Discord.RichEmbed();

        console.log("SAFEBOORU INVOKED by " + Author.name + "-------------\n")
        console.log(1) ;
        let query = message.content
                            .split(/\s+/)
                            .slice(1)
                            .join(" ")
                            .replace(/(\s|),(\s|)/g,"+")
                            .replace(/(\s|)\|(\s|)/g,"+")
                            .replace(/\s/g,"_")
                            .replace(/(_|)\+(_|)/g,"+")
                            .replace(/_-/g,"-")
                            .replace(/([A-z]|[0-9]) -/g,"$1+-")


        !query ? query = "1girl+airplane+solo" : query = query;
        getter.getRandom(query, (url) => {
            console.log(2)
            if (!url) {
                message.reply(mm('forFun.booru404',{lngs:LANG}))
            }
            else {
                //message.reply('http:' + url)
               // emb.setImage(url)
               emb.setTitle(":heart: S a f e b o o r u")
               emb.setDescription("**Query:** "+query.replace(/_/g," ").replace(/\+/g," | ")+"\nAsked by "+Author)
                console.log(url)
                  emb.setColor('#ff97cf')

                    message.channel.send({embed:emb})
                    message.channel.send({files:[url]}).then(function (m) {
                m.react('👍').catch(e=> {let a = (new Error); gear.errLog(e,__filename,a.stack.toString())})
                m.react('👎').catch(e=> {let a = (new Error); gear.errLog(e,__filename,a.stack.toString())})
                m.react('❤').catch(e=> {let a = (new Error); gear.errLog(e,__filename,a.stack.toString())})
                m.react('😠').catch(e=> {let a = (new Error); gear.errLog(e,__filename,a.stack.toString())})

            }).catch(e=>message.channel.send(url))
            }
        })
    };

 module.exports = {pub:true,cmd: cmd, perms: 3, init: init, cat: 'img',exp:0};

