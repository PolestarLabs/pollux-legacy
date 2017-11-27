const gear = require('../../gearbox.js');
const v = {}

init=function(message){

const Server = message.guild
const ACTION = message.content.split(/ +/).slice(1)[0]
const TAG    = message.content.split(/ +/).slice(1)[1]

const utChans = Server.dDATA.utilityChannels || await gear.serverDB.set(Server.id,{$set:{'utilityChannels':{}}});

if (!utChans.voting){
  utChans.voting = (await gear.serverDB.set(Server.id,{$set:{'utilityChannels.voting':{}}})).utilityChannels.voting;
}


//HELPKEY HERE !



const P = {lngs:message.lang};

//verbosity

v.mustMentionChannel 
v.serverOwnerMismatch // server owners must be the same
v.voteType
v.contentType
v.isThatIt
v.cancel
v.allSet
v.overwriteAlert
v.nosuchTag
v.boardRemoved
//---
  
  if(['add','+','new','set'].includes(ACTION))   return add(Server.dDATA,message,TAG);
  if(['del','remove','delete'].includes(ACTION)) return del(Server.dDATA,message,TAG);
  if(['edit','setup','change'].includes(ACTION)) return edt(Server.dDATA,message,TAG);
  
}

function edt(svData,msg,TG){
  
  if (msg.content.split(/ +/).length < 3){
    return //HELPKEY;
  }
  if(!svData.utilityChannels.voting[TG]){
    return msg.channel.send(v.nosuchTag);
  }   
  
  let m1 = await msg.channel.send(v.changeWhat);
  const response_1 = await msg.channel.awaitMessages(me=>
      me.author.id===msg.author.id && ['1','2','3','c','type','content','channel','cancel'].includes(me.content.toLowerCase()),
      {max:1,time:20000} );
  
  if(response_1.size < 1) return msg.channel.send(v.timeout);
  let choice = response_1.first().content.toLowerCase();
  
  if(['1','type'].includes(choice)){
    add(svData,msg,TG,'type')
  }
  if(['2','content'].includes(choice)){
    add(svData,msg,TG,'content')
  }
  if(['3','channel'].includes(choice)){
    let m1 = await msg.channel.send(v.mentionChannel);
    const response_1 = await msg.channel.awaitMessages(me=>
        me.author.id===msg.author.id && (
                            me.mentions.channels.size>0||
                            ['c','cancel'].includes(me.content.toLowerCase())
                                        ),
        {max:1,time:25000} );

    if(response_1.size < 1) return msg.channel.send(v.timeout);
    let choice = response_1.first().mentions.channels.first();

    if(['c','cancel'].includes(response_1.first().content.toLowerCase())) msg.channel.send(v.cancel);
    else{
      let input = {$set:{['utilityChannels.voting.'+TG+'.channel']:choice.id}}
      await gear.serverDB.set(msg.guild.id,input);
      msg.channel.send(v.allSet);
      msg.delete().catch();
    }
    
    response_1.first().delete().catch();
    m1.delete().catch();
  } 
  
  if(['c','cancel'].includes(choice)) return msg.channel.send(v.cancel);
  response_1.first().delete().catch();
  m1.delete().catch();
  
  
  
}

function del(svData,msg,TG){
  if (msg.content.split(/ +/).length < 3){
    return //HELPKEY;
  }
  if(!svData.utilityChannels.voting[TG]){
    return msg.channel.send(v.nosuchTag);
  }
  let input = {$unset:{['utilityChannels.voting.'+TG]:1}}
  gear.serverDB.set(msg.guild.id,input).then(ok=>msg.channel.send(v.boardRemoved));
}

async function add(svData,msg,TG){
  if(!edit){
    if(!msg.mentions.channels.first()){
      return msg.channel.send(v.mustMentionChannel);
    }
    if (msg.content.split(/ +/).length < 4){
      return //HELPKEY;
    }
    let chan = msg.mentions.channels.first();

    if(chan.guild.owner.id != msg.guild.owner.id){
      return msg.channel.send(v.serverOwnerMismatch);
    }
  }
  
  const payload = {}
  payload.channel = chan.id;
  
  if(svData.utilityChannels.voting[TG]){
    msg.channel.send(v.overwriteAlert).then(m=>m.delete(10000))
  }
  
  if(!edit || edit=='type'){
    let m1 = await msg.channel.send(v.voteType);
    const response_1 = await msg.channel.awaitMessages(me=>
        me.author.id===msg.author.id && ['1','2','3','updown','plusone','yesno'].includes(me.content.toLowerCase()),
        {max:1,time:25000} );

    if(response_1.size < 1) return msg.channel.send(v.timeout);
    let choice = response_1.first().content.toLowerCase();

    if(['1','updown'].includes(choice))  payload.type = 'updown';
    if(['2','plusone'].includes(choice)) payload.type = 'plusone';
    if(['3','yesno'].includes(choice))   payload.type = 'yesno';

    response_1.first().delete().catch();
    m1.delete().catch();
  }
  
  if(!edit || edit=='content'){
    let m2 = await msg.channel.send(v.contentType);
    const response_2 = await msg.channel.awaitMessages(me=>
        me.author.id===msg.author.id && ['1','2','3','img','txt','imtx'].includes(me.content.toLowerCase()),
        {max:1,time:25000} );

    if(response_2.size < 1) return msg.channel.send(v.timeout);
    let choice = response_2.first().content.toLowerCase();

    if(['1','img'].includes(choice) )  payload.content = 'img';
    if(['2','txt'].includes(choice))   payload.content = 'txt';
    if(['3','imtx'].includes(choice))  payload.content = 'imtx';

    response_2.first().delete().catch();
    m2.delete().catch();
  }
  
  
  let m3 = await msg.channel.send(v.isThatIt);
  const response_3 = await msg.channel.awaitMessages(me=>
      me.author.id===msg.author.id && ['ok','c','cancel'].includes(me.content.toLowerCase()),
      {max:1,time:25000} );
  
  if(response_3.size < 1) return msg.channel.send(v.timeout);
  let choice = response_3.first().content.toLowerCase();
  if(['c','cancel'].includes(choice)) return msg.channel.send(v.cancel);
  
  response_3.first().delete().catch();
  m3.delete().catch();
  
  
  let input = {$set:{['utilityChannels.voting.'+TG]:payload}}
  await gear.serverDB.set(msg.guild.id,input);
  msg.channel.send(v.allSet);
  msg.delete().catch();
  
}
