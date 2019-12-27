

const Discord = require('discord.js')
const md5 = require('md5')
const fs=require('fs');
const paths = require("./paths.json");  

const Promise = require("bluebird");

const Canvas = require("canvas"); 
const Pixly = require("pixel-util");
const wrap = require('canvas-text-wrapper').CanvasTextWrapper;

const {localranks,fishes,assorted,buyables,cosmetics,userDB,serverDB,channelDB,globalDB,items,fanart,audits,collectibles} = require('./database_ops.js');
const DB = serverDB;

const cfg = require('../config.json');
const errHook = new Discord.WebhookClient('376036137443000320', cfg.errHook);
const auxHook   = new Discord.WebhookClient('499934758642384906', "7O_oUUI8oy-JOc2kpb0qWh-ESf1CCM2trOphzXuP2D_YFc4PrCvjLhS2h6vmp8aKa5Ay");
const dropHook  = new Discord.WebhookClient('502015226288406537', "pgzghhJe5QRJXhdIgM4pRm-13zY3seCGfhSC17J_rNs45R17HSL6z-trpYbEPjbj7ay6");
const auditHook = new Discord.WebhookClient('560373869890764830', "_iPlyl1zrULP4fus8vB1aNz10YzLRxHeJbyPSDpi_Il4zWkTq6o0jwTCWQzr85RVr05_");
const colorname= require('name-this-color');

var MersenneTwister = require('mersenne-twister');
var generator = new MersenneTwister();

// Generates a random number on [0,1) real interval (same interval as Math.random)

 


