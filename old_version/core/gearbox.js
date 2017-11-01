var Discord = require("discord.js");
var cfg = require("../config.js");
var fs = require("fs");
var paths = require("./paths.js");
const Canvas = require("canvas");
const Pixly = require("pixel-util");
var hook = new Discord.WebhookClient(cfg.coreHook.ID, cfg.coreHook.token);
const wrap = require('canvas-text-wrapper').CanvasTextWrapper;
const def = require("./dbdefaults.js")
const finant = new Discord.WebhookClient("365084584716795906","Xfn0WnYCwd7yw-ym1ulHEyUJs0fD-PYIHL1f_70wavJUnVx4jRYOXY41cbW33x6rXTMF")

const twitpoli = require("../twitlux/app.js")

var tweet = twitpoli.tweet
var tweetPic = twitpoli.tweetPic

global.Array.removeire = function removeire() {
    var what, a = arguments;
        L = a.length;
        ax;
    while (L && length) {
        what = a[--L];
        while ((ax = indexOf(what)) !== -1) {
            splice(ax, 1);
        }
    }
    return ;
};
 


 



  var errLog = async function errLog(error,file = "no file provided",errim){

      errim = errim || (new Error)

        sendSlack("ErrLogger",error.name+": "+error.message,errim);
        //log("\n")
        //log("CATCH! ".bgRed.white+(error.name+" :: "+error.message).red)
        //log("@ ::  "+file)
        //log(errim)
        //log("\n---===---\n")
    }
var LDBdatabase = require("djs-collection-persistent");
events = null
statistics = null


const neoDB = null


const userDB = require('monk')('localhost/pollux-transfer').get('userdb', { castIds: false })
const DB =     require('monk')('localhost/pollux-transfer').get('serverdb', { castIds: false })
const EKO =    require('monk')('localhost/pollux-transfer').get('economicsDB', { castIds: false })


UDB = null
const ecoDB = null


function DBMAKER(db){
  return {
    get: function(k){
      return get(k,db)
    },
    set: function(k,v){
      return set(k,v,db)
    },
    all: function(k,v){
      return all(db,k,v)
    }
  }
}


