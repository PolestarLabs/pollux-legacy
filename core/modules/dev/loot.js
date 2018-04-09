const fs = require("fs");
const gear = require('../../gearbox.js');
const paths = require("../../paths.json");
const Pixly = require("pixel-util");
const Canvas = require("canvas");
const locale = require('../../../utils/multilang_b');
const mm = locale.getT();
const eko = require("../../archetypes/ekonomist.js");

const cmd = 'loot';

let rollNo = 0;
const ej = gear.emoji;

var P;

const raretypes={
   "UR":["ULTRA RARE","#ff59cc" ]
  ,"SR": ["SUPER RARE","#ed4949" ]
  ,"R":  ["RARE","#3663db" ]
  ,"U":  ["UNCOMMON","#ebcb19" ]
  ,"C":  ["COMMON","#222" ]
  }
const box={
  "BG":    "'Background': ",
  "RUBINES":"'Rubines'   : ",
  "JADES":  "'Jades'     : ",
  "MEDAL": "'Medal'     : ",
  "STICKER": "'Sticker'   : "
  ,"UR": "ULTRA RARE |"
  ,"SR": "SUPER RARE |"
  ,"R":  "      RARE |"
  ,"U":  "  UNCOMMON |"
  ,"C":  "    COMMON |"
};
const exRate = {
  "UR": 500
  ,"SR": 250
  ,"R":  125
  ,"U":  75
  ,"C":  50
  }

const LOOT = require("../../archetypes/lootbox.js");


const  init = async function (msg,options) {
  try{
  if(!options) return;
  let issuer = options.issuer;
  if(msg.author.id!= "88120564400553984" && issuer != "pollux")return;
  let message=msg;
  if(msg.author.looting)return;
  msg.author.looting = true;

  let rerolls = options.rerolls
      rerolls = rerolls === 0 ? 0 : !rerolls? 3 : rerolls;

      let event = options.event     || false;
  let boxaher = options.boxaher || 'lootbox_C_O';

  let box_rarity = options.rarity || 'C';
  let factors = ["C", "U", "R", "SR", "UR"].indexOf(box_rarity) || 0
  let rerollCost = (rollNo+1)*(factors+1)*175;

  const NOW = Date.now();
  if (msg.author.dDATA.modules.powerups){
    if (msg.author.dDATA.modules.powerups.extrarerolls){
      if(msg.author.dDATA.modules.powerups.extrarerolls.expires<NOW){
        rerolls += msg.author.dDATA.modules.powerups.extrarerolls.amount || 0
      }
    }
  };


  let balance = msg.author.dDATA.modules.rubines;

  const LANG=msg.lang
  P={lngs:LANG, interpolation: {'escapeValue': false}};

  let emb = new gear.Discord.RichEmbed;
  emb.setColor("#f240a7");
  P.user = msg.member.displayName;
  emb.description = ej("loot")+""+mm("loot.opening",P);

  let sttup = await msg.channel.send({embed:emb});
  await gear.wait(2);
  sttup.delete().catch();

  const BOX = await LOOT.Lootbox(box_rarity);

  //==>

    let LootData = await drawBox(BOX,message);
    let LootMeta = LootData.LOOTS;

  let lootpic=await msg.channel.send({
    files: [{
      attachment: await LootData.canvas.toBuffer(),
      name: "Lootbox.png"
    }]
  });

  let embed = new gear.Discord.RichEmbed();

  embed.setTitle(ej(box_rarity||"C")+(raretypes[box_rarity||"C"][0])+" LOOTBOX");
P.s = 30;
embed.setFooter(mm("CMD.timesOutIn",P),message.author.avatarURL || message.author.defaultAvatarURL);
embed.setColor(raretypes[LootMeta.rarity||"C"][1]);
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
        maxMatches: 1,
        time: 30e3
      });


    let action = 'keep';
    if (responses.size !== 0) {
      action = responses.first().content.toLowerCase()
    };

    if (action === "keep"){
        await keeppit(LootMeta,boxaher,msg);
    }
    else if(action==="reroll"&&rerolls>0){
      await eko.pay(rerollCost,message.author.id,{type: 'lootbox'});
      lootpic.delete().catch(e=>{});
      lootembed.delete().catch(e=>{});


      let emb = new gear.Discord.RichEmbed;
      emb.setColor("#3251d0");
      emb.description = ej("retweet")+""+mm("loot.rerolled",P);

      let q = await message.channel.send({embed:emb});
      await gear.wait(2);
      q.delete().catch();
      message.author.looting = false;
      return this.init(message,{issuer,rerolls:rerolls-1,event,boxaher,rarity:boxaher.split('_')[1]});
    }else{
      await keeppit(LootMeta,boxaher,msg);
    };

}catch(e){
  console.log(e)
}
};


