const fs = require("fs");
const gear = require('../../gearbox.js')
const {userDB} = require('../../gearbox.js')
const paths = require("../../paths.json");
//const locale = require('../../../utils/multilang_b');
//const mm = locale.getT();

const cmd = 'trade';

const init = async function (message) {


    
  if([ "wardrobe" ,"costume"].includes(message.args[0])){
    let nmsg = message
    nmsg.content=nmsg.content.replace("costume","trade")
    nmsg.content=nmsg.content.replace("wardrobe","trade")
    nmsg.args[0] = "trade"
    return require("../!event/wardrobe.js").init(nmsg)
  }
  
  
  
  
    banlist=['345030635917934592']
if(message.author.looting)return;
if(banlist.includes(message.author.id))return;


  if(message.author.trading) {
    setTimeout(()=>message.author.trading=false,50000);
    return message.reply("Trade Cooldown ongoing (50s)");
  } 
    message.author.trading=true;
  

const ITEMS = await gear.items.find({type:'box'});

     const yep =  gear.emoji("yep")
     const nop =  gear.emoji("nope")
     const Channel = message.channel;
     const Author = message.author;
     const Target = message.mentions.users.first() || Author;
     const MSG = message.content;
     const bot = message.botUser

    const LANG = message.lang;
    let meny;

    const args = MSG.split(/ +/).slice(1)
    const inventory = (await gear.userDB.findOne({id:Author.id},{"modules.inventory":1}).lean().exec()).modules.inventory;

    if (args.length== 2){

      if (typeof args[0] == 'string'){

        let itAmt = ITEMS.filter(itm=>inventory.includes(itm.id) && itm.type==args[0])
        if (itAmt.length == 0) return message.reply(gear.emoji("nope"));
        if (itAmt.length == 1) {
           let invids = itAmt.map(i=>i.id);
           sendBox(invids,true);
        };
        if (itAmt.length >= 2) {
           let invids = itAmt.map(i=>i.id)
           let opts =""
           for (i=0;i<itAmt.length;i++){

             opts+=`
${( itAmt[i].tradeable===true?">-":"> ")}[${i}][${itAmt[i].name}]`
           }
            meny = await message.reply("```md\n"+opts+"```").then(m=>sendBox(invids,false,m))
        }
      }
    };

    if (args.length== 3){
      if (typeof args[0] == 'number' && typeof args[1] == 'string'){

      } // X items (GIVE)

      if (typeof args[0] == 'string' && typeof args[1] == 'number'){

      } // 1 item for X (SELL)

      //if (typeof args[0] == 'string' && typeof args[1] == 'string') // items for items?
    };

    /*
    1 - (QTD)
    2 - item type
    3 - (PRICE)

    >  +trade 1 box         @mention
    >  +trade 1 box [price] @mention
    >  +trade   box [price] @mention
    >  +trade   box         @mention

    <  accept
    */

  async function sendBox(tradeit,direct,me){
    
    let index,item,resp;
    if (!direct) {
       resp = await Channel.awaitMessages(mms =>
        mms.author.id === message.author.id &&
        (!isNaN(Number(mms.content)) &&
        Number(mms.content) < tradeit.length &&
        Number(mms.content) >= 0||mms.content.toLowerCase().includes('trade')), {
          max: 1,
          time: 5000
        }
      )
 me.delete({timeout:12500}).catch(e=>"die silent");
 message.delete({timeout:2500}).catch(e=>"die silent");
      if (resp.size == 0) return;

if (resp.first().content.toLowerCase().includes("trade")) return message.channel.send(gear.emoji("nope"));

      index = Math.abs(Math.floor(Number(resp.first().content)))
      item = tradeit[index]
    }else{
      item = tradeit[0]
    }
    let selectedBox = ITEMS.find(x=>x.id==item);
    if(!selectedBox.tradeable) return message.reply("This box cannot be traded!");
    let m1 = await message.reply(gear.emoji(selectedBox.emoji)+" **"+selectedBox.name+"**");
    let m2 = await message.channel.send("`ok`"+yep+" || `c`"+nop);

    const resp2 = await Channel.awaitMessages(mms=>
                          mms.author.id === message.author.id && (
                            mms.content=="ok"||
                            mms.content=="c" ||
                            mms.content.toLowerCase().includes('trade')
                            ),{
                            max: 1,
                            time: 5e3
                          });

    if (resp2.size == 0) return message.reply("timeout");
    let response = resp2.first().content;
if (response.toLowerCase().includes("trade")) return message.channel.send(gear.emoji("nope"));

    if (response=="ok"){
      inventory.splice(inventory.indexOf(item),1)
      await userDB.set(Author.id,{$set:{'modules.inventory':inventory}});
      await gear.audit(Author.id,1,"trade["+item+"]",item,">",Target.id);
      await userDB.set(Target.id,{$push:{'modules.inventory':item}});
try{

      resp2.first().delete().catch(e=>"die silent")
      resp.first().delete().catch(e=>"die silent")
      message.delete().catch(e=>"die silent")
      m1.delete().catch(e=>"die silent")
      m2.delete().catch(e=>"die silent")
      meny.delete().catch(e=>"die silent")
}catch(e){

}
      let boxItem = gear.emoji(selectedBox.rarity)+selectedBox.altEmoji+"**"+selectedBox.name+"**";
      let aftereport = mm('responses.trade.boxent',`${Author.tag} sent a ${boxItem} to <@${Target.id}>`,
                      {
        author: Author.tag,
        lngs:message.lang,
        box: boxItem
                      });
      message.channel.send(yep+aftereport).then(m=>m.delete({timeout:6000}));

    }else{
      message.reply(nop);
      resp2.first().delete().catch(e=>"die silent")
      resp.first().delete().catch(e=>"die silent")
      message.delete().catch(e=>"die silent")
      m1.delete().catch(e=>"die silent")
      m2.delete().catch(e=>"die silent")
      meny.delete().catch(e=>"die silent")
     
    };
  }
}

module.exports = {
    pub: true,
    cmd: cmd,
    perms: 3,
    init: init,
    cat: 'misc'
};
