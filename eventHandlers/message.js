const gear      = require('../core/gearbox.js'),
      serverDB  = gear.serverDB,
      channelDB = gear.channelDB,
      userDB    = gear.userDB,
      async     = require('async');

let GREYLIST=[],BLACKLIST=["219406074242007040"],WHITELIST=[]



function dataChecks(type,ent){
  return new Promise(async resolve =>{
    if(type==="user"){
      userDB.findOne({id:ent.id}).then(user=>{
        if(!user) return resolve(userDB.new(ent));
        return resolve(user);
      });
    };
    if(type==="server"){
      serverDB.findOne({id:ent.id}).then(server=>{
        if(!server) return resolve(serverDB.new(ent));
        return resolve(server);
      });
    };
    if(type==="channel"){
      channelDB.findOne({id:ent.id}).then(channel=>{
        if(!channel) return resolve(channelDB.new(ent));
        return resolve(channel);
      });
    };
  });
};

async function levelUps(message,servData,chanData,USER,userData){
    let levelup;
    if(!chanData.modules.LVUP){
      levelup = (await channelDB.set(message.channel.id,{$set:{'modules.LVUP':true}})).modules.LVUP;
    }else{
      levelup = chanData.modules.LVUP;
    };
    if (levelup){
        let xp=userData.modules.exp;
        if(message.content.toLowerCase().includes('pick')) xp-=10;
        if(message.content.toLowerCase().includes('+lv')) xp-=10;
        await userDB.findOneAndUpdate({id:message.author.id},{$set:{'modules.exp':xp}});
        delete require.cache[require.resolve('../core/subroutines.js')];
        require('../core/subroutines.js').levelChecks(message,servData,userData);
    };
};

async function localExpIncrement(message,servData,chanData,USER,userData){




    let channel_exp;
    if(!chanData.modules.EXP){
      channel_exp = (await channelDB.set(message.channel.id,{$set:{'modules.EXP':true}})).modules.EXP;
    }else{
      channel_exp = chanData.modules.EXP;
    };
    if (channel_exp){
        let lRanks= {};
        if(!servData.modules.LOCALRANK){
          lRanks = (await serverDB.findOneAndUpdate({id:message.guild.id},{$set:{'modules.LOCALRANK':{}}})).modules.LOCALRANK||{};
        }else{
          lRanks = servData.modules.LOCALRANK;
        };

        let userRankLocal;
        if(!lRanks[USER.id]){
          userRankLocal = {level:0,exp:0};
        }else{
          userRankLocal = lRanks[USER.id];
        }
        userRankLocal.exp+=1;
        await serverDB.findOneAndUpdate({id:message.guild.id},{$set:{['modules.LOCALRANK.'+USER.id]:userRankLocal}});
    };
};
async function randomDrops(CHANNEL,chanData){

    let random_drops;
    if(!chanData.modules.EXP){
      random_drops = (await channelDB.findOneAndUpdate({id:CHANNEL.id},{$set:{'modules.DROPS':true}})).modules.DROPS;
    }else{
      random_drops = chanData.modules.DROPS;
    };
    if (random_drops){

      //processDrops();

    };
};
async function spamBuster(bot,message,servData){
  delete require.cache[require.resolve('../core/supermodules/nightwatch.js')];
  const Nightwatch = require ('../core/supermodules/nightwatch.js');
    let spam_buster;
    let global_buster;

    if(servData.modules.BUSTER){
      spam_buster = servData.modules.BUSTER;
    }else{
      return;
    };

      if(spam_buster.switches.flood===true) Nightwatch.floodBuster(message,bot,servData);
      if(spam_buster.switches.links===true) Nightwatch.linksBuster(message,bot,servData);
      if(spam_buster.switches.invites===true) Nightwatch.invitesBuster(message,bot,servData);
      if(spam_buster.switches.words===true) Nightwatch.wordsBuster(message,bot,servData);
      if(spam_buster.switches.mentionSpam===true) Nightwatch.mentionBuster(message,bot,servData);
  };

function serverLanguageSets(message, servData){
     if (servData.modules.LANGUAGE) {
       let langua = servData.modules.LANGUAGE;
      // if (message.guild.region === 'brazil') langua = "pt-BR";
       message.lang = [langua, 'dev'];
     } else {
       let langua = "en"
      // if (SERVER.region === 'brazil') langua = "pt-BR";
       message.lang = [langua, 'dev'];
       gear.serverDB.set(message.guild.id, {$set: {'modules.LANGUAGE': langua}});
     };
   };

exports.run = async function(bot, message){


  let nip = ':nipok:393448418103525376'
  let nip2 = ':nipok2:364505823281414145'
  let baget = ':contrabaguette:361447462314967040'
  if(message.author.id=="323058223559213067")message.react(nip);
  if(message.author.id=="323058223559213067")message.react(nip2);
  //if(message.author.id=="338886458733625344"&&message.guild.id=="277391723322408960")message.react(baget);

  /*
  if(message.channel.type=='dm'&&message.author.id!="271394014358405121"){

    bot.users.get('88120564400553984').send("**"+message.author.tag+"**: "+message.content).then(async m=>{
      resp = await m.channel.awaitMessages(x=>x.author.id=="88120564400553984",{max:1,time:25000})
      if(resp.first()){
        message.reply(resp.first().content)
      }
    })

  }
  */



  const USER   = message.author,
        SERVER = message.guild,
        CHANNEL= message.channel,
        TARGET = message.mentions.users.first() ||USER;
try{

  if (GREYLIST.includes(SERVER.id) || GREYLIST.includes(USER.id))return;

}catch(e){
    //console.log(e)
  return;
}
  if (USER.bot) return;

  let userData = await dataChecks( 'user',   USER    ),
      servData = await dataChecks( 'server', SERVER  ),
      chanData = await dataChecks( 'channel',CHANNEL ),
      targData = await dataChecks( 'user',   TARGET  );




  if (SERVER){
    message.botUser = bot
    //CHECK SERVER LANG
    await serverLanguageSets(message,servData);

    //CHECK CHANNEL LANG
    if(chanData.LANGUAGE){
      message.lang = [chanData.LANGUAGE || servData.LANGUAGE, 'dev'];
    };

     spamBuster(bot,message,servData);
    if(!userData.blacklisted || userData.blacklisted=='false'){
      await localExpIncrement(message,servData,chanData,USER,userData),
      await randomDrops(CHANNEL,chanData),
      await levelUps(message,servData,chanData,USER,userData);
      require('../core/archetypes/drops.js').lootbox(message)
    }




    if (typeof (servData.modules.PREFIX) !== 'undefined' && servData.modules.PREFIX && servData.modules.PREFIX !== '') {
        message.botUser = bot;

        let parsedData = {servData,userData,chanData,targData};
        if (require('../core/donFire.js').run(message,parsedData)===true)return;

        if (message.content.startsWith(servData.modules.PREFIX)) message.prefix=servData.modules.PREFIX;
        if (servData.globalPrefix!==false){
          if(message.content.startsWith("p!")) message.prefix = "p!";
        };
        if(message.content.startsWith("plx!")) message.prefix = "plx!";
        if(message.prefix){

          if(userData.blacklisted && userData.blacklisted!='false')return message.react(':BLACKLISTED_USER:406192511070240780');
            return require('../core/commandFire.js').run(message,parsedData);
        };
    };

     delete require.cache[require.resolve('../core/subroutines.js')];
      require('../core/subroutines.js').runAll(message,servData,userData,chanData);

    //---SPAM BUSTER

    //---NIGHTWATCH SUBROUTINES

    //---REACTIONS

  }

}
console.log("Message OK!")
