var gear = require("./gearbox.js");
const fs = require('fs');
const path = require('path');
const cfg = require('../config.js');
const hook = new gear.Discord.WebhookClient(cfg.coreHook.ID, cfg.coreHook.token);

module.exports = {
    determine: function determine(msg) {
        let query = msg.content.substr(msg.prefix.length).split(' ')[0];

        let imgreactions = JSON.parse(fs.readFileSync("./core/imgreactions.json", 'utf8'));
        if(imgreactions[query]){
            return {
                reaction: imgreactions[query],
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
    checkUse: async function checkUse(DTMN, DB, msg) {

        try {
            let commandFile = require(DTMN.path);
            switch (true) {
              case !msg.channel.nsfw && commandFile.cat.toLowerCase() == "nsfw" :
                    return "NONSFW";
                    break;
                //case (await DB.findOne({_id:msg.guild.id}).channels[msg.channel.id].modules.DISABLED.includes(commandFile.cat):
                //case (await DB.findOne({_id:msg.guild.id}).channels[msg.channel.id].modules.DISABLED.includes(DTMN.module):
              case (await DB.findOne({_id:msg.guild.id})).channels[msg.channel.id].modules.DISABLED.includes(commandFile.cmd):
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
            console.log((err.stack).red)
        }
    },
    run: async function run(file, message, userDB, DB) {
        
        try {
          
       
              
          
            delete require.cache[require.resolve(file)];
            let command = require(file)
            
            try{
              
            let exp = command.exp || 5;
            (await userDB.findOneAndUpdate({_id:message.author.id},{$inc:{'modules.exp':exp}})) 
            }catch(e){
              console.log(e)
            }
            
            let cooldown = command.cool || 2000;
               if(message.author.id=="88120564400553984"){
                 cooldown=0
               }
            let now = Date.now();
            if (message.author.cd_timer && (now - message.author.cd_timer)<cooldown){
              
        
              
              return message.reply(":hourglass_flowing_sand: Cooldown: `"+Math.abs((message.author.cd_timer+cooldown)-now )+"ms`")
            }          
            
            message.author.cd_timer = Date.now();
            
            let cmdtrak = (await userDB.findOne({_id:message.author.id})).modules.statistics.commandsUsed[command.cmd]
            if(cmdtrak == undefined)(await userDB.findOne({_id:message.author.id})).modules.statistics.commandsUsed[command.cmd]=0;
            (await userDB.findOne({_id:message.author.id})).modules.statistics.commandsUsed[command.cmd]++ 
          
            let SVcmdtrak = (await DB.findOne({_id:message.guild.id})).modules.statistics.commandsUsed[command.cmd]
            if(SVcmdtrak == undefined)(await DB.findOne({_id:message.guild.id})).modules.statistics.commandsUsed[command.cmd]=0;
            (await DB.findOne({_id:message.guild.id})).modules.statistics.commandsUsed[command.cmd]++
          
            
            
            let commandname = message.content.split(/ +/)[0]
            command.init(message, userDB, DB);

            console.log(" \x1b[45;1;37m"+"  --== " + commandname.toUpperCase() + " ==--   " + " || "+message.guild.name+" || "+message.author.tag+"\x1b[0m")
            console.log(" \x1b[37;1;91m |"+message.content+"| \x1b[0m")
        } catch (e) {
            console.log(e);
        }
    }
};
