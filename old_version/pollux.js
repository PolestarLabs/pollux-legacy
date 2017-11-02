
  

//Discord Startconst gear = require("./sharding.js").gear;

const gear = require("./core/gearbox.js");
const Discoin = require("./core/archetypes/discoin.js");
const eko = require("./core/archetypes/ekonomist.js")

const rq = require("request");
var bot = new gear.Discord.Client({ 
    messageCacheMaxSize: 4048,
    messageCacheLifetime: 1680,
    messageSweepInterval: 2600,
    disableEveryone: true,
    fetchAllMembers: false,
    disabledEvents: ['typingStart', 'typingStop', 'guildMemberSpeaking']
});


const cfg = require('./config.js');
const discoin = new Discoin(cfg.DISCOIN);

//var console = {};
//console.log = function(){};

      // var Ector = require('ector');
         // var ector = new Ector({
         //   botname:"Pollux"
         // });

 
//======================================//
//      GENERATE RARITY LIBS
//======================================//

    
    

//=======================================//
//      TOOLSET
//======================================//

const deployer = require('./core/deployer.js'); // <------------- I DUN LIKE DIS << FIX
//==-------------------------------------------
// UTILITY

const fs = require("fs");
const paths = require("./core/paths.json");
const emojya = bot.emojis.get('343314186765336576');
//bot.ector =ector
//var cleverbot = require("cleverbot"); // <------------- REVIEW  DIS << NEEDS $ for CB fee
//cleverbot = new cleverbot(cfg.clever.ID, cfg.clever.token);
const async = require('async');
let timer;
const {
    AkairoClient
} = require('discord-akairo');
const client = new AkairoClient({
    ownerID: '88120564400553984',
    prefix: '+'
});
const skynet = '248285312353173505';
const colors = require('colors');
//==-------------------------------------------


//==-------------------------------------------
// MULTILANG

const i18next = require('i18next');
const multilang = require('./utils/multilang_b');
const Backend = require('i18next-node-fs-backend');
const backendOptions = {
    loadPath: './utils/lang/{{lng}}/{{ns}}.json',
    addPath: './utils/lang/dev/translation.json',
    jsonIndent: 2
};



getDirs('utils/lang/', (list) => {
    i18next.use(Backend).init({
        backend: backendOptions,
        lng: 'en',
      fallbackLng:"en",
        preload: list,
        load: 'all'
    }, async (err, t) => {
        if (err) {
            console.log(err)
        }

        await multilang.setT(t);
    });
})

const mm = multilang.getT();

//Gearbox assemble!


//Database load!

//let monkdb=require('monk')('localhost/pollux')

const DB =  gear.DB//monkdb.get('liethal')
const userDB = gear.userDB//monkdb.get('pilot_userdb')



const defaults = require("./utils/defaults.js")  // Database Defaults

//DASHBOARD INIT




//==-------------------------------------------

