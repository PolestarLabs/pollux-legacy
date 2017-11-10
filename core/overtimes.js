const g=require('./gearbox.js');
const Discoin = require("./archetypes/discoin.js");
const cfg = require("../config.json")
const discoin = new Discoin(cfg.discoin);
const gear = g
const eko = require ('./archetypes/ekonomist.js')

exports.run = function(bot){
      bot.donators = [
        "169551262981816321"
      ]
      //DATE FOR EVERYONE
      let date = new Date();

      //EVERY MIDNITE-----------------------------------------------------------------
      if (date.getHours() === 0 && date.getMinutes() == 0 && date.getSeconds() == 0) {

      }
      //------------------------------------------------------------------------------



      //EVERY 3 AM-----------------------------------------------------------------
      if (date.getHours() === 3 && date.getMinutes() === 0 && date.getSeconds() === 0) {

        let epc = date.getTime()
        g.userDB.findOneAndUpdate({id:bot.user.id},{$set:{epochStamp:date,dailyEpoch:epc}})

      }
      //------------------------------------------------------------------------------


      //EVERY MINUTE-----------------------------------------------------------------
      if (date.getSeconds() === 0) {

        /* Exchange Currency */
        discoin.fetch().then(trades => {
          trades = JSON.parse(trades)
          console.log("\n\n----FETCHING TRADES")
          console.log(trades)
          console.log("-------------------[END TRADES]\n\n")

          if (trades.length == 0) return;

          for (i = 0; i < trades.length; i++) {

              let usr = trades[i].user + ""
              let ts = Date(trades[i].timestamp * 1000)
              let src = trades[i].source
              let amt = Number(Math.floor(trades[i].amount))
              let inv = trades[i].receipt

            if (amt < 1) {
              discoin.reverse(inv);
              return bot.fetchUser(usr).then(u => u.send(`:warning: Transaction Reversed :: Amount of Rubines below Zero`))
            };

            g.userDB.findOne({id: usr}).then(async USDATA => {
              if (!USDATA) {
                discoin.reverse(inv)
                bot.fetchUser(usr).then(u => u.send(`Transaction Reversed :: Not in Pollux Database`)).catch(e => console.log(e))
                return;
              };
              g.userDB.findOneAndUpdate({id: usr}, {
                  $inc: {
                    'modules.rubines': amt,
                    'modules.audits.rubines.earnings.exchange': amt
                  }
                }).then(ok=>{


              bot.fetchUser(usr).then(u => u.send(`
:currency_exchange:
**Exchange Processed!**
Received **${amt}** Rubines converted from ${src}!

At \`${ts}\`
Transaction Receipt: \`\`\`${inv}\`\`\`

`)).catch(async e => console.log(e))
                 })
            })
          }
        });





      //EVERY FIVE MINUTES--------------------------------------------------------------
        if (date.getMinutes() % 5 == 0) {
              /* Change Game */
              let gchange = gear.gamechange()
              console.log("newGame:  " + gchange)
              bot.user.setGame(gchange)
        }

      }
      //EVERY MINUTE (END)-----------------------------------------------------------------

      //EVERY HOUR-----------------------------------------------------------------
      if (date.getMinutes() + date.getSeconds() == 0) {
        let sweep = bot.sweepMessages()
        console.log("Sweeping ",sweep," messages.")
        }



}
