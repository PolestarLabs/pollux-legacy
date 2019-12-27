'use strict';
const gear=require('./gearbox.js');
const multilang = require('../utils/multilang_b');
const DB = gear.serverDB;
const userDB = gear.userDB;
const channelDB = gear.channelDB;
const deployer = require('./preprocessor.js')

exports.run = async function commandFire(message, payload, databaseless) {

try{
   let bot = message.botUser;
   let Database_bot = userDB.findOne({id:bot.user.id}).lean().exec();


   
    if(!databaseless){
      bot.dDATA = await Database_bot;
    }

    if(!message.channel.DISABLED) message.channel.DISABLED = (await gear.channelDB.findOne({id:message.channel.id})).modules.DISABLED;
    if(!message.guild.DISABLED)   message.guild.DISABLED = (await gear.serverDB.findOne({id:message.guild.id})).modules.DISABLED;

    setImmediate(async ()=>{
        message.channel.DISABLED = (await gear.channelDB.findOne({id:message.channel.id})).modules.DISABLED;
        message.guild.DISABLED = (await gear.serverDB.findOne({id:message.guild.id})).modules.DISABLED;
    });


    let forbiddens =  message.channel.DISABLED//.concat(message.guild.DISABLED)

    let DTMN = deployer.determine(message)
    let MDLE = deployer.checkModule(DTMN);

    if (!DTMN) return;
    if (DTMN.reaction) {
        if (forbiddens.includes(MDLE)) return;
        if (deployer.checkUse(DTMN, forbiddens, message)!==true) return;
        return message.channel.send({files: [DTMN.reaction]});
    };
    if(forbiddens){
      if (forbiddens.includes(MDLE)) {
        message.react(":nope:339398829088571402")
        return message.reply("forbidden")
      }
    };
    let mm = multilang.getT();
  
    switch (deployer.checkUse(DTMN, forbiddens, message)) {
        case "NONSFW":
        message.react(":nope:339398829088571402")
        message.reply(mm('CMD.not-a-NSFW-channel', {
                lngs: message.lang
            }))

            break;
        case "DISABLED":
            message.react(":nope:339398829088571402").catch(e=>null);
            if(message.guild.disaReply){
              message.reply(mm('CMD.disabledModule', {
                  lngs: message.lang,
                  module: message.content.substr(message.prefix.length).split(' ')[0]
              }))
            }
            break;
        case "NO ELEVATION":
            message.reply(mm('CMD.insuperms', {
                lngs: message.lang,
                prefix: message.prefixox
            }))
            break;
        default:
            setImmediate(()=>{
              deployer.run(DTMN.path, message,databaseless); //aqui nóis vai!

              
            });
            break;
    }
  }catch(e){
    console.error(e)
  }

}
