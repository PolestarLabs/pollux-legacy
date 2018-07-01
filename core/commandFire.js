const gear=require('./gearbox.js');
const multilang = require('../utils/multilang_b');
const DB = gear.serverDB;
const userDB = gear.userDB;
const channelDB = gear.channelDB;
const deployer = require('./preprocessor.js')

exports.run = async function commandFire(message, payload) {

//console.log("COMMAND--FIRE")

   let bot = message.botUser;
   let Database_bot =await userDB.findOne({id:bot.user.id});
   let servData = payload.servData;
   let userData = payload.userData;
   let chanData = payload.chanData;
   let targData = payload.targData;

    bot.dDATA = Database_bot;

    let forbiddens = chanData.modules.DISABLED;


    let DTMN = deployer.determine(message)
    let MDLE = deployer.checkModule(DTMN);

    if (!DTMN) return;
    if (DTMN.reaction) {
        if (forbiddens.includes(MDLE)) return;
        if (deployer.checkUse(DTMN, {chanData,servData}, message)!==true) return;
        return message.channel.send({files: [DTMN.reaction]});
    };
    if(forbiddens){
      if (forbiddens.includes(MDLE)) {
        return message.reply("forbidden")
      }
    };
    let mm = multilang.getT();
  //console.log(deployer.checkUse(DTMN, {chanData,servData}, message))
    switch (deployer.checkUse(DTMN, {chanData,servData}, message)) {
        case "NONSFW":
        message.reply(mm('CMD.not-a-NSFW-channel', {
                lngs: message.lang
            }))

            break;
        case "DISABLED":
            if(servData.disaReply){
              message.reply(mm('CMD.disabledModule', {
                  lngs: message.lang,
                  module: message.content.substr(message.prefix.length).split(' ')[0]
              }))
            }
            break;
        case "NO ELEVATION":
            message.reply(mm('CMD.insuperms', {
                lngs: message.lang,
                prefix: message.prefix
            }))
            break;
        default:
            let final_payload={
              Database_bot,
              servData,
              userData,
              chanData,
              targData
            };
            deployer.run(DTMN.path, message,final_payload); //aqui nóis vai!
            break;
    }
}
