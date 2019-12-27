
const gear = require("./gearbox.js");
const fs = require('fs');
const cfg = require('../config.json');

module.exports = {
    determine: function determine(msg) {
        let query = msg.content.substr(msg.prefix.length).split(' ')[0];

        let imgreactions = require("./imgreactions.js").out;

        if(imgreactions[query]){
          let rea
          if(imgreactions[query].constructor == Array){
            rea = imgreactions[query][gear.randomize(0,imgreactions[query].length-1)];
          }else{
            rea = imgreactions[query]
          }
            return {
                reaction: rea,
                path: null,
                module: "img",
                cat: "instant"
            }
        }


        let aliases = JSON.parse(fs.readFileSync("./core/aliases.json", 'utf8'));

        let command;
        if (aliases[query]) command = aliases[query].toLowerCase();
        else command = query.toLowerCase();

        let path = ""
        let files = fs.readdirSync(__dirname + "/modules")

        for (i = 0; i < files.length; i++) {
            let filedir = __dirname + "/modules/" + files[i]

            let morefiles = fs.readdirSync(filedir  )
            if (morefiles.indexOf(command + ".js") > -1) {


                let pathTo = filedir + "/" + command + ".js";

                let comm = require(pathTo)

                return {
                    path: pathTo,
                    cat: comm.cat,
                    module: files[i],
                    reaction: false
                }

            }
        }
        return false

    },
    checkModule: function checkModule(DTMN) {

        return DTMN.module
    },
    checkCategory: function checkCategory(DTMN) {

        return DTMN.cat
    },
    checkUse: function checkUse(DTMN, DB, msg) {

        try {
            let commandFile = require(DTMN.path);
          
            switch (true) {
              case !msg.channel.nsfw && commandFile.cat.toLowerCase() == "nsfw" :
                    return "NONSFW";
                    break;
                case  DB.includes(commandFile.cat):
                case  DB.includes(DTMN.module):
                case  DB.includes(commandFile.cmd):
                    return "DISABLED";
                    break;
                case msg.author.PLXpems > commandFile.perms:
                    return "NO ELEVATION";
                    break;
                default:
                    return true;
                    break;
            }
        } catch (err) {
            return true;
            console.error((err.stack).red)
        }
    },
    run: async function run(file, message,databaseless) {
        try {

            delete require.cache[require.resolve(file)];
            let command = require(file)

            try{
            let rand=gear.randomize(0,6)
            let exp = (command.exp || 7)-rand;
            gear.userDB.set(message.author.id,{$inc:{'modules.exp':exp}});
            }catch(e){
              console.error(e)
            }
          
            require('./minibuster.js').up(message,command.positive||2);
          
            let cooldown = command.cool || 2000;
               if(message.author.id==cfg.owner){
                 cooldown=0
               }else if(message.author.id=="x200044537270370313"){
                 cooldown=8000;
                 if(!databaseless){
                 //  await gear.userDB.set(message.author.id,{$inc:{'modules.exp':-1}});
                  }
               }
            let now = Date.now();
            if (message.author.cd_timer && (now - message.author.cd_timer)<cooldown){
              return message.reply(":hourglass_flowing_sand: Cooldown: `"+Math.abs((message.author.cd_timer+cooldown)-now )+"ms`").then(m=>m.delete(Math.abs((message.author.cd_timer+cooldown)-now )))
            }

            message.author.cd_timer = Date.now();
            Promise.all([
            gear.globalDB.set({
              $inc: {
                    ['data.statistics.commandUsage.CMD.' + command.cmd]: 1,
                    ['data.statistics.commandUsage.CAT.' + command.cat.replace('$','cash')]: 1
              }
            }),
            gear.userDB.set(message.author.id,{
              $inc: {
                    ['modules.statistics.commandUsage.CMD.' + command.cmd]: 1,
                    ['modules.statistics.commandUsage.TOTAL']: 1,
                    ['modules.statistics.commandUsage.CAT.'+command.cat.replace('$','cash')]: 1
              }
            }),
            gear.serverDB.set(message.guild.id,{
              $inc: {
                    ['modules.statistics.commandUsage.CMD.' + command.cmd]: 1,
                    ['modules.statistics.commandUsage.TOTAL']: 1,
                    ['modules.statistics.commandUsage.CAT.'+command.cat.replace('$','cash')]: 1
              }
            })
            ]
            )
          
            /*
            let cmdtrak = (await userDB.findOne({id:message.author.id}).lean().exec()).modules.statistics.commandsUsed[command.cmd]
            if(cmdtrak == undefined)(await userDB.findOne({id:message.author.id}).lean().exec()).modules.statistics.commandsUsed[command.cmd]=0;
            (await userDB.findOne({id:message.author.id}).lean().exec()).modules.statistics.commandsUsed[command.cmd]++

            let SVcmdtrak = (await DB.findOne({id:message.guild.id})).modules.statistics.commandsUsed[command.cmd]
            if(SVcmdtrak == undefined)(await DB.findOne({id:message.guild.id})).modules.statistics.commandsUsed[command.cmd]=0;
            (await DB.findOne({id:message.guild.id})).modules.statistics.commandsUsed[command.cmd]++
            */

            

            let commandname = message.content.split(/ +/)[0]

            message.target={};
            message.args=message.content.split(/ +/).slice(1);
            final_payload=null;
            //message.botUser.dDATA=final_payload.Database_bot;
            //message.author.dDATA=final_payload.userData;
            //message.target.dDATA=final_payload.targData;
            //message.guild.dDATA=final_payload.servData;
            //message.channel.dDATA=final_payload.chanData;
          try{
            
            if (command.cat){
              let perms = command.botperms
              
              delete require.cache[require.resolve('./catcheck.js')];      
              let permchk = require('./catcheck.js').run(command.cat,message,perms)
              if (permchk!=='ok') return console.log(permchk);              
            }
            
     
          
            //cmdsec.mark()
            let commandRunninng = command.init(message);
            
            if(commandRunninng&&commandRunninng.catch){
              commandRunninng.catch(e=>{
                console.error("THIS IS A HANDLED REJECTION AT".yellow, `${commandname}.js`.bgYellow.red);
                console.error(e)
                commandRunninng = null;
                command = null;
                return null;
              });
            }
              
               
          }catch(e){
            console.error(e)
          }


            
            if( !message.author.id==process.env.WATCHCMD || process.env.WATCHCMD == "all"){
              process.env.SHARD = message.botUser.shard.id
              /* COMMAND LOGGER */
            let shard = (" "+process.env.SHARD+" ").padEnd(4).inverse;
            let date = (new Date().toUTCString()+"").grey;
            let command = (" "+commandname.toUpperCase()+" ").padEnd(15).bgCyan;
            let user = (" "+message.author.tag+" ").bgYellow;
            let userID = (" "+message.author.id+" ").padEnd(20).yellow;
            let channel = (" #"+message.channel.name+" ").blue;
            let guild = (" "+message.guild.name+" ");
            let content = (" "+message.content+" ").grey;

            
            console.log(shard,date,command,"[",userID,"|",user,"]")
            console.log(guild,channel,content)
            console.log( " " )

          }
        } catch (e) {
           // console.error(e);
        }
        
  
                message= null;
                final_payload= null;
                command= null;
       
        
    }
};