function lineup(currentItem){
   return box[currentItem.rarity] + box[currentItem.type] +(typeof currentItem.name=='number'?currentItem.name: '"'+currentItem.name+'"');
};
async function composeItem(currentItem,base){
  let img,ITEM, nmo,eventide,qtd;


  switch(currentItem.type){
    case "RUBINES":
    case "JADES":
      img =await gear.getCanvas(paths.BUILD + "LOOT/" +(currentItem.emblem) + ".png");
      qtd = await gear.tag(base, "x" + currentItem.name, '36px WhitneyHTF', "#a0a0a0");
      break;
    case "BG":
      ITEM = await renderBG(currentItem.item);

      break;

    case "MEDAL":
      ITEM = await renderMedal(currentItem);
      break;

    case "STICKER":
      ITEM = await renderSticker(currentItem);
      break;

  };

  let rarity = await gear.getCanvas(paths.BUILD + "LOOT/rarity/" + currentItem.rarity + ".png")
  let rarityShine = await gear.getCanvas(paths.BUILD + "LOOT/shine" + currentItem.rarity + ".png")

  let event = await gear.tag(base, " ", '26px WhitneyHTF', "#d82d2d");
  let topname = await gear.tag(base, currentItem.type.toUpperCase(), '36px WhitneyHTF', "#d0d0d0");

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
        type: currentItem.type
      }
  }

  return item;
};
async function drawBox(BOX,message){
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
      let LOOTIE = await composeItem(BOX[i],base);

       base.drawImage(LOOTIE.RS, 74 + i*230+shift, 45);
       base.drawImage(LOOTIE.R, 152 + i*230+shift, 305, sq,sq);  //DRAW RARITY
       base.drawImage(LOOTIE.I, 32 + i*230,32);  //DRAW ITEM
       base.drawImage(LOOTIE.N.item, 175 + i*230-(LOOTIE.N.width/2), 44);  //DRAW NAME
       base.drawImage(LOOTIE.EV.item, 175 + i*230-(LOOTIE.EV.width/2), 44);  //DRAW EVENT
      if (LOOTIE.Q) await base.drawImage(LOOTIE.Q.item, 197 + i*230+shift, 250);  //DRAW QUANT

      LOOTS.push(LOOTIE.meta);

    }catch(err){
      console.log(err)
    };
  }
  await base.drawImage(B, 0, 0);

  return {canvas,LOOTS};
  }catch(err){
    console.warn(err);
     message.author.looting = false;
  }
}; //RETURNS {CANVAS,META}
async function renderBG(bname) {

    let BGFILE = paths.BUILD + "backdrops/"+bname+".png";
    const itemCanvas = {};
    itemCanvas.displayName = '"'+bname+'"'
    itemCanvas.canvas = new Canvas.createCanvas(285,350);
    itemCanvas.displayType = "BACKGROUND"
    itemCanvas.event = false;

    const ctx = itemCanvas.canvas.getContext('2d');
    let I = await gear.getCanvas(BGFILE);
    let J = await gear.getCanvas(paths.BUILD+"LOOT/BG.png");
    ctx.rotate(0.16);
    ctx.drawImage(I, 36, 80,260,140);
    ctx.rotate(-0.16);
    ctx.drawImage(J, 0, 0);

    return itemCanvas;
};
async function renderMedal(medal) {

    let MEDALFILE = paths.MEDALS + medal.item + ".png";
    const itemCanvas = {};
    itemCanvas.displayName = '"'+medal.name+'"'
    itemCanvas.canvas = new Canvas.createCanvas(285,350);
    itemCanvas.displayType = "MEDAL"
    itemCanvas.event = false;

    const ctx = itemCanvas.canvas.getContext('2d');
    let I = await gear.getCanvas(MEDALFILE);
    let J = await gear.getCanvas(paths.BUILD+"LOOT/MEDAL.png");
    ctx.drawImage(I, 94, 128);
    ctx.drawImage(J, 26, 26);

    return itemCanvas;
};
async function renderSticker(stk) {

    let STIKFILE = paths.BUILD+"stickers/" + stk.item + ".png"
    const itemCanvas = {};
    itemCanvas.displayName = '"'+stk.name+'"'
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
function invent_merge(item,message){

  let iMETA =item;

  return new Promise(resolve=>{

  let amt;

  switch(iMETA.type){
    case "RUBINES":
      amt=Number(parseInt(iMETA.name));
      gear.userDB.set(message.author.id,{$inc:{'modules.rubines':amt}}).then(ok=>{
        P.X = ej("rubine")+"**"+iMETA.name +"**"
        return resolve(mm("loot.addedRubines",P));
      }).catch(e=> console.warn("ERROR"));
      break;
    case "JADES":
      amt=Number(parseInt(iMETA.name));
      gear.userDB.set(message.author.id,{$inc:{'modules.jades':amt}}).then(ok=>{
        P.X = ej("jade")+"**"+iMETA.name +"**"
        return resolve(mm("loot.addedJades",P));
      }).catch(e=> console.warn("ERROR"));
      break;
    case "SAPPHIRES":
      amt=Number(parseInt(iMETA.name));
      gear.userDB.set(message.author.id,{$inc:{'modules.sapphires':amt}}).then(ok=>{
        P.X = ej("sapphire")+"**"+iMETA.name +"**"
        return resolve(mm("loot.addedSapphires",P));
      }).catch(e=> console.warn("ERROR"));
      break;

    case "MEDAL":
      let m=iMETA.rawName;
      if(message.author.dDATA.modules.medalInventory.includes(m)){
        dupeExchange().then(res=>resolve(res));
      }else{
        gear.userDB.set(message.author.id,{$push:{'modules.medalInventory':m}}).then(ok=>{
          P.itm= iMETA.name
          return resolve(ej("no1")+mm("loot.addedMedal",P));
        }).catch(e=> console.warn("ERROR"))
      }
      break;

    case "BG":
      let b=iMETA.rawName;
      if(message.author.dDATA.modules.bgInventory.includes(b)){
        dupeExchange().then(res=>resolve(res));
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
      if(message.author.dDATA.modules.stickerInventory.includes(m)){
        dupeExchange().then(res=>resolve(res));
      }else{
        gear.userDB.set(message.author.id,{$push:{'modules.stickerInventory':m}}).then(ok=>{
          P.itm= iMETA.name
          return resolve(ej("no1")+mm("loot.addedSticker",P));
        }).catch(e=> resolve("ERROR"))
      }
      }catch(e){
        console.log(e)
      }
      break;

    default:
      //console.log('BREAK DEFAULT',iMETA)
      break;
    }
  });

  function dupeExchange(){
    return new Promise(resolve=>{
      let amt = exRate[iMETA.rarity];
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
    })
};
async function keeppit(LOOTS,boxaher,message) {
  for (let i = 0; i < 3; i++) {
    let res = await invent_merge(LOOTS[i],message);
    await message.channel.send(res);
  };
   message.author.looting = false;
  await breakit(boxaher,message);
};

 module.exports = {
    pub:false,
    cmd: cmd,
    perms: 3,
    init: init,
    cat: 'structures'
};
