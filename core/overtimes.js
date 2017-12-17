const g=require('./gearbox.js');
const Discoin = require("./archetypes/discoin.js");
const cfg = require("../config.json")
const fs = require("fs")
const discoin = new Discoin(cfg.discoin);
const gear = g
const eko = require ('./archetypes/ekonomist.js')
const coinbase = JSON.parse(fs.readFileSync("./resources/lists/discoin.json", "utf8"))

exports.run = async function(bot){



      bot.donators = [
        "169551262981816321"
      ]
      //DATE FOR EVERYONE
      let date = new Date();

      //EVERY MIDNITE-----------------------------------------------------------------
      if (date.getHours() === 0 && date.getMinutes() == 0 && date.getSeconds() == 0) {

       await g.userDB.updateMany({},{$set:{'limits.slots':0}});
       await g.userDB.updateMany({},{$set:{'limits.bjack':0}});
       await g.userDB.updateMany({},{$set:{'limits.receive':0}});
       await g.userDB.updateMany({},{$set:{'limits.give':0}});

        gear.globalDB.get().then(async BOTDB => {

          if (!BOTDB.servsnow) {
            await gear.globalDB.set({
              $set: {
                "data.servsnow": bot.guilds.size
              }
            });
          }


          gear.globalDB.get().then(async BOTDB => {

            let payload = `
**Today's Growth Report**
Total new servers: ${bot.guilds.size - BOTDB.servsnow}
`
            await bot.channels.get("382413370579484694").send(payload);
            await gear.globalDB.set({
              $set: {
                "data.servsnow": bot.guilds.size
              }
            });
          })
        })
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
              let taxes =  Math.ceil(amt*0.1837)
              let coinfee =  Math.floor(amt*(coinbase[src]||{rbnRate:0.005}).rbnRate)
              let newAmt = amt - taxes - coinfee

            if (newAmt < 1) {
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
                    'modules.rubines': newAmt,
                    'modules.audits.rubines.earnings.exchange': newAmt
                  }
                }).then(ok=>{
function aN(inc,ref=amt){
  let len  = ref.toString().length
  let len2 = inc.toString().length
  let spaces = ""
  for (i=0;i<len-len2;i++){
   spaces += " "
  }
  return spaces+inc

}

              bot.fetchUser(usr).then(u => {

                try{

                u.send(`
\`${src}\` ${coinbase[src].icon}:currency_exchange: ${gear.emoji('rubine')} \`RBN\`
**Exchange Processed!**

Inbound  : ${gear.emoji('rubine')} × **${amt}**
Fees         : ${gear.emoji('rubine')} × **${taxes+coinfee}**
\`\`\`diff
+Inbound Amount   :  ${aN(amt)}
-Transaction Fee  :  ${aN(taxes)}
-Exg. Tax for ${src} :  ${aN(coinfee)}
---------------------------
 Net Income       :  ${aN(newAmt)}
\`\`\`
Received **${newAmt}** **RBN**(*Pollux Rubines*) converted from **${src}**(*${coinbase[src].bot+" "+coinbase[src].name}*)!
---
*Transaction Receipt:*
\`${ts}\`
\`\`\`${inv}\`\`\`

`)
                }catch(e){
                  console.log(e)
                  console.log("ERROR MESSAGE TO USER")
                }

              }).catch(e => console.log(e,"\n\nERROR ON FETCH"))
                 })
            })
          }
        });





      //EVERY FIVE MINUTES--------------------------------------------------------------
        if (date.getMinutes() % 5 == 0) {
              /* Change Game */
              let gchange = gear.gamechange()
              console.log("newGame:  " + gchange)
              bot.user.setPresence({status:'online',game:{name:gchange[0],type:gchange[1]}})
        }

      }
      //EVERY MINUTE (END)-----------------------------------------------------------------

      //EVERY HOUR-----------------------------------------------------------------
      if (date.getMinutes() + date.getSeconds() == 0) {
        let sweep = bot.sweepMessages()
        console.log("Sweeping ",sweep," messages.")
        }



}
