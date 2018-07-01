const fs = require("fs");
const gear = require('../../gearbox.js')
const locale = require('../../../utils/multilang_b');
const mm = locale.getT();

const ITEMS = JSON.parse(fs.readFileSync("./resources/lists/items.json","utf8"))

const cmd = 'lootbox';
try{

const LOOT = require("../../archetypes/lootbox.js")
}catch(e){
  console.log(e)
}

const init = async function (message,userDB,DB) {
  try{
  //if(message.author.id!=='88120564400553984') return message.reply("**Lootboxes are temporarily disabled.** Fixing recent issues  ");

if(message.author.looting)return;
//if(banlist.includes(message.author.id))return;

  const P={lngs:message.lang,prefix:message.prefix}

  if(!message.guild.member(message.botUser.user).hasPermission(['ATTACH_FILES','EMBED_LINKS'])){
    return message.reply(mm('CMD.noPermsMe', {
                lngs: message.lang,
                prefix: message.prefix
            }));
  };

  let inventory = message.author.dDATA.modules.inventory
  let boxes = {}

  for (let i=0;i<inventory.length;i++){
    if (ITEMS[inventory[i]] && ITEMS[inventory[i]].type =="box"){
      boxes[inventory[i]] ? boxes[inventory[i]]++ : boxes[inventory[i]] = 1;
    }
  };

    let invent_prompt = ""
    let embed = new gear.Discord.RichEmbed
    embed.setColor("#ff527a")
    let avlb = {}

    for (i in boxes) {
       let _R = ITEMS[i].rarity
       let cmmde = ITEMS[i].rarity

      if (ITEMS[i].event) {
        cmmde = "EV"
        if (!avlb.EV)avlb.EV = [];
        avlb.EV.push(ITEMS[i].id)
      }else{

        if (!avlb[_R])avlb[_R] = [];
        avlb[_R].push(ITEMS[i].id)
      }
embed.setDescription(gear.emoji('loot')+` **Lootbox Inventory**
These boxes contains many goodies you can use to customise your profile\u200b
`)
      embed.setThumbnail('http://www.pollux.fun/build/chest.png')
      embed.addField(gear.emoji(_R) + (ITEMS[i].altemoji || "") + ` ${ITEMS[i].name}\u2003\`[x${boxes[i]}]\``,
   //       `${gear.emoji(ITEMS[i].emoji)}` + ` x${boxes[i]}
`Type \`open ${cmmde}\` to open this box.`,
          false
        )

    };

      embed.setFooter(message.author.tag,message.author.avatarURL||message.author.defaultAvatarURL)
    if (inventory.length==0){
      embed.setColor("#d84343")
      embed.description=gear.emoji("nope")+" No Lootboxes to Open"
    }
    message.channel.send({embed});
      const responses = await message.channel.awaitMessages(msg2 =>
          msg2.author.id === message.author.id && (
               msg2.content.toLowerCase().includes("lootbox")
            || (avlb.U  && msg2.content.toLowerCase() === ("open u")  )
            || (avlb.R  && msg2.content.toLowerCase() === ("open r")  )
            || (avlb.UR && msg2.content.toLowerCase() === ("open ur") )
            || (avlb.SR && msg2.content.toLowerCase() === ("open sr") )
            || (avlb.EV && msg2.content.toLowerCase() === ("open ev") )
            || (avlb.C  && msg2.content.toLowerCase() === ("open")    )
            || (avlb.C  && msg2.content.toLowerCase() === ("open c")  )
            || (msg2.content.toLowerCase() === ("open b0b")  )
          ), {
            maxMatches: 1,
            time: 30e3
          });

        if (responses.size === 0) return;

        const action = responses.first().content.toUpperCase();
        let A;
        if (action.includes("LOOTBOX")) return message.channel.send(gear.emoji("nope"));
        if (action == "OPEN"){
           A="C"
        }
        else{
           A=action.split(/ +/)[1]
        };
          if([A]=="B0B")return message.reply("u very indian");
          if(!avlb[A])return message.reply(mm("loot.notThisbox",P));

          let Ty = A
          let Ev = ""
          if(A=="EV"){
            Ty= ITEMS[avlb[A][0]].rarity
            Ev= ITEMS[avlb[A][0]].event.replace(":","")
          }

          let mess=message;
              mess.content = "loot "+Ty

          try{
              require("../dev/loot.js").init(mess,{
                issuer:"pollux",
                reducer:0,
                rarity:Ty,
                event:Ev,
                boxaher:avlb[A][0]
              })
           // message.author.dDATA.modules.inventory.splice(inventory.indexOf(avlb[A][0]),1) //less shit

          }catch(e){
            message.reply("ERROR")
            console.log(e)
          }
          }catch(e){
            message.reply("ERROR")
            console.log(e)
          }
    }

 module.exports = {
    pub:true,
    cmd: cmd,
    perms: 4,
    init: init,
    cat: 'misc'
};
