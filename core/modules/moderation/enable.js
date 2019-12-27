const gear = require("../../gearbox.js");
const paths = require("../../paths.json");
//const locale = require('../../../utils/multilang_b');
//const mm = locale.getT();

const cmd = 'enable';

const init = async function (message) {


  const On = gear.emoji("yep")
  const Off = gear.emoji("nope")

  const Server = message.guild;
  const Channel = message.channel;
  const Author = message.author;

  const Member = message.member;
  const Target = message.mentions.users.first() || Author;
  const MSG = message.content;

  const args = MSG.split(' ').slice(1)
  const LANG = message.lang;

  const P = {lngs: LANG}

  //-------MAGIC----------------
  //HELP TRIGGER
  let helpkey = mm("helpkey", {
    lngs: message.lang
  })
  if (MSG.split(" ")[1] == helpkey || MSG.split(" ")[1] == "?" || MSG.split(" ")[1] == "help") {
    return gear.usage(cmd, message);
  }
  //------------

  if (message.channel.type == 'dm') {
    message.reply(mm('CMD.noDM', P));
    return;
  }
  if (message.content.length < 10) {
    message.reply(mm('CMD.chooseAmod', P));
    return;
  }
 
  SDATA = await gear.serverDB.findOne({id:message.guild.id});
  if (!gear.hasPerms(Member,SDATA)) {
    return message.reply(mm('CMD.moderationNeeded', P)).catch(console.error);
  }

  function pp(o, p) {
    return o[p];
  }


  if(args[0] == 'enable' ||args[0] == 'disable') return;


  const module = args[0].toUpperCase()
  let scope;
  if (args[1]) {
     scope = args[1].toLowerCase()
  }else{
    scope = 'c'
  }
  let sc = ''
  switch (scope) {
    case 's':
    case 'server':
    case 'guild':
      sc = 'S'
      break;
    case 'c':
    case 'channel':
    case 'chnl':
      sc = 'C'
      break;
    default:
      sc = 'C'
      break;
  }


  const enaMS = On + mm('CMD.enabledSer', {
    lngs: LANG,
    module: module
  })
  const enaMC = On + mm('CMD.enabledChn', {
    lngs: LANG,
    module: module,
    channel: Channel.name
  })
  const enaCS = On + mm('CMD.enabledComSer', {
    lngs: LANG,
    command: module
  })
  const enaCC = On + mm('CMD.enabledComChn', {
    lngs: LANG,
    command: module,
    channel: Channel.name
  })

  if (sc == 'S') {
    let mod;
    Server.channels.forEach(async e => {
      try {
        
        CDATA = await gear.serverDB.findOne({id:e.id});
        if (module in CDATA.modules) {
          mod = true
          gear.channelDB.set(e.id, {
            $set: {
              [module]: true
            }
          });
        } else {
          mod = false
          gear.channelDB.set(e.id, {
            $pull: {
              'modules.DISABLED': module.toLowerCase()
            }
          });
        }
      } catch (e) {
        console.error(e)
      }
    })
    mod ? message.reply(enaMS) : message.reply(enaCS);
  } else {
    CDATA = await gear.channelDB.findOne({id:message.channel.id});
    if (module in CDATA.modules) {
      gear.channelDB.set(message.channel.id, {
        $set: {
          [module]: true
        }
      });
      message.reply(enaMC)
    } else {

      imComm(message, sc)
    }
  }


  SDATA = await gear.serverDB.findOne({id:message.guild.id});
  function imComm(msg, scope) {

    try {
      let command = msg.content.substr(msg.prefix.length).split(/ +/)[1];
      // let commandFile = require(`./${command}.js`);
      if (scope == 'S') {
        Server.channels.forEach(e => {

          if (!SDATA.channels[e.id]) {

          }
        })

      }
      if (scope == 'C') {
        gear.channelDB.set(msg.channel.id, {
          $pull: {
            'modules.DISABLED': module.toLowerCase()
          }
        });
        message.reply(enaCC)
      }
    } catch (err) {
      console.error((err.stack).red)
    }
  }


}
module.exports = {
  pub: true,
  cmd: cmd,
  perms: 2,
  init: init,
  cat: 'mod'
};
