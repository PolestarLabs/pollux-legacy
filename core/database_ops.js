

const Schemas = require('./schemas.js');

const audits    = Schemas.audit;
const userDB    = Schemas.user;
const serverDB  = Schemas.server;
const channelDB = Schemas.channel;
const globalDB = Schemas.global;
const items = Schemas.items;
const fanart = Schemas.fanart;
const fishes = Schemas.fish;
const cosmetics = Schemas.cosmetics; 
const collectibles = Schemas.collectibles; 
const buyables = Schemas.buyables;
const localranks = Schemas.localranks; 
const assorted = Schemas.assorted;

const Promise = require("bluebird");





userDB.new = function(obj){
  return new Promise(async resolve=>{
    userDB.findOne({id:obj.id},{id:1}).lean().exec().then(usry=>{
      if (usry||usry!=null) return resolve(usry);
    let instance = new userDB;
    let avatarImg = typeof obj.displayAvatarURL == 'function' ? obj.displayAvatarURL({format:'png'}) : obj.avatar;
    instance.id=obj.id;
    instance.tag=obj.tag;
    instance.name=obj.username;
      instance.meta={
        tag: obj.tag,
        username: obj.username,
        discriminator: obj.discriminator,
        avatar: avatarImg,
      }
      instance.save(function(e){
      if(e)return resolve(userDB.findOne({id:obj.id}));//console.warn("USER Database Save Failed",e).lean().exec();
        else resolve(userDB.findOne({id:obj.id}).lean().exec());
      });
      
    })
  });
};

audits.new = function(obj){
  return new Promise(async resolve=>{
    let instance = new audits;
    instance.from = obj.from
    instance.transactionId = obj.transactionId
    instance.timestamp = obj.timestamp
    instance.currency = obj.currency
    instance.type = obj.type
    instance.amt = obj.amt
    instance.to = obj.to
    instance.transaction = obj.transaction

      instance.save(function(e){
          resolve(audits.findOne({transactionId:obj.transactionId}));
      });
      

  });
};



items.new = function(obj){
  return new Promise(async resolve=>{
    let instance = new items;
    instance.save(function(e){
       if(e)return console.warn("ITEM Database Save Failed",e);
    });
  });
};
serverDB.new = function(obj){
  return new Promise(async resolve=>{
    let instance = new serverDB;
      serverDB.findOne({id:obj.id},{id:1}).then(usry=>{
        //console.error({usry,stata:"NEW SV"})
      if (usry&&usry!=null) return resolve(usry);
        //console.error({usry,stata:"NEW SV--->",xx:obj.name})
    instance.id=obj.id;
    instance.name=obj.name;
    instance.channels=obj.channels.map(ch=>ch.id);
    instance.meta={     
      name: obj.name,      
      icon: obj.iconURL,
    }
    instance.save(function(e){
      if(e){ resolve(serverDB.findOne({id:obj.id})); return console.warn("SV Database Save Failed".red,e);}
      else resolve(serverDB.findOne({id:obj.id},{id:1}));
    });
    });
  });
};
channelDB.new = function(obj){
  return new Promise(async resolve=>{
    let instance = new channelDB;
     channelDB.findOne({id:obj.id},{id:1}).then(usry=>{
      if (usry||usry!=null) return resolve(usry);
    
    instance.id=obj.id;
    instance.server=obj.guild.id;
    instance.name=obj.name;
    instance.server=obj.guild.id;
    instance.save(function(e){
        if(e)return resolve(channelDB.findOne({id:obj.id}));//console.warn("USER Database Save Failed",e);
      else resolve(channelDB.findOne({id:obj.id}));
    });
  });
  });
};

const set = function(query,alter){
  return new Promise(async resolve=>{
    if(['string','number'].includes(typeof query)){
      query = {'id':query.toString()};
    };
    if(!typeof alter) resolve (null);
    return resolve(this.updateOne(query,alter));
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
    if(!typeof alter) resolve( "Invalid Alter Object");
    return resolve(this.updateOne(query,alter,{upsert:true}));
  })
};

collectibles.set    = set;
collectibles.getAll    = async function(){return (await collectibles.find({}))};
collectibles.get    = async function(id){
  return (await collectibles.findOne({id:id}))
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
    userDB.updateOne({'id': id,'modules.inventory': item}, {
        $set: {'modules.inventory.$': 'DRAGGE'}
    }).then(async x => {
      return resolve(userDB.updateOne({'id': id}, {
        $pull: {'modules.inventory': 'DRAGGE'}
      }));
    })
  })
};
cosmetics.set    = set;
cosmetics.bgs    = async function(filter){return (await cosmetics.find(filter||{public:true,type:"background"})).reverse()};
cosmetics.medals    = async function(filter){return (await cosmetics.find(filter||{public:true,type:"medal"}).sort({_id:1}))};
cosmetics.stickers    = async function(filter){return (await cosmetics.find(filter||{public:true,type:"sticker"})).reverse()};


userDB.set    = set;
serverDB.set  = set;
channelDB.set = set;
globalDB.set  = function(alter){
  if(!typeof alter) console.warn( "Invalid Alter Object");
  return globalDB.updateOne({id:0},alter);
};
globalDB.get  = async function(nodata){
  try{
    if(!nodata){

      return (await globalDB.findOne()).data;
    }else{

      return (await globalDB.findOne());
    }
  }catch(e){
  return (await globalDB.findOne());
  }
};






localranks.set = set;
localranks.new = (US) => {
  let U=(US.U||{id:US.U}).id;
  let S=(US.S||{id:US.S}).id;
localranks.findOne({user:U,server:S}, (err, rank) => {
   if (err) {
      console.error(err)
   }
   if (rank) {
     // Nothing
   } else {
      let rank = new localranks({
        server: S,
        user: U,
        level: 0,
        exp: 0
      });
      rank.save((err) => {
        if (err) return console.error(err);
      });
   }
});
}

localranks.incrementExp= (US,X=1) => {
  return this.updateOne({user:US.U,server:US.S},{$inc:{exp:X}});
}
localranks.incrementLv= (US,X=1) => {
  return this.updateOne({user:US.U,server:US.S},{$inc:{level:X}});
}


 


assorted.new = function(obj){


  return new Promise(async resolve=>{
    let instance = new assorted;
    Object.assign(instance,obj)   
    instance.save(function(e){
      if(e)return console.warn("ASSORTED Database Save Failed",e);
             resolve(assorted.findOne({"user":obj.user,"data.returnTime":obj.data.returnTime}));
         });
     });



};

 
module.exports={assorted,localranks,buyables,cosmetics,userDB,serverDB,channelDB,globalDB,items,fanart,audits,collectibles}
