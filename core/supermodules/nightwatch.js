const gear = require('../gearbox.js');
const rq = require('request')

    const U = /<@!?[0-9]+>/g;
    const R = /<@&[0-9]+>/g;
    const E =  /@(everyone|here)/g;

const locale = require('../../utils/multilang_b');
const mm = locale.getT();


module.exports = {
  floodBuster: function (msg,bot,data) {

  },
  linksBuster: function (msg, bot, data) {

    if (msg.member && msg.member.roles.has(data.modules.BUSTER.bypass.links) || msg.member.id == msg.guild.owner.ia) return;
    let whitelist = data.modules.BUSTER.params.links || []
    let amt = (data.modules.BUSTER.params.links || 0).length;
    let cleanedMessage = msg.content.replace(/\s+/g, '');

    let regex = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\x{00a1}\-\x{ffff}0-9]+-?)*[a-z\x{00a1}\-\x{ffff}0-9]+)(?:\.(?:[a-z\x{00a1}\-\x{ffff}0-9]+-?)*[a-z\x{00a1}\-\x{ffff}0-9]+)*(?:\.(?:[a-z\x{00a1}\-\x{ffff}]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?/g

    if (cleanedMessage.match(regex)) {
      if (whitelist) {
        for (i = 0; i < amt; i++) {
          if (!cleanedMessage.includes(whitelist[i])||whitelist[0]=="") {
            msg.delete().then(m => m.channel.send(gear.emoji('nope') + " No links here")).catch()
          }
        }
      } else {
        msg.delete().then(m => m.channel.send(gear.emoji('nope') + " No links here")).catch()
      }
    }
  },

  invitesBuster: function (msg, bot, data) {

    if (msg.member && (msg.member.roles.has(data.modules.BUSTER.bypass.invites) || msg.member.id == msg.guild.owner.id)) return;
    let whitelist = data.modules.BUSTER.params.invites || []
    let amt = (data.modules.BUSTER.params.invites || 0).length;
    let cleanedMessage = msg.content.replace(/\s+/g, '');

    if (cleanedMessage.includes('http') && cleanedMessage.includes('://')) {
      let link = 'https://' + (cleanedMessage.match(/(discord.gg\/)([A-z|0-9]*)/g)||[])[0];
      //console.log(link)
      rq(link, (err, data) => {
        try{

        if (data.toJSON().request.uri.path.includes('invite')) {
          if (whitelist) {
            for (i = 0; i < amt; i++) {
              if (!cleanedMessage.includes(whitelist[i])||whitelist[0]=="") {
                if(!msg)return;
                msg.delete().then(m => m.channel.send(gear.emoji('nope') + " No invites here")).catch(e=>{})
              }
            }
          } else {
            msg.delete().then(m => m.channel.send(gear.emoji('nope') + " No invites here")).catch(e=>{})
          }
        }
        }catch(e){
          //catch
        }
      })
    }
  },

  wordsBuster: function (msg,bot,data) {

    if (msg.member&&msg.member.roles.has(data.modules.BUSTER.bypass.words)||msg.member.id==msg.guild.owner.id)return;

    let words = data.modules.BUSTER.params.words || []
    let amt   = (data.modules.BUSTER.params.words||0).length;

    //console.log(words)
    if (amt==0)return;

    for (i=0;i<amt;i++){
      if(msg.content.includes(words[i])){
        msg.delete().then(m=>m.channel.send(gear.emoji('nope')+" Don't say that here")).catch(e=>'die silently');
      }
    }

  },







  mentionBuster: function (msg,bot,data) {

      if (msg.member && msg.member.roles.has(data.modules.BUSTER.bypass.mentionSpam))return;
    //console.log("---------MENTION BUSTER---------------------")
      if(!msg.author.onWatch) msg.author.onWatch = {offenses:0};
      let BUSTER = msg.author.onWatch
      if(BUSTER.offenses<0){
        BUSTER.offenses=0
        msg.author.warned = false
      };

    if(msg.content.match(U)){
      if(msg.content.match(U).length > data.modules.BUSTER.params.mentionSpam){
          return warn(msg,bot,'Multi Mention Spam',data);
      }
      if(msg.author.onWatch.mentions){

        if(BUSTER.mentions.previous){
          if(BUSTER.mentions.previous.match(U)){
            BUSTER.offenses+=1;
            if(BUSTER.offenses>=(data.modules.BUSTER.params.mentionSpam||5)){
                 return warn(msg,bot,'Multi Mention Spam',data);
            }
          }
        }else{
          msg.author.onWatch.offenses-=1;
        }
      }else{
         msg.author.onWatch.mentions = {previous:msg.content}
      }
    }else{
          msg.author.onWatch.offenses-=1;
    }
    if(msg.author.onWatch.offenses==0)  msg.author.warned = false;
  }
}

function warn(M,bot,origin,data){
  if(!M.author.warned){
    M.author.warned = true
    M.reply(":warning: `["+origin+"]` **Chill down!** Or you will be sniped.",{files:['https://media.giphy.com/media/13XOEO2sCoeIkE/giphy.gif']});
  }else{
    setTimeout(f=>M.author.warned = false,10000);
    takeAction(data.modules.BUSTER.action.mentionSpam,M,data);
  }
}

function takeAction(action,mess,sever_data){

  let member = mess.member
  let channel = mess.channel

  if(action==='mute')true;

  else if(action==='kick'){
    member.kick("Anti-Mention Buster")
      .then(us=>{
      channel.send(`**${member.user.tag}** Was sniped by Anti-Mention Spam Buster. Action taken: KICKED`)
    })
      .catch(err=>{
      channel.send(gear.emoji('nope')+"Cannot Kick that guy")
    })
  }

  else if(action==='ban'){
    member.ban({reason:"Anti-Mention Buster"})
      .then(us=>{
      channel.send(`**${member.user.tag}** Was sniped by Anti-Mention Spam Buster. Action taken: BANNED`)
    })
      .catch(err=>{
      channel.send(gear.emoji('nope')+"Cannot Ban that guy")

    })
  }
  else {
     member.guild.owner.send(":warning: `["+member.user.tag+"] ("+member.id+")`  **Mention Spam Private Warning!**");
  }

}
