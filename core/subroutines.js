const gear = require('./gearbox.js');
const fs = require('fs'),
    request = require('request');

const download = async function(uri, filename, callback){
  request.head(uri, async function(err, res, body){
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);

    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};


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
    //return;
    console.log("DELEVEL");
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


        try{

    if(servData.modules.AUTOROLES){

      if(message.guild.id=="363476237118734349")message.reply("Local Level Up! >> "+curLevel_local);

      console.log('autoroles yes!------------------------------------------------')
      let AUTOS = servData.modules.AUTOROLES
      let sorting = function(a,b){return b[1]-a[1]}
      AUTOS.sort(sorting)

      let levels = AUTOS.map(r=>r[1]);
      let addinrole;
      let addinrole_lv = 0;



      for (i=0;i<levels.length;i++){
           if(message.member.roles.has( AUTOS[i][0])){
           //message.reply('czechs interrupted at '+AUTOS[i][1])
            break;
           }
         if(  levels[i] <= curLevel_local&& levels[i] > addinrole_lv ){
          console.log('autoroles picked!------------------------------------------------')
          // message.reply('round '+i+' checking level:'+levels[i])
           addinrole = AUTOS[i][0];
           addinrole_lv = AUTOS[i][1];
         }
      }
        if(addinrole && !message.member.roles.has(addinrole)){
        if(message.guild.id=="363476237118734349")message.channel.send("New Rank! >> "+message.guild.roles.get(addinrole).name);
          console.log('autoroles given!------------------------------------------------')
          message.member.addRole(addinrole);
        }
      }
        }catch(e){
          console.log(e)
                 }


        if (servData.modules.LVUP) {
           console.log("Local LEVEL UP :: ".bgBlue + message.author.tag);
          console.log("LEVEL IMAGE-------------------------------------")
          delete require.cache[require.resolve("./modules/dev/levelUp_infra.js")]
         // require("./modules/dev/levelUp_infra.js").init(message,curLevel_local+" (SERVER)");
        };
  };

  await gear.userDB.set(message.author.id,{$inc:{'modules.exp':2}});
  //console.log({forNext,XP:userData.modules.exp,LV: userData.modules.level})
  if (curLevel < userData.modules.level) {
    return;
    //console.log("DELEVEL");
    //await gear.userDB.set(message.author.id,{$set:{'modules.level':curLevel}});
  }
  if (curLevel > userData.modules.level) {
    await gear.userDB.set(message.author.id,{$set:{'modules.level':curLevel}});
    let overallevel = (await gear.userDB.findOne({id: message.author.id})).modules.level;

    console.log("LEVEL UP EVENT FOR ".bgBlue + message.author.tag);


    if (message.guild.id === "110373943822540800") return;
    let polizei
    if(curLevel%25==0){
      polizei = "UR"
      await gear.userDB.set(message.author.id,{$push:{'modules.inventory':'lootbox_UR_O'}});
    }
    else if(curLevel%15==0){
      polizei = "SR"
      await gear.userDB.set(message.author.id,{$push:{'modules.inventory':'lootbox_SR_O'}});
    }
    else if(curLevel%10==0){
      polizei = "R"
      await gear.userDB.set(message.author.id,{$push:{'modules.inventory':'lootbox_R_O'}});
    }
    else if(curLevel%5==0){
      polizei = "U"
      await gear.userDB.set(message.author.id,{$push:{'modules.inventory':'lootbox_U_O'}});
    }
    else {
      polizei = "C"
      await gear.userDB.set(message.author.id,{$push:{'modules.inventory':'lootbox_C_O'}});
    }


    if (!servData.modules.LVUP) return;
    console.log("LEVEL IMAGE-------------------------------------|ok")
    delete require.cache[require.resolve("./modules/dev/levelUp_infra.js")]
    message.author.send("**+1** x "+gear.emoji('loot')+gear.emoji(polizei)+' Level Up Bonus!');
    require("./modules/dev/levelUp_infra.js").init(message);
  }
}

//-----------------------------------------------------------------------------------------------------------------------------

async function runAll(message, servData, userData, chanData) {


  if(chanData.slowmode){
    let cooldown = chanData.slowmodeTimer || 3000;
    if(message.author.id==message.guild.owner){
      cooldown=0
    }
    let now = Date.now();
    if (message.author.slowcd_timer && (now - message.author.slowcd_timer)<cooldown){
    message.reply(":hourglass_flowing_sand: **Slow Mode**: `"+Math.abs((message.author.slowcd_timer+cooldown)-now )+"ms`").then(m=>m.delete(Math.abs((message.author.slowcd_timer+cooldown)-now )))
    return  message.delete();
    }
      message.author.slowcd_timer = now
  }



  gear.globalDB.get().then(GLB=>{
    let tapped = GLB.tap;
    let taplisten = GLB.taplisten;
    if (!tapped) return;
    if(tapped&&(message.channel.id==tapped||message.guild.id==tapped||message.author.id==tapped)){
      let X = `:vhs: \`${message.guild.id}\`**${message.guild.name}** :: \`${message.channel.id}\`#${message.channel.name} :: **__${message.author.tag}__** \`\`\`${message.content}\`\`\``;
      message.botUser.shard.broadcastEval('if(this.channels.get("'+taplisten+'")){this.channels.get("'+taplisten+'").send("'+X+' `SHARD: '+(message.botUser.shard.id+1)+'` | **Attachments:**"+"'+((message.attachments.first()||{url:' `no attachments`'}).url)+'")}').then(ok=>ok);
    }
  })


  //console.log('ok')

  if(message.attachments){
     delete require.cache[require.resolve("./modules/dev/loliradar.js")]
    require("./modules/dev/loliradar.js").init(message);
  };
  if (message.channel.id == '364811796776878091') {
    //let nwurl = await gear.getImg(message,true);
    //let ts= "lewd-"+Date.now();
    //await download(nwurl,'/root/v7/resources/imgres/lewd/'+message.author.id+"-"+ts+'.png');

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

  };



  try{
  let A=message.author
  let S=message.guild
  let B=message.mentions.users.first()
  gear.userDB.set(A.id,{
    $set:{
      'meta':{
        tag: A.tag,
        username: A.username,
        discriminator: A.discriminator,
        avatar: A.avatarURL||A.defaultAvatarURL,
      }
    }
  });
  if(B){
    gear.userDB.set(B.id,{
      $set:{
        'meta':{
          tag: B.tag,
          username: B.username,
          discriminator: B.discriminator,
          avatar: B.avatarURL||B.defaultAvatarURL,
        }
      }
    })
  };
  if(S){
    //console.log(S.members.filter(async mb=>mb.roles.has((await gear.serverDB.find({id:S.id})).modules.MODROLE)).map(mb=>[mb.id])



    gear.serverDB.findOne({id:S.id}).then(data=>{
      let admins =S.members.filter(mb=>mb.id===S.owner.id||mb.roles.has(data.modules.MODROLE)===true).map(mb=>mb.id);
      //console.log(admins)
  gear.serverDB.set(S.id,{
      $set:{
        'meta':{
          name: S.name,
          roles: S.roles.map(rl=>{return{name:rl.name,color:rl.hexColor,id:rl.id}}),
          adms: admins,
          channels: S.channels.map((rl,index)=>{return{name:rl.name,pos:rl.position,id:rl.id,cat:(rl.parent||{name:"---"+index+"---"}).name,type:rl.type,nsfw:rl.nsfw,topic:rl.topic}}),
          icon: S.iconURL
        }
      }
    });
    })
  }
  }catch(e){


    }

  }


module.exports = {
  levelChecks
  ,runAll
}