async function loginSuccess() {
  console.log('Starting up at Shard '+(1+bot.shard.id)+'/'+bot.shard.count)
    console.log('LOGGED IN!'.bgGreen.white.bold)

    let name = 'Pollux Core Reporter';
    let tx = `Successful Login!`;
    let color = '#49c7ff';

   // gear.sendSlack(name, tx, undefined, color)

// ACTIONS OVER TIME ▼▼▼▼▼▼▼▼▼▼

    setInterval(async function () {
      
      //DATE FOR EVERYONE
      let date = new Date();
      
      //EVERY MIDNITE-----------------------------------------------------------------
      if (date.getHours() === 0 && date.getMinutes() == 0 && date.getSeconds() == 0) {
        userDB.findOne({
          _id: bot.user.id
        }).then(async BOTDB => {

          if (!BOTDB.servsnow) {
            await gear.superDefine(bot.user, "servsnow", bot.guilds.size - 0);
          }
          
          
          userDB.findOne({
            _id: bot.user.id
          }).then(async BOTDB => {

            let payload = `
**Today's Growth Report**
Total new servers: ${bot.guilds.size - BOTDB.servsnow}
`
            await bot.channels.get("363598717414014977").send(payload);
            gear.superDefine(bot.user, "servsnow", bot.guilds.size)
          })
        })
      
      process.exit(1)
      } 
      //EVERY MIDNITE-----------------------------------------------------------------
      
      
      
      //EVERY 3 AM-----------------------------------------------------------------
      if (date.getHours() === 3 && date.getMinutes() === 0 && date.getSeconds() === 0) {

        let epc = date.getTime()
        userDB.findOneAndUpdate({_id:bot.user.id},{$set:{epochStamp:date,dailyEpoch:epc}})
        
      }
      //EVERY 3 AM-----------------------------------------------------------------
      
       
      
      //EVERY MINUTE-----------------------------------------------------------------
      
      
      if (date.getSeconds() === 0) {
        /* Change Game */
        let gchange = gear.gamechange()
        console.log("newGame:  " + gchange)
        bot.user.setGame(gchange)

        
        /* Exchange Currency */
        discoin.fetch().then(trades => {
          console.log("\n\nFETCHING TRADES")
          console.log(trades)
          console.log("--------------------\n\n")
          trades = JSON.parse(trades)

          if (trades.length == 0) return;

          for (i = 0; i < trades.length; i++) {

            let usr = trades[i].user + ""
            let ts = Date(trades[i].timestamp * 1000)
            let src = trades[i].source
            let amt = Math.floor(trades[i].amount)
            let inv = trades[i].receipt

            if (amt < 1) {
              discoin.reverse(inv);
              return bot.fetchUser(usr).then(u => u.send(`:warning: Transaction Reversed :: Amount of Rubines below Zero`))
            }

            userDB.findOne({
              _id: usr
            }).then(async USDATA => {
              
              console.log(usr)
              console.log(USDATA)
              
              if (!USDATA) {
                discoin.reverse(inv)
                bot.fetchUser(usr).then(u => u.send(`Transaction Reversed :: Not in Pollux Database`)).catch(e => console.log(e))
                return;
              }
              userDB.findOneAndUpdate({_id: usr}, {
                  $inc: {
                    'modules.rubines': amt,
                    'modules.audits.main.earnings.exchange': amt
                  }
                })
              bot.fetchUser(usr).then(u => u.send(`
:currency_exchange: 
**Exchange Processed!**
Received **${amt}** Rubines converted from ${src}!

At \`${ts}\`
Transaction Receipt: \`\`\`${inv}\`\`\`

`)).catch(async e => console.log(e))
              await eko.receive(amt, usr, {
                type: 'exchange'
              })
            })
          }
        });




        
      //EVERY FIVE MINUTES--------------------------------------------------------------
        if (date.getMinutes() % 20 == 0) {
          //process.exit(1)
        }

      }
      //EVERY MINUTE (END)-----------------------------------------------------------------

      //EVERY HOUR-----------------------------------------------------------------
      if (date.getMinutes() + date.getSeconds() == 0) {
        /*
        let accountsR = gear.userDB.map(usr => {
          if (usr.ID != "271394014358405121") return usr.modules.rubines || 0;
          if (usr.ID != "88120564400553984") return usr.modules.rubines || 0;
          else return 0;
        })

        let accountsJ = gear.userDB.map(usr => {
          if (usr.ID != "271394014358405121") return usr.modules.jades || 0;
          if (usr.ID != "88120564400553984") return usr.modules.jades || 0;
          else return 0;
        })
        let accountsS = gear.userDB.map(usr => {
          if (usr.ID != "271394014358405121") return usr.modules.sapphires || 0;
          if (usr.ID != "88120564400553984") return usr.modules.sapphires || 0;
          else return 0;
        })

        let unita = gear.userDB.size
        let sum1 = Math.round(Math.sqrt(accountsS.reduce(add, 0)))
        let sum2 = Math.round(Math.sqrt(accountsJ.reduce(add, 0)))
        let sum3 = Math.round(Math.sqrt(accountsR.reduce(add, 0)))

        function add(a, b) {
          return a + b;
        }
        let ky = "" + date.getTime()
        //console.log(sum)
        gear.ecoDB.set(ky, {
          rubine: sum3,
          jade: sum2,
          sapphire: sum1
        })
*/
      }

    }, 1000); // EVERY SEC

  setInterval(function () {
    //CLEAR EV CACHE
    fs.readdir("./eventHandlers/", (err, files) => {
      if (err) return console.error(err);
      files.forEach(file => {
        delete require.cache[require.resolve(`./eventHandlers/${file}`)]
      });
      //postGCount(bot.guilds.size);
    });

  }, (60000 * 15)); // EVERY 15 MINS
  
// ACTIONS OVER TIME ▲▲▲▲▲▲▲▲▲
}



 // const dash = require("./dash/server.js")
 // bot.discordOutage = true
 //dash.init(bot,gear.DB,gear.userDB)

//=====================================

