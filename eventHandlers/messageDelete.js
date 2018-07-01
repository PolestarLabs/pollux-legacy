const gear = require('../core/gearbox.js');

exports.run=  async function run(bot, msg) {

         if(!msg.author.bot) msg.channel.snipe = msg;

          let ddata = await gear.serverDB.findOne({id:msg.guild.id});
          if(msg.author.bot)return;
          if(ddata){
          if(            msg.content.startsWith(ddata.modules.PREFIX)||
            msg.content.startsWith("px!")||
            msg.content.startsWith("plx!")
            ){
              return;
            }

            if(!ddata.logging)return;
            delete require.cache[require.resolve('../core/modules/dev/logs_infra.js')]
            let log = require('../core/modules/dev/logs_infra.js')
            log.init({
              bot
              ,channel:msg.channel
             ,server:msg.guild
             ,message:msg
             ,member: msg.member
             ,user: msg.author
            ,logtype: "messDel"
            })

    }
    }

