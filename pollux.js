global.Promise = require('bluebird');
const cfg = require('./config.json');
const colors = require('colors');
const fs = require('fs');

let {Client} =require("discord.js")
const POLLUX = new Client({
    messageCacheMaxSize: 4048,
    messageCacheLifetime: 1680,
    messageSweepInterval: 2600,
    disableEveryone: true,
    fetchAllMembers: false,
    disabledEvents: ['typingStart', 'typingStop', 'guildMemberSpeaking']
});
POLLUX.login(cfg.token).then(loginSuccess)
global.airbrake = require('airbrake').createClient(
  '163054', // Project ID
  '906b4956553da45ce79b9ae7d14b79ee' // Project key
);

airbrake.handleExceptions();


//GEARBOX | Boilerplate functions provider.
const {getDirs, userDB,serverDB,errHook,RichEmbed}= require("./core/gearbox.js");


setInterval(f=>{
  delete require.cache[require.resolve('./core/overtimes.js')];
  require('./core/overtimes.js').run(POLLUX);
},1000);


//Translation Engine ------------- <
const i18next = require('i18next');
const multilang = require('./utils/multilang_b');
const i18n_backend = require('i18next-node-fs-backend');
const backendOptions = {
    loadPath: './locales/{{lng}}/{{ns}}.json',
    addPath: './locales/dev/translation.json',
    jsonIndent: 2
};

getDirs('./locales/', (list) => {
    i18next.use(i18n_backend).init({
        backend: backendOptions,
        lng: 'en',
      fallbackLng:"en",
        preload: list,
        load: 'all'
    }, (err, t) => {
        if (err) {
            console.log(err)
        }
        multilang.setT(t);
    });
});
//----------------[i18n END]-------<


//=======================================//
//      BOT EVENT HANDLER
//=======================================//

async function loginSuccess() {
  console.log('LOGGED IN!'.bgGreen.white.bold)
  if(POLLUX.shard){
  console.log('Starting up Shard '+(1+POLLUX.shard.id)+'/'+POLLUX.shard.count);
  }
  POLLUX.user.setStatus('dnd')
};


fs.readdir("./eventHandlers/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    delete require.cache[require.resolve(`./eventHandlers/${file}`)];
    let eventor = require(`./eventHandlers/${file}`);
    let eventide = file.split(".")[0];
    POLLUX.on(eventide, (...args) => eventor.run(POLLUX, ...args));
  });
});

POLLUX.on('reconnecting',()=>{
  POLLUX.user.setStatus('dnd');
  POLLUX.user.setGame('Reconnecting...');
  POLLUX.destroy();
  process.exit(0)
})


//=======================================//
//      PROCESS EVENT HANDLER
//=======================================/*/

process.on('unhandledRejection', function(reason, p){
    airbrake.notify(reason,ok=>{
      console.log('Airbrake Notified');
      let embed = new RichEmbed();
      embed.setTitle("Unhandled Rejection")
      embed.setColor("#e3e32a")
      embed.setDescription(reason.stack)
      errHook.send(embed)
    });
    console.log("\n\n==================================")
    console.log("Possibly Unhandled Rejection at: Promise \n".red,p, "\n\n reason: ".red, reason.stack);
    console.log("==================================\n\n")
   // gear.sendSlack("Promise Breaker","Promise Rejection: "+reason,reason.stack,"#ffcd25" )

});

process.on('uncaughtException', function (err) {
     airbrake.notify(err,ok=>{
      console.log('Airbrake Notified');
      let embed = new RichEmbed();
      embed.setTitle("Unhandled Rejection")
      embed.setColor("#e3e32a")
      embed.setDescription(err.message)
      errHook.send(embed)
    });
    console.log("\n\n==================================")
    console.log('EXCEPTION: \n' + err);
    console.log(err.stack);
    console.log("==================================\n\n")
    //process.exit(1);

});
console.log("Pollux Core OK!")
