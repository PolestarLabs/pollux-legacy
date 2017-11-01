const gear = require("../gearbox.js")


const DB =  gear.DB
const uDB = gear.userDB
const EKO = gear.EKO


 
const main_currency =      "Rubines"
const secondary_currency = "Jades"
const premium_currency =   "Sapphire"



const currencies={
  main:{
    _id:"main",
    id:"rubines",
    name:"Rubines",
    emoji:gear.emoji('rubine'),
    volume:0,
    stash:100000,
    rate:1
  },
  
  side:{
    _id:"side",
    id:"jades",
    name:"Jades",
    emoji:gear.emoji('jade'),
    volume:0,
    stash:25000000,
    rate:.0025
  },
  premium:{
    _id:"premium",
    id:"sapphires",

    name:"Sapphires",
    emoji:gear.emoji('sapphire'),
    volume:0,
    stash:15000,
    rate:.0025
  }
  
}

try{
  

EKO.insert(currencies.main).catch(e=>{})
EKO.insert(currencies.side).catch(e=>{})
EKO.insert(currencies.premium).catch(e=>{})

}catch(e){console.log("INSERTO")}

const pay = async function pay(am,us,op){
 return transaction(am,us,op).then(res=>res);
}
 
const receive = async function receive(am,us,op){
  
  
  if(op && typeof op == 'object'){
    op.target = us
  }else{
    op = {target:us}
  }
  
  return transaction(am,"271394014358405121",op).then(res=>res)
}



async function balance(user,unit){
  unit = unit || 'main'
  let uid
  if(typeof user =='string') uid = user;
  else if(typeof user =='number') uid = user.toString();
  else uid = user.id;
 //console.log(uid)
 //console.log(typeof uid)
  let curr = currencies[unit].id 
  let usr = await uDB.findOne({_id:uid});
  let amt = usr?usr.modules[curr] :0
  return amt
}
  
  
async function transaction(amount,user_paying,options){

    amount = Number(amount)
    
    if(amount==NaN)return;
 
    
    let unit
    let target
    let type
  if(options){
    unit    = options.unit   || "main"
    target  = options.target || "271394014358405121"
    type    = options.type   || "trades"
  }else{
    unit    = "main"
    target  = "271394014358405121"
    type    = "trades"
  }
    

      target = target.id || target
  let uid
  if(typeof user_paying =='string') uid = user_paying;
  else if(typeof user_paying =='number') uid = user_paying.toString();
  else uid = user_paying.id;
    
    if (typeof uid!='string'){
      //console.log(typeof uid)
      //console.log(uid)

    }
   
    
       normalize(uid)
       normalize(target)
    
    let canbuy =await checkFunds(amount,uid,unit);
  if (!canbuy) {
    //console.log('no_funds')
    return// resolve(false);
  }
    

    
audit(amount,uid,target,unit,type);
if(!checkAuthent(uid,target)) {
  
  //console.log("NOAUTH");
  //return resolve(false);
}
    
//await checkout(amount,target,uid,unit,type);
  console.log("post-checkout");
  

}

async function checkout(amount,target,payer,unit,type){
  /*
  let curr = currencies[unit].id 
  
   console.log("ENTER CHECKOUT")
   console.log("===========================")
  
  let userdata=await uDB.findOne({_id:payer});
  let receiverdata=await uDB.findOne({_id:target});

    console.log("userdata.modules",curr,amount)
    userdata.modules[curr] -= amount
    receiverdata.modules[curr] += amount
  
  
    await uDB.findOneAndUpdate({_id:payer},userdata);
    await uDB.findOneAndUpdate({_id:target},receiverdata);
*/
    
  if(payer=="271394014358405121") await EKO.findOneAndUpdate({_id:unit},{$inc:{stash:-amount}});
     
} 

function checkAuthent(pay,receive){
  return true
  /*
  if(!uDB.get(pay) || !uDB.get(receive)) return false;
  if((!uDB.get(receive).modules.level<1||!uDB.get(receive).modules.level<1)&&(receive!="271394014358405121"&& pay!="271394014358405121")) return 'unsure';
  */
  return true;
}

async function audit(amount,user_paying,target,unit,type){
  let userdata=await uDB.findOne({_id:user_paying});
  let receiverdata=await uDB.findOne({_id:target});
  
  console.log("Ekonomist Audit ----------")
  console.log(amount,user_paying,target,unit,type)
  console.log(userdata.modules.audits[unit].earnings[type])
  console.log(userdata.modules.audits[unit].expenses[type])
  console.log("--------------------------")
  
    let curr = currencies[unit].id
    
    await checkDB(user_paying);
    await checkDB(target);
  
  
    userdata.modules.audits[unit].expenses[type] += amount
    receiverdata.modules.audits[unit].earnings[type] += amount
  
  
    await uDB.findOneAndUpdate({_id:user_paying},userdata);
    await uDB.findOneAndUpdate({_id:target},receiverdata);


  async function checkDB(UUU) {
    
    uDB.findOne({_id:UUU}).then(async AUDITS=>{
      
      console.log("AUDITS",typeof AUDITS)
      
     if (!AUDITS)return false;
    if (!AUDITS.modules.audits) await uDB.findOneAndUpdate({_id:UUU},{$set:{'modules.audits':{}}});
    if (!AUDITS.modules.audits[unit]) {
     let audits = {
        expenses: {},
        earnings: {}
      }
      await uDB.findOneAndUpdate({_id:UUU},{$set:{['modules.audits.'+unit]:audits}});
    }
    })
  }
}

const normalize =  function normalize(U) {
  console.log(U)
  return uDB.findOne({_id:U}).then(async USRDATA=>{

      if(!USRDATA)return;
    
    
  if (!USRDATA.modules.audits)await uDB.findOneAndUpdate({_id:U},{$set:{'modules.audits':{}}});
  uDB.findOne({_id:U}).then(async USRDATA=>{
    
  let unit=['main','side','premium']
  for (let i=0;i<3;i++){
    
  if (!USRDATA.modules.audits[unit[i]]) {
   let audits = {
      expenses: {
        trades:0
        ,shop:0
        ,drops:0
        ,exchange:0
        ,lewd:0
        ,gambling:0
        ,crafts:0
      },
      earnings: {
        trades:0
        ,shop:0
        ,drops:0
        ,exchange:0
        ,lewd:0
        ,gambling:0
        ,crafts:0
        ,dailies:0
      }
    }
    await uDB.findOneAndUpdate({_id:U},{$set:{['modules.audits.'+unit[i]]:audits}});
  }
}  
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
  

  let USRDATA = await uDB.findOne({_id:uid});
  
  let $ = USRDATA.modules[currencies[unit].id]

  if(!$)$=0;
  if (amount<=$) return true;
  else return false;
}

module.exports={
  normalize:normalize,
  checkFunds:checkFunds,
  pay:pay,
  balance:balance,
  receive:receive
}