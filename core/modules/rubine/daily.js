const gear = require("../../gearbox.js");
const minibuster = require("../../minibuster.js");
const paths = require("../../paths.json");
const moment = require("moment");
const rq = require('request');
//const locale = require('../../../utils/multilang_b');
//const mm = locale.getT();

const cmd = 'daily';

const init = async function (message) {


  const P={lngs:message.lang}
 
  let lang = message.lang[0]
  if(lang=='cz')lang='cs';
  moment.locale(lang);

  const v={
      last: mm('interface.daily.lastdly',P),
      next: mm('interface.daily.next',P),
      streakcurr: mm('interface.daily.streakcurr',P),
      expirestr: mm('interface.daily.expirestr',P),
  }
  const Author = message.author

  if(Author.dailing === true) return;
 

  const STREAK_EXPIRE = 1.296e+8*7
  const DAY = 7.2e+7 
  const USERDATA = await gear.userDB.findOne({id:  message.author.id}).lean().exec();
  const now        = Date.now();
  const userDaily  = USERDATA.modules.daily || 1;
  const userachinv  = USERDATA.modules.achievements || [];
  let   hardStreak = USERDATA.modules.dyStreakHard+1 || 1;
  let   softStreak = (hardStreak % 10 || 0) + 1;

  const dailyAvailable = now-userDaily >= DAY;
  const streakGoes = now-userDaily <= STREAK_EXPIRE;


  const dly_calc = await gear.calculateDaily({dDATA:USERDATA},message.botUser);

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

  if(!dailyAvailable&& Author.id!="88120564400553984"){

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

  gear.userDB.set(Author.id, {$set:{'modules.daily':now}});
  gear.userDB.findOne({id:Author.id}).lean().exec().then(async userData=>{
    Author.dailing = false;
      minibuster.up(message,hardStreak+softStreak*10)

    await Promise.all([
      gear.audit(Author.id,myDaily,"daily","RBN","+"),
      gear.userDB.set(Author.id, {$inc:{'modules.rubines':myDaily,'modules.exp':hardStreak}})
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
      let dailyStreak = mm('interface.daily.dailyStreakJades', P)
      embed.description += "\n" + (gear.emoji('jade') + dailyStreak)

      await Promise.all([
        gear.userDB.set(Author.id, {$inc:{'modules.jades':1000,'modules.exp':50}}),
        gear.audit(Author.id,1000,"daily_3streak","JDE","+")
      ]);
    }

    if ((hardStreak%200) == 0) {
      gemstone = await gear.getCanvas(paths.BUILD +"daily/ringsaph.png");
      let dailyStreak = mm('interface.daily.dailyStreakSapphs', P)
      embed.description += "\n" + (gear.emoji('sapphire') + dailyStreak)

      await Promise.all([
        gear.userDB.set(Author.id, {$inc:{'modules.sapphires':1,'modules.exp':5000}}),
        gear.audit(Author.id,1,"daily_250streak","SPH","+")
      ]);
    }

    if ((hardStreak%365) == 0) {
      gemstone = await gear.getCanvas(paths.BUILD +"daily/ringsaph.png");
      let dailyStreak = mm('interface.daily.dailyStreakSapphs', P)
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
    embed.attachFiles({
      attachment: await canvas.toBuffer(),
      name: "dly.png"
    });
    embed.setThumbnail("attachment://dly.png");

    const snekfetch = require('snekfetch')
    const token = gear.cfg.liscordtoken;

    
     
    
    if(userData.modules.stickerInventory.includes("rocketlux")){
      await gear.userDB.set(Author.id,{$inc:{"switches.boost":1}});
      let xx = (userData.switches||{}).boost || 1
      xx = xx > 30 ? 30 : xx;
      embed.addField("Pollux Boosting Bonus",(Number(xx)*10 )+gear.emoji('rubine')+"Rubines")
      await Promise.all([
        gear.userDB.set(Author.id, {$inc:{'modules.rubines':xx*10}}),
        gear.audit(message.author.id,xx,"boost_daily_boost","RBN","+")
      ]);
      if(hardStreak % 30 === 0) {
        embed.addField("Pollux Falcon Heavy Bonus",(1)+gear.emoji('sapphire')+"Sapphire")
        gear.userDB.set(Author.id, {$inc:{'modules.sapphires':1}}),
        gear.audit(message.author.id,xx,"boost_month_boost","SPH","+")
      }
    }

     
    
    
    
    if(hardStreak>=10 && !userachinv.includes('10daily')){
      
      await gear.userDB.set(Author.id,{$addToSet:{'modules.achievements':"10daily",'modules.medalInventory':'10daily'}});
      message.reply("**New Achievement!** Clockwork Collector | Collected 10 Dailies")
    }
      if(hardStreak>=30 && !userachinv.includes('30daily')){
      
        await gear.userDB.set(Author.id,{$addToSet:{'modules.achievements':"30daily",'modules.medalInventory':'30daily'}});
        message.reply("**New Achievement!** Collector of the Month | Collected 30 Dailies")
    }
      if(hardStreak>=100 && !userachinv.includes('100daily')){
      
        await gear.userDB.set(Author.id,{$addToSet:{'modules.achievements':"100daily",'modules.medalInventory':'100daily'}});
        message.reply("**New Achievement!** Compulsive Collector | Collected 100 Dailies")
    }
      if(hardStreak>=200 && !userachinv.includes('200daily')){
      
        await gear.userDB.set(Author.id,{$addToSet:{'modules.achievements':"200daily",'modules.medalInventory':'200daily'}});
        message.reply("**New Achievement!** Blood for a silver Sapphire | Collected 200 Dailies")
    }
      if(hardStreak>=365 && !userachinv.includes('365daily')){
      
        await gear.userDB.set(Author.id,{$addToSet:{'modules.achievements':"365daily",'modules.medalInventory':'365daily'}});
        message.reply("**New Achievement!** '+daily with me, +daily for the year' | Collected 365 Dailies")
    }
    
    
    if (userData.spdaily && userData.spdaily.amt){
      embed.addField(USERDATA.spdaily.title,"+"+USERDATA.spdaily.amt+gear.emoji('rubine'));
      await Promise.all([
        gear.userDB.set(Author.id, {$inc:{'modules.rubines':USERDATA.spdaily.amt}}),
        gear.audit(message.author.id,USERDATA.spdaily.amt,"special_daily_boost","RBN","+")
      ]);
    }

    embed.setFooter(Author.tag,Author.displayAvatarURL({format:'png'}));
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
