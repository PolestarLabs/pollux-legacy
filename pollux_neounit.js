

Promise = require('bluebird');

Promise.config({
  longStackTraces: true 
})
process.env.SHARD = 0
//thisShard = Number(process.argv.slice(2)[1])-1;
thisShard = Number(process.env.SHARD)
SHARD = thisShard
const cfg = require('./config.json');
const colors = require('colors');
const fs = require('fs');

//const SHARDS = JSON.parse(process.env.SHARDS)
//console.log(typeof SHARDS)
//console.log(SHARDS)
let {Client} =require("discord.js")
const POLLUX = new Client( { //)
  ///*
  //totalShardCount:16,
  //shards: [0,1,2,3],
  //totalShardCount:10,
  //shards:SHARDS,
   // shardCount: 4 ,
    presence:{status:'online'},
    messageCacheMaxSize: 50,
    messageCacheLifetime: 60,
    messageSweepInterval: 100,
    disableEveryone: true, 
    //partials: ['MESSAGE', 'CHANNEL'],  //reaction roles relies on this
    //retryLimit:5000,
    fetchAllMembers: false,
    //restWsBridgeTimeout: 10000000000,
    //restTimeOffset:100,
    intents:5671,
    ws:{compress:true,large_threshold:1,intents:5671},
    disabledEvents: [
      'TYPING_START'
      ,'VOICE_SERVER_UPDATE'
      ,'PRESENCE_UPDATE'
      ,"MESSAGE_REACTION_REMOVE"
      ,"VOICE_STATE_UPDATE"
      ,"VOICE_SERVER_UPDATE"
      ,"WEBHOOKS_UPDATE"
      ,"USER_UPDATE"
  ]
});

//POLLUX.on("raw",x=>console.log("[RAW]".yellow,x.t))
POLLUX.on("debug",x=> {
  if(process.debugging === true ) console.info("[DEBUG]".blue,x);
  if(x.includes("Session Limit Information") ) console.info("[DEBUG]".blue,x);
  if(x.includes("attempt") ) console.info("[DEBUG]".blue,x);
})
//*/
POLLUX.login(cfg.token).then(loginSuccess).catch(e=> {console.error(e); POLLUX.ready=true });
 

  
Promise.promisifyAll(require("mongoose"));



//GEARBOX | Boilerplate functions provider.
const {getDirs, errHook,RichEmbed}= require("./core/gearbox.js");

/*
setInterval(f=>{
  if(POLLUX.dbg){ 
   // delete require.cache[require.resolve('./core/overtimes.js')];
 }
  require('./core/overtimes.js').run(POLLUX);
},1000);
*/

//Translation Engine ------------- <
const i18next = require('i18next');
const multilang = require('./utils/multilang_b');
const i18n_backend = require('i18next-node-fs-backend');
const backendOptions = {
    loadPath: './locales/{{lng}}/{{ns}}.json',
    //addPath: './locales/dev/translation.json',
    jsonIndent: 2    
};

getDirs('./locales/', (list) => {
    i18next.use(i18n_backend).init({
        backend: backendOptions,
        lng: 'en',
        fallbackLng:["en","dev"],
        fallbackToDefaultNS: true,
        fallbackOnNull: true,
        returnEmptyString:false,
        preload: list,
        load: 'currentOnly',
        ns:['bot_strings','events','commands','website','translation'],
            defaultNS: 'bot_strings',
            fallbackNS: 'translation',
            interpolation:{
                 escapeValue: false
            }
    }, (err, t) => {
        if (err) {
            console.log(err) 
        }
        multilang.setT(t);
        global.mm = multilang.getT();
    });
});
//----------------[i18n END]-------<


//=======================================//
//      BOT EVENT HANDLER
//=======================================//



async function loginSuccess() {
  //dawait POLLUX.user.setStatus('idle');
  console.log('LOGGED IN!'.bgGreen.white.bold)
  try{POLLUX.shard.id = POLLUX.options.shards[0]}catch(e){}
  if(POLLUX.shard){
    console.log('Starting up Shard '+((1+POLLUX.shard.id)||(POLLUX.options.shard))+'/'+POLLUX.shard.count);
  }

};
POLLUX.once('ready', ()=>{
  console.log(POLLUX.user.id)
  /*
  let gear = require("./core/gearbox.js");
  //await POLLUX.user.setStatus('invisible');
   let sname = gear.getShardCodename(POLLUX,Number(process.env.SHARD)+1)
    //POLLUX.user.setPresence({shardID:Number(process.env.SHARD), status:'online',activity:{name:`+help / p!help - This is ${sname} Shard`,type:0}});
    
  if (POLLUX.shard) {
    POLLUX.user.setStatus('online');
    console.log(("● ".green)+'Shard' + (1 + POLLUX.shard.id) + '/' + POLLUX.shard.count + " [ONLINE]")
  }
  */
  console.log("[READY]".blue)



  fs.readdir("./eventHandlers/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
      // delete require.cache[require.resolve(`./eventHandlers/${file}`)];
      let eventor = require(`./eventHandlers/${file}`);
      let eventide = file.split(".")[0];
      //if(POLLUX.ready){
      
        POLLUX.on(eventide, (...args) => {
          if(eventor && eventor.run){
          eventor.run(POLLUX, ...args)
          }
        });
      
      //}
      //delete require.cache[require.resolve(`./eventHandlers/${file}`)]
    });
  });
})
POLLUX.on("ready",function(){
  
require('./core/cronjobs_shard.js').run(POLLUX);  
  
})

//}; // login success

//=======================================//
//      PROCESS EVENT HANDLER
//=======================================/*/

process.on('unhandledRejection', function(reason, p){
  //if (!process.mdebug)
    //return;
/*
  airbrake.notify(reason,ok=>{
      console.log('Airbrake Notified');
    });
    */
   
   let embed = new RichEmbed();
   embed.setTitle("Unhandled Rejection")
   embed.setColor("#e3e32a")
   try{embed.setDescription(reason.stack)}catch(e){}
   errHook.send(embed).catch(e=>false)

   console.error(".\n\n==================================")
    console.error("Possibly Unhandled Rejection at: Promise \n".red,p);
    //console.log("Possibly Unhandled Rejection at: Promise \n".red,p, "\n\n reason: ".red, reason.stack);
    console.error("==================================\n\n.")
   // gear.sendSlack("Promise Breaker","Promise Rejection: "+reason,reason.stack,"#ffcd25" )
  reason = null;
  p=null;
//process.exit()
});


//require('./core/archetypes/cutemon.js').run(POLLUX)


process.on('uncaughtException', function (err) {
   /*
     airbrake.notify(err,ok=>{
      console.log('Airbrake Notified');
    });
  */
      let embed = new RichEmbed();
      embed.setTitle("uncaughtException")
      embed.setColor("#e3e32a")
      try{embed.setDescription(err.stack)}catch(e){}
      errHook.send(embed)
    console.error("-\n\n==================================")
    console.error('EXCEPTION: \n' + err);
    console.error(err.stack);
    console.error("==================================\n\n-")
    //process.exit(1);
  embed=null;

  process.exit()
});

