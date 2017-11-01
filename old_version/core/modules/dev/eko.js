var cmd = 'report';
const gear = require("../../gearbox.js")

 

var init = async function (message,userDB,DB) {
  delete require.cache[require.resolve("../../archetypes/ekonomist.js")]
const eko = require("../../archetypes/ekonomist.js")
  let out=message.author.id
  let inn=message.mentions.users.first().id
  

  
 message.channel.send("OUTBOUND :"+out)
 message.channel.send("INBOUND :"+inn)

await message.channel.send(`Balances Before:
me: ${eko.balance(out)} || him: ${(await eko.balance(inn))}`)

 await eko.pay(500,message.author,{target:inn})
 await message.channel.send("**Poof**")
 await message.channel.send(`Balances After :
me: ${eko.balance(out)} || him: ${(await eko.balance(inn))}`)

}
  
 module.exports = {
    pub:true,
    cmd: cmd,
    perms:2,
    init: init,
    cat: 'dev'
};
 