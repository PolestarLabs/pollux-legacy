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

  let s=await gear.calculateDaily(Author,bot);
  let emblem  = s.emblem;
  let myDaily = ((s.class||15)-5)*10;

  let day = 72000000;
  //let day = 86400000;
  let userEpoch   = Author.dDATA.modules.daily ||0;
  let streak      = Author.dDATA.modules.dyStreak ||1;
  let hardStreak      = Author.dDATA.modules.dyStreakHard || Author.dDATA.modules.dyStreak || 1;
  let globalEpoch = GLB.dailyEpoch;

  const embed = new gear.RichEmbed
  embed.setColor("#d83668")

  if (emblem) {
    //embed.attachFile(paths.BUILD + emblem + ".png")
    embed.setAuthor(emblem.toUpperCase()+"-boosted Daily!","http://pollux.fun/images/donate/" + emblem + "-small.png")
  }





  if ((!userEpoch || now-userEpoch >= day)||message.author.id==="88120564400553984" ) {

    if ((now-userEpoch) < 1.728e+8 ||message.author.id==="88120564400553984" ) {



        await gear.userDB.set(Author.id, {$set:{'modules.dyStreakHard':hardStreak+1}});
        await gear.userDB.set(Author.id, {$inc:{'modules.dyStreak':1}});
    } else {
        await gear.userDB.set(Author.id, {$set:{'modules.dyStreakHard':1}});
        await gear.userDB.set(Author.id, {$set:{'modules.dyStreak':1}});
      hardStreak = 1
      streak = hardStreak%10 + 1
    }


  const Canvas = require("canvas");
  const canvas = new Canvas.createCanvas(250, 250);
  const ctx = canvas.getContext('2d');





    await gear.userDB.set(Author.id, {$set:{'modules.daily':now}});
    await eko.receive(myDaily, Author, {type: 'dailies'});

    //CONFIRM DAILY
    let dailyGet = mm('$.dailyGet',P).replace("100", "**" + myDaily + "**")

    embed.setDescription("\n" + RUBINE + dailyGet);

    let bar = "|▁▁▁▁▁▁▁▁▁▁|"
    for (i = 0; i < streak; i++) {
      bar = bar.replace("▁", "▇")
    };

    //embed.setFooter("Streak " + streak + "/10" + "|| Hard Streak: "+hardStreak )

     let gemstone = await gear.getCanvas(paths.BUILD +"daily/rubin.png");
    if ((hardStreak%10) == 0) {
      gemstone = await gear.getCanvas(paths.BUILD +"daily/manyrub.png");
      let dailyStreak = mm('$.dailyStreak', P)

      await gear.userDB.set(Author.id, {$set:{'modules.dyStreak':0}});
      await gear.userDB.set(Author.id, {$inc:{'modules.exp':80}});

      embed.description += "\n" + (gear.emoji('ticket') + dailyStreak)
      await eko.receive(myDaily * 5, Author, {type: 'dailies'});
      // gear.paramIncrement(Author, 'rubines', 500)
    }

    if ((hardStreak%3) == 0) {
      gemstone = await gear.getCanvas(paths.BUILD +"daily/jadine.png");
      let dailyStreak = mm('$.dailyStreakJades', P)
      await gear.userDB.set(Author.id, {$inc:{'modules.exp':50}});
      embed.description += "\n" + (gear.emoji('jade') + dailyStreak)
      await gear.userDB.set(Author.id, {$inc:{'modules.jades':1000}});
      // gear.paramIncrement(Author, 'rubines', 500)
    }

    if ((hardStreak%250) == 0) {
      gemstone = await gear.getCanvas(paths.BUILD +"daily/ringsaph.png");
      let dailyStreak = mm('$.dailyStreakSapphs', P)
      await gear.userDB.set(Author.id, {$inc:{'modules.exp':50}});
      embed.description += "\n" + (gear.emoji('sapphire') + dailyStreak)
      await gear.userDB.set(Author.id, {$inc:{'modules.sapphires':1}});
      // gear.paramIncrement(Author, 'rubines', 500)
    }

    embed.description += "\n\n" + "*Streak: **"+hardStreak+"***."
    let ringof = await gear.getCanvas(paths.BUILD +"daily/"+ (hardStreak%10) + ".png");


     ctx.drawImage(ringof,0,0,250,250);
     ctx.drawImage(gemstone,0,0,250,250);

  embed.attachFile({
  attachment: await canvas.toBuffer(),
  name: "attach.png"
  })

  let annex = "attachment://attach.png"

    embed.setThumbnail(annex)

      if (Author.dDATA.spdaily && Author.dDATA.spdaily.amt){
     embed.addField(Author.dDATA.spdaily.title,"+"+Author.dDATA.spdaily.amt+gear.emoji('rubine'));
    await gear.userDB.set(Author.id, {$inc:{'modules.rubines':Author.dDATA.spdaily.amt}});
  }



    message.reply({embed});


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
