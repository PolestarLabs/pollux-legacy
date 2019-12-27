const colors=require('colors')

const {ShardingManager} = require('discord.js');  
//const gear = require('./core/gearbox.js');
const cfg = require('./config.json');
const rq = require("request");
//const messenger = require('messenger');

//let server = messenger.createListener(3055);
 
let guilds = 0;
let users = 0; 
let SHARDS= 'auto';  
let UNIT = 0

let ShardManager = new ShardingManager('./pollux_neounit.js',{
  token:cfg.token,
  respawn: true
  //totalShards: SHARDS
  //,shardList: 'auto'
  //,shardCount:4
 // ,mode: 'worker'
 

});
/*


  server.on('broadcast',(msg,data)=>{
    ShardManager.broadcastEval('try{'+data+'}catch(err){}').then(res=>{
      msg.reply(res);
    });
  });
  server.on('broadcast sum',(msg,data)=>{
    ShardManager.broadcastEval('try{'+data+'}catch(err){}').then(res=>{
      msg.reply(res.reduce((a,b)=>a+b));
    });
  });
  server.on('broadcast flat',(msg,data)=>{
    ShardManager.broadcastEval('try{'+data+'}catch(err){}').then(res=>{
      msg.reply(clean(flatten(res)),null);
    });
  })
  
*/

console.log('start')
ShardManager.spawn(SHARDS, 5200, -1).then(shards => {
  TFS();

  shards.forEach(SHD=>{

     SHD.on('death', subprocess=>{
      //console.log(subprocess)
      //subprocess.disconnect()
       console.log((">> DEATH ["+SHD.id+"]").red )
      // SHD.kill()
      // SHD.respawn(5000,false)
      })
      SHD.on('disconnect', ()=>{
        console.log((">> DISCON ["+SHD.id+"]").yellow)
        //SHD.kill()
        //SHD.respawn(5000,false)
      })
      SHD.on('message', message=>{
       // console.log("MESSAGE-CHILD",message);
      })
      SHD.on('ready', ()=>{
        setTimeout(()=>SHD.respawn(),  3*60*60*1000)
        console.log((">> READY ["+SHD.id+"]").green)
      })
      SHD.on('reconnecting', ()=>{
        console.log((">> RECON ["+SHD.id+"]").blue)
      })
      SHD.on('spawn', subprocess=>{

        console.log((">> SPAWN ["+SHD.id+"]").magenta )
        //subprocess.kill()
      })
    });
    
 // require('./core/cronjobs_global.js').run();
}).catch(e=> {
  console.error(e);
 
});

ShardManager.on("message",msg=>{
  eval(msg)
})

process.on("message",msg=>{
  eval(msg)
})

 

function clean(thiss,deleteValue) {
  for (var i = 0; i < thiss.length; i++) {

    if (thiss[i] == deleteValue) {
      thiss.splice(i, 1);
      i--;
    }
  }
  return thiss;
};

function flatten(arr) {
  return arr.reduce(function (flat, toFlatten) {
    return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
  }, []);
}
function TFS() {
    setTimeout(() => {
        getServs();
        setInterval(() => {
            getServs();
        }, 1000 * 60 * 50);
    }, 1000 * 10);
}

function getServs() {
    ShardManager.fetchClientValues('guilds.size').then(rst => {
        ShardManager.broadcastEval('var x=0;this.guilds.map(g => {x += g.memberCount});x;').then(r => {
            r = r.reduce((a, b) => a + b);
            let users = r;
            let g = rst.reduce((prev, val) => prev + val, 0);
            updateStats(g);
        }).catch(e=> {});
    }).catch(e=> {});
}

function updateStats(guilds) {

    let rqOptions = {
        headers: {
            Authorization: cfg.discordbots
        },
        url: `https://bots.discord.pw/api/bots/271394014358405121/stats`,
        method: 'POST',
        json: {
            "server_count": guilds
        }
    };

    rq(rqOptions, function (err, response, body) {
        if (err) {
            console.log("DBOTS PW ERROR",err)
        }

            console.log("PW OK",body)
    });

    let rqCarbon = {
        url: `https://www.carbonitex.net/discord/data/botdata.php`,
        method: 'POST',
        json: {
            "server_count": guilds,
            "key": cfg.carbonitex
        }
    };

    rq(rqCarbon, function (err, response, body) {
        if (err) {
            console.log("CARBON ERROR",err)
        }
console.log("Carbon OK",body)
    });

}


process.on('unhandledRejection', function(reason, p){

  //process.exit()

})