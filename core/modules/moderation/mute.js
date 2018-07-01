const gear = require("../../gearbox.js");
const paths = require("../../paths.json");
const locale = require('../../../utils/multilang_b');
const mm = locale.getT();

const cmd = 'roleadd';

const init = function (message, userDB, DB) {
    var Server = message.guild;
    var Channel = message.channel;
    var Author = message.author;
    if (Author.bot) return;
    var Member = Server.member(Author);
    var Target = message.mentions.users.first() || Author;
    var MSG = message.content;
    var bot = message.botUser
    var args = MSG.split(/ +/).slice(1)


    var LANG = message.lang;

  const P = {lngs:message.lang};
if(gear.autoHelper([mm("helpkey",P),'noargs',''],{cmd,message,opt:this.cat}))return;
  if(args.length<1)return gear.autoHelper('force',{cmd,message,opt:this.cat});


    try {
        var modPass = gear.hasPerms(Member)

        if (!modPass) {
            return message.reply(mm('CMD.moderationNeeded', {
                lngs: LANG
            })).catch(console.error);
        }


        //-------MAGIC----------------

        Target = Server.member(Target)
        let regex = /([0-9]*)[\s+]?([m|h|d|w|y]?)/
        let timing = MSG.split(/ +/).slice(2).join(' ');
        let number = timing.match(regex)[1];
        let unit = timing.match(regex)[2];
        let mult
        switch(unit){
          case 'y':
            mult=1000*60*60*24*365;
            break;
          case 'w':
            mult=1000*60*60*24*7;
            break;
          case 'd':
            mult=1000*60*60*24;
            break;
          case 'h':
            mult=1000*60*60;
            break;
          default:
            mult=60000;
            break;
        }

        args[2]=number*mult/60000;

        if (args[2] != undefined && !isNaN(args[2])) {

            var time = Number(args[2])
            var timeTx = args[2] + " minutes."
        } else {
            var time = undefined
            var timeTx = "Undetermined Time"
        }




        var MUTED = "MUTED"
        var wasMUTED = "was Muted"
        var TIME = "Time"
        var UNMUTE = "UNMUTED"
        var wasAUTOUNMUTE = "Mute has Timed Out"
        var noperms = mm('CMD.moderationNeeded', {
            lngs: LANG
        })

        var RESPO = mm('dict.responsible', {
            lngs: LANG
        })

        var noPermsMe = mm('CMD.unperm', {
            lngs: LANG
        })


        // Create a new role with data
        var muteRole = Server.dDATA.modules.MUTEROLE;
        if (muteRole == undefined && !Server.roles.exists("name", "POLLUX-MUTE")) {

            Server.createRole({
                    name: 'POLLUX-MUTE',
                    color: '000000',

                })
                .then(role => {
                    console.log(`Created role ${role}`)


                    commitMute(role)

                    Target.addRole(role)
               makeitMute(Target,role,time)

                    roleout(time, role)
                    logThis(time,timeTx)
                    return message.channel.send(`**${Target.displayName}** was MUTED for ${timeTx}`)

                }).catch(console.error)



        } else if (Server.roles.exists("name", "POLLUX-MUTE")) {
            let role = Server.roles.find("name", "POLLUX-MUTE")
            Target.addRole(role)
           makeitMute(Target,role,time)
            commitMute(role)
            roleout(time, role)
            logThis(time,timeTx)
            return message.channel.send(`**${Target.displayName}** was MUTED for ${timeTx}`)

        } else if (Server.roles.has(muteRole)) {
            commitMute(muteRole)
            Target.addRole(Server.roles.get(muteRole))
           makeitMute(Target,muteRole,time)

            roleout(time, muteRole)
            logThis(time,timeTx)
            return message.channel.send(`**${Target.displayName}** was MUTED for ${timeTx}`)

        }


        function roleout(tm, role) {
            if (tm == undefined) return false;
            return setTimeout(f => {
                Target.removeRole(role)
            }, tm*60000)

        }


        function logThis(time,timeTx) {

            let chanpoint;

            let logchan = Server.dDATA.modules.LOGCHANNEL
            let advchan = Server.dDATA.modules.ADVLOG
            let actchan = Server.dDATA.modules.ACTLOG
            let modchan = Server.dDATA.modules.MODLOG

            if (logchan && Server.channels.has(logchan)) {
                chanpoint = Server.channels.get(logchan)
            }
            if (Server.dDATA.splitLogs && modchan && Server.channels.has(modchan)) {
                chanpoint = Server.channels.get(modchan)
            }
          //console.log(chanpoint.name)

            if (chanpoint) {


                var id = Target.user.id
                var mess = message
                var emb = new gear.Discord.RichEmbed;

                emb.setThumbnail(Target.user.avatarURL)
                emb.setTitle(":mute: " + MUTED);
                emb.setDescription(`**${Target.user.username+"#"+Target.user.discriminator}** ${wasMUTED}`);
                //emb.addField("Channel",mess.channel,true)
                emb.addField(TIME, timeTx, true)
                emb.addField(RESPO, Author, true)
                //emb.addField("Message",mess.content,true)
                emb.setColor("#102af5");
                var ts = new Date
                emb.setFooter("Mute", Target.user.avatarURL)
                emb.setTimestamp(ts)

                chanpoint.send({embed:emb}).catch(e=> {let a = (new Error); gear.errLog(e,__filename,a.stack.toString())})


                var RevokeEmb = new gear.Discord.RichEmbed;

                RevokeEmb.setThumbnail(Target.user.avatarURL)
                RevokeEmb.setTitle(":mute: " + UNMUTE);
                RevokeEmb.setDescription(`**${Target.user.username+"#"+Target.user.discriminator}** ${wasAUTOUNMUTE}`);
                RevokeEmb.addField(RESPO, bot.user, true)
                RevokeEmb.setColor("#102af5");
                var ts = new Date
                RevokeEmb.setFooter("Unmute", Target.user.avatarURL)
                RevokeEmb.setTimestamp(ts)

                if (time && typeof time === "number") {

                    setTimeout(f => {
                        chanpoint.sendEmbed(RevokeEmb).catch()
                    }, time*60000)
                }


            }


        }


      async function makeitMute(Mem,Rol,minutes){
        let now = Date.now();
        let time =  minutes * 60000;
        let freedom = now + time;
        await gear.serverDB.set(Mem.guild.id,{$push:{"modules.MUTEDUSERS":{id:Mem.id,expires:freedom}}});
      };


function commitMute(role) {
  Server.channels.forEach(chn => {
    chn.overwritePermissions(role, {
      'SEND_MESSAGES': false
    }).catch()
  })
}




    } catch (e) {
       console.log(e)
    }
}

module.exports = {
    pub: false,
    cmd: cmd,
    perms: 3,
    init: init,
    cat: 'mod'
};
