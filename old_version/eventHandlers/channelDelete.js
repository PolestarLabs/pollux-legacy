
const polx = require("../pollux.js")
const fx = require("../core/functions.js")


module.exports = {
    run:  function run(gear,DB,userDB,bot, ch) {

          try{
          gear.paramRemove(ch.guild,"channels",ch.id)
          gear.sendLog("delChan","adv",ch.guild,DB,ch.name)
          }catch(e){
            console.log(e)
          }
    }
}
