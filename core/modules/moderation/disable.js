const gear = require("../../gearbox.js");
const paths = require("../../paths.json");
//const locale = require('../../../utils/multilang_b');
//const mm = locale.getT();

const cmd = 'disable';

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
  if(args[0] == 'enable' ||args[0] == 'disable') return;
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


  const disaMS = Off + mm('CMD.disabledSer', {
    lngs: LANG,
    module: module
  })
  const disaMC = Off + mm('CMD.disabledChn', {
    lngs: LANG,
    module: module,
    channel: Channel.name
  })
  const disaCS = Off + mm('CMD.disabledComSer', {
    lngs: LANG,
    command: module
  })
  const disaCC = Off + mm('CMD.disabledComChn', {
    lngs: LANG,
    command: module,
    channel: Channel.name
  })

  if (sc == 'S') {
    let mod;
    Server.channels.forEach(async e => {
      try {
       
        CDATA = await gear.channelDB.findOne({id:e.id});

        if (module in CDATA.modules) {
          mod = true
          gear.channelDB.set(e.id, {
            $set: {
              [module]: false
            }
          });
        } else {
          mod = false
          gear.channelDB.set(e.id, {
            $push: {
              'modules.DISABLED': module.toLowerCase()
            }
          });
        }
      } catch (e) {
        console.error(e)
      }
    })
    mod ? message.reply(disaMS) : message.reply(disaCS);
  } else {

    CDATA = await gear.channelDB.findOne({id:message.channel.id});
    if (module in CDATA.modules) {
      gear.channelDB.set(message.channel.id, {
        $set: {
          [module]: false
        }
      });
      message.reply(disaMC)
    } else {

      imComm(message, sc)
    }
  }


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
          $push: {
            'modules.DISABLED': module.toLowerCase()
          }
        });
        message.reply(disaCC)
      }
    } catch (err) {
      console.err((err.stack).red)
    }
  }


}
module.exports = {
  pub: true,
  cmd: cmd,
  perms: 2,
  init: init,
  cat: 'master'
};
