const paths = require("./paths.js");
var fs = require("fs");



module.exports = {

    listen: async function (bot, DB, userDB, gear) {


        var events = [
                "channelCreate",
                "guildMemberAdd",
                "guildMemberRemove",
                "presenceUpdate",
                "message",
                "channelDelete"
                ];

        for(i=0;i<events.length;i++){

           await fire(events[i]);

        }
      

        function fire(eve){
        fs.readdir(`${__dirname}/cherry`, (err, files) => {
            if (err) return console.error(err);
            files.forEach(file => {

                try {

                //console.log(file)
                    let eventor = require(`${__dirname}/cherry/${file}`);
                     let eventide = file.split(".")[0];
                    if(!eventor[eve])return;
                    bot.on(eve, (...args) => eventor[eve](gear, DB, userDB, bot, ...args));
                } catch (e) {
                    console.log(e)
                }


            })
        })}

    }


}
