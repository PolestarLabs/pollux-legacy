const gear = require('../core/gearbox.js');

async function levelChecks(message,servData,userData) {

  const _CURVE = 0.0427899
  let curLevel = Math.floor(_CURVE * Math.sqrt(userData.modules.exp));
  let forNext = Math.trunc(Math.pow((userData.modules.level + 1) / _CURVE, 2));

  const thisGdata = servData.modules.LOCALRANK[message.author.id];
  const _FACTOR = 0.0872899 || servData.modules.UPFACTOR;

  let curLevel_local = Math.floor(_FACTOR * Math.sqrt(thisGdata.exp));
  let forNext_local = Math.trunc(Math.pow((thisGdata.level + 1) / _FACTOR, 2));

  if (curLevel_local > thisGdata.level) {
    await gear.serverDB.findOneAndUpdate({id: message.guild.id},{
      $set: {
        ['modules.LOCALRANK.' + message.author.id]: {
          exp: thisGdata.exp,
          level: curLevel_local
        }
      }
    });
  };
  await gear.userDB.set(message.author.id,{$inc:{'modules.exp':5}});
  console.log({forNext,XP:userData.modules.exp,LV: userData.modules.level})
  if (curLevel > userData.modules.level) {
    await gear.userDB.set(message.author.id,{$set:{'modules.level':curLevel}});
    let overallevel = (await gear.userDB.findOne({id: message.author.id})).modules.level;

    console.log("LEVEL UP EVENT FOR ".bgBlue + message.author.tag);

    if (message.guild.id === "110373943822540800") return;

    if (!servData.modules.LVUP) return;
    console.log("LEVEL IMAGE-------------------------------------")
    require("./modules/dev/levelUp_infra.js").init(message);
  }
}

module.exports = {
  levelChecks
}
