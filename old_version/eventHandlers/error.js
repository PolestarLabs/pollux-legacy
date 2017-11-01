
const polx = require("../pollux.js")
var defaults = require("../utils/defaults.js")  // Database Defaults


module.exports = {
    run:  function run(gear,DB,userDB,bot, err) {
        console.log("ERROR-1".bgRed)
      if (!err )return;
      console.log(err)
             bot.user.setStatus('dnd').then(x=>{
          
        console.log("ERROR".bgRed)
        process.exit(1)
        })
        process.exit(1)
    }
}
 