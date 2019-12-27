const gear = require('./gearbox.js');
const fs = require('fs'),
    request = require('request');

const download = async function(uri, filename, callback){
  request.head(uri, async function(err, res, body){

    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};


async function levelChecks(message,servData,userData) {

  servData = await servData;
  userData = await userData;
  if (!servData) return;
  
  if(message.author.id=="200044537270370313" && gear.randomize(1,100)==69){
    message.react("🅿");
    await gear.wait(.8)
    message.react("🇪");
    await gear.wait(.8)
    message.react("🇷");
    await gear.wait(.7)
    message.react("🇩");
    await gear.wait(.7)
    message.react("🇮");
  }

  
  if(message.channel.id=="277392033000325120" || message.channel.id=="420106467853729792"|| message.channel.id=="477049507344023552"){
  let HELPSMODS = [
    "88120564400553984"
    ,"200044537270370313",
    "163200584189476865"
    
  ]
  

  if(message.content.toLowerCase().includes("blacklist")||message.content.toLowerCase().includes("black list")||message.content.toLowerCase().includes("lista negra")){

      if(HELPSMODS.includes(message.author.id)||message.member.roles.size >3) return;
        
       let blreas = (await gear.userDB.findOne({id:message.author.id},{blacklisted:1}).lean().exec()).blacklisted;

        let mtx;
        if(blreas && blreas!="false"&&blreas!="") mtx = "I can see you're blacklisted for `"+blreas+"`. You've done some bad things and I've penalised you for that!\nWait for a moderator so they can check your case.";
        else mtx = "Blacklist means you or your friends have done some bad things and I've penalised you for that!\nWait for a moderator so they can check your case.";
        message.reply(mtx + "Please read the <#450920072949530634> regarding blacklisting. ")
      }
    }
    
    
    let userId = message.author.id
    let servDataRank = gear.localranks.findOne({server:message.guild.id,user:userId});
    servData = await gear.serverDB.findOne({id:message.guild.id},{"modules.LOCALRANK":0}).lean().exec();
    userData = !userData.modules ? await gear.userDB.findOne({id:message.author.id}).lean().exec() : userData;
    if(!servData)return;
    if(!userData)return;


  const _CURVE = 0.0427899
  let curLevel = Math.floor(_CURVE * Math.sqrt(userData.modules.exp));
  let forNext = Math.trunc(Math.pow((userData.modules.level + 1) / _CURVE, 2));
  //servData.modules.LOCALRANKx=servData.modules.LOCALRANKx?servData.modules.LOCALRANKx:{};
  let thisGdata = await servDataRank||{exp:0,level:0};
  //servDataRank = null;
  const _FACTOR =  servData.modules.UPFACTOR||0.5;  

  
  

  gear.localranks.findOne({user:message.author.id,server:message.guild.id}).lean().then(async data=>{

    if(!message) return;
    
    if(!data) await gear.localranks.new({U:message.author,S:message.guild});
    await gear.localranks.set({user:message.author.id,server:message.guild.id},{$inc:{'exp':1}});
  })
  
  let curLevel_local = Math.floor(_FACTOR * Math.sqrt(thisGdata.exp));
  let forNext_local = Math.trunc(Math.pow(((thisGdata.level||0) + 1) / _FACTOR, 2));

  if (curLevel_local < thisGdata.level || !thisGdata.level) {
    

     
    
 
  }
  if (curLevel_local > thisGdata.level) {
    if (!thisGdata.level) {
      await gear.localranks.set({
        server: message.guild.id,
        user: message.author.id 
      }, {
        $set: {
          level: 0
        }
      });
    };
   await gear.localranks.set({
        server: message.guild.id,
        user: message.author.id 
      }, {
        $inc: {
          level: 1
        }
      });
    

        try{

    if(servData.modules.AUTOROLES){

      if(message.author.id=="88120564400553984")message.reply("Local Level Up! >> "+curLevel_local);

      
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
          
          // message.reply('round '+i+' checking level:'+levels[i])
           addinrole = AUTOS[i][0];
           addinrole_lv = AUTOS[i][1];
         }
      }
        if(addinrole && !message.member.roles.has(addinrole)){
          
          //message.channel.send("New Rank! >> "+message.guild.roles.get(addinrole).name);
          
          
          message.member.roles.add(addinrole).catch(e=>'noperms');
        }
      }
        }catch(e){
          //console.error(e)
                 }


        if (servData.modules.LVUP===true) {
        if (servData.modules.LVUP_local===false) return;
          
          
          // delete require.cache[require.resolve("./modules/dev/levelUp_infra.js")]
          //require("./modules/dev/levelUp_infra.js").init(message,curLevel_local+" (SERVER)");
          //require("./modules/dev/levelUp_infra_local.js").init(message,curLevel_local+" (SERVER)");
        };
  };

  //gear.userDB.set(message.author.id,{$inc:{'modules.exp':1}});
  
  if (curLevel < userData.modules.level) {
    return null;
    
   // await gear.userDB.set(message.author.id,{$set:{'modules.level':curLevel}});
  }
  if (curLevel > userData.modules.level) {
    await gear.userDB.set(message.author.id,{$set:{'modules.level':curLevel}});
    let overallevel = (await gear.userDB.findOne({id: message.author.id},{"modules.level":1}).lean().exec()).modules.level;

    //console.log("GLOBAL LEVEL UP EVENT FOR ".bgBlue + message.author.id);


    if (message.guild.id === "110373943822540800") return;
    let polizei;
    if(curLevel%25==0){
      polizei = "UR"
      gear.userDB.set(message.author.id,{$push:{'modules.inventory':'lootbox_UR_O'}}).then(null);
    }
    else if(curLevel%15==0){
      polizei = "SR"
      gear.userDB.set(message.author.id,{$push:{'modules.inventory':'lootbox_SR_O'}}).then(null);
    }
    else if(curLevel%10==0){
      polizei = "R"
      gear.userDB.set(message.author.id,{$push:{'modules.inventory':'lootbox_R_O'}}).then(null);
    }
    else if(curLevel%5==0){
      polizei = "U"
      gear.userDB.set(message.author.id,{$push:{'modules.inventory':'lootbox_U_O'}}).then(null);
    }
    else {
      polizei = "C"
      gear.userDB.set(message.author.id,{$push:{'modules.inventory':'lootbox_C_O'}}).then(null);
    }


    if (servData.modules.LVUP!==true) return servData=null;
    
 

    //delete require.cache[require.resolve("./modules/dev/levelUp_infra.js")]
    message.author.send("**+1** x "+gear.emoji('loot')+gear.emoji(polizei)+' Level Up Bonus!').catch(null);
    require("./modules/dev/levelUp_infra.js").init(message).catch(null);
    message=null
  }
}

