const fs = require("fs");
const gear = require('../../gearbox.js')
const paths = require("../../paths.json");
const Pixly = require("pixel-util");
const Canvas = require("canvas");
const locale = require('../../../utils/multilang_b');
const mm = locale.getT();

const cmd = 'loot';

let rollNo = 0;
const ej = gear.emoji;
const MEDALBASE = JSON.parse(fs.readFileSync("./resources/lists/medals.json"));
const BGBASE = JSON.parse(fs.readFileSync("./resources/lists/backgrounds.json"));

const  init = async function (message,userDB,DB,issuer,reducer,event) {

delete require.cache[require.resolve("../../archetypes/lootbox.js")]
delete require.cache[require.resolve("../../gearbox.js")]
let LOOT = require("../../archetypes/lootbox.js")

//let faker = message.content.split("--ev").slice(1)[0]
//console.log("|")
//console.log(faker)
//return
event = event //|| faker
//message.content = message.content.replace("--ev","")

  let box_rarity = (message.content.split(/ +/)[1] ||'c').toUpperCase();
  let factors = ["C", "U", "R", "SR", "UR"].indexOf(box_rarity) || 0

  let rerollCost = Math.floor(50*Math.pow(3,rollNo+factors/3));

  let now = Date.now();
  let  rerolls = 3
  if (message.author.dDATA.modules.powerups){
    if (message.author.dDATA.modules.powerups.extrarerolls){
        if(message.author.dDATA.modules.powerups.extrarerolls[1]<now){
          rerolls = message.author.dDATA.modules.powerups.extrarerolls[0]
        }
    }
  };

  rerolls = typeof reducer== "number" ? reducer : rerolls;
  let balance = message.author.dDATA.modules.rubines;

if(message.author.id!= "88120564400553984" && issuer != "pollux")return;

const LANG=message.lang
let P={lngs:LANG, interpolation: {'escapeValue': false} };
          let emb = new gear.Discord.RichEmbed;
          emb.setColor("#f240a7");
          P.user = message.member.displayName;
          emb.description = ej("loot")+""+mm("loot.opening",P);

          let sttup = await message.channel.send({embed:emb});
          await gear.wait(3);
          sttup.delete().catch();
  /*
      Canvas.registerFont(paths.FONTS + "/product-sans-bold.ttf", {
            family: 'Product',
            weigth: "bold"
        });
        Canvas.registerFont(paths.FONTS + "/product-sans-reg.ttf", {
            family: 'Product',
            weigth: "normal"
        });
*/
    const BOX = new LOOT.Lootbox(box_rarity);
    await BOX.open(event);
    let BOXB = require("util").inspect(BOX);

    let boxContents=[];
    for (let i in BOX.prizes){
        let yL = BOX.prizes[i].length
        for (let y=0;y<yL;y++){
            let itm= BOX.prizes[i][y];
            boxContents.push({type:i,good:itm})
        };
    };

const    prize = {
    bgs:{
        C:"BG",
        U:"BG",
        R:"BG",
        SR:"BG",
        UR:"BG"
    },
        stamps:{
        C:"STAMP",
        U:"STAMP",
        R:"STAMP",
        SR:"STAMP",
        UR:"STAMP"
    },
        medals:{
        C:"COLOR",
        U:"MEDAL",
        R:"MEDAL",
        SR:"MEDAL",
        UR:"MEDAL"
    },
        rubines:{
        C:"RUBINE_C",
        U:"RUBINE_U",
        R:"RUBINE_R",
        SR:"RUBINE_SR",
        UR:"RUBINE_UR"
    },
        jades:{
        C:"JADE_C",
        U:"JADE_U",
        R:"JADE_R",
        SR:"JADE_SR",
        UR:"JADE_UR"
    }
};

async function renderBG(bname) {

    let BGFILE = paths.BUILD + "backdrops/"+bname+".png";// +rarity+"/" +files[rand].name+".png"

    const incanv = {}
    incanv.neme = '"'+bname+'"'
    incanv.pic = new Canvas.createCanvas(285,350);
    const ctx = incanv.pic.getContext('2d');

    let I = await gear.getCanvas(BGFILE)
    let J = new Canvas.Image;
    J.src = await Pixly.createBuffer(paths.BUILD+"LOOT/BG.png").then(b => {return b;});

       await ctx.rotate(0.16);
       await ctx.drawImage(I, 36, 80,260,140);
       await ctx.rotate(-0.16);
       await ctx.drawImage(J, 0, 0);

    return incanv;
};

async function renderMedal(medal) {
    let medalfolder = fs.readdirSync(paths.MEDALS)
    let filepath = paths.MEDALS + medal.icon + ".png"

    const incanv = {}
    incanv.neme = '"'+medal.name+'"'
    incanv.nmo = medal.icon
    incanv.pic = new Canvas.createCanvas(300, 300);
    const ctx = incanv.pic.getContext('2d');

    let I = new Canvas.Image;
    I.src = await Pixly.createBuffer(filepath).then(b => {return b;});
    let J = new Canvas.Image;
    J.src = await Pixly.createBuffer(paths.BUILD+"LOOT/MEDAL.png").then(b => {return b;});
        //await ctx.rotate(0.16)
        await ctx.drawImage(I, 94, 128);
        await ctx.drawImage(J, 26, 26);
        //await ctx.rotate(-0.16)
    return incanv;
};

    let LOOTS = []
    let Max = boxContents.length
    const canvas = new Canvas.createCanvas(800, 600);
    const base = canvas.getContext('2d');

    for (i = 0; i < Max; ++i) {
        let img
        let namely;
        let nmo;
        let eventide;

        img= await gear.getCanvas(paths.BUILD + "LOOT/" + prize[boxContents[i].type][boxContents[i].good[0]] + ".png")
        if (boxContents[i].type == "rubines" || boxContents[i].type == "jades") {
            img =await gear.getCanvas(paths.BUILD + "LOOT/" +(prize[boxContents[i].type]||"zirigidum")[boxContents[i].good[0]] + ".png")

        } else if (boxContents[i].type == "bgs") {
            try{
            eventide == BGBASE.filter(m=>m.name==boxContents[i].good[1].name)[0].event != undefined;
            }catch(err){
              console.log(err);
              eventide = false;
            };

            let img_pre = await renderBG(boxContents[i].good[1].name);
            namely = img_pre.neme;
            img =await  img_pre.pic;

        }else if (boxContents[i].type == "medals") {
            try{
              let filtlet = MEDALBASE.filter(m=>m.icon==boxContents[i].good[1]);
              eventide= filtlet[0].event != undefined;
            }catch(err){
              eventide = false;
            }

            let img_pre = await renderMedal(boxContents[i].good[1])
            namely = img_pre.neme
            img = await img_pre.pic
            nmo = img_pre.nmo

        } else {
            img = await gear.getCanvas(paths.BUILD + "LOOT/" + prize[boxContents[i].type][boxContents[i].good[0]] + ".png")
        };

        let qtd;
        let rarity = await gear.getCanvas(paths.BUILD + "LOOT/rarity/" + boxContents[i].good[0] + ".png")
        let rarityShine = await gear.getCanvas(paths.BUILD + "LOOT/shine" + boxContents[i].good[0] + ".png")

        if (boxContents[i].type == "rubines" || boxContents[i].type == "jades") qtd = await gear.tag(base, "x" + boxContents[i].good[1], '36px Product,Sans', "#a0a0a0");

        let eve = eventide?"EVENT":"";
        let event = await gear.tag(base, eve, '26px Product,Sans', "#d82d2d");
        let name = await gear.tag(base, boxContents[i].type.toUpperCase(), '36px Product,Sans', "#d0d0d0");

        let item = {
            N: name,
            I: img,
            R: rarity,
            EV: event,
            RS: rarityShine,
            Q: qtd || false,
            prompt:{name:namely||boxContents[i].good[1],rarity:boxContents[i].good[0],type:boxContents[i].type,sidename:nmo}
        }
        LOOTS.push(item)
    }

    let sq = 70
    let shift = (50-sq)/2
      const B = await gear.getCanvas(paths.BUILD + "LOOT/mainframe.png")

    for (i=0;i<LOOTS.length;++i){
      await base.drawImage(LOOTS[i].RS, 74 + i*230+shift, 45);
    }
      await base.drawImage(B, 0, 0);

    for (i=0;i<LOOTS.length;++i){
      //DRAW RARITY
      await base.drawImage(LOOTS[i].R, 152 + i*230+shift, 305, sq,sq);
      //DRAW ITEM
      await base.drawImage(LOOTS[i].I, 32 + i*230,32);
      //DRAW NAME
      await base.drawImage(LOOTS[i].N.item, 175 + i*230-(LOOTS[i].N.width/2), 44);
      //DRAW EVENT
      await base.drawImage(LOOTS[i].EV.item, 175 + i*230-(LOOTS[i].EV.width/2), 44);
      //DRAW QUANT
      if (LOOTS[i].Q) await base.drawImage(LOOTS[i].Q.item, 197 + i*230+shift, 250);
    }

const raretypes={
   "UR":["ULTRA RARE","#ff59cc" ]
  ,"SR": ["SUPER RARE","#ed4949" ]
  ,"R":  ["RARE","#3663db" ]
  ,"U":  ["UNCOMMON","#ebcb19" ]
  ,"C":  ["COMMON","#222" ]
  }
const box={
  "bgs":    "'Background': ",
  "rubines":"'Rubines'   : ",
  "jades":  "'Jades'     : ",
  "medals": "'Medal'     : ",
  "stamps": "'Sticker'   : "
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

let prize_lineup = [
  box[LOOTS[0].prompt.rarity] + box[LOOTS[0].prompt.type] + LOOTS[0].prompt.name,
  box[LOOTS[1].prompt.rarity] + box[LOOTS[1].prompt.type] + LOOTS[1].prompt.name,
  box[LOOTS[2].prompt.rarity] + box[LOOTS[2].prompt.type] + LOOTS[2].prompt.name
]

function invent_merge(item){
  return new Promise(async resolve=>{
  let amt;
  switch(item.prompt.type){
    case "rubines":
      amt=Number(parseInt(item.prompt.name));
      userDB.set(message.author.id,{$inc:{'modules.rubines':amt}}).then(ok=>{
        P.X = ej("rubine")+"**"+item.prompt.name +"**"
        return resolve(mm("loot.addedRubines",P));
      });
      break;

    case "jades":
      amt=Number(parseInt(item.prompt.name));
      userDB.set(message.author.id,{$inc:{'modules.jades':amt}}).then(ok=>{
        P.X = ej("jade")+"**"+item.prompt.name +"**"
        return resolve(mm("loot.addedJades",P));
      });
      break;

    case "medals":
      let m=item.prompt.sidename;
      if(message.author.dDATA.modules.medalInventory.includes(m)){
        dupeExchange().then(res=>resolve(res));
      }else{
        userDB.set(message.author.id,{$push:{'modules.medalInventory':m}}).then(ok=>{
          P.itm= item.prompt.name
          return resolve(ej("no1")+mm("loot.addedMedal",P));
        })
      }
      break;

    case "bgs":
      let b=item.prompt.name.replace(/"/g,"");
      if(message.author.dDATA.modules.bgInventory.includes(b)){
        dupeExchange().then(res=>resolve(res));
      }else{
        userDB.set(message.author.id,{$push:{'modules.bgInventory':b}}).then(ok=>{
          P.itm= item.prompt.name
          return resolve(ej("pic")+mm("loot.addedBG",P));
        });

      }
      break;

    case "stamps":
      break;

    default:
      break;
    }
  });

  function dupeExchange(){
    return new Promise(resolve=>{
      let amt = exRate[item.prompt.rarity];
      userDB.set(message.author.id,{$inc:{'modules.rubines':amt}}).then(ok=>{
            P.itm= item.prompt.name
            P.tpe= box[item.prompt.type].replace(/['| ]/g,"")
            P.X  ="**"+ exRate[item.prompt.rarity] +"**"+ej("rubine")
            return resolve(mm("loot.duplicateExchange",P));
      })
    })
  };
};

        let embed = new gear.Discord.RichEmbed();
        embed.setTitle(ej(box_rarity||"C")+(raretypes[box_rarity||"C"][0])+" LOOTBOX");
        P.s = 30;
        embed.setFooter(mm("CMD.timesOutIn",P),message.author.avatarURL || message.author.defaultAvatarURL);
        embed.setColor(raretypes[box_rarity||"C"][1]);
        embed.setDescription(`
${mm("loot.contains",P)}
\`\`\`ml
${prize_lineup[0]}
${prize_lineup[1]}
${prize_lineup[2]}
\`\`\`
\`keep\` ${mm("loot.keep",P)} | ${ balance>=rerollCost?rerolls>0?`\`reroll\` ${mm("loot.reroll",P)} : **${rerollCost}** ${ej("rubine")} `:"":mm("loot.noFunds",P)}
${ej("retweet")} ${mm("loot.rerollRemain",P)} **${rerolls}**

`);

    async function keeppit() {
      for (i = 0; i < 3; i++) {
        let x = await invent_merge(LOOTS[i]);

        message.channel.send(x);
      };
    };

  let lootpic=await message.channel.send({
                    files: [{
                        attachment: await canvas.toBuffer(),
                        name: "loot.png"
                    }]
                });

       let lootembed =await message.channel.send(embed)
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

        let action
        if (responses.size === 0) {
          ////console.log("timeout")
          action = "keep"
        }else{
        action = responses.first().content
        }
        let A;
        if (action === "keep"){
            await keeppit();
        }
        else if(action==="reroll"){

          message.author.dDATA.modules.rubines -= rerollCost
          message.author.dDATA.modules.rubines

          lootpic.delete().catch(e=>{})
          lootembed.delete().catch(e=>{})
          rollNo++

          let emb = new gear.Discord.RichEmbed
          emb.setColor("#3251d0")
          emb.description = ej("retweet")+""+mm("loot.rerolled",P)

          let q = await message.channel.send({embed:emb})
          await gear.wait(2);
          q.delete().catch()
          return this.init(message,userDB,DB,issuer,rerolls-1,event)
        }else{
              await keeppit();
        };

/*
    message.channel.send(`
**Item 1**
${boxContents[0].type}
${boxContents[0].good}

**Item 2**
${boxContents[1].type}
${boxContents[1].good}

**Item 3**
${boxContents[2].type}
${boxContents[2].good}

`)
*/
};
 module.exports = {
    pub:false,
    cmd: cmd,
    perms: 3,
    init: init,
    cat: 'structures'
};
