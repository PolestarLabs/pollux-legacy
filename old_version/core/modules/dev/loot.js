
const fs = require("fs");
const gear = require('../../gearbox.js')
const paths = require("../../paths.js");
const PixelCore = require('canvasutil').PixelCore
const pixelProcessor = new PixelCore();
const Pixly = require("pixel-util");
const Jimp = require("jimp");
const Canvas = require("canvas");
const opentype = require("opentype.js");
const drawText = require("node-canvas-text").default;
const locale = require('../../../utils/multilang_b');
 

const mm = locale.getT();

const ej = gear.emoji

const cmd = 'loot';




let rollNo = 0 

const  init = async function (message,userDB,DB,issuer,reducer,event) {
var MODLS = message.author.dDATA.modules  

  
  
  console.log(event)
  
  const BGBASE = JSON.parse(fs.readFileSync("./resources/lists/backgrounds.json"))
  const MEDALBASE = JSON.parse(fs.readFileSync("./resources/lists/medals.json"))
  
   
delete require.cache[require.resolve("../../archetypes/lootbox.js")]
let LOOT = require("../../archetypes/lootbox.js")

  
  let faker = message.content.split("--ev").slice(1)[0]
  //console.log("|")
  //console.log(faker)
  //return
  

  
   event = event || faker 
  message.content = message.content.replace("--ev","")
  
      let arg = (message.content.split(/ +/)[1] ||'c').toUpperCase();
  let factors = ["C", "U", "R", "SR", "UR"].indexOf(arg) || 0
  
  let rerollCost = Math.floor(50*Math.pow(3,rollNo+factors/3))
  
  let now = Date.now()
  let  rers = 3
  if (message.author.dDATA.modules.powerups){
    if (message.author.dDATA.modules.powerups.extrarerolls){
        if(message.author.dDATA.modules.powerups.extrarerolls[1]<now){
          rers = message.author.dDATA.modules.powerups.extrarerolls[0]
        }
    }
  }

  rers = typeof reducer== "number" ? reducer : rers
  let balance = message.author.dDATA.modules.rubines
  
  
  
if(message.author.id!= "88120564400553984" && issuer != "pollux")return;
  
  
   
const LANG=message.lang
let P={lngs:LANG, interpolation: {'escapeValue': false} }

          let emb = new gear.Discord.RichEmbed
          emb.setColor("#f240a7")
          P.user = message.member.displayName
          emb.description = ej("loot")+""+mm("loot.opening",P)
          
          let sttup = await message.channel.send({embed:emb})
          await gear.wait(3)
          sttup.delete().catch()
  
  


    Canvas.registerFont(paths.FONTS + "/product-sans-bold.ttf", {
            family: 'Product',
            weigth: "bold"
        });
        Canvas.registerFont(paths.FONTS + "/product-sans-reg.ttf", {
            family: 'Product',
            weigth: "normal"
        });
        //



////console.log("ok")


    var bauzin = new LOOT.Lootbox(arg)

    //Channel.sendCode(bauzin).then()
    ////console.log("-------------------")
    await bauzin.open(event)
   //console.log(bauzin.prizes)

            let bauzinB = require("util").inspect(bauzin);

    let bay=[]
    for (var i in bauzin.prizes){

        let yL = bauzin.prizes[i].length

        for (var y=0;y<yL;y++){


            let itm= bauzin.prizes[i][y];
////console.log(i)

            bay.push({type:i,good:itm})

        }
//console.log(bay)

    }




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
    },

}




