var gear = require("../../gearbox.js");
var paths = require("../../paths.js");
var fs = require("fs");
var cmd = 'background';
const eko = require("../../archetypes/ekonomist.js")
var locale = require('../../../utils/multilang_b');
var mm = locale.getT();


var init = function (message, userDB, DB) {
  const BGBASE = JSON.parse(fs.readFileSync("./resources/lists/backgrounds.json"))
  const pricechart = {
    EV: 85000,
    UR: 18907,
    SR: 8331,
    R: 4920,
    U: 2300,
    C: 950

  }
  let em = gear.emoji("rubine")
  var args = message.content.split(/ +/).slice(1)[0]
  
  let MSG=message.content
  
    let helpkey = mm("helpkey",{lngs:message.lang})
if (!args || MSG.split(/ +/)[1]==helpkey || MSG.split(/ +/)[1]=="?"|| MSG.split(/ +/)[1]=="help"){
    return gear.usage(cmd,message,this.cat);
}
  
  
  
  const y = message.botUser.emojis.get("339398829050953728")
  const n = message.botUser.emojis.get("339398829088571402")

  if (message.author.dDATA.modules.bgInventory.includes(args)) {
    message.channel.send(gear.emoji("yep"))
    message.channel.send({
      files: [paths.BUILD + "/backdrops/" + args + ".png"]
    })
                  message.author.dDATA.modules.bgID = args
               userDB.findOneAndUpdate({_id:message.author.id},message.author.dDATA).then(ok=>{
                 
              
     return message.channel.send(y+"Background equipped! :wink: ")
               })
    
  } else {
    let amt = BGBASE.filter(bg => bg.name == args)[0]
    console.log(typeof amt)
    
    let price = typeof amt == "object" ? (amt.price || pricechart[amt.rarity]) : false
    
    try{ 
      
    if(amt.event) price = pricechart.EV
    }catch(e){ 
      
    } 
    
    
    message.channel.send({
      files: [paths.BUILD + "/backdrops/" + args + ".png"]
    }).then(async img => {
      
      let affords = await eko.checkFunds(price,message.author.id);
      

      message.channel.send(gear.emoji("nope") + " BG not in Inventory. You could buy it for **" + gear.miliarize(price,"strict") + "**" + em + "Rubines")
      
            
      if(affords){
              message.channel.send("Do you want to buy this BG?").then(async m => {
        await m.react(y);
        m.react(n);
                
                const reas = await m.awaitReactions(react =>
                react.users.has(message.author.id), {
                    maxEmojis: 1,
                    time: 15000
                }
            ).catch(e => {
                   return message.channel.send(n+" Cancelled")
            });
                
             
            if (reas.size === 0 ||reas.size === 1&&reas.first().emoji==n) {
              return message.channel.send(n+" Cancelled")
            }
                 if (reas.size === 1&&reas.first().emoji==y) {
              await eko.pay(price,message.author.id, {type: 'shop'});
              message.author.dDATA.modules.bgInventory.push(args)
              message.author.dDATA.modules.bgID = args
              await userDB.findOneAndUpdate({_id:message.author.id},message.author.dDATA)
              
              return message.channel.send(y+"Background aquired and equipped! :wink: ")
              
            }
                
                
                
      })
      }else{
        return message.channel.send("But you cannot afford it :frowning: ")
      }
      

    }).catch(e => {

      return message.channel.send(gear.emoji("nope") + "Invalid Background Code")
    })






  }


  //message.channel.send("Backgrounds now can be get at <http://www.pollux.fun/bgshop>")



}

module.exports = {
  pub: true,
  cmd: cmd,
  perms: 3,
  init: init,
  cat: 'cosmetics'
};