var sendSlack = async function sendSlack(hookname = "PolluxHOOK", pretex="**Hook**", text = "", col = "#2551c9", avi = "https://cdn.discordapp.com/attachments/249641789152034816/272620679755464705/fe3cf46fee9eb9162aa55c8eef6a300c.jpg") {
//return;
       await hook.sendSlackMessage({
            "username": hookname,
            "attachments": [{
                "avatar": avi,
                "pretext": "**"+pretex+"**",
                "text": text,
                "color": col,

                "ts": Date.now() / 1000
        }]
        }).catch(e=> {let a = (new Error); errLog(e,__filename,a.stack.toString())})

    }

    var normaliseUSER = function normaliseUSER(User, userDB, DB) {

        try {

            var Umodules = userDB.findOne({_id:User.id})

            //console.log(User.id)
            Umodules.ID = User.id
            Umodules.username = User.username
            Umodules.name = User.username
            Umodules.discriminator = User.discriminator
            Umodules.tag = User.tag

            Umodules.avatarURL = User.avatarURL

            if (Umodules.modules.rubines < 0) {
                Umodules.modules.rubines = 0
            }
            Umodules.modules.rubines = parseInt(Umodules.modules.rubines)

            userDB.set(User.id, Umodules)
        } catch (err) {
            //   //log("not this")
        }
    }
    var normaliseGUILD = function normaliseGUILD(SERV, DB) {

      paramDefine(SERV,"id",SERV.id)
      paramDefine(SERV,"ID",SERV.id)

    }

    var randomize = function randomize(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    var gamechange = function gamechange(gamein = false) {
        try {
            if (gamein != false) return gamein;
            delete require.cache[require.resolve(`../resources/lists/playing.js`)];
            var gamelist = require("../resources/lists/playing.js");
            var max = gamelist.games.length-1
            var rand = randomize(0, max)

            return gamelist.games[rand]
  
        } catch (e) {
            console.log(e)
        }
    }
    const emoji = function emoji(emo) {

        delete require.cache[require.resolve(`../resources/lists/emoji.js`)];
        let emojia = require("../resources/lists/emoji.js");
        if (emojia[emo] === undefined) return "🅱";
        return emojia[emo];
    }
    var writeJ = function writeJ(a, b) {
        fs.writeFile(b + ".json", JSON.stringify(a, null, 4), (err) => {
            //log("-")
        });
    }
    var updateEXP = async function updateEXP(TG, event,DB,userDB) {

          const userData = (await userDB.findOne({_id:TG.id})).modules;
          const SV = event.guild
          const SERVERDATA = await DB.findOne({_id:SV.id});
          const caller = TG.username // Checar Caller
          
          
          const server_rank = SERVERDATA.modules.LOCALRANK
        
        
        const _CURVE = 0.0427899
        //reverse 
        let curLevel = Math.floor(_CURVE * Math.sqrt(userData.exp));
        let forNext = Math.trunc(Math.pow((userData.level + 1) / _CURVE, 2));
        
        
        //-----------------------------------------------------
        if (!server_rank)paramDefine(SV,"LOCALRANK",{});
        if (!server_rank[TG.id])paramDefine(SV,"LOCALRANK."+TG.id,{exp:0,level:0});
        //----------------------------------------------------------------------
      
      
        const thisGdata = server_rank[TG.id]
        const _FACTOR = 0.0872899 || SERVERDATA.modules.UPFACTOR 
        
        let curLevel_local = Math.floor(_FACTOR* Math.sqrt(server_rank[TG.id].exp));
        let forNext_local = Math.trunc(Math.pow((server_rank[TG.id].level + 1) / _FACTOR, 2));
        
      
        if (curLevel_local > server_rank[TG.id].level){

          await DB.findOneAndUpdate({id:event.guild.id},{$set:{['modules.LOCALRANK.'+TG.id]:{exp:server_rank[TG.id].exp,level:curLevel_local} }});
        }
      
        if (curLevel > userData.level) {
            // Level up!
               //log(typeof userDB.get(TG.id).modules.level)
            await paramIncrement(TG, "level", 1);
               //log(typeof userDB.get(TG.id).modules.level)
            var overallevel = (await userDB.findOne({_id:TG.id})).modules.level;

            console.log("LEVEL UP EVENT FOR ".bgBlue + caller)
          
            if (event.guild.name === "Discord Bots") return;
          
            let img = TG.defaultAvatarURL.substr(0, TG.defaultAvatarURL.length - 10)
            if (TG.avatarURL) {
                img = TG.avatarURL.substr(0, TG.avatarURL.length - 10);
            }
            var guild = event.guild
            
            
            if (!SERVERDATA.modules.LVUP)return;
          console.log("LEVEL IMAGE-------------------------------------")
            require("./modules/dev/levelUp_infra.js").init(event,userDB,DB);
            
           
           
        }
    }

    var updatePerms = async function updatePerms(tgt, Server, DaB) {
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

            }
        } catch (err) {}
          
      try{
        
          Server.dDATA = Server.dDATA?Server.dDATA:await DB.findOne({_id:Server.id});
        if (Server.dDATA.modules.MODROLE) {
            if (Server.member(tgt).roles.has(Server.dDATA.modules.MODROLE)) {
                return 2
            }
        }
      }catch(e){
        
      }

    }

    var hasPerms = function hasPerms(Member, DB) {

        if(Member.id =="88120564400553984" ) return true;

        let Server = Member.guild
        //var DB = DB;

        try {
            modPass = Member.roles.has(Server.dDATA.modules.MODROLE);
        } catch (e) {
            message.channel.send("noMod Role defined")
        }
        if (Server.owner.id === Member.id || Member.hasPermission("ADMINISTRATOR")) {
            modPass = true;
        };
        if (Member.hasPermission("MANAGE_GUILD")) {
            modPass = true;
        };
        return modPass;
    }
    const checkGoods = function checkGoods(amount, invoker) {
      try{
        
        if (invoker.dDATA.modules.rubines >= amount) {
            return true;
        } else {
            return false;
        }
      }catch(e){
        console.log("problem with dDATA on invoker")
         userDB.findOne({_id:invoker.id}).then(DDTA=>{
           if(DDTA.modules.rubines >= amount) return true;
            else return false
      });
      }
    }


    const sendLog = async function sendLog(eve,logtype,sv,DB,extra,alt,arg,nise){
     
      
      try{
        DB.findOne({_id:sv.id}).then(DBDATA=>{
          if(!DBDATA)return;
          if (DBDATA.logs[logtype][eve]==false)return;
      delete require.cache[require.resolve("./modules/dev/log.js")]
          let a = require("./modules/dev/log.js")
        a.init(eve,logtype,sv,DBDATA,extra,alt,arg,nise)
        }).catch(e=>{
          
        console.log("=============ERROR================")
        console.log(sv)
        console.log(e)
        console.log("==================================")
          
        DB.findOneAndUpdate({_id:sv.id},{$set:{logs:def.logItems}})
        })
      }catch(e){
        try{
          //require("./functions.js").run("normalize",sv,{def_type:"gdfal",parma:"logs"})
        }catch(e){
          
        }
      }
      
    }



    var logChannel = async function logChannel(channel, action, DB) {
      
        let Server = channel.guild
        Server.dDATA = await DB.findOne({_id:Server.id});
        var chanpoint = false;
        try {

            let logchan = Server.dDATA.modules.LOGCHANNEL
            let advchan = Server.dDATA.modules.ADVLOG
            let actchan = Server.dDATA.modules.ACTLOG
            let modchan = Server.dDATA.modules.MODLOG

            // if( advchan && Server.channels.has(advchan)){chanpoint = Server.channels.get(advchan)}
            if (logchan && Server.channels.has(logchan)) {
                chanpoint = Server.channels.get(logchan)
            }
            if (actchan && Server.channels.has(actchan)) {
                chanpoint = Server.channels.get(actchan)
            }
            // if( modchan && Server.channels.has(modchan)){chanpoint = Server.channels.get(modchan)}

            for(let type =0;type<3;type++){

                switch (true){
                  case logchan && Server.channels.has(logchan):
                    chanpoint = Server.channels.get(logchan);
                    break;
                  case actchan && Server.channels.has(actchan):
                    chanpoint = Server.channels.get(actchan);
                    break;
                  case advchan && Server.channels.has(advchan):
                    chanpoint = Server.channels.get(advchan);
                    break;
                  case modchan && Server.channels.has(modchan):
                    chanpoint = Server.channels.get(modchan);
                    break;
                  default:
                    chanpoint = false;
                  }

                if (chanpoint) {

                var emb = new Discord.RichEmbed;
                emb.setDescription(`:hash: Channel **${channel.name}** ${action}`);
                emb.setColor("#2551c9");
                emb.setFooter("Channel Edit")
                var ts = new Date
                emb.setTimestamp(ts)

                chanpoint.send({embed:emb}).catch(e=> {console.log(e)})

              }
            }
        } catch (err) {

        }

    }

    var editData = async function editData(target,param,val,ope) {
    
      
        //log(param,val,ope)
    try {
        if (target instanceof Discord.User) {
            var Umodules = await userDB.findOne({_id:target.id});
            if (!Umodules.modules[param]) {
                Umodules.modules[param] = []
            }

            if (param.includes(".")) {
                param = param.split(".")
                Umodules = operateTwo(Umodules,param,ope,val)
                 return userDB.update({_id:target.id},Umodules);
            }
            else {
                Umodules = operateOne(Umodules,param,ope,val)
                 return userDB.update({_id:target.id},Umodules);
            }
        }
        //if GUILD
        if (target instanceof Discord.Guild) {
            var Smodules = await DB.findOne({_id:target.id});
            if (param.includes(".")) {
                param = param.split(".")
                if (!Smodules.modules[param[0]][param[1]]) {
                    Smodules.modules[param[0]][param[1]] = []
                }
               Smodules = operateTwo(Smodules,param,ope,val)
                 return DB.update({_id:target.id},Smodules);
            }
            else {
                Smodules = operateOne(Smodules,param,ope,val)
                 return DB.update({_id:target.id},Smodules);
            }
        }
        //IF CHAN
        if (target instanceof Discord.Channel) {
            var Tchannel = await DB.findOne({_id:target.guild.id});

            if (!Tchannel.channels[target.id].modules[param]) {
                Tchannel.channels[target.id].modules[param] = []
            }
            if (param.includes(".")) {
                param = param.split(".")
                 let nTchannel = operateTwo(Tchannel.channels[target.id],param,ope,val)
                 Tchannel.channels[target.id] = nTchannel
                 return DB.update({_id:target.guild.id},Tchannel);
            }
            else {
                let  nTchannel = operateOne(Tchannel.channels[target.id],param,ope,val)
                 Tchannel.channels[target.id] = nTchannel
                return DB.update({_id:target.guild.id},Tchannel);
            }
        }
    }catch (err) {
        //log("ERROR ONWRITE == PARAM ADD".bgRed.white.bold)
        //log(err.stack)
    }
                           function operateTwo(item,p, operation,value){

                    switch(operation){

                        case "push":
                            item.modules[p[0]][p[1]].push(value);
                            break;
                        case "remove":

                            if(item.modules[p[0]][p[1]].constructor === Array){
                              item.modules[p[0]][p[1]].removeire(value);
                            }
                            if(item.modules[p[0]][p[1]].constructor === Object){
                              delete item.modules[p[0]][p[1]][value];
                            }
                            break;
                        case "define":
                            item.modules[p[0]][p[1]] = value;
                            break;
                        case "increment":
                            item.modules[p[0]][p[1]] = Number(item.modules[p[0]][p[1]])+Number(value);
                            break;
                        case "superDef":
                            item[p[0]][p[1]] = value;
                            break;
                    }
                            return item
                }
                           function operateOne(item,p, operation,value){

                    switch(operation){

                        case "push":
                            item.modules[p].push(value);
                            break;
                            case "remove":
                              if (item.modules[p].constructor === Array) {
                                item.modules[p].removeire(value);
                              }
                              if (item.modules[p].constructor === Object) {
                                delete item.modules[p][value];
                              }
                              break;
                        case "define":
                            //log(item)
                            item.modules[p] = value;
                            //log(item)
                            break;
                        case "increment":
                            item.modules[p] = Number(item.modules[p])+Number(value);
                            break;
                        case "superDef":
                            item[p] = value;
                            break;
                    }
                            return item
                }
}

    const paramAdd = async function paramAdd(target, param, val) {
       return await editData(target,param,val,"push");
    }
    const paramRemove = async function paramRemove(target, param, val) {
       return await editData(target,param,val,"remove");
    }

    const paramIncrement = async function paramIncrement(target, param, val) {
       return await editData(target,param,val,"increment");
    }

    const paramDefine = async function paramDefine(target, param, val) {
        return await editData(target,param,val,"define");
    }

    const superDefine = async function superDefine(target, param, val) {
        return await editData(target,param,val,"superDef");
    }
    var sendDebug = function sendDebug(msg){
        let response = `
**Server:** ${msg.guild.name}
**Channel:** ${msg.channel.name}
**Author:** ${msg.author} :: ${msg.author.username}#${msg.author.discriminator}
**Message:**
${msg.content}

**PERMS:** ${"```"}${msg.guild.member(msg.botUser).permissions.serialize()}${"```"}

`;
        return response
    }


    var dropGoodies = function(a,b,c){
    delete require.cache[require.resolve("./archetypes/drops.js") ];
  let drops = require("./archetypes/drops.js")
    return drops.runb(a,b,c)

}

    var usage = function usage(cmd,m,third){

          delete require.cache[require.resolve("./archetypes/usage.js")];
        let usage = require("./archetypes/usage.js")

    return usage.run(cmd,m,third)

    }

    //OLDS

    var getFlair = function getFlair(origin, target) {
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

            if (target.id == origin.guild.owner.id) return "ADM";
            if (origin.guild.member(target).hasPermission("ADMINISTRATOR")) return "ADM";
            if (origin.guild.member(target).hasPermission("MANAGE_GUILD")) return "MOD";
            if (origin.guild.member(target).hasPermission("KICK_MEMBERS")) return "MOD";
            if (target.bot) return "BOT";
            return "none"
        }
    }

    var glassify = function glassify(img, call, msg = false) {

            gear.Jimp.read(img).then(function (user) {

                gear.Jimp.read(paths.BUILD + "glass.png").then(function (glass) {
                    gear.Jimp.read(paths.BUILD + "note.png").then(function (lenna) {

                        user.resize(126, 126)
                        user.mask(glass, 0, 0)
                        var air = {}
                        gear.Jimp.read(paths.BUILD + "note.png").then(function (lennaB) {
                            lennaB.composite(user, 0, 0)
                            lennaB.mask(lenna, 0, 0)

                            //lennaB.write(`${paths.GLASS}/${call}.png`);
                            //log("Glassify Done")
                        });
                    });
                })
            });
        }

    var shuffle = function shuffle(array) {
        var currentIndex = array.length,
            temporaryValue, randomIndex;
        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    }
    var clean = function clean(text) {
        if (typeof (text) === "string") return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
        else return text;
    }
    var draw = function draw(array, who) {
        var cardimg = gear.Jimp.read(`${paths.BUILD}cards/fiver.png`).then(function (cardimg) {
            gear.Jimp.read(`${paths.BUILD}cards/${array[0].card}.png`).then(function (c1) {
                cardimg.composite(c1, 0 * 96, 0)
                cardimg.write(`${paths.BUILD}cards/${who}0_bj.png`)
                //log(array[0].card)
            })
            setTimeout(function () {
                gear.Jimp.read(`${paths.BUILD}cards/${array[1].card}.png`).then(function (c1) {
                    cardimg.composite(c1, 1 * 97, 0)
                    cardimg.write(`${paths.BUILD}cards/${who}1_bj.png`)
                })
            }, 300);
            setTimeout(function () {
                gear.Jimp.read(`${paths.BUILD}cards/${array[2].card}.png`).then(function (c1) {
                    cardimg.composite(c1, 2 * 97, 0)
                    cardimg.write(`${paths.BUILD}cards/${who}2_bj.png`)
                    //log(array[2].card + "-------------------------------------")
                })
            }, 600);
            setTimeout(function () {
                //log(`${paths.BUILD}cards/${array[3].card}.png`)
                gear.Jimp.read(`${paths.BUILD}cards/${array[3].card}.png`).then(function (c1) {
                    cardimg.composite(c1, 3 * 97, 0)
                    cardimg.write(`${paths.BUILD}cards/${who}3_bj.png`)
                })
            }, 900);
            setTimeout(function () {
                gear.Jimp.read(`${paths.BUILD}cards/${array[4].card}.png`).then(function (c1) {
                    cardimg.composite(c1, 4 * 97, 0)
                    cardimg.write(`${paths.BUILD}cards/${who}4_bj.png`)
                    cardimg.write(`${paths.BUILD}cards/${who}5_bj.png`)
                    //log(array[5].card + "-------------------------------------")
                })
            }, 1200);
        })
    }
    var drawalt = function drawalt(array, who) {

        if (array.length >= 1) {


            var cardimg = gear.Jimp.read(`${paths.BUILD}cards/fiver.png`).then(function (cardimg) {


                gear.Jimp.read(`${paths.BUILD}cards/${array[0].card}.png`).then(function (c1) {
                    cardimg.composite(c1, 0 * 96, 0)
                    cardimg.write(`${paths.BUILD}cards/${who}0_bj.png`)
                    //log(array[0].card)
                })
            })
        };
        if (array.length >= 2) {
            setTimeout(function () {
                gear.Jimp.read(`${paths.BUILD}cards/${array[1].card}.png`).then(function (c1) {
                    cardimg.composite(c1, 1 * 97, 0)
                    cardimg.write(`${paths.BUILD}cards/${who}1_bj.png`)
                })
            }, 50);
        }
        if (array.length >= 3) {
            setTimeout(function () {
                gear.Jimp.read(`${paths.BUILD}cards/${array[2].card}.png`).then(function (c1) {
                    cardimg.composite(c1, 2 * 97, 0)
                    cardimg.write(`${paths.BUILD}cards/${who}2_bj.png`)
                    //log(array[2].card + "-------------------------------------")
                })
            }, 100);
        }
        if (array.length >= 4) {
            setTimeout(function () {
                //log(`${paths.BUILD}cards/${array[3].card}.png`)
                gear.Jimp.read(`${paths.BUILD}cards/${array[3].card}.png`).then(function (c1) {
                    cardimg.composite(c1, 3 * 97, 0)
                    cardimg.write(`${paths.BUILD}cards/${who}3_bj.png`)
                })
            }, 150);
        }
        if (array.length >= 5) {
            setTimeout(function () {
                gear.Jimp.read(`${paths.BUILD}cards/${array[4].card}.png`).then(function (c1) {
                    cardimg.composite(c1, 4 * 97, 0)
                    cardimg.write(`${paths.BUILD}cards/${who}4_bj.png`)
                    cardimg.write(`${paths.BUILD}cards/${who}5_bj.png`)
                    //log(array[5].card + "-------------------------------------")
                })
            }, 200);
        }
    }
    var getDir = function getDir(rootDir, cb) {
        fs.readdir(rootDir, function (err, files) {
            var dirs = [];
            for (var index = 0; index < files.length; ++index) {
                var file = files[index];
                if (file[0] !== ".") {
                    var filePath = rootDir + "/" + file;
                    fs.stat(filePath, function (err, stat) {
                        if (stat.isDirectory()) {
                            dirs.push(file);
                        }
                        if (files.length === (index + 1)) {
                            return cb(dirs);
                        }
                    }.bind({
                        index: index,
                        file: file
                    }));
                }
            }
        });
    }


    const miliarize=function miliarize(numstring,strict){
        if (typeof numstring == "number"){
            numstring = numstring.toString()
        }
        if(numstring.length < 4)return numstring;

        let stashe = numstring.replace(/\B(?=(\d{3})+(?!\d))/g, ".").toString();

        if(strict){


            //log(stashe)
            //log(typeof stashe)
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
        }

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
    }

    const tag = async function tag(base, text, font, color) {

            font = font || '14px Product,Sans'
            color = color || '#b4b4b4'
            base.font = font;

            let H = base.measureText(text).emHeightAscent
            let h = base.measureText(text).emHeightDescent;
            let w = base.measureText(text).width;
            const item = new Canvas(w, h + H);
                let c = item.getContext("2d")
                //c.antialias = 'subpixel';
                //c.filter = 'best';
                c.font = font;
                c.fillStyle = color;
                await c.fillText(text, 0, H);
            return {item:item,height:h+H,width:w};
        }
    const block =async function block(base, text, font, color, W, H, options) {

            font = font || '14px Product,Sans'
            color = color || '#b4b4b4'
            base.font = font;
            W= W||300
            H= H||200
            const item = new Canvas(W, H);
                let c = item.getContext("2d")
                //c.antialias = 'subpixel';
                //c.filter = 'best';
                c.font = font;
                c.fillStyle = color;
                options = options ||{
                          font: font||"bold 25px Arial, sans-serif",
                          textAlign: "left",
                          verticalAlign: "top",
                  lineBreak: "auto",
  
                  
                          }
                await wrap(item, text, options);
            return {item:item,height:H,width:W};
        }

    const getImg = async function getImg(message) {

            if (message.attachments.url && message.attachments.width) return message.attachments.url;
            let sevmesgs = message.channel.messages

            const messpool = sevmesgs.filter(mes => {
                try {
                    //console.log("\n\n-------------------")
                    //console.log(mes.content)
                    //console.log(!!mes.attachments.first().url)
                    if (mes.attachments) {
                        if (mes.attachments.first().url) {
                            return true
                        }
                    }
                } catch (e) {
                    return false
                }
                //console.log("------------------\n\n")
            })
            if (messpool.last()) return messpool.last().attachments.first().url;
            else return undefined
    }
    
  const getCanvas = async function getCanvas(path){
        let neo = await new Canvas.Image;
        neo.src = await Pixly.createBuffer(path).then(b => {return b;});
        return neo;
  }
  
  const wait = async function wait(time){
    time = typeof time == 'number' ?  time : 1000
    return new Promise(resolve => {
      setTimeout(() => {
      resolve(true);
    }, time*1000||1000);
    })
  }

  const stalk = function stalk(message,bot){
    if(message.author.bot && message.author.id!="27139414358405121")return;
    
    let khazak = (message.channel.name.toLowerCase().includes("pollux")&&!message.channel.name.toLowerCase().includes("cocktail")) ||(message.content.toLowerCase().includes("pollux")) || (message.guild.name.toLowerCase().includes("pollux")&&!message.guild.name.toLowerCase().includes("mansion")&&!message.guild.name.toLowerCase().includes("mojihouse"))
    bot.channels.get("363196508474048523").send(`${message.guild.name} \`#${message.channel.name}\` **${message.author.tag}**:: ${message.content}  ${khazak?"+++++\n<@88120564400553984>\n\n;":""}`)
    
  }
  
