const gear = require("../../gearbox.js");
const paths = require("../../paths.json");
//const locale = require('../../../utils/multilang_b');
//const mm = locale.getT();

const cmd = 'mute';

const init = async function (message, userDB, DB) {
    var Server = message.guild;
  await  Server.members.fetch();
    var Channel = message.channel;
    var Author = message.author;
    if (Author.bot) return;
    var Member = Server.member(Author);
    var Target =await gear.getTarget(message);
    var MSG = message.content;
    var bot = message.botUser
    var args = MSG.split(/ +/).slice(1)

return message.reply("Mute Has been disabled");
  
    var LANG = message.lang;

  const P = {lngs:message.lang};
if(gear.autoHelper([mm("helpkey",P),'noargs',''],{cmd,message,opt:this.cat}))return;
  if(args.length<1)return gear.autoHelper('force',{cmd,message,opt:this.cat});


  let ServerDATA = await gear.serverDB.findOne({id:Server.id},{"modules.LOCALRANKx":0});
  
    try {
        var modPass = await gear.hasPerms(Member,ServerDATA);

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
        
        args[2]=+number*mult/60000;

        if (args[2] != undefined && !isNaN(args[2]) && Number(args[2]) != 0) {

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
        if (!muteRole && !Server.roles.has(muteRole) && !Server.roles.find(x=>x.name=== "POLLUX-MUTE"||x.name.includes( "POLLUX-MUTE")))  {
            Server.roles.create({
                    name: 'POLLUX-MUTE',
                    color: '000000',
                })
                .then(async role => {
                    message.channel.send(`No Mute Role Setup, Creating ${role}`)
              
                    commitMute(role)

                    Target.roles.add(role)
                    makeitMute(Target,role,time)
                    roleout(time, role)
                    logThis(time,timeTx)
                    await gear.serverDB.set(Server.id,{$set:{'modules.MUTEROLE':role.id}});
                    return message.channel.send(`**${Target.displayName}** was MUTED for ${timeTx}`)
                }).catch(console.error)


        } else if (Server.roles.find(x=>x.name=== "POLLUX-MUTE"||x.name.includes( "POLLUX-MUTE"))) {
            let role = Server.roles.find(x=>x.name=== "POLLUX-MUTE"||x.name.includes( "POLLUX-MUTE"))
            Target.roles.add(role)
            makeitMute(Target,role,time)
            commitMute(role)
            roleout(time, role)
            logThis(time,timeTx)
            return message.channel.send(`**${Target.displayName}** was MUTED for ${timeTx}`)

        } else if (Server.roles.has(muteRole)) {
            commitMute(muteRole)
            Target.roles.add(Server.roles.get(muteRole))
            makeitMute(Target,muteRole,time)
            roleout(time, muteRole)
            logThis(time,timeTx)
            return message.channel.send(`**${Target.displayName}** was MUTED for ${timeTx}`)

        }


        function roleout(tm, role) {
            if (tm == undefined) return false;
            return setTimeout(f => {
                Target.roles.remove(role)
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
          
 
            if (chanpoint) {


                var id = Target.user.id
                var mess = message
                var emb = new gear.RichEmbed;

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


                var RevokeEmb = new gear.RichEmbed;

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
    chn.overwritePermissions({
      permissionOverwrites:[
        {
          id:role,
      deny:['SEND_MESSAGES','SPEAK']
    }
      ],
       reason: 'MUTED BY '+message.author.tag
    }).catch(e=>{})
  })
}




    } catch (e) {
       console.error(e)
    }
}

module.exports = {
    pub: false,
    cmd: cmd,
    perms: 3,
    init: init,
    cat: 'mod', botperms: ["MANAGE_CHANNELS","MANAGE_ROLES"]
};
