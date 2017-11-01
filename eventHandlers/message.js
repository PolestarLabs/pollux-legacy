const gear      = require('../core/gearbox.js');
const serverDB  = gear.serverDB;
const channelDB = gear.channelDB;
const userDB    = gear.userDB;

/*
FLOW

> DB checks
  -- user exist
  -- target exist
  -- server exist
  -- channel exist
*/



function dataChecks(type,ent){
  return new Promise(async resolve =>{
    if(type==="user"){
      userDB.findOne({id:ent.id}).then(user=>{
        if(!user) return resolve(userDB.new(ent));
        return resolve(user);
      });
    };
    if(type==="server"){
      serverDB.findOne({id:ent.id}).then(server=>{
        if(!server) return resolve(serverDB.new(ent));
        return resolve(server);
      });
    };
    if(type==="channel"){
      channelDB.findOne({id:ent.id}).then(channel=>{
        if(!channel) return resolve(channelDB.new(ent));
        return resolve(channel);
      });
    };
  });
};


exports.run = async function(bot, message){


  console.log((await dataChecks('user',message.author)).id)


}
