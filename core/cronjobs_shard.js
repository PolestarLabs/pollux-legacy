'use strict';
const rq = require('request')
const g=require('./gearbox.js')
const Discoin = require("./archetypes/discoin.js")
const cfg = require("../config.json")
const fs = require("fs")

const discoin = new Discoin(cfg.discoin);
const gear = g
//const eko = require ('./archetypes/ekonomist.js')
const coinbase = JSON.parse(fs.readFileSync("./resources/lists/discoin.json", "utf8"));
const CronJob = require('cron').CronJob;
Promise = require('bluebird');




exports.run = async function(bot){
 
  
  new CronJob('* * * * *', ()=> {
 
    try{
      
     // console.log('ONE MIN TICK'.gray,(1+(bot.shard||{id:99}).id+"").padStart(2,'0'), "STATUS: ".blue, bot.ws.shards.first().status )
      if(bot.ws.status == 5 ) {
        console.log((`SHARD [${(bot.shard||{}).id||process.env.SHARD}] Disconnected :: Reviving...`+"").yellow)
        process.exit()
      return;
        bot.login().then(x=>{
        console.log((`SHARD [${(bot.shard||{}).id||process.env.SHARD}] Reconnected!`+"").green)
      }).catch(e=>{
        console.error((`SHARD [${(bot.shard||{}).id||process.env.SHARD}] Could not be Revived!`+"").red)
        console.error(e)
      })
    }else{
      gear.wait(5).then(xx=>{
      bot.shard.broadcastEval('try{ if(this.ws.shards.first().status==5){process.exit();1}else{0} }catch(err){null}').then(
        x=>{
          let print
          if(x.includes(5) ) { print = x.map(y=> (y+"")[y==0?"grey":y==5?"red":"grey"] ).join(" ") };
          //console.log(print);
        }).catch(e=>null);
      }).catch(e=>null);
     //bot.shard.broadcastEval('try{this.ws.shards.first().status} catch(e){"X".red}').then(x=>console.log(x.map(y=> (y+"")[y==0?"green":y==5?"red":"blue"] ).join(" ")) )
    }
  }catch(err){ 
    //console.error(err)
  }





  },null,true);

 //if ( (bot.shard||{id:99}).id == 0) return;


  new CronJob('0 0 * * *', ()=> {
  // EVERY MIDNIGHT
 let client = bot; 
 /*
    client.shard.fetchClientValues('guilds.size')
.then(results => {
  var totalServers = results.reduce((prev, val) => prev + val, 0);

});
*/
     g.userDB.updateMany(
     {'limits.slots':{$gt:10}},
     {$set:{'limits.slots':0}}
   ).then(x=>console.log("Daily Limit Reset for Slots "));
   g.userDB.updateMany(
     {'limits.blackjack':{$gt:10}},
     {$set:{'limits.blackjack':0}}
   ).then(x=>console.log("Daily Limit Reset for Blackjack "));
   g.userDB.updateMany(
     {'limits.receive':{$gt:2}},
     {$set:{'limits.receive':0}}
   ).then(x=>console.log("Daily Limit Reset for Receive "));
   g.userDB.updateMany(
     {'limits.give':{$gt:2}},
     {$set:{'limits.give':0}}
   ).then(x=>console.log("Daily Limit Reset for Give "));   
  
},null,true);

//new CronJob('*/10 * * * * *', ()=> {
// SEK
//},null,true);




new CronJob('0 0 0 * *', async ()=> {
return;
  try{
    const EV= require('./modules/!event/clockwork/hallowinter.js');
    const returners = EV.venturelog.map(log=>log.special&&log.special.includes('return')?log.id:null).filter(x=>!!x);
      
    gear.userDB.find({'eventThing.hallowinter19.journey':{$exists:true},'eventThing.hallowinter19.explorationClaim':false, 'eventThing.hallowinter19.returnTime':{$lt: Date.now()} }).then(explorers=>{
      explorers.forEach(userData=>{

        let resprize = {coal:0,rubines:0,sapphires:0,lootbox:[],ember:0,items:[]};
        let abort = {val:false};

        userData.eventThing.hallowinter19.journey.forEach(log=> EV.calculatePrize( resprize, EV.venturelog.find(l=>l.id==log.event), abort,userData) );
        
        gear.userDB.set(userData.id,{ $set:{'eventThing.hallowinter19.explorationClaim':true} }).then(_=>{

          (bot.users.find(usr=> usr.id === userData.id) || {send:()=>null} ).send(
            "Hello there! Your exploration just finished!" , {
              embed:{
                description: `[Check your Journey Logs here!](https://pollux.fun/journey?target=${userData.id})`,
                color: 0xff3355
              }
            }
          ).catch(e=>console.log(`can't send DM to ${userData.id}`))
          
        })
      })
      
    })

  }catch(e){
    
  }

},null,true);

 
new CronJob('*/15 * * * *', async ()=> {
  try{
    let mess= await (await bot.channels.get("609173885304438833").messages.fetch('609176798818992188'));
 
 
      mess.author = bot.user;
      mess.content = "fdrop -snipe"
      mess.signature = "gdrop"
      require('./archetypes/drops.js').lootbox(mess);
  

  }catch(e){
    
  }
},null,true);
  
  new CronJob('* * * * *', async ()=> {
  try{

  
    let rqOptions = {
      method:"POST",
      url: "https://beta.pollux.gg/status",
        json:{
          "status": bot.ws.status
          ,"api_ping":  bot.ws.shards.first().pings[0]
          ,"shard":  bot.shard.id
          ,"uptime": bot.uptime     
          ,"servers": bot.guilds.size     
          ,"users": bot.users.size     
          , "timestamp" : Date.now() 
        }
      }
      rq(rqOptions,function(err,res,bd){
        //console.log("OK".green,"Status Sent")
        if ( bot.ws.status ==5){ 
          console.log("STATUS 5".red,"Exiting")
          process.exit();
        }
      })
      
    }catch(e){
      
    }

    
  
   gear.globalDB.set({$set:{['data.shardData.'+(Number((bot.shard||{id:process.env.SHARD}).id)+1)+".servers"]:bot.guilds.size}}).then(x=>x=null);
   gear.globalDB.set({$set:{['data.shardData.'+(Number((bot.shard||{id:process.env.SHARD}).id)+1)+".users"]:bot.users.size}}).then(x=>x=null);
   gear.globalDB.set({$set:{['data.shardData.'+(Number((bot.shard||{id:process.env.SHARD}).id)+1)+".channels"]:bot.channels.size}}).then(x=>x=null);
  
  
  // EVERY 5
  let gchange = gear.gamechange();
 
    
  //let sname = gear.getShardCodename(bot,Number(process.env.SHARD)+1)
    bot.user.setPresence({status:'online',activity:{name:gchange[0],type:gchange[1]}});


  
},null,true);


new CronJob('0 */5 * * *', async ()=> { 
//EVERY 2 HOUR
 // bot.login().then(x=>{
    //console.log((`SHARD [${(bot.shard||{}).id||process.env.SHARD}] Routine Reconnect!`+"").green)
    //process.exit()
  //}).catch(e=>{
  //  console.error((`SHARD [${(bot.shard||{}).id||process.env.SHARD}] Could not be Reconnected(ROUTINE)!`+"").red)
  //  console.error(e)
  //})

})


new CronJob('*/10 * * * *', async ()=> {
  // EVERY 1 MINUTE

  

  let usw= bot.users.sweep(x=>x)

  
  //======================================================================================
        /* UNMUTE USERS 
//======================================================================================

  //require('./archetypes/cutemon.js').run(bot,gear)

        gear.serverDB.find({
          'modules.MUTEDUSERS': { $exists: true, $gt: [] }
        }).then(arr => {
          arr.forEach(async sv => {
            try {
              if (!sv) return;
              if (!sv.modules.MUTEROLE){
                await gear.serverDB.set(sv.id,{$set:{'modules.MUTEDUSERS':[]}});
                return;
              };
              let date = Date.now();
              let SV = bot.guilds.get(sv.id);
              if (!SV) return;
              sv.modules.MUTEDUSERS.filter(mtu=>mtu.expires <= date).forEach(toUnmute=>{
                let ME = SV.members.get(toUnmute.id);
                if (!ME)return;
                ME.roles.remove(sv.modules.MUTEROLE).then(async x=>{
                  if(!x.guild)return;
                  await  gear.serverDB.set(sv.id,{$pull:{'modules.MUTEDUSERS':{id:toUnmute.id}}});
                  let xxx = (await gear.serverDB.findOne({id:x.guild.id}));
                  if (xxx&&xxx.logging) {
                          //delete require.cache[require.resolve('./modules/dev/logs_infra.js')]
                          let log = require('./modules/dev/logs_infra.js');
                          log.init({
                            bot,
                            server: x.guild,
                            member: x,
                            user:   x.user,
                            logtype: "usrUnmute"
                          });
                    }
               }).catch(async e=>{
                 console.log(`
==================================
UNMUTE ERROR: Bad Muterole
Muterole value: ${sv.modules.MUTEROLE}
Server: ${sv.id} (${sv.name})
==================================
`);
await  gear.serverDB.set(sv.id,{$set:{'modules.MUTEDUSERS':[]}});
               });
             })
            } catch (e) {
              console.error(e)
            }
          })
        });
    
//======================================================================================  
        /* Exchange Currency */
//======================================================================================  

  
},null,true);
  
  
  
  
}

