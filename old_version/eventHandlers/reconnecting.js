const polx = require("../pollux.js")
var defaults = require("../utils/defaults.js") // Database Defaults

module.exports = {
    run: function run(gear, DB, userDB, bot) {
        console.log("REKON".bgRed)
        bot.user.setStatus('away').then(x=>{
          
        console.log("Reconnect".bgRed)
        process.exit(1)
        })
        process.exit(1)
    }
}
 