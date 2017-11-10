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

async function performChecks(GLB,Author){
    if (!GLB.dailyEpoch || isNaN(GLB.dailyEpoch)) {
    GLB=await gear.globalDB.set({$set:{"data.dailyEpoch":1500271200000}});
  }
  if (!GLB.epochStamp || isNaN(GLB.epochStamp)) {
    GLB=await gear.globalDB.set({$set:{"data.epochStamp":new Date(1500271200000)}});
  }
  if (!Author.dDATA.modules.daily || isNaN(Author.dDATA.modules.daily)) {
    await gear.userDB.set(Author.id, {$set:{"modules.daily":1500271199999}});
    Author.dDATA = await gear.userDB.findOne({id: Author.id});
  }
};

function calculateDaily(Author,bot) {
        let semibanned  = 5
        let penalised   = 50
        let regular     = 100
        let aluminium   = 120
        let iridium     = 150
        let palladium   = 200
        let uranium     = 300
        let emblem;

      let thisguy = bot.guilds.get("277391723322408960").member(Author)
if(!thisguy)return {class:regular,emblem};
      if (thisguy.roles.find("name", "Uranium")) {
        emblem = "uranium"
        return {class:uranium,emblem};
      };
      if (thisguy.roles.find("name", "Palladium")) {
        emblem = "palladium"
        return {class:palladium,emblem};
      };
      if (thisguy.roles.find("name", "Iridium")) {
        emblem = "iridium"
        return {class:iridium,emblem};
      };
      if (thisguy.roles.find("name", "Aluminium")) {
        emblem = "aluminium"
        return {class:iridium,emblem};
      };
    return {class:regular,emblem};
  };

const init = async function (message) {

  const Channel = message.channel;
  const Author = message.author;
  const MSG = message.content;
  const bot = message.botUser
  const args = MSG.split(' ').slice(1)[0]
  const LANG = message.lang;
  const P = {lngs:LANG}

  //VERFIFY User
  let creation = Author.createdAt.getTime();
  let now = Date.now();
  if (now - creation < 86478521) return message.reply(":warning: New Accounts can't daily");
  //-----

  let GLB=await gear.globalDB.get();
  await performChecks(GLB,Author,bot);


  let RUBINE = gear.emoji("rubine");

  let s=calculateDaily(Author,bot);
  let emblem  = s.emblem;
  let myDaily = s.class;

  let day = 72000000;
  //let day = 86400000;
  let userEpoch   = Author.dDATA.modules.daily;
  let streak      = Author.dDATA.modules.dyStreak;
  let globalEpoch = GLB.dailyEpoch;

  const embed = new gear.RichEmbed
  embed.setColor("#d83668")
  if (emblem) {
    embed.attachFile(paths.BUILD + emblem + ".png")
    embed.setThumbnail("attachment://" + emblem + ".png")
  }

  if (!userEpoch || now-userEpoch >= day) {

    if (((userEpoch - globalEpoch) / day) <= 2) {
         await gear.userDB.set(Author.id, {$inc:{'modules.dyStreak':1}});
    } else {
         await gear.userDB.set(Author.id, {$set:{'modules.dyStreak':0}});
    }
    //CONFIRM DAILY
    let dailyGet = mm('$.dailyGet',P).replace("100", "**" + myDaily + "**")

    embed.setDescription(".\n" + RUBINE + dailyGet);

    let bar = "|▁▁▁▁▁▁▁▁▁▁|"

    for (i = 0; i < streak + 1; i++) {
      bar = bar.replace("▁", "▇")
    }

    embed.setFooter("Streak " + streak + "/10" + bar)

    if (streak >= 10) {
      let dailyStreak = mm('$.dailyStreak', P)

      await gear.userDB.set(Author.id, {$set:{'modules.dyStreak':0}});
      await gear.userDB.set(Author.id, {$inc:{'modules.exp':80}});

      embed.description += "\n" + (gear.emoji('ticket') + dailyStreak)
      await eko.receive(myDaily * 5, Author, {type: 'dailies'});
      // gear.paramIncrement(Author, 'rubines', 500)
    }

    message.reply({
      embed
    })

    await gear.userDB.set(Author.id, {$set:{'modules.daily':now}});
    await eko.receive(myDaily, Author, {type: 'dailies'});
    //gear.paramIncrement(Author, 'rubines', 100)

  } else {
    let r = userEpoch+day-now;
    let remain = (r / 1000 + "").toHHMMSS();
    P.remaining= remain;
    let dailyNope = mm('$.dailyNope',P);
    gear.userDB.set(Author.id, {$inc:{'modules.exp':-20}});
    message.reply(RUBINE + dailyNope);
  };
};

module.exports = {
  pub: true,
  cmd: cmd,
  perms: 3,
  init: init,
  cat: 'rubines',
  exp: 15,
  cool: 10
};