//-----------------------------------------------------------------------------------------------------------------------------

async function runOnCMD(message) {
  
  


  let A=message.author
  let S=message.guild
  let B=message.mentions.users.first();
  gear.userDB.set(A.id,{
    $set:{
      'meta':{
        tag: A.tag,
        username: A.username,
        discriminator: A.discriminator,
        avatar: A.displayAvatarURL({format:'png',size:256}),
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
          avatar: B.displayAvatarURL({format:'png',size:256}),
        }
      }
    })
  };
  if(S){
    

  gear.serverDB.findOne({id:S.id}).lean().exec().then(data=>{
    let admins =S.members.filter(mb=>mb.id===S.ownerID||mb.roles.has(data.modules.MODROLE)===true).map(mb=>mb.id);
    console.log(admins+" "+S.name.blue);
  gear.serverDB.set(S.id,{
      $set:{
        'meta':{
          name: S.name,
          roles: S.roles.map(rl=>{return{name:rl.name,color:rl.hexColor,id:rl.id}}),
          adms: admins,
          channels: S.channels.map((rl,index)=>{return{name:rl.name,pos:rl.position,id:rl.id,cat:(rl.parent||{name:"---"+index+"---"}).name,type:rl.type,nsfw:rl.nsfw,topic:rl.topic}}),
          icon: S.iconURL({format:'png',size:256})
        }
      }
    });
    })
  
};
};


async function runAll(message, servData, userData, chanData) {

  

 
 //  meter.mark();
  
/*
var DEADLIST = []


if(DEADLIST.includes(message.guild.id)){

  await gear.userDB.set(message.author.id,{$set:{blacklisted:`Blacklisted under Redlisted Server - ${message.guild.name}`}});
 return message.content = "";

}
*/

  
  //delete require.cache[require.resolve('./minibuster.js')]
  require('./minibuster.js').run(message,servData,userData,chanData);
  runOnCMD(message, servData, userData, chanData);

  

    if(!userData.blacklisted || userData.blacklisted=='false'|| userData.blacklisted==''){
      try{

        if(chanData.modules.DROPS!==false){
          if(servData.modules.DROPS!==false){
            require('./archetypes/drops.js').lootbox(message);
          }
        }      
      }catch(e){}
      
    }
/*
  gear.globalDB.get().then(GLB=>{
    let tapped = GLB.tap;
    let taplisten = GLB.taplisten;
    if (tapped){            if((message.channel.id==tapped||message.guild.id==tapped||message.author.id==tapped)){
        let X = `:vhs: \`${message.guild.id}\`**${message.guild.name}** :: \`${message.channel.id}\`#${message.channel.name} :: **__${message.author.tag}__**\`${message.author.id}\` \`\`\`${message.content}\`\`\``;
        message.botUser.shard.broadcastEval('if(this.channels.get("'+taplisten+'")){this.channels.get("'+taplisten+'").send("'+X+' `SHARD: '+(message.botUser.shard.id+1)+'` | **Attachments:**"+"'+((message.attachments.first()||{url:' `no attachments`'}).url)+'")}').then(ok=>ok);
      }
    }
  });
*/
  
  chanData = null;
  return;

  

  if(message.attachments){
   //  delete require.cache[require.resolve("./modules/dev/loliradar.js")]
    // require("./modules/dev/loliradar.js").init(message);
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
        embed.setAuthor(message.author.tag,message.author.displayAvatarURL({format:'png'}))
        embed.setImage(fi)
        embed.setDescription(message.content)
        message.botUser.channels.get(chan).send({embed})

      })

    })

  };

  }



module.exports = {
  levelChecks
  ,runAll,
  runOnCMD
}