module.exports={
  colorname,
  auditHook,
  assorted,
  dropHook,
  cosmetics,
  DB:serverDB, //legacy
  serverDB,
  userDB,collectibles,
  channelDB,
  globalDB,
  Discord,
  errHook,localranks,
  auxHook,
  items,
  md5,
  fanart,
  yep: {
      r: ":yep:339398829050953728",
      i: "339398829050953728"
    },

    nope: {
      r: ":nope:339398829088571402",
      i: "339398829088571402"
    },
    audits,
  buyables,
  paths,
  getRandomRarity: function(type="unshuffle"){
    
    let shuffled = this.shuffle(["UR","SR","SR","R","R","R","R","U","U","U","U","U","U","U","U","C","C","C","C","C","C","C","C","C","C","C","C","C",
    "UR","SR","SR","R","R","R","R","U","U","U","U","U","U","C","C","C","C","C","C","C","C","C","C"]);
    let result;
    if (type == "shuffle"){
      result =  (shuffled[this.randomize(0,shuffled.length-1)]);
    }
  let rand = this.randomize(0,1000);
    result = "C";
    if(rand<=700) result = "U";
    if(rand<=450) result = "R";
    if(rand<=250) result = "SR";
    if(rand<=100) result = "UR";
    //40 20 15 10 5
    
    if (type == "debug"){
      result =  { shuffld : (shuffled[this.randomize(0,shuffled.length-1)]), enum: result, rand,array:JSON.stringify(shuffled)};
    }
    return result;
    
  },
  getShardCodename: function (bot,SHARD=Number(process.env.SHARD)+1){
   return ["Almond"
,"Biscuit"
,"Cookie"
,"Daifuku"
,"Eclair"
,"Flan"
,"Gummybear"
,"Hazelnut"
,"Ice Cream"
,"Jelly"
,"Kuzumochi"
,"Lemondrop"
,"Melonpan"
,"Namagashi"
,"Okoshi"
,"Pancake"
,"Quesadilla"
,"Raspberry"
,"Sugarplum"
,"Truffle"
,"Upside-down Cake"
,"Vanilla"
,"Waffle"
,"Xanax"
,"Yogurt"
,"Zucchini"
,"Acorn"
,"Brownie"
,"Custard"
,"Donut"
,"Ether"
,"Fudge"
,"Ganache"
,"Honeycomb"
,"Iridium"
,"Joule"
,"Kebab"
,"Lolipop"
,"Marshmallow"
,"Nescau"
,"Oreo"
,"Pudding"
          ][(bot.shard||SHARD-1||{id:false}).id || SHARD-1]
  },
  cfg,
   cleanup: async function cleanup(messages){
    for(i=0;i<messages.length;i++){
      messages[i].delete().catch(e=>"die silent")
    }
  },
  demotiv : require("../resources/lists/demotiv.json"),
  RichEmbed:Discord.MessageEmbed,
  
  getTarget: async function getTarget(msg,x){
    x = x || {}
    
    x.point = x.point ||0
    x.noself = x.noself ||false
    
    
    let bot = msg.botUser
    let usr;
    if (msg.mentions.users.size > 0) {
      usr = msg.mentions.users.first().id;
    } else {
      let argpos = msg.content.split(/ +/).slice(1 + (x.point || 0)).join(' ').toLowerCase();
      
      if (argpos.length == 0) usr = msg.author.id;
      usr = (msg.guild.members.find(um => {
        if (um.id.includes(argpos)) return true;
        if (um.displayName && um.displayName.toLowerCase().includes(argpos)) return true;
        if (um.username && um.username.toLowerCase().includes(argpos)) return true;
        if (um.user && um.user.tag.toLowerCase().includes(argpos)) return true;
        else return false;
      }) || {
        id: false
      }).id;
            if (argpos.length == 0 && !x.noself) usr = msg.author.id;
    }
    
    let res = usr ? await bot.users.fetch(usr) : false;
    if (!res && !x.noself) return msg.author;
    else return res;
    return res;
  },
  
  
  
  
  invertColor: function invertColor(hex, bw) {
    if (hex.indexOf('#') === 0) {
        hex = hex.slice(1);
    }
    // convert 3-digit hex to 6-digits.
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) {
        throw new Error('Invalid HEX color.');
    }
    var r = parseInt(hex.slice(0, 2), 16),
        g = parseInt(hex.slice(2, 4), 16),
        b = parseInt(hex.slice(4, 6), 16);
    if (bw) {       
        return (r * 0.299 + g * 0.587 + b * 0.114) > 186
            ? '#000000'
            : '#FFFFFF';
    }
    // invert color components
    r = (255 - r).toString(16);
    g = (255 - g).toString(16);
    b = (255 - b).toString(16);
    // pad each with zeros and return
    return "#" + padZero(r) + padZero(g) + padZero(b);
},

  getTier: async function getTier(Author,bot,m) {
    return (await userDB.findOne({id:Author.id},{donator:1}).lean().exec()).donator;

    /*return m.botUser.shard.broadcastEval('try{this.guilds.get("277391723322408960").member("'+Author.id+'").roles.map(r=>{return {"id":r.id,"name":r.name}})}catch(e){}')
  .then(hisroles=> {
hisroles=hisroles.find(x=>x)
        let emblem;
if(!hisroles)return false;
      if (hisroles.find(f=>f.name== "Aluminium")) {
        emblem = "aluminium"
      };
      if (hisroles.find(f=>f.name== "Iridium")) {

        emblem = "iridium"
      };
      if (hisroles.find(f=>f.name== "Palladium")) {
        emblem = "palladium"
      };
      if (hisroles.find(f=>f.name== "Uranium")) {
        emblem = "uranium"
      };
    return emblem;
})*/
  },
    getTagge: async function getTagge(Author,bot,m) {
    return bot.guilds.fetch('277391723322408960')
  .then(MEMB=> {
      
      let hisroles = MEMB.roles.map(r=>{return {"id":r.id,"name":r.name}})
      
hisroles=hisroles.find(x=>x)
        let emblem;
if(!hisroles)return false;
      if (hisroles.find(f=>f.id== "278985261231243266")) {
        return "moderatorplus";
      };
      if (hisroles.find(f=>f.id== "340531837606821899")) {
        return "moderatorplus";
      };
      if (hisroles.find(f=>f.id== "278985289605578752")) {
        return "moderator";
      };
      if (hisroles.find(f=>f.id== "345213323991842817")) {
        return "partner";
      };
      if (hisroles.find(f=>f.id== "397091492356685824")) {
        return "ambassador";
      };
      if (hisroles.find(f=>f.id== "278985519894102019")) {
        return "translator";
      };
      if (hisroles.find(f=>f.id== "278985326381498370")) {
        return "assistant";
      };
})
  },
  
    
    mmrand: function mmrand(string, fun,params){
        let rand = this.randomize(0,fun(string,{returnObjects:true}).length -1);
        return fun(string+"."+rand,params);
    },
    
  audit: async function audit(ID,amt,type,currency,transaction,to){
    
    if (amt == 0) return;
    
    to = to || "271394014358405121"
    type = type || "other"
    currency = currency || "RBN"
    transaction = transaction || "-"
    amt = Math.abs(Number(amt))
    
    let now = Date.now()
    let payload={
       from: to,
      transactionId: currency+md5(now+"_"+ID),
      timestamp: now,
      currency,type,amt,to:ID,transaction
    }      
    let embed = new this.RichEmbed
    embed.setTitle((transaction=="+"?'📥':'📤')+" New Transaction")
    embed.description = "`"+payload.transactionId+"`"
    embed.setColor(currency=='RBN'?'#cc2222':currency=='JDE'?'#33CcAa':currency=='SPH'?'#2255cc':'#eeeeaA')
    embed.addField('Author',`<@${ID}>` , true)
    embed.addField('Amount',transaction+amt , true)
    embed.addField('Currency',currency , true)
    embed.addField('Transaction Type',"`"+type+"`" , true)
    embed.addField(transaction=="+"?'From':'To',`<@${to}>` , true)
    embed.setTimestamp(now)
    embed.setFooter(ID)
    auditHook.send(embed)
    if(type==='give') auditHook.send(" :arrow_up: :arrow_up: :arrow_up: :arrow_up:");

/*
    auditHook.send("```js\n"+JSON.stringify(payload,null,2)+"```\n"+`
    ${ID} **${amt} ${currency}** >>\`${type}\`>> ${to}
    `);*/
    //await userDB.set(ID,{$push:{'audits':payload}});
      await audits.new(payload);
    
    if(to=="271394014358405121") {
      //await userDB.set("271394014358405121",{$push:{'audits':contrapayload}});
      
    } 
    
    return true;
  },
  
 calculateDaily:function calculateDaily(Author,bot) {
        let semibanned  = 1
        let penalised   = 5

let regular =   15 +1
let plastic =   16+1
let aluminium =  20 +1
let iron =  25+1
let carbon =  25+1
let lithium =   30+1
let iridium =   30+1
let palladium =   40+1
let zircon =  50+1
let uranium =   80+1
let astatine =  100+1

 




        let emblem;


           

           
           if(!Author.dDATA.donator) return {class:regular,emblem};
           if(Author.dDATA.donator == "plastic") return {class:plastic,emblem:"plastic"};
           if(Author.dDATA.donator == "aluminium") return {class:aluminium,emblem:"aluminium"};
           if(Author.dDATA.donator == "iron") return {class:iron,emblem:"iron"};
           if(Author.dDATA.donator == "carbon") return {class:carbon,emblem:"carbon"};
           if(Author.dDATA.donator == "lithium") return {class:lithium,emblem:"lithium"};
           if(Author.dDATA.donator == "iridium") return {class:iridium,emblem:"iridium"};
           if(Author.dDATA.donator == "palladium") return {class:palladium,emblem:"palladium"};
           if(Author.dDATA.donator == "zircon") return {class:zircon,emblem:"zircon"};
           if(Author.dDATA.donator == "uranium") return {class:uranium,emblem:"uranium"};
           if(Author.dDATA.donator == "astatine") return {class:astatine,emblem:"astatine"};
            else return {class:regular,emblem};
           

  },

  manageLimits: async function manageLimits(param,limit,TDATA,message){
    if(TDATA.limits && TDATA.limits[param] > limit){
      if(param == "blackjack") return true;
      return message.channel.send('**'+TDATA.name+' is ratelimited, try again tomorrow**')
    }else{
      if(!TDATA.limits || !TDATA.limits[param]){

        await userDB.set(TDATA.id,{$set:{['limits.'+param]:1}});
      }
        await userDB.set(TDATA.id,{$inc:{['limits.'+param]:1}});
        return false;
    }
  } ,

