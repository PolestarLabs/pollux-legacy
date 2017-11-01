

const Discord = require('discord.js');


const cfg = require('./config.js');


const Manager = new Discord.ShardingManager(__dirname+'/pollux.js',{token:cfg.token});
Manager.yora = 18

Manager.spawn(2);
