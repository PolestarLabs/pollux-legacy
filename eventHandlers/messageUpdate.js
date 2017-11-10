exports.run=  async function run(bot, msg_old,msg_new) {

          if(msg_old.author.id==bot.user.id)return;
          if(msg_old.author.bot)return;

           let mess = require("./message.js");
            await mess.run(bot, msg_new);
    }

