const gear      = require('../core/gearbox.js'),
      serverDB  = gear.serverDB,
      channelDB = gear.channelDB,
      userDB    = gear.userDB,
      async     = require('async');


let GREYLIST=[],BLACKLIST=[],WHITELIST=[]

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
          lRanks = (await serverDB.findOneAndUpdate({id:message.guild.id},{$set:{'modules.LOCALRANK':{}}})).modules.LOCALRANK;
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
async function spamBuster(SERVER,servData,CHANNEL,chanData){
    //const Nightwatch = require ('./supermodules/nightwatch.js');
    let spam_buster;
    if(!chanData.modules.BUSTER){
      await (await channelDB.set(CHANNEL.id,{
        $set:{
          'modules.BUSTER':{
              'flood'      :false,
              'links'      :false,
              'invites'    :false,
              'words'      :false,
              'mentionSpam':false
          }
        }
      })).modules.BUSTER;
      spam_buster = (await channelDB.findOne({id:CHANNEL.id})).modules.BUSTER;

    }else{
      spam_buster = chanData.modules.BUSTER;
    };
    if(spam_buster.flood)/*Nightwatch.floodBuster()*/;
    if(spam_buster.links)/*Nightwatch.linksBuster()*/;
    if(spam_buster.invites)/*Nightwatch.invitesBuster()*/;
    if(spam_buster.words)/*Nightwatch.wordsBuster()*/;
    if(spam_buster.mentionSpam)/*Nightwatch.mentionBuster()*/;
};

   function serverLanguageSets(message, servData) {
     if (servData.modules.LANGUAGE) {
       let langua = servData.modules.LANGUAGE;
       if (message.guild.region === 'brazil') langua = "pt-BR";
       message.lang = [langua, 'dev'];
     } else {
       let langua = "en"
       if (SERVER.region === 'brazil') langua = "pt-BR";
       message.lang = [langua, 'dev'];
       serverDB.set(message.guild.id, {$set: {'modules.LANGUAGE': langua}});
     };
   }

exports.run = async function(bot, message){

  const USER   = message.author,
        SERVER = message.guild,
        CHANNEL= message.channel,
        TARGET = message.mentions.users.first() ||USER;

  if (GREYLIST.includes(SERVER.id) || GREYLIST.includes(USER.id))return;
  if (USER.bot) return;

  let userData = await dataChecks( 'user',   USER    ),
      servData = await dataChecks( 'server', SERVER  ),
      chanData = await dataChecks( 'channel',CHANNEL ),
      targData = await dataChecks( 'user',   TARGET  );


  if (SERVER){

    await localExpIncrement(message,servData,chanData,USER,userData),
    await randomDrops(CHANNEL,chanData),
    await spamBuster(SERVER,servData,CHANNEL,chanData);

    //CHECK SERVER LANG
    await serverLanguageSets(message,servData);

    //CHECK CHANNEL LANG
    if(chanData.modules.LANGUAGE){
      message.lang = [chanData.modules.LANGUAGE || servData.modules.LANGUAGE, 'dev'];
    };

    if (typeof (servData.modules.PREFIX) !== 'undefined' && servData.modules.PREFIX && servData.modules.PREFIX !== '') {
        if (message.content.startsWith(servData.modules.PREFIX)) message.prefix=servData.modules.PREFIX;
        if (servData.globalPrefix!==false){
          if(message.content.startsWith("p!")) message.prefix = "p!";
        };
        if(message.content.startsWith("plx!")) message.prefix = "plx!";

        if(!message.prefix)return;
        message.botUser = bot;
        let parsedData = {servData,userData,chanData,targData};
        require('../core/commandFire.js').run(message,parsedData);
    };



    //---SPAM BUSTER

    //---NIGHTWATCH SUBROUTINES

    //---REACTIONS

    //---REACTIONS


  }






}
