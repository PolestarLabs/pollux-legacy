const Discord = require('discord.js');
const gear = require('./core/gearbox.js');
const cfg = require('./config.json');
const rq = require("request");

let guilds = 0;
let users = 0;
let SHARDS= 1

let ShardManager = new Discord.ShardingManager('./pollux.js',{token:cfg.token}, true);

ShardManager.spawn(SHARDS).then(shards => {
  TFS();
}).catch(e=> {
  let a = (new Error);
});

function TFS() {
    setTimeout(() => {
        getServs();
        setInterval(() => {
            getServs();
        }, 1000 * 60 * 5);
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
            Authorization: cfg.pwTok3
        },
        url: `https://bots.discord.pw/api/bots/${cfg.pwID}/stats`,
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
            "key": cfg.carbon_token
        }
    };

    rq(rqCarbon, function (err, response, body) {
        if (err) {
            console.log(err)
        }

    });

}


