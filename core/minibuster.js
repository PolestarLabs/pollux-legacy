
const {userDB,serverDB,channelDB} = require('./gearbox.js')
module.exports ={
  
  up:function(msg,pos){  
    
    userDB.set(msg.author.id,{$inc:{'modules.statistics.healthIndex':pos}});
    serverDB.set(msg.guild.id,{$inc:{'modules.statistics.healthIndex':pos}});   
    
  },
  
checks:function(msg,UD){
  const Checks = [
  {
    regex: /^pick$/,
      category: "PICK",
        weight:10
  },
    {
      regex: /^_.*|^.!.*\s+|^.\/.*\s+|^\+.*\s+/,
      category: "COMMAND",
        weight:.5
    },
    {
      regex: /^<.*[0-9]>$/,
      category: "ONEMOJI",
        weight:2
    },
    {
      regex: /^<@[0-9]>$/,
      category: "COLDPING",
        weight:5
    },
    {
      regex: /^(.[A-Za-z]{10,})+$/,
      category: "LONGSTRING",
        weight:8.3
    },
    {
      regex: /(.)\1{4,}/,
      category: "REPEATEDCHARS",
        weight:20.7
    },
    {
      regex: /(.{1,5})\1{3,}/,
      category: "REPEATEDWORDS",
        weight:20.9
    },    {
      regex: /^.$/,
      category: "ONECHAR",
        weight:20.2
    }
]
  
  let penalty = 0;
  if((UD.modules.statistics||{}).lastMessage == msg) {penalty = 80;  userDB.set(UD.id,{$inc:{['modules.statistics.buster.REPEATINGMSG']:1}});}
  
  let score
  for (i in Checks){
    if(msg.match(Checks[i].regex)) {
      penalty+=Checks[i].weight;
      userDB.set(UD.id,{$inc:{['modules.statistics.buster.'+Checks[i].category]:1}});
    }
  }
  return penalty;
   
  
}  ,
  
  
run: async function(message,SD,UD,CD){

return;  
  if(UD.blacklisted) return;
   
   const checkRegex = /^_.*|^p!catch|^pick\b|^.!.*\s+|^.\/.*\s+|^\+.*\s+|^<.*[0-9]>$|^(.[A-Za-z]{10,})+$|(.)\2{4,}|(. ){4,}|(.{1,5})\4{3,}/g
  const msg = message.content.toLowerCase()
  if (msg.length ==0) return;
  
  let targetto = ['491669197617758223','88120564400553984',"441391031716675584",'373940607766495244','111143742420840448','279201851902263296',
                  '322413219052519425',
                  '134506259037683712',
                  '398233992748335104',
                 ]
  
  
  //targetto = (await userDB.find({'modules.statistics.healthIndex':{$exists:true}, blacklisted:{$exists:false}},{_id:-1,id:1}).sort({'modules.statistics.healthIndex':1}).limit(25)).map(x=>x.id).lean().exec();
  
   const UNIVERSALTRACK = false
   
   const bustCondition =  msg.match(checkRegex)||msg.length<=3||((UD.modules.statistics||{}).lastMessage == msg)
  targetto.push("350647150272577546")
  if(UD.modules.statistics&&UD.modules.statistics.healthIndex<-1000){
    for (i in targetto){
      if(message.author.id==targetto[i]&&!UNIVERSALTRACK){
        //console.error(`${"Tracking".yellow} ${UD.name.red}: ${msg} |SCORE:${(UD.modules.statistics.healthIndex+"").bgRed} |BUST:${bustCondition?"TRUE".red:"false".green}`);
      }
    }
  }
 
  
  if(UNIVERSALTRACK){ 
   console.error(`${"Tracking".yellow} ${UD.name.red}: ${msg} |SCORE:${(UD.modules.statistics.healthIndex+"").bgRed} |BUST:${bustCondition?"TRUE".red:"false".green}`);
  }
  
  if(bustCondition){
     let   penalty = 3
  if(UD.modules.statistics&&UD.modules.statistics.healthIndex<-1000){
    
     penalty = this.checks(msg,UD);
    
  }  


    userDB.set(message.author.id,{$inc:{'modules.statistics.healthIndex':-penalty}});
    serverDB.set(message.guild.id,{$inc:{'modules.statistics.healthIndex':-penalty}});
   // console.error("MATCH TRUE:".red+(msg.bgBlue))
    
  }else{
    let positive = 1 + Math.round(msg.length/10||0)
    userDB.set(message.author.id,{$inc:{'modules.statistics.healthIndex':+positive}});
    serverDB.set(message.guild.id,{$inc:{'modules.statistics.healthIndex':+positive}});
   // console.error("MATCH FALSE:".green+(msg.bgBlue)+"SCORE="+positive)
  }
  
    userDB.set(message.author.id,{$set:{'modules.statistics.lastMessage':msg}});
  
 if(UD.modules.statistics&&UD.modules.statistics.healthIndex > 0 && UD.modules.statistics.warned == true){
   userDB.set(message.author.id,{$set:{'modules.statistics.warned':false}});
   userDB.set(message.author.id,{$set:{'modules.statistics.warned2':false}});
 }
   
 if(UD.modules.statistics&&UD.modules.statistics.healthIndex < -1000 && !UD.modules.statistics.warned){
    userDB.set(message.author.id,{$set:{'modules.statistics.warned':true}});
   message.reply("Your Reputation score is alarmingly low, please consider slowing down.");
 }  
 if(UD.modules.statistics&&UD.modules.statistics.healthIndex < -2000 && !UD.modules.statistics.warned2){
    userDB.set(message.author.id,{$set:{'modules.statistics.warned2':true}});
   message.reply("Your Reputation score is alarmingly low, please consider slowing down, this is your second warning, blacklisting will not be reversed if you drop any lower!");
 }
 if(UD.modules.statistics&&UD.modules.statistics.healthIndex < -3500){
   message.reply("Your Reputation score reached below acceptable levels and you've been Blacklisted. You've been warned twice so this will not be reversed.");
   userDB.set(message.author.id,{$set:{'blacklisted':'[SPAM BUSTER]: '+UD.modules.statistics.healthIndex+" | at "+`${message.guild.name} (${message.guild.id}) >> LAST BUSTED FOR: [${msg}]`}});
 }
  
}
} 