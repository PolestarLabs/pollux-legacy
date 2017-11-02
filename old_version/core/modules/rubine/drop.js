var gear = require("../../gearbox.js");
var paths = require("../../paths.js");
var locale = require('../../../utils/multilang_b');
const eko = require("../../archetypes/ekonomist.js")
var mm = locale.getT();

var cmd = 'drop';

var init = async function (message, userDB, DB) {


  var Server = message.guild;
  var Channel = message.channel;
  var Author = message.author;
  if (Author.bot) return;
  var Member = Server.member(Author);
  var Target = message.mentions.users.first() || Author;
  var MSG = message.content;
  var bot = message.botUser
  var args = MSG.split(' ').slice(1)
  var LANG = message.lang;

  //-------MAGIC----------------
  //HELP TRIGGER
  let helpkey = mm("helpkey", {
    lngs: message.lang
  })
  if (MSG.split(/ +/)[1] == helpkey || MSG.split(/ +/)[1] == "?" || MSG.split(/ +/)[1] == "help") {
    return gear.usage(cmd, message, this.cat);
  }
  //------------
  var userData = Author.dDATA.modules

  var emojya = gear.emoji("rubine")
  let GOODMOJI = emojya
  let GOOD = 'Rubine'
  if (Server.dDATA.modules.GOODMOJI) {
    GOODMOJI = Server.dDATA.modules.GOODMOJI
  }
  if (Server.dDATA.modules.GOODNAME) {
    GOOD = Server.dDATA.modules.GOODNAME
  }

  var dropAmy = Math.abs(parseInt(args[0])) || -1

  if (dropAmy <= 0) return message.channel.send(":warning:");

  console.log("------------DROP by" + Author)
  // message.guild.defaultChannel.send()
  if (userData.rubines >= dropAmy) {


    await eko.pay(dropAmy, Author, {
      type: 'drops'
    });
    await gear.paramIncrement(Author, 'rubines', -Math.abs(dropAmy));
    await gear.paramIncrement(msg.botUser.user, 'rubines', Math.abs(dropAmy));

    message.channel.send(mm('$.userDrop', {
      lngs: LANG,
      amt: dropAmy,
      emoji: GOODMOJI,
      good: GOOD,
      user: Author.username,
      prefix: message.prefix
    }).replace(/\&lt;/g, "<").replace(/\&gt;/g, ">"), {
      files: [paths.BUILD + 'rubine.png']
    }).then(function (r) {

      if (isNaN(Channel.DROPSLY)) {
        Channel.DROPSLY = dropAmy
      } else {
        Channel.DROPSLY += dropAmy
      }
      message.delete(1000)

      return new Promise(async resolve => {

        var oldDropsly = Channel.DROPSLY
        const responses = await Channel.awaitMessages(msg2 =>
          msg2.content === message.prefix + 'pick' ||
          msg2.content === guild.dDATA.modules.PREFIX + 'pick', {
            maxMatches: 1
          }
        ).catch("DROP.JS 67 -- ERROR");
        if (responses.size === 0) {} else {
          if (oldDropsly > Channel.DROPSLY) {
            return resolve(true);
          }
          let Picker = responses.first().author

          console.log("----------- SUCCESSFUL PICK by" + Picker.username)
          message.channel.send(mm('$.pick', {
            lngs: LANG,
            good: GOOD,
            user: Picker.username,
            count: Channel.DROPSLY,
            emoji: ""
          }) + " " + emojya).then(function (c) {

            c.delete(500000).catch(e => {
              let a = (new Error);
              gear.errLog(e, __filename, a.stack.toString())
            })
            r.delete(0).catch(e => {
              let a = (new Error);
              gear.errLog(e, __filename, a.stack.toString())
            })
          }).catch(e => {
            let a = (new Error);
            gear.errLog(e, __filename, a.stack.toString())
          });

          await gear.paramIncrement(Picker, 'rubines', Math.abs(Channel.DROPSLY));
          await eko.receive(Channel.DROPSLY, Picker, {
            type: 'drops'
          });

          Channel.DROPSLY = 0
          return resolve(true);
        }
        return resolve(true);
      })

    }).catch(e => {
      let a = (new Error);
      gear.errLog(e, __filename, a.stack.toString())
    })

    
  } else {
    message.reply(mm('$.cantDrop', {
      lngs: LANG,
      goods: GOOD
    })).catch(e => {
      let a = (new Error);
      gear.errLog(e, __filename, a.stack.toString())
    });
  }
}

module.exports = {
  pub: true,
  cmd: cmd,
  perms: 3,
  init: init,
  cat: 'misc'
}
