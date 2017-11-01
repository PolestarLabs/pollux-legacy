const polx = require("../pollux.js")
const fx = require("../core/functions.js")


module.exports = {
  run: function run(gear, DB, userDB, bot, ch, chn) {

    let params = ["name", "position", "nsfw", "topic"]

    
     let log=  function log(alt) {

        try {
          gear.sendLog("updtChan", "adv", ch.guild, DB, ch.name, alt)
          gear.superDefine(ch, "name", ch.name)
        } catch (e) {
          console.log(e)
        }
      }
    
    fx.run("exposeLogs",params,{changes:log, old:ch,new:chn})
    
    }
  }
