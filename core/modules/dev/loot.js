const fs = require("fs");
const gear = require('../../gearbox.js');
const paths = require("../../paths.json");
const Pixly = require("pixel-util");
const Canvas = require("canvas");
//const locale = require('../../../utils/multilang_b');
//const mm = locale.getT();
const eko = require("../../archetypes/ekonomist.js");

const cmd = 'loot';


const ej = gear.emoji;




const raretypes={
   "UR":["ULTRA RARE","#ff59cc" ]
  ,"SR": ["SUPER RARE","#ed4949" ]
  ,"R":  ["RARE","#3663db" ]
  ,"U":  ["UNCOMMON","#ebcb19" ]
  ,"C":  ["COMMON","#222" ]
  }
const box={
  "BG":     "'Background': ",
  "RUBINES":"'Rubines'   : ",
  "JADES":  "'Jades'     : ",
  "MEDAL":  "'Medal'     : ",
  "BOOSTER":"'Booster'   : ",
  "STICKER":"'Sticker'   : "
  ,"UR": "ULTRA RARE |"
  ,"SR": "SUPER RARE |"
  ,"R":  "      RARE |"
  ,"U":  "  UNCOMMON |"
  ,"C":  "    COMMON |"
};
const exRate = {
  "UR": 1200
  ,"SR": 800
  ,"R":  600
  ,"U":  250
  ,"C":  100
  }




