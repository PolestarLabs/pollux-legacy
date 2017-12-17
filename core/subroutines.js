const gear = require('./gearbox.js');


async function levelChecks(message,servData,userData) {

  const _CURVE = 0.0427899
  let curLevel = Math.floor(_CURVE * Math.sqrt(userData.modules.exp));
  let forNext = Math.trunc(Math.pow((userData.modules.level + 1) / _CURVE, 2));
  servData.modules.LOCALRANK=servData.modules.LOCALRANK?servData.modules.LOCALRANK:{};
  let thisGdata = servData.modules.LOCALRANK[message.author.id]||{exp:0,level:0};
  const _FACTOR =  servData.modules.UPFACTOR||0.5;

  let curLevel_local = Math.floor(_FACTOR * Math.sqrt(thisGdata.exp));
  let forNext_local = Math.trunc(Math.pow((thisGdata.level + 1) / _FACTOR, 2));

  if (curLevel_local < thisGdata.level) {
    console.log("DELEVEL");
    return
    thisGdata.level = curLevel_local;
    await gear.serverDB.findOneAndUpdate({
      id: message.guild.id
    }, {
      $set: {
        ['modules.LOCALRANK.' + message.author.id]: thisGdata
      }
    });
  }
  if (curLevel_local > thisGdata.level) {
    thisGdata.level=curLevel_local;
    await gear.serverDB.findOneAndUpdate({id: message.guild.id},{
      $set: {['modules.LOCALRANK.' + message.author.id]: thisGdata
      }
    });
        if (servData.modules.LVUP) {

          console.log("LEVEL IMAGE-------------------------------------")
          delete require.cache[require.resolve("./modules/dev/levelUp_infra.js")]
         // require("./modules/dev/levelUp_infra.js").init(message,curLevel_local+" (SERVER)");
        };
  };

  await gear.userDB.set(message.author.id,{$inc:{'modules.exp':1}});
  //console.log({forNext,XP:userData.modules.exp,LV: userData.modules.level})
  if (curLevel < userData.modules.level) {
    console.log("DELEVEL");
    await gear.userDB.set(message.author.id,{$set:{'modules.level':curLevel}});
  }
  if (curLevel > userData.modules.level) {
    await gear.userDB.set(message.author.id,{$set:{'modules.level':curLevel}});
    let overallevel = (await gear.userDB.findOne({id: message.author.id})).modules.level;

    console.log("LEVEL UP EVENT FOR ".bgBlue + message.author.tag);

    if (message.guild.id === "110373943822540800") return;

    if (!servData.modules.LVUP) return;
    console.log("LEVEL IMAGE-------------------------------------")
    delete require.cache[require.resolve("./modules/dev/levelUp_infra.js")]
    require("./modules/dev/levelUp_infra.js").init(message);
  }
}

//-----------------------------------------------------------------------------------------------------------------------------

async function runAll(message, servData, userData, chanData) {
  //console.log('ok')

  if(message.attachments){

     delete require.cache[require.resolve("./modules/dev/loliradar.js")]
    require("./modules/dev/loliradar.js").init(message);
  }

  if (message.channel.id == '364057602013003787') {
    return;
    if(message.content.length < 80 && !message.attachments.first() )return;
    gear.serverDB.distinct('modules.shitpostFeed', function (err, result) {
      if (err) return;
      if(!result||result.length<1)return;
      let fi = message.attachments.first()?message.attachments.first().url:""
      result.forEach(chan=>{
        let embed = new gear.RichEmbed
        embed.title="Shitpost Delivery"
        embed.setAuthor(message.author.tag,message.author.avatarURL||message.author.defaultAvatarURL)
        embed.setImage(fi)
        embed.setDescription(message.content)
        message.botUser.channels.get(chan).send({embed})

      })

    })

  }
}

module.exports = {
  levelChecks
  ,runAll
}
