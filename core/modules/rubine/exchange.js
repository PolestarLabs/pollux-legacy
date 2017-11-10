const Discoin = require("../../archetypes/discoin.js");
const cfg = require("../../../config.json")
const gear = require("../../gearbox.js")
const fs = require("fs")
const locale = require('../../../utils/multilang_b');
const mm = locale.getT();
const eko = require("../../archetypes/ekonomist.js")

const cmd = "exchange"
const coinbase = JSON.parse(fs.readFileSync("./resources/lists/discoin.json", "utf8"))

const init = async function (message, userDB, DB) {

  const discoin = new Discoin(cfg.discoin);

  let args = message.content.split(/ +/).slice(1)

  let P={lngs:message.lang}
  if(gear.autoHelper([mm("helpkey",P)],{cmd,message,opt:this.cat}))return;



  if (args.length < 2) return gear.autoHelper('force',{cmd,message,opt:this.cat});
  if (isNaN(parseInt(args[0]))) return message.reply("first no int");
  if (typeof args[1] != "string" || args[1].length != 3) return message.reply("invalid curr");

  if (!(await eko.checkFunds(args[0], message.author))) return message.reply(mm("$.noFundsGeneric", {
    lngs: message.lang
  }));

  let amt = args[0]
  let $ = args[1].toUpperCase()

  let coinInfo = coinbase[$]

  if (!coinInfo) {
    coinInfo = {}
    coinInfo.bot = $ + "-Bot"
    coinInfo.name = $
    coinInfo.icon = ":heavy_dollar_sign:"
  }

    P.$= $
    P.amt= amt

  const v = {}
  v.desc = mm("discoin.desc", P)
  v.intake = mm("discoin.intake", P)
  v.outtake = mm("discoin.outtake", P)
  v.remainder = mm("discoin.remainder", P)

  v.amNaN = mm("discoin.amNaN", P)
  v.invalidCurr = mm("discoin.invalidCurr", P)
  v.invalidAmt = mm("discoin.invalidAmt", P)
  v.unverified = mm("discoin.unverified", P)
  v.userLimit = mm("discoin.userLimit", P)
  v.globalLimit = mm("discoin.globalLimit", P)
  v.receiptCode = mm("discoin.receiptCode", P)
  v.takedis = mm("discoin.takedis", P)


  discoin.request(message.author.id, amt, $).then(async result => {

    let r = result


    if (r.status == "approved") {

      await eko.pay(Number(amt), message.author.id, {type: 'exchange'});

      let embed = new gear.Discord.RichEmbed
      embed.setColor("#f43fa0")
      //embed.setThumbnail("https://image.freepik.com/free-vector/street-atm-teller-machine-with-current-operation_3446-141.jpg")
      embed.setDescription(v.desc.replace("%BOT%", coinInfo.bot))
      embed.setTitle(`${coinbase.DISCOIN.icon} Exchange Successful!`)
      embed.addField(v.intake, `${gear.emoji("rubine")} **${amt}**`, true)
      let outtake = v.outtake.replace("%CURRNAME%", coinInfo.name).replace("%BOTNAME%", coinInfo.bot).replace("%CODE%", $)
      embed.addField(outtake, `${coinInfo.icon} **${r.resultAmount}**`, true)
      embed.addField(v.remainder, `${r.limitNow} ${$}`, false)
      embed.addField(v.receiptCode, "```" + `${r.receipt}` + "```\n" + v.takedis, false)
      embed.setFooter(message.author.tag, message.author.avatarURL || message.author.defaultAvatarURL)
      let ts = new Date
      embed.setTimestamp(ts)
      message.channel.send("processing...")
      message.channel.send({
        embed
      })

      gear.finant.send("exg", {
        embeds: [embed]
      })
    }

  }).catch(e => {
    let r = e

    let reason = r.reason
    let xx = gear.emoji("nope")

    switch (reason) {
      case "amount NaN":
        message.channel.send(xx + v.amNaN)
        break;
      case "invalid destination currency":
        message.channel.send(xx + v.invalidCurr)
        break;
      case "invalid amount":
        message.channel.send(xx + v.invalidAmt)
        break;
      case "verify required":
        message.channel.send(xx + v.unverified)
        break;
      case "per-user limit exceeded":
        message.channel.send(xx + v.userLimit.replace("%NUM%", r.limit))
        break;
      case "total limit exceeded":
        message.channel.send(xx + v.globalLimit.replace("%NUM%", r.limit))
        break;
    }
  })

}

module.exports = {
  pub: true,
  cmd: "exchange",
  perms: 3,
  init: init,
  cat: '$'
};
