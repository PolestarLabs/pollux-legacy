//const polx = require("../pollux.js")
const fx = require("../core/functions.js")

module.exports = {
    run:  function run(gear,DB,userDB,bot, ch) {

          try{
          fx.run("channelSetup",ch)
          gear.sendLog("newChan","adv",ch.guild,DB,ch.name)
          }catch(e){
            console.log(e)
          }
    }
}
