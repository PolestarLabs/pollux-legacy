const fx = require("../core/functions.js")
var gear = require("../core/gearbox.js");


module.exports = {
  run: function run(gear, DB, userDB, bot, mem, nemem) {
    var locale = require('../utils/multilang_b');
    var mm = locale.getT();

    let params = ["displayName", "avatarURL"]



      bot.guilds.forEach(gkd => {
        
        if (!gkd.members.has(mem.id)) return;

let MEMAVA=mem.avatarURL||mem.defaultAvatarURL;
let NEMAVA=mem.avatarURL||mem.defaultAvatarURL;

            gear.sendLog("usrPhoto", "adv", gkd, DB, mem.avatarURL,false , {
              user: {
                img: mem.avatarURL?MEMAVA.replace("?size=2048","") : mem.defaultAvatarURL,
                imgn: nemem.avatarURL?NEMAVA.replace("?size=2048","") : nemem.defaultAvatarURL,
                men: mem.toString()
              }
            });


        
    })


  }
}