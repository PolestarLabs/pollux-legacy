const {Client} = require('eris')
const cfg = require('./config.json')
const gear =require('./core/gearbox.js');
const g = gear;
const fs = require("fs")
const moment = require("moment")
require('colors')

const Discoin = require("./core/archetypes/discoin.js");
const discoin = new Discoin(cfg.discoin);
const coinbase = require("./resources/lists/discoin.json");
const {CronJob} = require('cron');

Promise = require('bluebird');

console.log("Sidecar Started".blue);
const PLX = new Client("Bot "+cfg.token,{restMode:true, intents: 0});


new CronJob('0 */2 * * *', async ()=> {
  const EV= require('./core/modules/!event/clockwork/hallowinter.js');
  const partServers =  await gear.serverDB.find({'event.hallowinter19':{$exists:true}}).lean().exec();

  console.log("Thermo Checks".bgBlue)
  partServers.forEach(async serverData=>{
    let furn =  serverData.event.hallowinter19.furnace
    let thermo =  serverData.event.hallowinter19.thermo

    if (furn >= 12){
      gear.serverDB.set( serverData.id, {$inc:{'event.hallowinter19.furnace': -12 } })
    }else if (furn != 0){
      gear.serverDB.set( serverData.id, {$set:{'event.hallowinter19.furnace': 0 } })
    }
 
 
    console.log( serverData.name +": " + furn + (thermo+"°C").bgBlue)
    let removal = 1
    if(thermo>15) removal = 3;
    if(thermo>20) removal = 6;
    if(thermo>30) removal = 12;

    if (thermo < -20) return;

      if (furn > 1000){
        removal+=3
       await gear.serverDB.set( serverData.id, {$inc:{'event.hallowinter19.thermo': +5 ,'event.hallowinter19.furnace': -507} });
      }else if (furn >= 500){
        removal+=2
       await gear.serverDB.set( serverData.id, {$inc:{'event.hallowinter19.thermo': +2 ,'event.hallowinter19.furnace': -183} });
        removal+=1
      }else if (furn >= 250){
       await  gear.serverDB.set( serverData.id, {$inc:{'event.hallowinter19.thermo': +1 ,'event.hallowinter19.furnace': -25} });
      }else if (furn == 0){
        
       await  gear.serverDB.set( serverData.id, {$inc:{'event.hallowinter19.thermo': -5 } });
      }else{

      }
      await gear.serverDB.set( serverData.id, {$inc:{'event.hallowinter19.thermo': -removal } });

  });


},null,true);
 

new CronJob('* * * * *', async ()=> {
    
    const EV= require('./core/modules/!event/clockwork/hallowinter.js');
    const returners = EV.venturelog.map(log=>log.special&&log.special.includes('return')?log.id:null).filter(x=>!!x);
    const usersStillExploring = await gear.userDB.find({'eventThing.hallowinter19.journey':{$exists:true},'eventThing.hallowinter19.explorationClaim':false, 'eventThing.hallowinter19.returnTime':{$gt: Date.now()} }).lean().exec();
    const usersExploring = await gear.userDB.find({'eventThing.hallowinter19.journey':{$exists:true},'eventThing.hallowinter19.explorationClaim':false, 'eventThing.hallowinter19.returnTime':{$lt: Date.now()} }).lean().exec();
    console.log (usersExploring.length.toString().blue + " explorers done exploring.")
    console.log (usersStillExploring.length.toString().yellow + " explorers still exploring.")
    console.table( usersStillExploring.map(x=>Object({NAME:x.name,TIME:moment(x.eventThing.hallowinter19.returnTime).fromNow() }) ) )
    usersExploring.forEach(async userData=>{

        let resprize = {coal:0,rubines:0,sapphires:0,lootbox:[],ember:0,items:[]};
        let abort = {val:false};
        let eventData = userData.eventThing.hallowinter19;
        eventData.journey.forEach(log=> EV.calculatePrize( resprize, EV.venturelog.find(l=>l.id==log.event), abort,userData) );
        
        
        
        
        let journey= await gear.assorted.findOne({user:userData.id,'data.end':eventData.returnTime});
        if(!journey){
            await gear.assorted.new({
                user: userData.id, type: "journey",
                data: { 
                    journey: eventData.journey,
                    start: userData.eventDaily,
                    end: eventData.returnTime
                }
            });
        }
       

        PLX.getDMChannel(userData.id).then( async chn=> {
            console.log({chn})
         chn.createMessage({
            content: "Hello there! Your exploration just finished!" ,          
            embed:{
                description: `[Check your Journey Logs here!](https://pollux.fun/journey/${journey._id})`,
                color: 0xff3355
            }
          }).catch(e=>console.log(`can't send DM to ${userData.id}`))
          await gear.userDB.set(userData.id,{ $set:{'eventThing.hallowinter19.explorationClaim':true} });
          EV.payOut(userData,resprize);
        }


      ).catch(e=>console.error(`scan't fetch DM channel (Event)  ${userData.id}`,e))      

    }) //end foreach

},null,true);


