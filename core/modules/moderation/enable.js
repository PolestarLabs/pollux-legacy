const gear = require("../../gearbox.js");
const paths = require("../../paths.json");
const locale = require('../../../utils/multilang_b');
const mm = locale.getT();

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
    Server.channels.forEach(e => {
      try {
        if (module in Channel.dDATA.modules) {
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
        console.log(e)
      }
    })
    mod ? message.reply(enaMS) : message.reply(enaCS);
  } else {
    if (module in Channel.dDATA.modules) {
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
          $pull: {
            'modules.DISABLED': module.toLowerCase()
          }
        });
        message.reply(enaCC)
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
  cat: 'mod'
};
