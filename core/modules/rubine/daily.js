const gear = require("../../gearbox.js");
const paths = require("../../paths.json");
const locale = require('../../../utils/multilang_b');
const mm = locale.getT();
const eko = require("../../archetypes/ekonomist.js")

const cmd = 'daily';

String.prototype.toHHMMSS = function () {
  let sec_num = parseInt(this, 10); // don't forget the second param
  let hours = Math.floor(sec_num / 3600);
  let days = Math.floor(hours / 24);

  let minutes = Math.floor((sec_num - (hours * 3600)) / 60);
  let seconds = sec_num - (hours * 3600) - (minutes * 60);

  if (hours < 10) {
    hours = "0" + hours;
  }
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  let time = hours + 'h ' + minutes + 'm ' + seconds + 's';
  days > 1 ? time = days + " D " : time = time
  return time;
}
const init = async function (message, userDB, DB) {

  let GLB=await gear.globalDB.get();

  const Channel = message.channel;
  const Author = message.author;
  const MSG = message.content;
  const bot = message.botUser
  const args = MSG.split(' ').slice(1)[0]
  const LANG = message.lang;


  const embed = new gear.Discord.RichEmbed
  embed.setColor("#d83668")


  let creation = Author.createdAt.getTime();
  let noww = Date.now();
  if (noww - creation < 86400000) return message.reply(":warning: New Accounts can't daily");

  let emoj = gear.emoji("rubine")
  let emblem;

  if (!GLB.dailyEpoch || isNaN(GLB.dailyEpoch)) {
    GLB=await gear.globalDB.set({$set:{"data.dailyEpoch":1500271200000}});
  }
  if (!GLB.epochStamp || isNaN(GLB.epochStamp)) {
    GLB=await gear.globalDB.set({$set:{"data.epochStamp":new Date(1500271200000)}});
  }
  if (!Author.dDATA.modules.daily || isNaN(Author.dDATA.modules.daily)) {
    await gear.userDB.set(Author.id, {$set:{"modules.daily":1500271199999}});
    Author.dDATA = await userDB.findOne({id: Author.id});
  }

  let semibanned = 5
  let penalised = 50
  let regular = 100
  let aluminium = 120
  let iridium = 150
  let palladium = 200
  let uranium = 300

  const myDaily = function () {
    try {
      let thisguy = bot.guilds.get("277391723322408960").member(Author)

      if (thisguy.roles.find("name", "Uranium")) {
        emblem = "uranium"
        return uranium;
      }
      if (thisguy.roles.find("name", "Palladium")) {

        emblem = "palladium"

        return palladium;
      }
      if (thisguy.roles.find("name", "Iridium")) {
        emblem = "iridium"
        return iridium;

      }
      if (thisguy.roles.find("name", "Aluminium")) {
        emblem = "aluminium"
        return iridium;

      }
    } catch (e) {

    }
    return regular;
  }

  myDaily()
  if (emblem) {

    embed.attachFile(paths.BUILD + emblem + ".png")
    embed.setThumbnail("attachment://" + emblem + ".png")
  }

  let now = new Date().getTime();
  let day = 80000000;
  let userEpoch = Author.dDATA.modules.daily;
  let streak = Author.dDATA.modules.dyStreak;
  let globalEpoch = GLB.dailyEpoch;


  let daysince = Math.floor(Math.floor(Math.floor(parseInt(Math.abs(globalEpoch - now), 10) / 3600) / 24) / 1000)

  let next = globalEpoch + (daysince * day + day);

  if (args === "help" || args === "?" || args === "reset" || args === "epoch") {
    let e = new gear.Discord.RichEmbed
    let r = next
    //let R = -();
    let remain = (Math.abs((now - next) / 1000) + "").toHHMMSS();

    e.setTitle(gear.emoji("rubine") + " Last Global Dailies Refresh")
    e.setDescription(remain)
    e.setFooter("LAST RESET")
    e.setTimestamp(GLB.epochStamp)
    e.setColor("#d13d54")
    return Channel.send({
      embed: e
    }).catch(e => gear.hook.send(e.error))
  };

  if (!userEpoch || now - userEpoch >= day) {

    if (((userEpoch - globalEpoch) / 86400000) <= 2) {
          gear.userDB.set(Author.id, {$inc:{'modules.dyStreak':1}});
    } else {
          gear.userDB.set(Author.id, {$set:{'modules.dyStreak':0}});
    }

    //CONFIRM DAILY
    let dailyGet = mm('$.dailyGet', {
      lngs: LANG,
      emoji: '',
    }).replace("100", "**" + myDaily() + "**")

    embed.setDescription(".\n" + emoj + dailyGet)

    let bar = "|▁▁▁▁▁▁▁▁▁▁|"

    for (i = 0; i < streak + 1; i++) {
      bar = bar.replace("▁", "▇")
    }

    embed.setFooter("Streak " + streak + "/10" + bar)

    if (streak >= 10) {
      let dailyStreak = mm('$.dailyStreak', {
        lngs: LANG,
        emoji: ''
      })

      gear.userDB.set(Author.id, {$set:{'modules.dyStreak':0}});
      gear.userDB.set(Author.id, {$inc:{'modules.exp':80}});

      embed.description += "\n" + (gear.emoji('ticket') + dailyStreak)
      await eko.receive(myDaily() * 5, Author, {type: 'dailies'});
      // gear.paramIncrement(Author, 'rubines', 500)
    }

    message.reply({
      embed
    })

    await gear.userDB.set(Author.id, {$set:{'modules.daily':now}});
    await eko.receive(myDaily(), Author, {type: 'dailies'});
    //gear.paramIncrement(Author, 'rubines', 100)

  } else {

    let r = Math.abs(now - next);
    let remain = (r / 1000 + "").toHHMMSS();
    let dailyNope = mm('$.dailyNope', {
      lngs: LANG,
      remaining: remain
    })
    gear.userDB.set(Author.id, {$inc:{'modules.exp':-20}});
    message.reply(emoj + dailyNope)
  };
};

module.exports = {
  pub: true,
  cmd: cmd,
  perms: 3,
  init: init,
  cat: 'rubines',
  exp: 15,
  cool: 5000
};
