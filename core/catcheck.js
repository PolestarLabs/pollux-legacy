const gear = require('./gearbox.js');
var locale = require('../utils/multilang_b');
var mm = locale.getT();

exports.run = function(cat,msg,perms){
  
  if (!msg.channel.permissionsFor(msg.botUser.user).has("SEND_MESSAGES")){
    return;// 'error chan permis catchcheck'
  }
  
  
  if(perms&&typeof perms == "object"){
        if (!msg.channel.permissionsFor(msg.botUser.user).has(perms)){
          try{
            
      msg.react(":nope:339398829088571402")
      msg.channel.send(mm('error.iNeedThesePerms',{lngs:msg.lang,})+`
${"• "+perms.join('\n• ')}
`)
          }catch(e){
            
          }
      return "error";
    }
  }
  
  
  if(['img','social','cosmetics'].includes(cat)){
    
    if (!msg.channel.permissionsFor(msg.botUser.user).has("ATTACH_FILES")){
      msg.react(":nope:339398829088571402").catch(e=>null);
      msg.channel.send(mm('error.iNeedThesePerms',{lngs:msg.lang,})+`
• \`ATTACH_FILES\`
`).catch(e=>null)
      return "error";
    }
  }
  return "ok"
  
}