const Russia = require("../archetypes/Russia");
var gear = require("../../gearbox.js");
var paths = require("../../paths.js");
var locale = require('../../../utils/multilang_b');
var mm = locale.getT();
var fs = require('fs');
var cmd = 'speak or lang';

var init = function (message,userDB,DB) {
var Server = message.guild;
var Channel = message.channel;
var Author = message.author;
if (Author.bot) return;
var Member = Server.member(Author);
var Target = message.mentions.users.first() || Author;
var MSG = message.content;
var bot = message.botUser
var args = MSG.split(' ').slice(1)[0]
var LANG = message.lang;


    if (Russia.ongoingUser(Author.id)) {
        return message.reply(`Command already ongoing for this user.`);
    }
 if (Russia.ongoingChannel(Channel.id)) {
        return message.reply(`Command already ongoing for this user.`);
    }
const RRLT = new Russia(message);

    return message.channel.send("emb").then(async() => {

        //--start shit



        var players = await recol()
        await game(message, balance);
        const balance = await Author.dDATA.modules.rubines;






        RRLT.finish();

    });



       function recol() {

        return new Promise(async resolve => {


            message.channel.send("prompt")


                  const responses = await Channel.awaitMessages(msg2 =>
                (
                    msg2.content.includes('>join')


                ), {
                    maxMatches: 6,
                    time: 15e3
                }
            );

             if (responses.size === 0) {
                message.reply(mm('menu.goaway', {
                    lngs: LANG
                }));
                RRLT.finish();
                // break;
            }else{

                responses.forEach(re=>{
                    let bet= re.content.split(/ +/)[1]
                    if (!typeof bet === "number") bet=0;
                    RRLT.register(re.author.id,bet);
                message.reply(re.author.id+bet)
                                      })
            }

        })}


}


 module.exports = {pub:true,cmd: cmd, perms: 2, init: init, cat: 'language'};
