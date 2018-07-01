

const Schemas = require('./schemas.js');

const userDB    = Schemas.user;
const serverDB  = Schemas.server;
const channelDB = Schemas.channel;
const globalDB = Schemas.global;
const items = Schemas.items;
const fanart = Schemas.fanart;
const collectibles = Schemas.collectibles;

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
items.new = function(obj){
  return new Promise(async resolve=>{
    let instance = new items;
    instance.save(function(e){
      if(e)throw ["USER Database Save Failed",e];
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
    instance.server=obj.guild.id;
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


fanart.getAll    = async function(){return (await fanart.find({}))};
fanart.getFan    = async function(){return (await fanart.find({author_ID:{$not:"88120564400553984"}}))};
fanart.getOriginal    = async function(){return (await fanart.find({author_ID:"88120564400553984"}))};
fanart.set  = function(query,alter){
  return new Promise(async resolve=>{
    if(['string','number'].includes(typeof query)){
      query = {'_id':query.toString()};
    };
    if(!typeof alter) throw "Invalid Alter Object";
    return resolve(this.findOneAndUpdate(query,alter,{upsert:true}));
  })
};


items.set    = set;
items.getAll    = async function(){return (await items.find({}))};

items.get    = async function(id){
  return (await items.findOne({id:id}))
};
items.cat    = async function(cat){
  return (await items.findOne({type:cat}))
};
items.consume = async function (id, item) {
  return new Promise(async resolve => {
    userDB.findOneAndUpdate({'id': id,'modules.inventory': item}, {
        $set: {'modules.inventory.$': 'DRAGGE'}
    }).then(async x => {
      return resolve(userDB.findOneAndUpdate({'id': id}, {
        $pull: {'modules.inventory': 'DRAGGE'}
      }));
    })
  })
};
collectibles.set    = set;
collectibles.bgs    = async function(filter){return (await collectibles.find(filter||{public:true,type:"background"})).reverse()};
collectibles.medals    = async function(filter){return (await collectibles.find(filter||{public:true,type:"medal"}))};
collectibles.stickers    = async function(filter){return (await collectibles.find(filter||{public:true,type:"sticker"})).reverse()};


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
module.exports={collectibles,userDB,serverDB,channelDB,globalDB,items,fanart}


console.log("Database Ops OK!")
