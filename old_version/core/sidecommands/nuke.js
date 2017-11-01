var gear = require("../gearbox.js");
var hooks = require('../../hooks');
var nuke = new gear.Discord.WebhookClient(hooks.nukeID, hooks.nukeToken);
var locale = require('../../utils/multilang_b');
var mm = locale.getT();

exports.run = (bot, message, DB, gdfal) => {
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











    var noperms     =   mm('CMD.moderationNeeded', {lngs:LANG})
    var noPermsMe   =   mm('CMD.unperm', {lngs:LANG})



    if (Server.dDATA.modules.MODROLE && Server.dDATA.modules.MODROLE.size >= 1){
        modPass = Member.roles.has(Server.dDATA.modules.MODROLE);
    }else if(Author.id==Server.owner.id||Member.hasPermission("ADMINISTRATOR")){
        modPass = true;
    };
if (!modPass) return message.reply(noperms);





    message.channel.send(mm('nuke.confirm', {
        lngs: LANG
    })).then(async() => {


        return new Promise(async resolve => {


            const responses = await Channel.awaitMessages(msg2 =>
                msg2.author.id === message.author.id && (
                    msg2.content.includes('cancel') ||
                    msg2.content === 'c' ||
                    msg2.content === 'ok' ||
                    msg2.content.includes('no')
                ), {
                    maxMatches: 1,
                    time: 30e3
                }
            );

            if (responses.size === 0) {
                message.reply(mm('nuke.timeout', {
                    lngs: LANG
                }));
                return resolve(true);
            }

            const action = responses.first().content.toLowerCase();
            if (action.includes('cancel') || action === 'c' || action === 'no') {
                message.reply("CANCEL");
                return resolve(true);
            }




            message.channel.send(mm('nuke.confirmB', {
                lngs: LANG
            }));

            const responsesB = await Channel.awaitMessages(msg2B =>
                msg2B.author.id === message.author.id && (
                    msg2B.content != ""

                ), {
                    maxMatches: 1,
                    time: 20e3
                }
            );

            if (responsesB.size === 0) {
                message.reply(mm('nuke.timeout', {
                    lngs: LANG
                }));
                return resolve(true);
            }

            const actionB = responsesB.first().content.toLowerCase();


            if (actionB.includes('cancel') || actionB === 'c') {

                message.reply("CANCEL")
                return resolve(true);
            } else {

                message.channel.send(mm('nuke.start', {
                    lngs: LANG
                }));

                if(actionB.length < 4){
                var why = "Because they wanted to!"
                }else{
                var why = actionB

                }
                DB.set(Server.id, gdfal)
                nukealert(message,why)
                message.channel.send(mm('nuke.completed', {
                    lngs: LANG
                }));

            }
            return resolve(true);
        });

    })
}

function nukealert(origin,why){
        nuke.sendSlackMessage({
        'username': 'Nuke Radar',
        'attachments': [{
            'thumb_url': 'https://lh3.googleusercontent.com/-XQQ3ZiH32_w/WMyvtjCqqEI/AAAAAAAASts/vamDgZyWUbwZLpCtF4PN0pno7aYsXrK3QCJoC/w800-h800/bomba%2Bnuclear.gif',
            'pretext': `:radioactive: **NUKE ALERT** :radioactive:

**Where?**
*${origin.guild}*

**Who?**
*${origin.author}*

**Why?**
*${why}*

`,
            'color': '#ffa10b',
            'footer': 'Pollux Nuclear Institute',
            'ts': Date.now() / 1000
      }]
    })
}
