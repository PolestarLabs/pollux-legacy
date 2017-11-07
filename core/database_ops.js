

const Schemas = require('./schemas.js');

const userDB    = Schemas.user;
const serverDB  = Schemas.server;
const channelDB = Schemas.channel;
const globalDB = Schemas.global;

const Promise = require("bluebird");

userDB.new = function(obj){
  return new Promise(async resolve=>{
    let instance = new userDB;
    instance.id=obj.id;
    instance.tag=obj.tag;
    instance.name=obj.username;
    instance.save(function(e){
      if(e)throw ["USER Database Save Failed",e];
      else resolve(userDB.findOne({id:obj.id}));
    });
  });
};
serverDB.new = function(obj){
  return new Promise(async resolve=>{
    let instance = new serverDB;
    instance.id=obj.id;
    instance.name=obj.name;
    instance.channels=obj.channels.map(ch=>ch.id);
    instance.save(function(e){
      if(e)throw ["SERVER Database Save Failed",e];
      else resolve(serverDB.findOne({id:obj.id}));
    });
  });
};
channelDB.new = function(obj){
  return new Promise(async resolve=>{
    let instance = new channelDB;
    instance.id=obj.id;
    instance.server=obj.guild.id;
    instance.name=obj.name;
    instance.save(function(e){
      if(e)throw ["CHANNEL Database Save Failed",e];
      else resolve(channelDB.findOne({id:obj.id}));
    });
  });
};

const set = function(query,alter){
  return new Promise(async resolve=>{
    if(['string','number'].includes(typeof query)){
      query = {'id':query.toString()};
    };
    if(!typeof alter) throw "Invalid Alter Object";
    return resolve(this.findOneAndUpdate(query,alter));
  })
};

userDB.set    = set;
serverDB.set  = set;
channelDB.set = set;
globalDB.set  = function(alter){
  if(!typeof alter) throw "Invalid Alter Object";
  return globalDB.findOneAndUpdate({id:0},alter);
};
globalDB.get  = async function(){
  try{
  return (await globalDB.findOne()).data;
  }catch(e){
  return (await globalDB.findOne());
  }
};
module.exports={userDB,serverDB,channelDB,globalDB}


console.log("Database Ops OK!")