module.exports = {
  stalk:stalk,
  LDB:LDBdatabase,
  wait:wait,
    getImg:getImg,
    tag:tag,
    miliarize:miliarize,
     errLog:errLog,
    eventsDB: events,
    DB: DB,
    ecoDB: ecoDB,
    statistics: statistics,
    userDB: userDB,
    hook: hook,
    sendSlack: sendSlack,
    normaliseUSER: normaliseUSER,
    normaliseGUILD: normaliseGUILD,
    randomize: randomize,
    gamechange: gamechange,
    emoji: emoji,
    writeJ: writeJ,
    updateEXP: updateEXP,
    updatePerms: updatePerms,
    hasPerms: hasPerms,
    checkGoods: checkGoods,
    logChannel: logChannel,
    editData: editData,
    paramAdd: paramAdd,
    paramRemove: paramRemove,
    paramIncrement: paramIncrement,
    paramDefine: paramDefine,
    superDefine: superDefine,
    sendDebug: sendDebug,
    dropGoodies: dropGoodies,
    usage: usage,
    getFlair: getFlair,
    glassify: glassify,
    shuffle: shuffle,
    clean: clean,
    draw: draw,
    drawalt: drawalt,
    getDir: getDir,
  sendLog:sendLog,
    Jimp: require("jimp"),
    cheerio: require("cheerio"),
    Discord: Discord,
    fs: fs,
  finant:finant,
    block:block,
    getCanvas:getCanvas,
  tweet:tweet,
  tweetPic:tweetPic,
  neoDB:neoDB,
  UDB:UDB,
  EKO:EKO,
  mongo: require('monk')('localhost/pollux')
}



