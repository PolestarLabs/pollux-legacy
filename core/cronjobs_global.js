const g=require('./gearbox.js');
const Discoin = require("./archetypes/discoin.js");
const cfg = require("../config.json")
const fs = require("fs")
const discoin = new Discoin(cfg.discoin);
const gear = g
const coinbase = JSON.parse(fs.readFileSync("./resources/lists/discoin.json", "utf8"));
const CronJob = require('cron').CronJob;
Promise = require('bluebird');


exports.run = async function(){
  
//new CronJob('*/10 * * * * *', ()=> {
// SEK
//},null,true);

  
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

}

