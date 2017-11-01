
const polx = require("../pollux.js")
const stuff = require("../stuff.js")
const fx = require("../core/functions.js")  // Database Defaults



module.exports = {
  
  run: async function run(gear, DB, userDB, bot, message) {
      
    
    if(bot.tap&&(message.channel.id==bot.tap||message.guild.id==bot.tap)){
      
        
      let X = `:vhs: **${message.guild.name}**#\`${message.channel.name}\`:: **__${message.author.tag}__** :${message.content}`
        
      
      
      bot.channels.get(bot.taplisten).send(X)  
    }
    
    
   
      if (message.channel.type == 'dm' && message.content === "halloween") {
        message.reply("Use `p!halloween` in the server(s) you want to entry for this event!")
      }
    try{

      var cdd = false


      let cooldown = false;
      //var ector = bot.ector

      //COOLDOWNS-----------------------------------------------------------//
      var cd = function (argamassa, fx, timeout, respfn) {
        var onCooldown = false;
        return function () {
          if (!onCooldown) {
            fx.apply(argamassa, arguments);
            onCooldown = true;
            try {

              setTimeout(function () {
                onCooldown = false;
              }, timeout || 10000);
            } catch (err) {
              onCooldown = false;
              //console.log("HERE")
              console.error
            }

          } else {
            try {
              respfn()
            } catch (err) {}
          }
        }
      } //
      //-------------------------------------------------------------------//

      var gibexp = cd(console, gear.paramIncrement, 8000);
      var plzDrop = cd(console, gear.dropGoodies, 150000);

      //Set Them Up
      var Server = message.guild;
      var Channel = message.channel;
      var Author = message.author;
      var Target = message.mentions.users.first() || Author;
      var MSG = message.content;
      let aut_server_rank

      if(!Server)return;
      
      DB.findOne({_id:Server.id}).then(async SERVERDATA=>{
           if (!SERVERDATA||!SERVERDATA.modules){        
        await fx.run("guildSetup", Server).catch(e=>{
          message.reply("Error")
        });
        SERVERDATA = await DB.findOne({_id:Server.id});
      }
                



        
      let USERDATA = await userDB.findOne({_id:Author.id});
           if (!USERDATA){
        await fx.run("userSetup", Author);
        USERDATA = await userDB.findOne({_id:Author.id});
      }
        
        
        
      let TARGETDATA = await userDB.findOne({_id:Target.id});
      if (!TARGETDATA){
        await fx.run("userSetup", Target);
        TARGETDATA = await userDB.findOne({_id:Author.id});
      }
        
        
      let CHANDATA;
        try{
          CHANDATA = SERVERDATA.channels[Channel.id];
        }catch(e){
          
        }      
      if (!CHANDATA){ 
        await fx.run("channelSetup", Channel);
        SERVERDATA = await DB.findOne({_id:Server.id});
        CHANDATA = SERVERDATA.channels[Channel.id]
      }
      



    
      
      var cooldownDrop = false
      
if(message.mentions.users.size+message.mentions.roles.size >= 6){
    return;
    message.delete().catch(e => {
        console.log(e)
        console.log("POLLUX 415".red)
    })
    message.channel.send(":warning: SPAM PROTECTION TRIGGERED :warning:")
    Server.member(message.author).ban().then(e=>message.channel.send(message.author+" kicked for Mention Spam above 5")).catch(a=>message.channel.send(Server.owner+" could not kick "+message.author+" due to permission issues."))
}

  
    /*/---  LOGS     ---------------------------------------------------------


        var logserver = Server.name + " "
        var logchan = " #" + Channel.name + " "
        var logusr = " " + Author.username + ": "
        var logmsg = MSG


        console.log(" @ " + logserver.bgWhite.black.bold + logchan.bgWhite.blue + logusr.yellow.underline + logmsg.gray.underline + "\n")


    }
    //--- END LOGS   ---------------------------------------------------------*/
    if (Author.bot) return;
    //-- NO BOTS PAST HERE ---------------------------------------------------
     
        


    if (Server && !Author.bot) {
      
SERVERDATA = await DB.findOne({_id:Server.id});

    if (Server.antiflood || Server.id=="277391723322408960") {

            let lms = message.channel.messages.last()

            if (lms.author.id == message.author.id && message.content.includes(lms.content)) {
                if (!Author.warning) Author.warning = 0;
                Author.warning++
                    setTimeout(() => Author.warning--, 3000)
                if (Author.warning == 6) {
                    message.reply(":warning: **FLOOD**")
                }
                if (Author.warning > 10) {
                    message.member.kick().then(kik => {
                        kik.send("You have been kicked from " + Server.name + " for Flooding all around.")
                        message.channel.send(kik.username + " have been kicked from " + Server.name + " for Flooding all around.")

                    }).catch(c => {
                        Channel.send(Server.owner + " No kick Permissions given for Flood Control.")
                    })
                }

            }

        }




if((
  message.content.includes("https://discord.gg/")
 || message.content.includes("discord.gg/")
 || (message.content.includes("discord")&&message.content.includes("gg"))
||message.content.includes("https://discord . gg/")
)&&SERVERDATA.modules.inviteBuster){
  message.delete().then(m=>message.channel.send(message.author+" No Invite Links REEEEEE"))
}
                                                    





        let args = message.content.toLowerCase().split(' ').slice(1)[0]
        //==-------------------------------------------
        // SIDE COMMANDS
        try{

        gear.fs.readFile("./core/collateral_triggers.json", 'utf8', (err, data) => {
            data = JSON.parse(data)

            if (data[MSG]) {
                let jet = require(`../core/sidecommands/${data[MSG]}.js`);
                try {
                    jet.run(bot, message, DB, defaults.gdfal)
                    return
                } catch (err) {
                   // hook.send(err)
                    return
                }
            }
        });
        }catch(e){}
        if (message.content.endsWith('now illegal')) {

            let illegal = require(`../core/sidecommands/nowillegal.js`);
            try {
                illegal.run(bot, message)
                return
            } catch (err) {
                console.log(err)
                //hook.send(err)
                return
            }
        }
        //console.log(Server.name)

 
  
      /*
     
             try{
               

        if (SERVERDATA.modules.REACTIONS != undefined) {
            let servdata = SERVERDATA.modules
            if (servdata.REACTIONS[MSG]) {
                let max = servdata.REACTIONS[MSG].length
                let goer = gear.randomize(0, max)
                return Channel.send(servdata.REACTIONS[MSG][goer])
            }
        } else {
            let D = SERVERDATA
            D.modules.REACTIONS = {}
            DB.set(Server.id, D)
        }
             }catch(e){
               console.log(e)
              console.trace();
               process.exit()
             }
*/
        //--- END SIDE   ---------------------------------------------------------
        //  SETUPS


        if(!cooldown){
          cooldown = true
        let USDAT = USERDATA
        USDAT.modules.exp+=1
        gear.userDB.update({_id:Author.id},USDAT)

      //-----------------------------------------------------
        if (!SERVERDATA.modules.LOCALRANK){
          SERVERDATA.modules.LOCALRANK={}
        };
          
    
          
         aut_server_rank = SERVERDATA.modules.LOCALRANK[Author.id]
        
        if (!SERVERDATA.modules.LOCALRANK[Author.id]){
          aut_server_rank={exp:0,level:0};
        }


    
      //----------------------------------------------------------------------


        aut_server_rank.exp++;

          setTimeout(f=>cooldown=false,3000)
        }
        
        gear.paramIncrement(Author, "exp", gear.randomize(-2,2))     
      
        if (stuff.xpbanne.includes(Author.id)) {
          //  ------
      
          gear.paramIncrement(Author, "exp", -1)                               
          //ANTIGRIND
          /*let lmsGRIND = message.author.lastMessage.content
          console.log(lmsGRIND)
          console.log(message.content)
          if (message.content.includes(lmsGRIND)) {
              gear.stalk(message,bot)
            if (message.content !== "hit") {
             gear.paramIncrement(Author, "exp", -10*levele)
            }
          }*/
        }
  
        // POLLUX PERMS 101

        /*
        -= ::PERMS:: =-
        0 = ALMIGHTY (owner)
        1 = ADM
        2 = MOD
        3 = PLEB
        4 = FUDIDO
        5 = FORBIDDEN
        */

        Author.PLXpems = gear.updatePerms(Author, Server, DB)
        Target.PLXpems = gear.updatePerms(Target, Server, DB)

        // DONE WITH PERMS ---//

        //A NEW CHANNEL? --------------------------------------------
        try{
            if (SERVERDATA.channels[Channel.id] == undefined)fx.run("channelSetup",Channel, Server);
           }catch(e){
             return fx.run("channelSetup",Channel, Server);
           }
        
        let defaultgreet = {
            hi: false,
            joinText: "Welcome to the Server %username%!",
            greetChan: ""
        }

        if (!SERVERDATA.modules.GREET || SERVERDATA.modules.GREET === undefined) {
            gear.paramDefine(Server, "GREET", defaultgreet)
        }

        let defaultgreetB = {
            hi: false,
            joinText: "%username% has left us!",
            greetChan: ""
        }
        if (!SERVERDATA.modules.FWELL || SERVERDATA.modules.FWELL === undefined) {
            gear.paramDefine(Server, "FWELL", defaultgreetB)
        }

        //TRY level shit
        //------------------------------------------------------------
        try {
            if (SERVERDATA.modules && !SERVERDATA.modules.DISABLED.includes("level")) {
                gear.updateEXP(Author, message, DB, userDB).catch(e=>{
                  "fail silently"
                })
            } else if (SERVERDATA.modules && !SERVERDATA.channels[Channel.id].modules.DISABLED.includes("level")) {
                gear.updateEXP(Author, message, DB, userDB).catch(e=>{
                  "fail silently"
                })
            }

        } catch (err) {
            fx.run("guildSetup",Server) // maybe no server
        }

        //TRY gemdrop shit
        //------------------------------------------------------------
      if(!cooldownDrop){
        cooldownDrop = true
        try {
            if (SERVERDATA.modules && !SERVERDATA.modules.DISABLED.includes("drop")) {
                plzDrop(message,DB,userDB)
            } else if (!SERVERDATA.channels[Channel.id].modules.DISABLED.includes("drop")) {
                plzDrop(message,DB,userDB)
            }
        } catch (err) {
            console.log(err)
            fx.run("guildSetup",Server)
        }
        setTimeout(()=>cooldownDrop=false,15000)
      }
  /*   
*/
                   //==========================//
//-----------------//  ACTUAL COMMAND PROCESS  //~~//~~//~~//~~//~~//~~//~~||
                   //==========================//


      
      
      setInterval(f=>{
        
       
          if(Server){
        if(cdd==true)return;
        if(message.content.length<20)return;
      cdd=true
      if(gear.randomize(0,10000)>9000){
        
      gear.tweet(message.content)
      setTimeout(f=>{cdd=false},1220000)
      }
      
    }
      
      },15000000
      )
      
      
      
      Server.dDATA=  Server.dDATA  ? Server.dDATA  : {};
      Author.dDATA=  Author.dDATA  ? Author.dDATA  : {};
      Target.dDATA=  Target.dDATA  ? Target.dDATA  : {};
      Channel.dDATA= Channel.dDATA ? Channel.dDATA : {};
      

      Object.assign( Server.dDATA,  SERVERDATA );
      Object.assign( Author.dDATA,  USERDATA   );
      Object.assign( Target.dDATA,  TARGETDATA );
      Object.assign( Channel.dDATA, CHANDATA   );
      
      userDB.update({_id:Author.id},USERDATA)
      DB.update({_id:Server.id},SERVERDATA)
      DB.update({_id:Server.id},{
        $set:{
          ['modules.LOCALRANK.'+Author.id]:aut_server_rank
        }
      })
      DB.update({_id:Server.id},{
        $set:{
          ['channels.'+Channel.id]:CHANDATA
        }
      })
        //Wave 1 --> CHECK LOCALE

        if (Server && typeof (SERVERDATA.modules.LANGUAGE) !== 'undefined' && SERVERDATA.modules.LANGUAGE && SERVERDATA.modules.LANGUAGE !== '') {
            let langua = "en"
            if (Server.region === 'brazil') langua = "pt-BR";
            message.lang = [SERVERDATA.modules.LANGUAGE, langua, 'dev'];
        } else {
            let langua = "en"
            if (Server.region === 'brazil') langua = "pt-BR";
            gear.paramDefine(Server, "LANGUAGE", langua)
        }
  
        //Wave 2 -- CHECK PREFIX
      
      //console.log(SERVERDATA)
      //process.exit()
      
       if(SERVERDATA.channels[Channel.id].modules.LANGUAGE){
         
         
          message.lang = [SERVERDATA.channels[Channel.id].modules.LANGUAGE || SERVERDATA.modules.LANGUAGE, 'dev'];
          }
      
      
        if (Server && typeof (SERVERDATA.modules.PREFIX) !== 'undefined' && SERVERDATA.modules.PREFIX && SERVERDATA.modules.PREFIX !== '') {

            //-- GET & CHECK PREFIX
            if (message.content.startsWith(SERVERDATA.modules.PREFIX)||
                message.content.startsWith("p!")) {
                //console.log(message.content)
                if (message.content.startsWith("p!")){
                    message.prefix = "p!";
                }
              
                polx.commandFire(message, Server, Channel, Author)
              
            } else {
                if (false){ 

                    //cleverbot someday
                } else {

                        if (message.content.startsWith("pollux, ")&&message.author.id==="88120564400553984"){
                              let msg = message;
                            let M = message.content;
                            //console.log(M)
                            msg.content = SERVERDATA.modules.PREFIX + "eval" + M.substr(M.indexOf(",") + 1)
                            //console.log(msg.content)
                          gibexp(Author, 'exp', gear.randomize(5, 30))
                           return polx.commandFire(msg, Server, Channel, Author)
                        }
                  
                  
                  
                        try {
                        var usr = message.mentions.users.first()
                        if (message.guild && usr.id == bot.user.id && !message.author.bot) {
                            let msg = message;
                            let M = message.content;
                            msg.content ="p!"+M.substr(M.indexOf(">"))
                    
                          try{
                              delete require.cache[require.resolve("../core/modules/dev/chat.js")];
                  require("../core/modules/dev/chat.js").init(msg, userDB,DB)
                          }catch(e){
                            console.log(e)
                          }
                        }
                    } catch (err) {}
                }
            }
        } else {
             

    

        }
    } else {
        //console.log(message.content)
                return polx.DMcommandFire(message)
                message.reply("Sorry sweetie, don't send stuff for me here. I'll have DM support someday in the future. If you are here for help check http://pollux.fun/commands");
        return;
    }
                                      })
}catch(e){
 console.log(e)
}
    }
}