//Get Help
  autoHelper: function autoHelper(trigger,options){
    let message, P, M, key, cmd, opt;
    if(options&&typeof options=='object'){
      message = options.message || options.msg;
      M=message.content;
      P = {lngs:message.lang};
      key = options.opt;
      cmd=  options.cmd;
      opt=  options.opt;
    };

    if (    trigger.includes(message.content.split(/ +/)[1])
        ||  message.content.split(/ +/)[1]=="?"
        ||  message.content.split(/ +/)[1]=="help"
        || (message.content.split(/ +/).length==1&&trigger.includes('noargs'))
        ||  trigger==='force'
       ){
      this.usage(cmd,message,opt);
      return true;
    }else{
      return false;
    }
  },



//Get Index List
  getDirs : function getDirs(rootDir, cb) {
    fs.readdir(rootDir, function (err, files) {
        let dirs = [];
        for (let i = 0; i < files.length; ++i) {
            let file = files[i];
            if (file[0] !== '.') {
                let filePath = rootDir + '/' + file;
                fs.stat(filePath, function (err, stat) {
                    if (stat.isDirectory()) {
                        dirs.push(this.file);
                    }
                    if (files.length === (this.index + 1)) {
                        return cb(dirs);
                    }
                }.bind({
                    index: i,
                    file: file
                }));
            }
        }
    })
 },


