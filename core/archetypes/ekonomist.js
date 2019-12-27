const gear = require("../gearbox.js")
const DB =  gear.serverDB;
const uDB = gear.userDB;
const Promise = require("bluebird");
//const EKO = gear.EKO
  const auditTemplate={
                rubines:{earnings:{},expenses:{}},
                jades:{earnings:{},expenses:{}},
                sapphires:{earnings:{},expenses:{}}
  }
const currencies={
  main:{
    id:"rubines",
    name:"Rubines",
    emoji:gear.emoji('rubine'),
    volume:0,
    stash:100000,
    rate:1
  },
  side:{
    id:"jades",
    name:"Jades",
    emoji:gear.emoji('jade'),
    volume:0,
    stash:25000000,
    rate:.0025
  },
  premium:{
    id:"sapphires",
    name:"Sapphires",
    emoji:gear.emoji('sapphire'),
    volume:0,
    stash:15000,
    rate:.0025
  }
}

const pay = function pay(am,us,op){
 return transaction(am,us,op);
}

const receive = function receive(am,us,op){
  if(op && typeof op == 'object'){
    op.target = us
  }else{
    op = {target:us}
  }
  return transaction(am,"271394014358405121",op);
}



function balance(user,unit){
  return new Promise(async resolve=>{
    unit = unit || 'main'
    let uid;
    if(typeof user =='string') uid = user;
    else if(typeof user =='number') uid = user.toString();
    else uid = user.id;
    let curr = currencies[unit].id;
    let usr = await uDB.findOne({id:uid});
    let amt = usr?usr.modules[curr] :0;
    return resolve(amt);
  })
};

function transaction(amount,user_paying,options){
  return new Promise(async (resolve,reject)=>{

    amount = Number(amount);

    if(amount==NaN)return;
    let unit,target,type;

  if(options){
    unit    = options.unit   || "main"
    target  = options.target || "271394014358405121"
    type    = options.type   || "trades"
  }else{
    unit    = "main"
    target  = "271394014358405121"
    type    = "trades"
  };

      target = target.id || target
  let uid
  if(typeof user_paying =='string') uid = user_paying;
  else if(typeof user_paying =='number') uid = user_paying.toString();
  else uid = user_paying.id;

    normalize(uid)
    normalize(target)

    let canbuy = await checkFunds(amount, uid, unit);
    if (!canbuy) {
      return reject("No Funds");
    }

    audit(amount, uid, target, unit, type);
    if (!checkAuthent(uid, target)) {
      
      //return resolve(false);
    }

    return resolve(checkout(amount,target,uid,unit,type));
  })
}

function checkout(amount,target,payer,unit,type){
  return new Promise(async resolve=>{

    let curr = currencies[unit].id
    
    
    await gear.userDB.findOneAndUpdate({id:payer},{$inc:{['modules.'+curr]:-amount}});
    await gear.userDB.findOneAndUpdate({id:target},{$inc:{['modules.'+curr]:amount}});
    return resolve(true);
  });



};

function checkAuthent(pay,receive){
  return true
  /*
  if(!uDB.get(pay) || !uDB.get(receive)) return false;
  if((!uDB.get(receive).modules.level<1||!uDB.get(receive).modules.level<1)&&(receive!="271394014358405121"&& pay!="271394014358405121")) return 'unsure';
  */
}

async function audit(amount,user_paying,target,unit,type){
  return;
    await checkDB(user_paying);
    await checkDB(target);
  let userdata=await uDB.findOne({id:user_paying});
  let receiverdata=await uDB.findOne({id:target});
    let curr = currencies[unit].id

    await uDB.findOneAndUpdate({id:user_paying},{
      $inc:{['modules.audits.'+curr+'.expenses.'+type]:-amount},
    });
    await uDB.findOneAndUpdate({id:target},{
      $inc:{['modules.audits.'+curr+'.earnings.'+type]:amount},
    });

  async function checkDB(UUU) {
    uDB.findOne({id:UUU}).then(async AUDITS=>{
      if (!AUDITS)return false;
      if (!AUDITS.modules.audits) await uDB.findOneAndUpdate({id:UUU},{$set:{'modules.audits':{}}});
      if (!AUDITS.modules.audits[unit]) {
       let audits = {
          expenses: {},
          earnings: {}
        }
      await uDB.findOneAndUpdate({id:UUU},{$set:{['modules.audits.'+unit]:audits}});
    }
    })
  }
};

const normalize =  function normalize(U) {
  
  return uDB.findOne({id:U}).then(async USRDATA=>{
      if(!USRDATA)return;

  if (!USRDATA.modules.audits)await uDB.findOneAndUpdate({id:U},{$set:{'modules.audits':auditTemplate}});
  uDB.findOne({id:U}).then(async USRDATA=>{

  let unit=['rubines','jades','sapphires']

  })
  })
  }

const checkFunds = async function checkFunds(amount,user,unit){

  if(user=="271394014358405121")return true;
  if(!unit)unit='main';
   amount = Number(amount)
  if(isNaN(amount))return false;
  let uid
  if(typeof user =='string') uid = user;
  else if(typeof user =='number') uid = user.toString();
  else uid = user.id;

  let USRDATA = await uDB.findOne({id:uid});
  let $ = USRDATA.modules[currencies[unit].id]
  if(!$)$=0;
  if (amount<=$) return true;
  else return false;
}

module.exports={
  normalize,checkFunds,
  pay,balance,receive,
  auditTemplate
}
