const gear = require("../../gearbox.js");
const getter = require("booru-getter");
const eko = require("../../archetypes/ekonomist.js")
//const locale = require('../../../utils/multilang_b');
//const mm = locale.getT();

const cmd = 'rule34';

const init = async function (message, userDB, DB) {

  return message.reply('Rule 34 search was disabled because it violates Discord ToS in some aspects. A new command will replace this one soon.');

  const Server = message.guild;
  const Channel = message.channel;
  const Author = message.author;
  if (Author.bot) return;
  const MSG = message.content;
  const bot = message.botUser
  const args = MSG.split(' ').slice(1)[1]
  const LANG = message.lang;

  //-------MAGIC----------------
  //HELP TRIGGER
  let helpkey = mm("helpkey", {
    lngs: message.lang
  })
  if (message.content.split(/ +/)[1] == helpkey || message.content.split(/ +/)[1] == "?" || message.content.split(/ +/)[1] == "help") {
    return gear.usage(cmd, message, this.cat);
  }
  //------------

   let query = message.content
                            .split(/ +/)
                            .slice(1)
                            .join(" ")
                            .replace(/(\s|),(\s|)/g,"+")
                            .replace(/(\s|)\|(\s|)/g,"+")
                            .replace(/\s/g,"_")
                            .replace(/(_|)\+(_|)/g,"+")
                            .replace(/_-/g,"-")
                            .replace(/([A-z]|[0-9])-/g,"$1+-")


  let GOODMOJI = gear.emoji('rubine')
  let GOOD = 'Rubine'

  if (Server.dDATA.modules.GOODNAME) {
    GOOD = Server.dDATA.modules.GOODNAME
  }

  if (Server.dDATA.modules.paidCommands) {

    if (Server.dDATA.modules.paidCommands.includes("rule34")) {

      if (gear.checkGoods(5, Author) == false) {
        message.reply(mm('forFun.nsfwNofunds', {
          lngs: LANG,
          goods: GOOD,
          prefix: message.prefix
        }));
        return;
      }
      Channel.send(GOODMOJI + mm('forFun.nsfwCheckout', {
        lngs: LANG,
        emoji: ""
      }))


        await eko.pay(5,message.author.id, {type: 'lewd'});

    }
  }

  !query ? query = "pointy_ears" : query = query;

  getter.getRandomLewd(query, async(url) => {
    if (url === undefined) {
      message.reply(mm('forFun.nsfw404', {
        lngs: LANG
      }))
    } else {
      //message.channel.send()
      //message.reply("http:" + url);
      var msg_ax = "**Query:** " +query + "\nby " + Author //
      var emb = new gear.RichEmbed();
      emb.setColor('#b41212')
      emb.setTitle(':underage: RULE 34')
               emb.setDescription("**Query:** "+query.replace(/_/g," ").replace(/\+/g," | ")+"\nAsked by "+Author)

      var image = ("http:" + url)
      message.channel.send({
        embed: emb
      })
      message.channel.send({
        files: [{
          attachment: image,
          name: "file.png"
        }]
      }).then(async function (m) {
        await m.react('👍')
        await m.react('👎')
        await m.react('❤')
        await m.react('😠')

      }).catch(e => message.channel.send(image))


    }
  })


}
module.exports = {
  pub: true,
  cmd: cmd,
  perms: 3,
  init: init,
  cat: 'nsfw'
};