Array.prototype.removeire = function removeire() {
    var what, a = arguments,
        L = a.length,
        ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

//=======================================//
//      FUNCTIONFEST
//=======================================//

function getDirs(rootDir, cb) {
    fs.readdir(rootDir, function (err, files) {
        var dirs = [];
        for (var i = 0; i < files.length; ++i) {
            var file = files[i];
            if (file[0] !== '.') {
                var filePath = rootDir + '/' + file;
                fs.stat(filePath, function (err, stat) {
                    if (stat.isDirectory()) {
                        dirs.push(this.file);
                    }
                    if (files.length === (this.index + 1)) {
                        return cb(dirs);
                    }
                }.bind({
                    index: i,
                    file: file
                }));
            }
        }
    })
} //detatch (nope)

async function commandFire(message, Server, Channel, Author) {
  
               let Database_bot =   await userDB.findOne({_id:bot.user.id});
               let Database_user =   await userDB.findOne({_id:Author.id});
               let Database_server = await DB.findOne({_id:Server.id});
    bot.dDATA = Database_bot;
    message.botUser = bot;
    message.akairo = client;
  
    let Target = message.mentions.users.size>0?message.mentions.users.first():message.author;
    if(Target){ 
    let Database_target = await userDB.findOne({_id:Target.id});
    message.target        = Target
    message.target.dDATA   = Database_target
    }else{
    message.target        = Author
      Object.assign( Target.dDATA,  Database_user );
    }

    
      Object.assign( message.guild.dDATA,  Database_server );
      Object.assign( message.author.dDATA, Database_user   );
      Object.assign( message.channel.dDATA,Database_server.channels[Channel.id]);
    
  
    if(!message.prefix) message.prefix = (await DB.findOne({_id:Server.id})).modules.PREFIX;
    let forbiddens = []//Server.dDATA.channels[Channel.id].modules.DISABLED

    let DTMN = deployer.determine(message)
    let MDLE = deployer.checkModule(DTMN);
 
    if (!DTMN) return;
    if (DTMN.reaction) {
        if (forbiddens.includes(MDLE)) return;
        if (deployer.checkUse(DTMN, DB, message)!==true) return;
        return message.channel.send({files: [DTMN.reaction]});
    };
    try {

      if (forbiddens.includes(MDLE)) {
        return message.reply("forbidden")
      }
    } catch (e) {

    }
    var mm = multilang.getT();
    switch (deployer.checkUse(DTMN, DB, message)) {
        case "NONSFW":
        message.reply(mm('CMD.not-a-NSFW-channel', {
                lngs: message.lang
            }))
            
            break;
        case "DISABLED":
            message.reply(mm('CMD.disabledModule', {
                lngs: message.lang,
                module: message.content.substr(message.prefix.length).split(' ')[0]
            }))
            break;
        case "NO ELEVATION":
            message.reply(mm('CMD.insuperms', {
                lngs: message.lang,
                prefix: message.prefix
            }))
            break;
        default:
            deployer.run(DTMN.path, message, userDB, DB); //aqui nóis vai!
            break;
    }
}

function DMcommandFire(message) {

    message.botUser = bot;
    message.akairo = client;


    if(!message.prefix) message.prefix = "+"

    let DTMN = deployer.determine(message)
  //  let MDLE = deployer.checkModule(DTMN);

    if (!DTMN) return;
    if (DTMN.reaction) {
      //  if (forbiddens.includes(MDLE)) return;
      //  if (deployer.checkUse(DTMN, DB, message)!==true) return;
      //  return message.channel.send({files: [DTMN.reaction]});
    };



            deployer.run(DTMN.path, message, userDB); //aqui nóis vai!

}


bot.login(cfg.truetoken).then(loginSuccess());


//=======================================//
//      BOT EVENT HANDLER
//=======================================//

fs.readdir("./eventHandlers/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    let eventor = require(`./eventHandlers/${file}`);
    let eventide = file.split(".")[0];

    bot.on(eventide, (...args) => eventor.run(gear,DB,userDB,bot, ...args));
  });
});

  



  
//=======================================//
//      PROCESS EVENT HANDLER
//=======================================/*/

process.on('unhandledRejection', function(reason, p){
  
    console.log("\n==================================")
    console.log("Possibly Unhandled Rejection at: Promise \n".red,p, "\n\n reason: ".red, reason.stack);
    console.log("==================================\n")

   // gear.sendSlack("Promise Breaker","Promise Rejection: "+reason,reason.stack,"#ffcd25" )
});
process.on('uncaughtException', function (err) {

    console.log('EXCEPTION: '.bgRed.white.bold + err);
    console.log(err.stack);
  process.exit(1);

    

}); 

function postGCount(g) {

    let rqORG = {
        headers: {
            Authorization: cfg.dborg
        },
        url: `https://discordbots.org/api/bots/271394014358405121/stats`,
        method: 'POST',
        body: {
            server_count: g
        },
        json: true
    };
    rq(rqORG, function (err, response, body) {
        if (err) {
        console.log("ORG");
        console.log(err)
        }
        //console.log("ORG");
        //console.log(response);
        //console.log(body);
    });

    let rqOptions = {
        headers: {
            Authorization: cfg.pwTok3
        },
        url: `https://bots.discord.pw/api/bots/271394014358405121/stats`,
        method: 'POST',
        body: {
            server_count: g
        },
        json: true
    };

    rq(rqOptions, function (err, response, body) {
        if (err) {
            console.log("PW");
            console.log(err)
        }
        console.log("PW");
        //  console.log(response);
        console.log(body);
    });

    /*
        });
        let rqCarbon = {
            url: `https://www.carbonitex.net/discord/data/botdata.php`,
            method: 'POST',
            json: {
                "server_count": g,
                "key": cfg.carbon_token //SOON
            }
        };
        rq(rqCarbon, function (err, response, body) {
            if (err) {
                console.log(err)
            }
        });
    */

}

//---------------------------------------------------------------------------------------- END

module.exports = {
    commandFire: commandFire,
    DMcommandFire: DMcommandFire,
    postGCount: postGCount,
    bot:bot
};