async function renderBG(bname) {
//console.log(bname)
////console.log("Raritu:"+rarity)
                   
  //  let files = BGBASE.filter(bg=>bg.rarity==rarity && bg.droppable == "TRUE")

    //let rand = gear.randomize(0, files.length - 1);
    var BGFILE = paths.BUILD + "backdrops/"+bname+".png"// +rarity+"/" +files[rand].name+".png"
    
    const incanv = {}
    incanv.neme = '"'+bname+'"'
    incanv.pic = new Canvas(285,350);
    const ctx = incanv.pic.getContext('2d');

  //console.log(BGFILE)
    let I = await gear.getCanvas(BGFILE)
    
    let J = new Canvas.Image;
    J.src = await Pixly.createBuffer(paths.BUILD+"LOOT/BG.png").then(b => {return b;});
  
        await ctx.rotate(0.16)
       await ctx.drawImage(I, 36, 80,260,140);
       await ctx.rotate(-0.16)
       await ctx.drawImage(J, 0, 0);

    return incanv
    

}
async function renderMedal(medal) {

//console.log(medal)
    
    let medalfolder = gear.fs.readdirSync(paths.MEDALS)
  
   // let rand = gear.randomize(0, files.length - 1);
    
    var filepath = paths.MEDALS + medal.icon + ".png"
    
    const incanv = {}
    incanv.neme = '"'+medal.name+'"'
    incanv.nmo = medal.icon
    incanv.pic = new Canvas(300, 300);
    const ctx = incanv.pic.getContext('2d');

    let I = new Canvas.Image;
    I.src = await Pixly.createBuffer(filepath).then(b => {return b;});
    let J = new Canvas.Image;
    J.src = await Pixly.createBuffer(paths.BUILD+"LOOT/MEDAL.png").then(b => {return b;});
        //await ctx.rotate(0.16)
        await ctx.drawImage(I, 94, 128);
        await ctx.drawImage(J, 26, 26);
        //await ctx.rotate(-0.16)
  
    return incanv

}



    let LOOTS = []
    let Max = bay.length

    const canvas = new Canvas(800, 600);
    const base = canvas.getContext('2d');
  
  


  
    for (i = 0; i < Max; ++i) {
        
        let img
        let namely;
        let nmo;
        let eventide;

        img= await gear.getCanvas(paths.BUILD + "LOOT/" + prize[bay[i].type][bay[i].good[0]] + ".png")
        if (bay[i].type == "rubines" || bay[i].type == "jades") {
            
            img =await gear.getCanvas(paths.BUILD + "LOOT/" +(prize[bay[i].type]||"zirigidum")[bay[i].good[0]] + ".png")
            //img =await gear.getCanvas(paths.BUILD+"LOOT/gabr.png")

          
        } else if (bay[i].type == "bgs") {
          
          //console.log(bay[i].good)
          
                    
            try{
              
            eventide == BGBASE.filter(m=>m.name==bay[i].good[1].name)[0].event != undefined
            }catch(err){
              console.log(err)
              eventide = false
            }
          
          
            let img_pre = await renderBG(bay[i].good[1].name)
            namely = img_pre.neme
            img =await  img_pre.pic
        }else if (bay[i].type == "medals") {
          
            try{
              
             let filtlet = MEDALBASE.filter(m=>m.icon==bay[i].good[1])
            
            eventide= filtlet[0].event != undefined
              
            }catch(err){
              //console.log(err)
              eventide = false
            }

            let img_pre = await renderMedal(bay[i].good[1])
            namely = img_pre.neme
            img = await img_pre.pic
            nmo = img_pre.nmo

        } else {
            img = await gear.getCanvas(paths.BUILD + "LOOT/" + prize[bay[i].type][bay[i].good[0]] + ".png")
        }
        let qtd
        let rarity = await gear.getCanvas(paths.BUILD + "LOOT/rarity/" + bay[i].good[0] + ".png")
        let rarityShine = await gear.getCanvas(paths.BUILD + "LOOT/shine" + bay[i].good[0] + ".png")
        
        if (bay[i].type == "rubines" || bay[i].type == "jades") qtd = await gear.tag(base, "x" + bay[i].good[1], '36px Product,Sans', "#a0a0a0");
      
      
        let name = await gear.tag(base, bay[i].type.toUpperCase(), '36px Product,Sans', "#d0d0d0");
        
        let eve = eventide?"EVENT":""
        
        let event = await gear.tag(base, eve, '26px Product,Sans', "#d82d2d");
        
        let item = {
            N: name,
            I: img,
            R: rarity,
            EV: event,
            RS: rarityShine,
            Q: qtd || false,
            prompt:{name:namely||bay[i].good[1],rarity:bay[i].good[0],type:bay[i].type,sidename:nmo}
        }
        ////console.log("-------------")
        ////console.log(bay[i].type)
        ////console.log("-------------")
        LOOTS.push(item)
    }

   // ////console.log(bay)





    let lootman = [
        {
            x: 125,
            y: 25
        },
        {
            x: 25,
            y: 125
        },
        {
            x: 400 - 150 - 25,
            y: 125
        },
    ]
    let rareman = [
        {
            x: 175,
            y: 45
        },
        {
            x: 75,
            y: 150
        },
        {
            x: 275,
            y: 150
        },
    ]
    let tagman = [
        {
            x: 275,
            y: 100
        },
        {
            x: 175,
            y: 200
        },
        {
            x: 375,
            y: 200
        },
    ]
    let eventman = [
        {
            x: 170 ,
            y: 20 
        },

        {
            x: 405,
            y: 20 
        },

        {
            x: 640,
            y: 20 
        },
    ]
    
    let nameman = [
        {
            x: 125,
            y: 150
        },

        {
            x: 25,
            y: 250
        },

        {
            x: 225,
            y: 250
        },
    ]
    
    
