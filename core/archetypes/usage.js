const fs = require("fs")
var gear = require("../gearbox.js");
var paths = require("../paths.json");
var locale = require('../../utils/multilang_b');
var mm = locale.getT();

const coinbase = require("../../resources/lists/discoin.json");
const d = require("./infra.json").decoration;
const langlistage = require('../../utils/langList.json');

const v = {}

exports.run = function run(cmd, m, third) {

        third = third || "misc"
        v.mod = mm("dict.module", {lngs: m.lang});
        v.name = mm("modules." + third, {lngs: m.lang});

        let emb = new gear.Discord.RichEmbed;
      try{
        emb.setColor(d[third].color)
      }catch(e){
        emb.setColor("#eee")
      }
        emb.setThumbnail(d[third].thumb)
        emb.setFooter(`${v.mod}: ${v.name} | ${third.toUpperCase()} > ${cmd}`, "https://png.icons8.com/puzzle/color/16");
        emb.setAuthor(mm("help.commUsage", {
            lngs: m.lang,
            comm: m.prefix + cmd
        }), m.botUser.user.avatarURL, "http://Pollux.fun/commands");
        emb.setDescription(mm("help." + cmd, {
            lngs: m.lang,
             prefix: m.prefix
        }) + "\n\n")
        emb.addField("**" + mm("dict.usage", {
            lngs: m.lang
        }) + "**", mm("usage." + cmd, {
            lngs: m.lang,
            prefix: m.prefix
        }), false)

        if (cmd == "exchange") {
          let litzka = ""
          for (i in coinbase) {
            if (i != "DISCOIN") litzka += `\`${i}\`  ${coinbase[i].icon} **${coinbase[i].bot}**'s  ${coinbase[i].name}\n`;
          };
          emb.addField("======", `
          ${litzka}
          `, false)

        }
      if (third === "language") {
        emb.addField("**" + mm("usage.speakAvailable", {
          lngs: m.lang
        }) + "**", langlistage.languages.join('\n'), false)
      }
      m.channel.send({
        embed: emb
      })
      }
