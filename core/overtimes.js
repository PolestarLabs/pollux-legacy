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
       await g.userDB.updateMany({},{$set:{'limits.blackjack':0}});
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

        try{
           if (date.getMinutes() === 0) {
          bot.channels.get('206252981895692289').send('perdi');
           }
        }catch(e){

        }

               gear.serverDB.find({
          'modules.MUTEDUSERS': { $exists: true, $gt: [] }
        }).then(arr => {
          arr.forEach(sv => {
          //console.log(sv.name)
            try {

             sv.modules.MUTEDUSERS.filter(mtu=>mtu.expires <= Date.now()).forEach(toUnmute=>{
               let SV = bot.guilds.get(sv.id);
               if (!SV) return;
               let ME = SV.members.get(toUnmute.id);
               ME.removeRole(sv.modules.MUTEROLE).then(async x=>{
                 await  gear.serverDB.set(sv.id,{$pull:{'modules.MUTEDUSERS':{expires:{$lte:Date.now()}}}});
                 if (x.guild.dDATA.logging) {

                        delete require.cache[require.resolve('./modules/dev/logs_infra.js')]
                        let log = require('./modules/dev/logs_infra.js')
                        log.init({
                          bot,
                          server: x.guild,
                          member: x,
                          user:   x.user,
                          logtype: "usrUnmute"
                    })
                  }
               });
             })
            } catch (e) {}
          })
        })

        /* Exchange Currency */

        discoin.fetch().then(trades => {
          trades = JSON.parse(trades)
          //console.log("\n\n----FETCHING TRADES")
          //console.log(trades)
          //console.log("-------------------[END TRADES]\n\n")

          if (trades.length == 0) return;

          for (i = 0; i < trades.length; i++) {

              let usr = trades[i].user + ""
              let ts = Date(trades[i].timestamp * 1000)
              let src = trades[i].source
              let amt = Number(Math.floor(trades[i].amount))
              let inv = trades[i].receipt
              let taxes =  0 //Math.ceil(amt*0.1837)
              let coinfee =  0 //Math.floor(amt*(coinbase[src]||{rbnRate:0.005}).rbnRate)
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
              //console.log("newGame:  " + gchange)
              bot.user.setPresence({status:'online',game:{name:gchange[0],type:gchange[1]}})
        }

      //EVERY EVENT HOURS --------------------------------------------------------------
        /*
        if ((date.getHours() % 2 )+ date.getMinutes()==0) {
          console.log("YYYYYYYYYYYYYYYYYYYY")
          delete require.cache[require.resolve('./modules/dev/trader.js')]

            gear.serverDB.find({'event.enabled':true}).then(arr=>{
      //console.log(arr.length)
    arr.forEach(sv=>{
      try{
        bot.channels.get(sv.event.channel).fetchMessage(sv.event.message)
      }catch(e){}
    })
  })


          gear.serverDB.find({
          'event.enabled': true
          }).then(arr => {
            arr.forEach(async sv => {
              try {
            let elf;
            let rand = gear.randomize(1,20);
            if(rand%2==0)elf=["australis","austri"];
            else elf=["borealis","bori"];

            let ELF = elf[0];
            let NIK = elf[1];
            let GLD = bot.guilds.get(sv.id)
            GLD.dDATA=sv
                  if(sv.event[NIK]){
                    await gear.serverDB.set(sv.id,{$set:{['event.'+NIK]:false}});
                    bot.channels.get(sv.event.channel).send(gear.emoji(ELF)+" [END]");
                  }else{

                  await gear.serverDB.set(sv.id,{$set:{['event.'+NIK]:true}});
                  let Schannel = bot.channels.get(sv.event.channel);
                  let dummyMSG = {
                  prefix: sv.modules.PREFIX || "p!",
                    channel:Schannel,
                    lang:[sv.modules.LANGUAGE,'dev'],
                    content:"p!trader "+ELF,
                    guild:GLD
                  }
                  require('./modules/dev/trader.js').init(dummyMSG,true,ELF)

                }
              } catch (e) {}
            })
          })
        }
        */
      }
      //EVERY MINUTE (END)-----------------------------------------------------------------

      //EVERY HOUR-----------------------------------------------------------------
if (date.getMinutes() + date.getSeconds() == 0) {
      require('./modules/owner/comboupdate.js').init({},bot);
  /*
        gear.serverDB.find({
          'event.enabled': true
        }).then(arr => {
          //console.log(arr.length)
          arr.forEach(sv => {
            try {
              bot.channels.get(sv.event.channel).fetchMessage(sv.event.message)
            } catch (e) {}
          })
        })*/

        let sweep = bot.sweepMessages()
        console.log("Sweeping ",sweep," messages.")

        }
      }
