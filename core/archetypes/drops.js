const gear = require("../gearbox.js");
const paths = require("../paths.json");
const locale = require('../../utils/multilang_b');
const mm = locale.getT();

function eventChecks(svDATA){
  if (!svDATA.event) return 1;
  if (!svDATA.event.enabled) return 1;
  if (!svDATA.event.channel) return 1;
  if (!svDATA.event.iterations) return 1;
  let I = Math.round(svDATA.event.iterations)
  return I||1;
}; 



var EVENT = true
var EVENTBOX = "event_s3"
var EVENTICON = "solstice"


function convertToEvent(i,box) {
    box.id   = box.id.replace("O", EVENTBOX)
    box.text = box.text += "\n" + i.eventDrop
    //box.pic  = EVENTICON+"_chest.png"
    box.pic  = "chest.png"
    return box;
} 

module.exports = {
  lootbox: async function loot(trigger) {

    /*
    if(trigger.content=="fdrop -cycle") {
      switch(gear.randomize(0,3)){
        case 0:
          return require('./flashdrop.js').lootbox(trigger);
        case 1:
          return require('./snipedrop.js').lootbox(trigger);
        case 2:
          return require('./flashandsnipe.js').lootbox(trigger);
        case 3:
          break;
      }
    }
    */

    //if(trigger.content=="fdrop -flash")     return require('./flashdrop.js').lootbox(trigger);
   // if(trigger.content=="fdrop -snipe")     return require('./snipedrop.js').lootbox(trigger);
    //if(trigger.content=="fdrop -flashrand") return require('./flashandsnipe.js').lootbox(trigger);



      if(trigger.author.bot && trigger.signature!='gdrop') return;

      const msg = trigger.content.toLowerCase();
 
    if(trigger.author.id!="271394014358405121"){

        if(trigger.content=="pick" &&  !trigger.channel.natural){
            return    gear.userDB.set(trigger.author.id,{$inc:{'modules.exp':-100}});
}

     const checkRegex = /^_.*|^p!catch|^pick|\$w|\$m\b|^.!.*\s+|^.\/.*\s+|^\+.*\s+|^<.*[0-9]>$|^(.[A-Za-z]{10,})+$|(.)\2{4,}|(. ){4,}|(.{1,5})\4{3,}/g
  
const FLOODCHANNELS = ["548144067167387678"]
if(FLOODCHANNELS.includes(trigger.channel.id)){
  if(trigger.author.blacklisted != true){

    await gear.userDB.set(trigger.author.id,{$set:{blacklisted:"Pick Farm"}});
    trigger.reply("You've been blacklisted for Box Farming");
    trigger.author.blacklisted = true;
    return;
  }; 
}

    if(msg.match(checkRegex)) return;
    
} 
 
    const SVR = trigger.guild;
    const CHN = trigger.channel;
    let prerf = "+"//serverDATA.modules.PREFIX || "+";
    const _DROPMIN   = SVR.memberCount >= 250 ? 200 : SVR.memberCount >= 10 ? -100 : -500
    const _DROPMAX   = SVR.memberCount >= 2500 ? 800 : 1200 ;
    const _RAREMAX   = 129
    const P = {
      lngs: trigger.lang,
      prefix:""
    }
    
    
    const v = {
      dropLoot: mm("loot.lootDrop." + (gear.randomize(1, 5)), P) + mm("loot.lootPick", P).replace(prerf, ""),
      disputing: mm("loot.contesting", P),
      oscarGoesTo: mm("loot.goesTo", P),
      gratz: mm("loot.congrats", P),
      morons: mm("loot.morons", P),
      eventDrop: mm("loot.eventDrop", P),
      suprareDrop: mm("loot.suprareDrop", P)+ mm("loot.lootPick", P),
      rareDrop: mm("loot.rareDrop", P)+ mm("loot.lootPick", P),
      ultraRareDrop: mm("loot.ultraRareDrop", P)+ mm("loot.lootPick", P)
    }
    
    let droprate = 777;
    droprate = gear.randomize(_DROPMIN,_DROPMAX);
    
    let BOX = { id:'lootbox_C_O', text:v.dropLoot, pic:"chest.png"}
    
    
    
    let iterations = 1//eventChecks(serverDATA);
    for (i=0;i<iterations/5;i++){
      droprate = gear.randomize(_DROPMIN , _DROPMAX);
      if(droprate == 777) break;
    };  
    
    if (EVENT){
      let dropevent = gear.randomize(1, 5);
      if (dropevent >= 2) BOX = convertToEvent(false,BOX);
    }
    
    let rarity = gear.randomize(0,_RAREMAX);
    switch (true){
      case rarity <=8:
        BOX.id  = "lootbox_UR_O";
        BOX.text= v.ultraRareDrop;
        break;
      case rarity <= 12:
        BOX.id  = "lootbox_SR_O";
        BOX.text= v.suprareDrop;
        break;
      case rarity <= 28:
        BOX.id  = "lootbox_R_O";
        BOX.text= v.rareDrop;
        break;
      case rarity <= 50:
        BOX.id  = "lootbox_U_O";
        BOX.text= v.dropLoot;
        break;
      case rarity <= 128:
        BOX.id  = "lootbox_C_O";
        BOX.text= v.dropLoot;
        break;
      default:
        BOX.id  = "lootbox_C_O";
        BOX.text= v.dropLoot;
    };
    
    // if(trigger.channel.id=="426308107992563713") droprate= 777;
    let dropcondition = droprate===777 || (trigger.content=="fdrop" && trigger.author.id==='88120564400553984');
    
   
    //dropcondition ? console.log((`>> DROPRATE [${droprate}] >> ${trigger.guild.name} :: #${trigger.channel.name} `+"").red.bgYellow) : false;
    if(dropcondition || trigger.signature=="gdrop"){      
       
      

      if (!BOX) return;
      trigger.channel.natural = true
      
      let lootMessage = await CHN.send(BOX.text,{
        files:[paths.BUILD + (BOX.pic || "chest.png")]
      }).catch(e=>false);
      if(!lootMessage) return;
      
      let ballotMessage = await CHN.send(v.disputing).catch(e=>false);
      if(!ballotMessage) return CHN.send("An error has occurred at `LOOT_BALLOT.get`");  
      
      //COLLECT PICKERS
      let pickers = [];
      let bal_content_A = ballotMessage.content;      
      let bal_content = ballotMessage.content;      
      const responses = await CHN.awaitMessages(pickMsg=>{
        
        if( !pickMsg.author.bot
            && !pickers.find(u=>u.id==pickMsg.author.id)
            && pickMsg.content.toLowerCase() == ('pick') ){          
              if(ballotMessage){
                ballotMessage.edit(bal_content_A + "\n **" + pickers.length +"** People!").then(newmsg=>{
                  bal_content=newmsg.content;
                }).catch(e=>null);                  
              };
              pickMsg.react(':loot:339957191027195905').catch(e=>{});

              pickers.push({id:pickMsg.author.id, name:pickMsg.author.username, mention:`<@${pickMsg.author.id}>`});          
              return true;
            }else{
              //pickMsg.delete().catch();
            };
        }, {time: 10000});
      
      if (pickers.length === 0) {
        CHN.send(v.morons);
        return;
      };      
      
      try{
        CHN.bulkDelete(responses,true).catch(e=>false);
      }catch(e){
        if(responses.first()) responses.first().delete().catch(e=>false);
      }
      
      lootMessage.delete().catch(e=>{});
      ballotMessage.delete().catch(e=>{});
      
      let p_sz = pickers.length-1;
      let rand =  gear.randomize(0,p_sz);
          rand = gear.randomize(0,p_sz);
          rand = gear.randomize(0,p_sz);
      pickers=gear.shuffle(pickers)
      
      
      let luckyOne = pickers[rand];
      
      let drama = pickers.map(user=>user.name);
      let ids = pickers.map(user=>user.id);



      let wa;
      if(trigger.channel.id =="637148977703157760"){
        //wa= gear.shuffle(["456671205882200085"])[0]
         wa= gear.shuffle(trigger.guild.roles.get('585555788773195778').members.map(x=>x.id))[0];
      }
     // if(ids.includes(wa)) {
     if(ids.includes(wa) && gear.randomize(1,5)==2) {
        rand = ids.indexOf(wa)
        luckyOne = pickers[rand];
      }

      let drama_message = "• "+drama.join('\n• ');
      let mention = pickers.map(user=>user.mention);
      drama[rand] = mention[rand];
      let mention_message = "• "+drama.join('\n• ');
      
      let goesto = await CHN.send(v.oscarGoesTo);
      let dramaMsg = await CHN.send(drama_message);
      //console.log(("WINNER PICKED!!!").green)
      await gear.wait(2);
      
      dramaMsg.edit(mention_message).catch(e=>null);      
      await gear.wait(2);
      
            
      gear.dropHook.send("---\nLootbox Drop at **"+trigger.guild.name+"** ("+trigger.guild.id+") - `#"+trigger.channel.name+"` ("+trigger.channel.id+") \n Message to trigger: ```"+trigger.content+"```" +`
Participants: 
\`\`\`
${pickers.map(x=>x.name+" - "+x.id).join("\n")}
 \`\`\`
Winner:\`${JSON.stringify(luckyOne)}\
---

`)
      
      
      await gear.userDB.set(luckyOne.id,{$push:{'modules.inventory':BOX.id}});
      //console.log(("BOX ADDED!!!").green)
      goesto.delete().catch(e=>false);
      dramaMsg.delete().catch(e=>false);
      CHN.send(mention[rand]+", "+v.gratz);
      await gear.userDB.updateOne({id:{$in:ids}},{$inc:{'modules.exp':100}});
      await gear.userDB.set(luckyOne.id,{$inc:{'modules.exp':500}});
      trigger.channel.natural = true
    }
  }  
}