new CronJob('* * * * *', async ()=> {
    await gear.wait(1+gear.randomize(1,5));
  discoin.fetch().then(async trades => {
    trades = JSON.parse(trades)
    if (!trades.length || trades.length === 0) return;
    //let tle = trades.length;
    await gear.wait(Number(process.env.SHARD));
    Promise.all(trades.map(td=>resolveExchange(td,PLX)));
  });
},null,true);

new CronJob('0 0 * * *', ()=> {
    // EVERY MIDNIGHT
    
     g.userDB.updateMany(
       {'limits.slots':{$gt:40}},
       {$set:{'limits.slots':0}}
     );
     g.userDB.updateMany(
       {'limits.blackjack':{$gt:40}},
       {$set:{'limits.blackjack':0}}
     );
     g.userDB.updateMany(
       {'limits.receive':{$gt:40}},
       {$set:{'limits.receive':0}}
     );
     g.userDB.updateMany(
       {'limits.give':{$gt:40}},
       {$set:{'limits.give':0}}
     );  
    
  },null,true);
  


  async function resolveExchange(exchange_itm,PLX){
    
    let usr = exchange_itm.user + "";
    let ts = Date(exchange_itm.timestamp); // iso
    let src = exchange_itm.from.id;
    let amt = Number(Math.floor(exchange_itm.payout));
    let inv = exchange_itm.id;
    let taxes =  0 //Math.ceil(amt*0.1837)
    let coinfee =  0 //Math.floor(amt*(coinbase[src]||{rbnRate:0.005}).rbnRate)
    let newAmt = Math.floor(amt - taxes - coinfee);

  if (newAmt < 1) {
    discoin.reverse(inv);
    
    PLX.getDMChannel(usr).then(chn=> chn.createMessage(`:warning: Transaction Reversed :: Amount of Rubines below Zero`)
            .catch(e=>console.warn(`User ${usr} cannot receive DMs`)));
  };

  g.userDB.findOne({id: usr},{id:1}).lean().exec().then(async USDATA => {
    if (!USDATA) {
      discoin.reverse(inv)
      PLX.getDMChannel(usr).then(chn=> chn.createMessage(`:warning: Transaction Reversed :: Amount of Rubines below Zero`)
            .catch(e=>console.warn(`User ${usr} cannot receive DMs`)));            
      return;
    };
    g.audit(usr,newAmt,"discoin","RBN","+","DISCOIN_"+src).then(ok=>ok);
    g.userDB.findOneAndUpdate({id: usr}, {
        $inc: {
          'modules.rubines': newAmt                    
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
        
        let RATE=0.7

        discoin.process(inv);

        
        PLX.getDMChannel(usr).then(chn=> chn.createMessage(`
\`${src}\` ${coinbase[src].icon}:currency_exchange: ${gear.emoji('rubine')} \`RBN\`
**Exchange Processed!**

Inbound  : ${gear.emoji('rubine')} × **${amt/RATE}**
Fees         : ${gear.emoji('rubine')} × **${(amt/RATE*0.3)+taxes+coinfee}**
\`\`\`diff
+Inbound Amount   :  ${aN((amt/RATE))}
-Transaction Fee  :  ${aN(taxes+(amt/RATE*0.3))}
-Exg. Tax for ${src} :  ${aN(coinfee)}
---------------------------
Net Income       :  ${aN(newAmt)}
\`\`\`
Received **${newAmt}** **RBN**(*Pollux Rubines*) converted from **${src}**(*${coinbase[src].bot+" "+coinbase[src].name}*)!
---
*Transaction Receipt:*
\`${ts}\`
\`\`\`${inv}\`\`\`
        `).catch(e=>console.warn("[DISCOIN] User can't recveive DMs")) ) 

})
})
  }