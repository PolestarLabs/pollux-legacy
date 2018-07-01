const Discord = require('discord.js');
const gear = require('./core/gearbox.js');
const cfg = require('./config.json');
const rq = require("request");
const messenger = require('messenger');

let server = messenger.createListener(3055);


let guilds = 0;
let users = 0;
let SHARDS= 5;

let ShardManager = new Discord.ShardingManager('./pollux.js',{token:cfg.token}, true);


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


ShardManager.spawn(SHARDS).then(shards => {
  TFS()


}).catch(e=> {
  console.log(e)
});
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
            console.log(err)
        }

            console.log(body)
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
            console.log(err)
        }
console.log(body)
    });

}