gamechange : function gamechange(gamein = false) {
        try {
            if (gamein != false) return gamein;
            delete require.cache[require.resolve(`../resources/lists/playing.js`)];
            var gamelist = require("../resources/lists/playing.js");
            var max = gamelist.games.length-1
            var rand = this.randomize(0, max)

            return gamelist.games[rand]

        } catch (e) {}
    },

  randomize: function randomize(min, max) {
    let RAND = generator.random();
        RAND = generator.random();
        if(!max){
          max = min;
          min = 0;
        }
      return Math.floor(RAND * (max - min + 1) + min);
  },

  emoji: function emoji(emo,technical) {
    if(technical){
      return technical.shard.broadcastEval("this.emojis.get('"+emo+"')").then(x=>x.find(it=>it!=null))
    }

      delete require.cache[require.resolve(`../resources/lists/emoji.js`)];
      let emojia = require("../resources/lists/emoji.js");
      if (emojia[emo] === undefined) return "🅱";
      return emojia[emo];
  },

  //Get IMG from Channel MSGs
  getImg: async function getImg(message,nopool) {
    if((message.args[0]||"").startsWith("http")) return message.args[0]
    if (message.attachments.first()) return message.attachments.first().url;
    let sevmesgs = message.channel.messages;

    if(nopool)return;

    const messpool = sevmesgs.filter(mes => {
      try {
        if (mes.attachments) {
          if (mes.attachments.first().url) {
            return true
          }
        }
      } catch (e) {
        return false
      }
    });
    if (messpool.last()) return messpool.last().attachments.first().url;
    else return undefined
  },

  //-------------------------------------------------------------[CANVAS FUNCTIONS]
  //Readfile >> Canvas
  getCanvas: async function getCanvas(path) {
    let img = new Canvas.Image;
    img.src = await Pixly.createBuffer(path).then(buff => {
      return buff;
    });
    return img;
  },
    getBuffer: async function getBuffer(path) {
    return Pixly.createBuffer(path).then(buff => {
      return buff;
    });
  },

  //> Canvas Text Block
   block: async function block(base, text, font, color, W, H, options) {

     font = font || '14px Product,Sans'
     color = color || '#b4b4b4'
     base.font = font;
     W = W || 300;
     H = H || 200;
     const item = new Canvas.createCanvas(W, H);
     let c = item.getContext("2d");
     //c.antialias = 'subpixel';
     //c.filter = 'best';
     c.font = font;
     c.fillStyle = color;
     options = options || {
       font: font || "bold 25px Arial, sans-serif",
       textAlign: "left",
       verticalAlign: "top",
       lineBreak: "auto",
     };

     await wrap(item, text, options);
     return {item: item,height: H,width: W}; // <-- i think H and W are redundant, need to check later

   },

  //> Canvas Text Tag
   tag: function tag(base, text, font, color) {

            font = font || '14px Product,Sans'
            color = color || '#b4b4b4'
            base.font = font;

            let H = base.measureText(text).emHeightAscent
            let h = base.measureText(text).emHeightDescent;
            let w = base.measureText(text).width;
            const item = new Canvas.createCanvas(w, h + H);
                let c = item.getContext("2d")
                //c.antialias = 'subpixel';
                //c.filter = 'best';
                c.font = font;
                c.fillStyle = color;
                c.fillText(text, 0, H);
            return {item:item,height:h+H,width:w};// <-- same as above
        },
  //-------------------------------------------------------------[CANVAS END]


  //> Wait in Seconds
    wait: async function wait(time){
      time = typeof time == 'number' ?  time : 1000;
      return new Promise(resolve => {
          setTimeout(() => {
            resolve(true);
          },
          time*1000||1000);
      });
    },

 
    yield: function gear_yield(){
      return new Promise(resolve => setImmediate(resolve) );
    },

    miliarize: function miliarize(numstring,strict){
      try{
        if (typeof numstring == "number"){
            numstring = numstring.toString() || "0";
        };
        if(numstring.length < 4)return numstring;
        //-- -- -- -- --
        let stashe = numstring.replace(/\B(?=(\d{3})+(?!\d))/g, ".").toString();
        // Gibe precision pls
        if(strict){
            let stash = stashe.split(".")
        switch(stash.length){
            case 1:
                return stash;
            case 2:
                if(stash[1]!="000") break;
                return stash[0]+"K";
            case 3:
                if(stash[2]!="000") break;
                return stash[0]+"."+stash[1][0]+stash[1][1]+"Mi";
            case 4:
                if(stash[3]!="000") break;
                return stash[0]+"."+stash[1][0]+stash[1][1]+"Bi";
             }
            return stashe;
        };
        // Precision is not a concern
        stash = stashe.split(".")
        switch(stash.length){
            case 1:
                return stash.join(" ");
            case 2:
                if(stash[0].length<=1) break;
                return stash[0]+"K";
            case 3:
                return stash[0]+"Mi";
            case 4:
                return stash[0]+"Bi";
             }
         return stashe;
    }catch(err){
      return "---"
    }
    },


  //===============[ARCH PIPES]===================//
    usage: function usage(cmd, m, third) {
      delete require.cache[require.resolve("./archetypes/usage.js")];
      let usage = require("./archetypes/usage.js");
      usage.run(cmd, m, third);
    },
     dropGoodies: function (a, b, c) {
       delete require.cache[require.resolve("./archetypes/drops.js")];
       let drops = require("./archetypes/drops.js");
       return drops.runb(a, b, c);
     },
  //===============[pipes-end]===================//





    sendLog: function sendLog(args){
      //PLES
      let P = args.payload;
      let L = args.logType;
      let E = args.event;
      let S = args.server;

      serverDB.findOne({id:S.id},{"modules.LOCALRANKx":0}).then(DBDATA=>{
          if(!DBDATA)return;
          if (DBDATA.logs[L][E]===false)return;
          delete require.cache[require.resolve("./modules/dev/log.js")];
          let logger = require("./modules/dev/log.js");
          logger.init(E,L,S,DBDATA,P);
        }).catch(e=>{
        console.log("===========LOG ERROR==============");
        console.log(S);
        console.log('----------');
        console.error(e);
        console.log("==================================");
        //serverDB.findOneAndUpdate({id:sv.id},{$set:{logs:def.logItems}}) <== fuck
        });
    },

  //==============[LEGACY (Pollux v3/v4 "RubyRuby/Meido" Cogs)]=============//

    sendLog_legacy: function sendLog_legacy(eve,logtype,sv,DB,extra,alt,arg,nise){
      //console.warn("Deprecation warning: This is a Legacy Function")
      try{
        DB.findOne({id:sv.id}).then(DBDATA=>{
          if(!DBDATA)return;
          if (DBDATA.logs[logtype][eve]==false)return;
      delete require.cache[require.resolve("./modules/dev/log.js")]
          let a = require("./modules/dev/log.js")
        a.init(eve,logtype,sv,DBDATA,extra,alt,arg,nise)
        }).catch(e=>{

        console.log("=============ERROR================")
        console.log(sv)
        console.error(e)
        console.log("==================================")

        DB.findOneAndUpdate({id:sv.id},{$set:{logs:def.logItems}})
        })
      }catch(e){
        try{
          //require("./functions.js").run("normalize",sv,{def_type:"gdfal",parma:"logs"})
        }catch(e){

        }
      }

    },
    checkGoods: function checkGoods(amount, invoker) {
      //console.warn("Deprecation warning: This is a Legacy Function")
      try{

        if (invoker.dDATA.modules.rubines >= amount) {
            return true;
        } else {
            return false;
        }
      }catch(e){
        console.log("problem with dDATA on invoker",e)
         userDB.findOne({id:invoker.id}).lean().exec().then(DDTA=>{
           if(DDTA.modules.rubines >= amount) return true;
            else return false
      });
      }
    },
    hasPerms:   function hasPerms(Member,SVDATA) {
  
      
        //console.warn("Deprecation warning: This is a Legacy Function")
        if(Member.id =="88120564400553984" ) return true;
        let Server = Member.guild
        let modPass = false;
      
        if(SVDATA.modules && SVDATA.modules.MODROLE){
            modPass = Member.roles.has(SVDATA.modules.MODROLE);
        }

        
        if (Server.ownerID === Member.id || Member.hasPermission("ADMINISTRATOR")) {
            modPass = true;
        };

        if (Member.hasPermission("MANAGE_GUILD")) {
            modPass = true;
        };
        return modPass;
    },
    updatePerms: function updatePerms(tgt, Server, DaB) {
      try {

        switch (true) {
          case Server.member(tgt).id == Server.ownerID:
            return 0;
            break;
          case Server.member(tgt).hasPermission("ADMINISTRATOR"):
          case Server.member(tgt).hasPermission("MANAGE_GUILD"):
            return 1;
            break;
          case Server.member(tgt).hasPermission("KICK_MEMBERS"):
          case Server.member(tgt).hasPermission("MANAGE_CHANNELS"):
            return 2;
            break;
          default:
            return 3;
            break;
        };

        serverDB.findOne({
          id: Server.id
        },{"modules.LOCALRANKx":0}).then(SDATA=>{
          if (SDATA.modules.MODROLE) {
            if (Server.member(tgt).roles.has(SDATA.modules.MODROLE)) {
              return 2;
            }
          }
        });
      } catch (e) {
        console.error(e)
      };
    },


  //===============[LEGACY (Pollux Zero/1.0 "Arturia/Falk" Cogs)]==============//
      getFlair: function getFlair(origin, target) {
        //console.warn("Deprecation warning: This is a Legacy Function");
        try {

            let modRole = origin.guild.roles.find("name", "MOD");
            let admRole = origin.guild.roles.find("name", "ADM");
            let maidRole = origin.guild.roles.find("name", "🎀   Maids");

            if (origin.guild.member(target).roles.has(admRole.id)) {
                return "ADM";
            } else if (origin.guild.member(target).roles.has(modRole.id)) {
                return "MOD";
            } else if (origin.guild.member(target).roles.has(maidRole.id)) {
                return "MAID";
            } else if (target.bot) {
                return "BOT";
            } else {
                return "none";
            }
        } catch (err) {

            if (target.id == origin.guild.ownerID) return "ADM";
            if (origin.guild.member(target).hasPermission("ADMINISTRATOR")) return "ADM";
            if (origin.guild.member(target).hasPermission("MANAGE_GUILD")) return "MOD";
            if (origin.guild.member(target).hasPermission("KICK_MEMBERS")) return "MOD";
            if (target.bot) return "BOT";
            return "none"
        }
    },
      glassify: function glassify(img, call, msg = false) {
          //console.warn("Deprecation warning: This is a Legacy Function");
            Jimp.read(img).then(function (user) {

                Jimp.read(paths.BUILD + "glass.png").then(function (glass) {
                    Jimp.read(paths.BUILD + "note.png").then(function (lenna) {

                        user.resize(126, 126)
                        user.mask(glass, 0, 0)
                        var air = {}
                        Jimp.read(paths.BUILD + "note.png").then(function (lennaB) {
                            lennaB.composite(user, 0, 0)
                            lennaB.mask(lenna, 0, 0)

                            //lennaB.write(`${paths.GLASS}/${call}.png`);
                            //log("Glassify Done")
                        });
                    });
                })
            });
        },
      shuffle:  function shuffle(array) {
        //console.warn("Deprecation warning: This is a Legacy Function")
        var currentIndex = array.length,
            temporaryValue, randomIndex;
        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    },
  capitalize: function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

}

