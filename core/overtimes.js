const g=require('./gearbox.js');
const Discoin = require("./archetypes/discoin.js");
const cfg = require("../config.json");
const fs = require("fs");
const discoin = new Discoin(cfg.discoin);
const gear = g;
const eko = require ('./archetypes/ekonomist.js');
const coinbase = JSON.parse(fs.readFileSync("./resources/lists/discoin.json", "utf8"))

exports.run = async function(bot){
      //DATE FOR EVERYONE
      let date = new Date();

      //EVERY MIDNITE-----------------------------------------------------------------
      if (date.getHours() === 0 && date.getMinutes() == 0 && date.getSeconds() == 0) {

      }


      //------------------------------------------------------------------------------



      //EVERY 3 AM-----------------------------------------------------------------
      if (date.getHours() === 3 && date.getMinutes() === 0 && date.getSeconds() === 0) {

        let epc = date.getTime()
        //g.userDB.findOneAndUpdate({id:bot.user.id},{$set:{epochStamp:date,dailyEpoch:epc}})

      }
      //------------------------------------------------------------------------------


      //EVERY MINUTE-----------------------------------------------------------------
      if (date.getSeconds() === 0) {


           if (date.getMinutes() === 0) {
            //bot.channels.get('206252981895692289').send('perdi');
           }


      //EVERY FIVE MINUTES--------------------------------------------------------------
        if (date.getMinutes() % 5 == 0) {
              /* Change Game */
              let gchange = gear.gamechange();
              
              bot.user.setPresence({status:'online',game:{name:gchange[0],type:gchange[1]}})
        }

      //EVERY EVENT HOURS --------------------------------------------------------------
        /*
        if ((date.getHours() % 2 )+ date.getMinutes()==0) {
          console.log("YYYYYYYYYYYYYYYYYYYY")
          delete require.cache[require.resolve('./modules/dev/trader.js')]

            gear.serverDB.find({'event.enabled':true}).then(arr=>{
      
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
      //require('./modules/owner/comboupdate.js').init({},bot);
  /*
        gear.serverDB.find({
          'event.enabled': true
        }).then(arr => {
          
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