//113 273
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

  raretypes={
    "UR":["ULTRA RARE","#ff59cc" ]
  ,"SR": ["SUPER RARE","#ed4949" ]
  ,"R":  ["RARE","#3663db" ]
  ,"U":  ["UNCOMMON","#ebcb19" ]
  ,"C":  ["COMMON","#222" ]
  }
box={
  
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
  
}
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


async function invent_merge(item){
  switch(item.prompt.type){
      
    case "rubines":
      console.log()
      message.author.dDATA.modules.rubines+=parseInt(item.prompt.name);
      P.X = ej("rubine")+"**"+item.prompt.name +"**"
      return mm("loot.addedRubines",P)
      break;
      
    case "jades":
      message.author.dDATA.modules.jades+=parseInt(item.prompt.name);
      P.X = ej("jade")+"**"+item.prompt.name +"**"
      return mm("loot.addedJades",P)
      break;
      
    case "medals":
      let m=item.prompt.sidename;
    
      if(message.author.dDATA.modules.medalInventory.includes(m)){
        //gear.paramAdd(message.author,"inventory",["medal_coupon",m,item.prompt.name])
        
        
        message.author.dDATA.modules.rubines += exRate[item.prompt.rarity];
        P.itm= item.prompt.name 
        P.tpe= box[item.prompt.type].replace(/['| ]/g,"")
        P.X  ="**"+ exRate[item.prompt.rarity] +"**"+ej("rubine")
        return mm("loot.duplicateExchange",P)
      }else{
        message.author.dDATA.modules.medalInventory.push(m);
        P.itm= item.prompt.name 
        return ej("no1")+mm("loot.addedMedal",P)
      }
      break;

    case "bgs":
      let b=item.prompt.name.replace(/"/g,"");
      if(message.author.dDATA.modules.bgInventory.includes(b)){
        //gear.paramAdd(message.author,"inventory",["bg_coupon",b])
        message.author.dDATA.modules.rubines += exRate[item.prompt.rarity];
        P.itm= item.prompt.name 
        P.tpe= box[item.prompt.type].replace(/['| ]/g,"")
        P.X  ="**"+ exRate[item.prompt.rarity] +"**"+ej("rubine")
        return mm("loot.duplicateExchange",P)
      }else{
        message.author.dDATA.modules.bgInventory.push(b);
        P.itm= item.prompt.name 
        return ej("pic")+mm("loot.addedBG",P)
      }
      break;
      
    case "stamps":
      break;
      
    default:
      break;
    }
  
  
}




let embed = new gear.Discord.RichEmbed()
         embed.setTitle(ej(arg||"C")+(raretypes[arg||"C"][0])+" LOOTBOX")
          P.s = 30
          embed.setFooter(mm("CMD.timesOutIn",P),message.author.avatarURL || message.author.defaultAvatarURL)
          embed.setColor(raretypes[arg||"C"][1])
         embed.setDescription(`
${mm("loot.contains",P)}
\`\`\`ml
${prize_lineup[0]}
${prize_lineup[1]}
${prize_lineup[2]}                          
\`\`\`
\`keep\` ${mm("loot.keep",P)} | ${ balance>=rerollCost?rers>0?`\`reroll\` ${mm("loot.reroll",P)} : **${rerollCost}** ${ej("rubine")} `:"":mm("loot.noFunds",P)}
${ej("retweet")} ${mm("loot.rerollRemain",P)} **${rers}**

`)

  
  let lootpic=await message.channel.send({
                    files: [{
                        attachment: await canvas.toBuffer(),
                        name: "loot.png"
                    }]
                })

       let lootembed =await message.channel.send(embed)
  if (rers===0){
    
    message.channel.send(mm("loot.noMoreRolls",P))
  }
  
   const responses = await message.channel.awaitMessages(msg2 =>
          msg2.author.id === message.author.id && (
            (msg2.content.toLowerCase() === ("reroll")&&rers>0&&balance>=rerollCost)
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
          
            for (i=0;i<3;i++){
              let x= await invent_merge(LOOTS[i]);
              message.channel.send(x).then(x=>{
                userDB.findOneAndUpdate({_id:message.author.id},message.author.dDATA)
              })
            }
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
          return this.init(message,userDB,DB,issuer,rers-1,event)
          
        }
          else{
          
            for (i=0;i<3;i++){
              let x= await invent_merge(LOOTS[i]);
                            message.channel.send(x).then(x=>{
                userDB.findOneAndUpdate({_id:message.author.id},message.author.dDATA)
              })
            }
        }

  

/*
    message.channel.send(`
**Item 1**
${bay[0].type}
${bay[0].good}

**Item 2**
${bay[1].type}
${bay[1].good}

**Item 3**
${bay[2].type}
${bay[2].good}



`)
*/

  
    }
 module.exports = {
    pub:true,
    cmd: cmd,
    perms: 3,
    init: init,
    cat: 'misc'
};

