const gear = require("../../gearbox.js");
const paths = require("../../paths.json");
const locale = require('../../../utils/multilang_b');
const mm = locale.getT();

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
  if (!gear.hasPerms(Member)) {
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
    Server.channels.forEach(e => {
      try {
        if (module in Channel.dDATA.modules) {
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
        console.log(e)
      }
    })
    mod ? message.reply(disaMS) : message.reply(disaCS);
  } else {
    if (module in Channel.dDATA.modules) {
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
    console.log('immcomm')
    try {
      let command = msg.content.substr(msg.prefix.length).split(/ +/)[1];
      // let commandFile = require(`./${command}.js`);
      if (scope == 'S') {
        Server.channels.forEach(e => {

          if (!Server.dDATA.channels[e.id]) {
            console.log("nochan:  " + e.name)
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
      console.log((err.stack).red)
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
