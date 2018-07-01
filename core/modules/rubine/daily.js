const gear = require("../../gearbox.js");
const paths = require("../../paths.json");
const moment = require("moment");
const locale = require('../../../utils/multilang_b');
const mm = locale.getT();

const cmd = 'daily';

const init = async function (message) {


  const P={lngs:message.lang}

  let lang = message.lang[0]
  if(lang=='cz')lang='cs';
  moment.locale(lang);

  const v={
      last: mm('daily.lastdly',P),
      next: mm('daily.next',P),
      streakcurr: mm('daily.streakcurr',P),
      expirestr: mm('daily.expirestr',P),
  }
  const Author = message.author

  if(Author.dailing === true) return;


  const STREAK_EXPIRE = 1.296e+8
  const DAY = 7.2e+7

  const now        = Date.now();
  const userDaily  = Author.dDATA.modules.daily || 1;
  let   hardStreak = Author.dDATA.modules.dyStreakHard+1 || 1;
  let   softStreak = (hardStreak % 10 || 0) + 1;

  const dailyAvailable = now-userDaily >= DAY;
  const streakGoes = now-userDaily <= STREAK_EXPIRE;

  const dly_calc = await gear.calculateDaily(Author,message.botUser);
  const emblem   = dly_calc.emblem;
  const myDaily  = ((dly_calc.class||15)-5)*10;


  const embed = new gear.RichEmbed;
  embed.setColor("#d83668");


  if (emblem) {
    embed.setAuthor(emblem.toUpperCase()+"-boosted Daily!","http://pollux.fun/images/donate/" + emblem + "-small.png")
  }


  if(message.content.endsWith('info')){
    let embe2=new gear.RichEmbed;
    embe2.setColor('#e35555')
    embe2.setDescription(`
${gear.emoji('time')   } ${gear.emoji('offline')} **${v.last}** ${ moment.utc(userDaily).fromNow()}
${gear.emoji('future') } ${dailyAvailable?gear.emoji('online'):gear.emoji('dnd')} **${v.next}** ${ moment.utc(userDaily).add(20,'hours').fromNow() }
${gear.emoji('expired')} ${streakGoes?gear.emoji('online'):gear.emoji('dnd')} **${v.expirestr}** ${streakGoes ? moment.utc(userDaily+STREAK_EXPIRE).fromNow() +" !": "I have bad news for you..." }
${gear.emoji('expense')} ${gear.emoji('offline')} **${v.streakcurr}** \`${hardStreak }x\`(Hard) | \`${hardStreak%10 }x\`(Soft)
  `)
        return message.channel.send({embed:embe2});
  }

  if(!dailyAvailable){

    let r = userDaily+DAY;
    P.remaining=  moment.utc(r).fromNow(true)
    let dailyNope = mm('$.dailyNope',P);
    message.reply(gear.emoji('nope') + dailyNope);
    let embe2=new gear.RichEmbed;
    embe2.setColor('#e35555');
    embe2.setDescription(`
${gear.emoji('time')   } **${v.last}** ${ moment.utc(userDaily).fromNow()}
${gear.emoji('expired')} **${v.expirestr}** ${moment.utc(userDaily+STREAK_EXPIRE).fromNow() }
    `);

    return message.channel.send({embed:embe2});

  };
  Author.dailing = true

  if(streakGoes) {
    gear.userDB.set(Author.id, {
      $inc:{
        'modules.dyStreakHard':1
      }
    });
  }else{
    gear.userDB.set(Author.id, {
      $set:{
        'modules.dyStreakHard':1
      }
    });
    hardStreak = 1
  }

  const Canvas = require("canvas");
  const canvas = new Canvas.createCanvas(250, 250);
  const ctx = canvas.getContext('2d');

  gear.userDB.set(Author.id, {$set:{'modules.daily':now}}).then(async userData=>{
    Author.dailing = false;

    await Promise.all([
      gear.audit(Author.id,myDaily,"daily","RBN","+"),
      gear.userDB.set(Author.id, {$inc:{'modules.rubines':myDaily}})
    ]);
    let dailyGet = mm('$.dailyGet',P).replace("100", "**" + myDaily + "**")
    embed.setDescription("\n" + gear.emoji('rubine') + dailyGet);


    let gemstone = await gear.getCanvas(paths.BUILD +"daily/rubin.png");

    if ((hardStreak%10) == 0) {
      gemstone = await gear.getCanvas(paths.BUILD +"daily/manyrub.png");
      let dailyStreak = mm('$.dailyStreak', P).replace("500", "**500**")
      embed.description += "\n" + (gear.emoji('ticket') + dailyStreak)

      await Promise.all([
        gear.userDB.set(Author.id, {$inc:{'modules.rubines':500,'modules.exp':100}}),
        gear.audit(Author.id,500,"daily_10streak","RBN","+")
      ]);
    }

    if ((hardStreak%3) == 0) {
      gemstone = await gear.getCanvas(paths.BUILD +"daily/jadine.png");
      let dailyStreak = mm('$.dailyStreakJades', P)
      embed.description += "\n" + (gear.emoji('jade') + dailyStreak)

      await Promise.all([
        gear.userDB.set(Author.id, {$inc:{'modules.jades':1000,'modules.exp':50}}),
        gear.audit(Author.id,1000,"daily_3streak","JDE","+")
      ]);
    }

    if ((hardStreak%200) == 0) {
      gemstone = await gear.getCanvas(paths.BUILD +"daily/ringsaph.png");
      let dailyStreak = mm('$.dailyStreakSapphs', P)
      embed.description += "\n" + (gear.emoji('sapphire') + dailyStreak)

      await Promise.all([
        gear.userDB.set(Author.id, {$inc:{'modules.sapphires':1,'modules.exp':5000}}),
        gear.audit(Author.id,1,"daily_250streak","SPH","+")
      ]);
    }

    if ((hardStreak%365) == 0) {
      gemstone = await gear.getCanvas(paths.BUILD +"daily/ringsaph.png");
      let dailyStreak = mm('$.dailyStreakSapphs', P)
      embed.description += "\n" + (gear.emoji('sapphire') + dailyStreak)

      await Promise.all([
        gear.userDB.set(Author.id, {$inc:{'modules.sapphires':1,'modules.exp':25000}}),
        gear.audit(Author.id,1,"daily_365streak","SPH","+")
      ]);
    }

    embed.description += "\n\n" + "*Streak: **"+hardStreak+"***."
    let ringof = await gear.getCanvas(paths.BUILD +"daily/"+ (hardStreak%10) + ".png");

    ctx.drawImage(ringof,0,0,250,250);
    ctx.drawImage(gemstone,0,0,250,250);
    embed.attachFile({
      attachment: await canvas.toBuffer(),
      name: "dly.png"
    });
    embed.setThumbnail("attachment://dly.png");

    if (userData.spdaily && userData.spdaily.amt){
      embed.addField(Author.dDATA.spdaily.title,"+"+Author.dDATA.spdaily.amt+gear.emoji('rubine'));
      await Promise.all([
        gear.userDB.set(Author.id, {$inc:{'modules.rubines':Author.dDATA.spdaily.amt}}),
        gear.audit(message.author.id,Author.dDATA.spdaily.amt,"special_daily_boost","RBN","+")
      ]);
    }

    embed.setFooter(Author.tag,Author.avatarURL||Author.defaultAvatarURL);
    message.channel.send({embed}).catch(e=>'die silently');

  });

}

module.exports = {
  pub: true,
  cmd: cmd,
  perms: 3,
  botperms: ["EMBED_LINKS","SEND_MESSAGES","ATTACH_FILES"],
  init: init,
  cat: 'rubines',
  exp: 15,
  cool: 10
};