const  init = async function (msg,options) {
  
 delete require.cache[require.resolve("../../archetypes/lootbox.js")];
  const LOOT = require("../../archetypes/lootbox.js");
  let USERDATA = await gear.userDB.findOne({id:msg.author.id}).lean().exec();

  
  let thisRoll = (options||{thisroll:0}).thisRoll || 0;

  let start = Date.now();
  
  function benchmark(reson){ 
    let now = Date.now();
    if (msg.channel.id !== '435196699259043851')return;
    msg.reply("checkpoint - `"+(now-start)+"ms` ("+reson+")")
  }

  
  
  try{
  if(!options) return;
  let issuer = options.issuer;
  if(msg.author.id!= "88120564400553984" && issuer != "pollux")return;
  let message=msg;
  if(msg.author.looting)return;
  msg.author.looting = true;

  let rerolls = options.rerolls;
      rerolls = rerolls === 0 ? 0 : !rerolls? 3 : rerolls;

      let event = options.event     || false;
  let boxaher = options.boxaher || 'lootbox_C_O';

  let box_rarity = options.rarity || 'C';
    
  let stake = Math.round((USERDATA.modules.bgInventory.length||100) + (USERDATA.modules.bgInventory.length||100) + (USERDATA.modules.inventory.length||100) /1.5)  
  stake = stake < 80 ? 80 : stake;

  let factors = ["C", "U", "R", "SR", "UR"].indexOf(box_rarity) || 0;
  let rerollCost = ((thisRoll||0)+1)*Math.ceil(factors*1.48+1)*(stake+60);
    let rerollCostPrevious = ((thisRoll||0))*Math.ceil(factors*1.48+1)*(stake+60);
     // console.error({RERRS:options.rerolls})
      if (options.rerolls === undefined) {
        const NOW = Date.now();
        switch (USERDATA.donator) {
          case "iridium":
            rerolls += 1;
            break;
          case "palladium":
            rerolls += 2;
            break;
          case "uranium":
            rerolls += 3;
            break;
          default:
            rerolls += 0
        }
        
        if (msg.author.id == "88120564400553984") rerolls += 3;
        if (USERDATA.modules && USERDATA.modules.powerups) {
          if (USERDATA.modules.powerups.extrarerolls) {
            if (USERDATA.modules.powerups.extrarerolls.expires < NOW) {
              rerolls += USERDATA.modules.powerups.extrarerolls.amount || 0
            }
          }
        }
      };


  let balance = USERDATA.modules.rubines;

  const LANG=msg.lang
  const P={lngs:LANG, interpolation: {'escapeValue': false}};

  let emb = new gear.RichEmbed;
  emb.setColor("#f240a7");
  P.user = msg.member.displayName;
  emb.description = ej("loot")+""+mm("loot.opening",P);

  let sttup = await msg.channel.send({embed:emb});
    /*
      try{
    
    const fs = require("fs");
    let voiceChannel = msg.member.voiceChannel;
    let exportFile 
    let connection;
    if (!voiceChannel) {
     throw error;
    }else{
      exportFile = './resources/sndres/zelda.mp3';
      connection=  false //await voiceChannel.join();
      await gear.wait(3);
if(!connection)return;  
//const dispatcher = connection.playStream(exportFile);

dispatcher.on('end', () => {
    voiceChannel.leave();
}); 
    }
    
  }catch(e){} */
    
  await gear.wait(2);
  sttup.delete().catch();

    
  const boxparams = await gear.items.findOne({id:boxaher});
  const BOX = await LOOT.Lootbox(boxparams);

  //==>

    let LootData = await drawBox(BOX,message);
    let LootMeta = LootData.LOOTS;

  let lootpic=await msg.channel.send({
    files: [{
      attachment: await LootData.canvas.toBuffer(),
      name: "Lootbox.png"
    }]
  });

  let embed = new gear.RichEmbed();
    
   
    
  embed.setTitle(ej(box_rarity||"C")+boxparams.altEmoji +boxparams.name);
P.s = 30;
embed.setFooter(mm("CMD.timesOutIn",P),message.author.displayAvatarURL({format:'png'}));

embed.setColor(raretypes[box_rarity||"C"][1]);

embed.setDescription(`
${mm("loot.contains",P)}
\`\`\`ml
${lineup(LootMeta[0])}
${lineup(LootMeta[1])}
${lineup(LootMeta[2])}
\`\`\`
\`keep\` ${mm("loot.keep",P)} | ${ balance>=rerollCost?rerolls>0?`\`reroll\` ${mm("loot.reroll",P)} : **${rerollCost}** ${ej("rubine")} `:"":mm("loot.noFunds",P)}
${ej("retweet")} ${mm("loot.rerollRemain",P)} **${rerolls}**

`);

  let lootembed =await msg.channel.send(embed);

  if (rerolls===0){
    message.channel.send(mm("loot.noMoreRolls",P))
  };

  const responses = await message.channel.awaitMessages(msg2 =>
      msg2.author.id === message.author.id && (
        (msg2.content.toLowerCase() === ("reroll")&&rerolls>0&&balance>=rerollCost)
        || msg2.content.toLowerCase() === ("keep")
      ), {
        max: 1,
        time: 30e3
      });


    let action = 'keep';
    if (responses.size !== 0) {
      action = responses.first().content.toLowerCase()
    };

    if (action === "keep"){
        await keeppit(LootMeta,boxaher,msg,USERDATA,rerollCostPrevious,thisRoll);
    }
    else if(action==="reroll"&&rerolls>0){

      lootpic.delete().catch(e=>'die silently');
      lootembed.delete().catch(e=>'die silently');
      let emb = new gear.RichEmbed;
      emb.setColor("#3251d0");
      emb.description = ej("retweet")+""+mm("loot.rerolled",P);

      let q = await message.channel.send({embed:emb});
      await gear.wait(2);
      q.delete().catch();
      message.author.looting = false;
      return this.init(message,{issuer,thisRoll:thisRoll+1,rerolls:rerolls-1,event,boxaher,rarity:boxaher.split('_')[1]});
    }else{
      await keeppit(LootMeta,boxaher,msg,USERDATA,rerollCostPrevious,thisRoll);
    };

}catch(e){
  console.error(e)
}
};


function lineup(currentItem){
   return box[currentItem.rarity] + box[currentItem.type] +(typeof currentItem.name=='number'?currentItem.name: '"'+(currentItem.type=='STICKERE'?'['+currentItem.SSS.split(' ').slice(0,2).join(' ').toUpperCase()+']':'')+currentItem.name+'"');
};
async function composeItem(currentItem,base,UDATA){
  let img,ITEM={}, nmo,eventide,qtd;


  switch(currentItem.type){
    case "RUBINES":
    case "JADES":
      img =await gear.getCanvas(paths.BUILD + "LOOT/" +(currentItem.emblem) + ".png");
      qtd = await gear.tag(base, "x" + gear.miliarize(currentItem.name,true), "34px 'Corporate Logo Rounded'", "#a0a0a0");
      
      break;
    case "BG":
      ITEM = await renderBG(currentItem.item,UDATA, currentItem.rarity);

      break;

    case "MEDAL":
      ITEM = await renderMedal(currentItem,UDATA, currentItem.rarity);
      break;

    case "STICKER":
      ITEM = await renderSticker(currentItem,UDATA);
      break;
    case "BOOSTER":
      ITEM = await renderBooster(currentItem,UDATA);
      break;

  };

  let rarity = await gear.getCanvas("./dash/public/images/tiers/new/" + currentItem.rarity + ".png")
  let rarityShine = await gear.getCanvas(paths.BUILD + "LOOT/shine" + currentItem.rarity + ".png")

  let event = await gear.tag(base, " ", "26px 'Corporate Logo Rounded'", "#d82d2d");
  let topname = await gear.tag(base, ((ITEM||currentItem).displayType||currentItem.type).toUpperCase(), "30px 'Corporate Logo Rounded'", "#d0d0d0");

  
  
  let item = {
      N: topname,
      I: img||ITEM.canvas,
      R: rarity,
      EV: event,
      RS: rarityShine,
      Q: qtd || false,
      meta:{
        name:currentItem.name,
        display: currentItem.name,
        rawName: currentItem.item,
        rarity: currentItem.rarity,
        type: currentItem.type,
        SSS:currentItem.SSS
      }
  }

  return item;
};
async function drawBox(BOX,message){
  let UDATA = await gear.userDB.findOne({id:message.author.id}).lean().exec();
  try{
  const canvas = new Canvas.createCanvas(800, 600);
  const base = canvas.getContext('2d');
  let Max = BOX.length
  let LOOTS = []

    let sq = 70
    let shift = (50-sq)/2
    const B = await gear.getCanvas(paths.BUILD + "LOOT/mainframe.png");

  for (let i = 0; i < Max; ++i) {
    try{
      let LOOTIE = await composeItem(BOX[i],base,UDATA);

       base.drawImage(LOOTIE.RS, 74 + i*230+shift, 45);
       base.drawImage(LOOTIE.I, 32 + i*230,32);  //DRAW ITEM
       base.drawImage(LOOTIE.R, 152 + i*230+shift, 305, sq,sq);  //DRAW RARITY
       base.drawImage(LOOTIE.N.item, 175 + i*230-(LOOTIE.N.width/2), 44);  //DRAW NAME
       base.drawImage(LOOTIE.EV.item, 175 + i*230-(LOOTIE.EV.width/2), 44);  //DRAW EVENT
        
      if (LOOTIE.Q) await base.drawImage(LOOTIE.Q.item, 197 + i*230+shift, 250);  //DRAW QUANT

      LOOTS.push(LOOTIE.meta);

    }catch(err){
      console.error(err)
    };
  }
  await base.drawImage(B, 0, 0);

  return {canvas,LOOTS};
  }catch(err){
    console.warn(err);
     message.author.looting = false;
  }
}; //RETURNS {CANVAS,META}
async function renderBG(bname,UDATA,Rar) {
  

    let BGFILE = paths.BUILD + "backdrops/"+bname+".png";
    const itemCanvas = {};
    itemCanvas.displayName = '"'+bname+'"'
    itemCanvas.canvas = new Canvas.createCanvas(285,350);
    itemCanvas.displayType = "BACKGROUND"
    itemCanvas.event = false;

    const ctx = itemCanvas.canvas.getContext('2d');
    let I = await gear.getCanvas(BGFILE);
    let J = await gear.getCanvas(paths.BUILD+"LOOT/BG.png");
    let NW = await gear.getCanvas(paths.BUILD+"new.png");
    ctx.rotate(0.155);
    ctx.drawImage(I, 36, 80,260,140);
    ctx.rotate(-0.155);
    ctx.drawImage(J, 0, 0);
   

     if(!UDATA.modules.bgInventory.includes(bname)){
          

         
    ctx.drawImage(NW, 220, 90, 64,64);
       }else{
         await makegrad(ctx,Rar);
       }
       

    return itemCanvas;
};

async function makegrad(ctx,rar){
  var grd=ctx.createLinearGradient(0,0,285,0);
grd.addColorStop(.1,"rgba(120, 176, 252, 0)");
grd.addColorStop(.4,"rgba(120, 176, 252, 0.57)");
grd.addColorStop(.6,"rgba(120, 176, 252, 0.57)");
grd.addColorStop(.9,"rgba(120, 176, 252, 0)");

ctx.fillStyle=grd;
ctx.fillRect(0,220,285,50);
  ctx.font = "900 18px 'Whitney HTF'";
  let amt = exRate[rar]
let RBNm = await gear.getCanvas("http://pollux.fun/images/rubine.png");
let TX = await gear.tag(ctx, "DUPLICATE", "600 26px 'Corporate Logo Rounded'", "#ffffff");  
let TX1 = await gear.tag(ctx, "DUPLICATE", "600 26px 'Corporate Logo Rounded'", "rgba(0, 0, 0, .7)");  
let TX2 = await gear.tag(ctx, `+${amt} Rubines`, "400 18px 'Corporate Logo Rounded'", "#ffffff");  
  
ctx.drawImage(TX1.item,1+142-TX.width/2,1+220);
ctx.drawImage(TX1.item,-1+142-TX.width/2,-1+220);
ctx.drawImage(TX.item,142-TX.width/2,220);
ctx.drawImage(TX2.item,142-TX2.width/2+10,248);
ctx.drawImage(RBNm,142-TX2.width/2-10,247,20,20);
  
       
}


async function renderMedal(medal,UDATA,Rar) {  

    let MEDALFILE = paths.MEDALS + medal.item + ".png";
    const itemCanvas = {};
    itemCanvas.displayName = '"'+medal.name+'"'
    itemCanvas.canvas = new Canvas.createCanvas(285,350);
    itemCanvas.displayType = "MEDAL"
    itemCanvas.event = false;

    const ctx = itemCanvas.canvas.getContext('2d');
    let I = await gear.getCanvas(MEDALFILE);
    let J = await gear.getCanvas(paths.BUILD+"LOOT/MEDAL.png");
    let NW = await gear.getCanvas(paths.BUILD+"new.png");
    ctx.drawImage(I, 94, 128,100,100);
    ctx.drawImage(J, 26, 26);
   
      
     if(!UDATA.modules.medalInventory.includes(medal.item)){

         
    ctx.drawImage(NW, 150, 90, 64,64);
       }else{
            
await makegrad(ctx,Rar);
       
    } 
    
    return itemCanvas;
};
async function renderSticker(stk) {

    let STIKFILE = paths.BUILD+"stickers/" + stk.item + ".png"
    const itemCanvas = {};
    //itemCanvas.displayName = '"['+stk.SSS.split(' ').slice(0,2).join(' ').toUpperCase()+']'+stk.name+'"' 
    itemCanvas.canvas = new Canvas.createCanvas(285,350);
    itemCanvas.displayType = "STICKER"
    itemCanvas.event = false;

    const ctx = itemCanvas.canvas.getContext('2d');
    let I = await gear.getCanvas(STIKFILE);
    let J = await gear.getCanvas(paths.BUILD+"LOOT/STAMP.png");
    ctx.drawImage(I, 94, 128,100,100);
    ctx.drawImage(J, 26, 26);

    return itemCanvas;
};

async function renderBooster(stk) {
    let STIKFILE = paths.BUILD+"items/" + stk.SSS + ".png"
    const itemCanvas = {};
    //itemCanvas.displayName = '"['+stk.SSS.split(' ').slice(0,2).join(' ').toUpperCase()+']'+stk.name+'"' 
    itemCanvas.canvas = new Canvas.createCanvas(285,350);
    itemCanvas.displayType = "BOOSTER"
    itemCanvas.event = false;

    const ctx = itemCanvas.canvas.getContext('2d');
    let I = await gear.getCanvas(STIKFILE);
    let J = await gear.getCanvas(paths.BUILD+"LOOT/STAMP.png");
    ctx.drawImage(I, 54, 98,200,200);
    ctx.drawImage(J, 26, 26);

    return itemCanvas;
};

function invent_merge(item,message,UDATA){

  let iMETA =item;

  return new Promise(async resolve=>{

  let P={lngs: message.lang, interpolation: {'escapeValue': false}};
    
  let amt;

  switch(iMETA.type){
    case "RUBINES":
      amt=Number(parseInt(iMETA.name));
      await gear.audit(message.author.id,amt,"lootbox","RBN","+");
      gear.userDB.set(message.author.id,{$inc:{'modules.rubines':amt}}).then(ok=>{
        P.X = ej("rubine")+"**"+iMETA.name +"**"
        return resolve(mm("loot.addedRubines",P));
      }).catch(e=> console.warn("ERROR"));
      break;
    case "JADES":
      amt=Number(parseInt(iMETA.name));
      await gear.audit(message.author.id,amt,"lootbox","JDE","+");
      gear.userDB.set(message.author.id,{$inc:{'modules.jades':amt}}).then(ok=>{
        P.X = ej("jade")+"**"+iMETA.name +"**"
        return resolve(mm("loot.addedJades",P));
      }).catch(e=> console.warn("ERROR"));
      break;
    case "SAPPHIRES":
      amt=Number(parseInt(iMETA.name));
      await gear.audit(message.author.id,amt,"lootbox","SPH","+");
      gear.userDB.set(message.author.id,{$inc:{'modules.sapphires':amt}}).then(ok=>{
        P.X = ej("sapphire")+"**"+iMETA.name +"**"
        return resolve(mm("loot.addedSapphires",P));
      }).catch(e=> console.warn("ERROR"));
      break;

    case "MEDAL":
      let m=iMETA.rawName;
      if(UDATA.modules.medalInventory.includes(m)){
        dupeExchange(P).then(res=>resolve(res));
      }else{
        gear.userDB.set(message.author.id,{$push:{'modules.medalInventory':m}}).then(ok=>{
          P.itm= iMETA.name
          return resolve(ej("no1")+mm("loot.addedMedal",P));
        }).catch(e=> console.warn("ERROR"))
      }
      break;

    case "BG":
      let b=iMETA.rawName;
      if(UDATA.modules.bgInventory.includes(b)){
        dupeExchange(P).then(res=>resolve(res));
      }else{
        gear.userDB.set(message.author.id,{$push:{'modules.bgInventory':b}}).then(ok=>{
          P.itm= iMETA.name
          return resolve(ej("pic")+mm("loot.addedBG",P));
        });
      }
      break;

    case "STICKER":
      try{

      let m=iMETA.rawName;
      if(UDATA.modules.stickerInventory.includes(m)){
        dupeExchange(P).then(res=>resolve(res));
      }else{
        gear.userDB.set(message.author.id,{$push:{'modules.stickerInventory':m}}).then(ok=>{
          P.itm= iMETA.name
          return resolve(ej("no1")+mm("loot.addedSticker",P));
        }).catch(e=> resolve("ERROR"))
      }
      }catch(e){
        console.error(e)
      }
      break;

    case "BOOSTER":
      try{

      let m=iMETA.rawName;

        gear.userDB.set(message.author.id,{$push:{'modules.inventory':m}}).then(ok=>{
          P.itm= iMETA.name
          return resolve(ej("no1")+mm("loot.addedSticker",P));
        }).catch(e=> resolve("ERROR"))

      }catch(e){
        console.error(e)
      }
      break;
      
    default:
      
       break;
    }
  });

  function dupeExchange(P){
    return new Promise(resolve=>{
      let amt = exRate[iMETA.rarity];
      gear.audit(message.author.id,amt,"lootbox_dupe","RBN","+").then(ok=>ok);
      gear.userDB.set(message.author.id,{$inc:{'modules.rubines':amt}}).then(ok=>{
            P.itm= iMETA.name
            P.tpe= box[iMETA.type].replace(/['| |:]/g,"")
            P.X  ="**"+ exRate[iMETA.rarity] +"**"+ej("rubine")
            return resolve(mm("loot.duplicateExchange",P));
      })
    })
  };
};
async function breakit(boxaher,message){
       gear.userDB.findOneAndUpdate({
        'id':message.author.id,
        'modules.inventory':boxaher
      },{$set:{'modules.inventory.$':'DRAGGE'}}).then(async x=>{
      await gear.userDB.findOneAndUpdate({'id':message.author.id},{$pull:{'modules.inventory':'DRAGGE'}});
    });
};
async function keeppit(LOOTS,boxaher,message,UDATA,rerollCost,thisRoll) {
  for (let i = 0; i < 3; i++) {
      invent_merge(LOOTS[i],message,UDATA).then(res=>{
      message.channel.send(res);
      message.author.looting = false;
    });
  }
    if(thisRoll>0){
      
      gear.userDB.set(message.author.id,{$inc:{'modules.rubines':-rerollCost}});
    }
      gear.audit(message.author.id,rerollCost,"lootbox_rerolls","RBN");
      breakit(boxaher,message);
  


};

 module.exports = {
    pub:false,
    cmd: cmd,
    perms: 3,
    init: init,
    cat: 'structures'
};
