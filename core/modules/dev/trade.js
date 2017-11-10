const fs = require("fs");
const gear = require('../../gearbox.js')
const paths = require("../../paths.json");
const locale = require('../../../utils/multilang_b');
const mm = locale.getT();

const cmd = 'trade';

const init = async function (message, userDB, DB) {

const ITBASE = JSON.parse(fs.readFileSync("./resources/lists/items.json","utf8"))
let ITEMS = []

for (i in ITBASE){
  ITEMS.push(ITBASE[i])
}
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
    const inventory = Author.dDATA.modules.inventory

    if (args.length== 2){
       console.log(2)
      if (typeof args[0] == 'string'){
        console.log("0 string")
        let itAmt = ITEMS.filter(itm=>inventory.includes(itm.id) && itm.type==args[0])
        if (itAmt.length == 0) return message.reply(gear.emoji("nope"));
        if (itAmt.length == 1) {
           let inv_names = itAmt.map(i=>i.name);
           let invids = itAmt.map(i=>i.id);
           hover(invids,true);
        };
        if (itAmt.length >= 2) {
           let inv_names = itAmt.map(i=>i.name)
           let invids = itAmt.map(i=>i.id)
           let opts =""
           for (i=0;i<inv_names.length;i++){
              opts+=`
[${i}] :: ${inv_names[i]}`
           }
            meny = await message.reply("```ml\n"+opts+"```").then(m=>hover(invids,false))
        }
      }
    }

    if (args.length== 3){
      if (typeof args[0] == 'number' && typeof args[1] == 'string'){

      } // X items (GIVE)

      if (typeof args[0] == 'string' && typeof args[1] == 'number'){

      } // 1 item for X (SELL)

      //if (typeof args[0] == 'string' && typeof args[1] == 'string') // items for items?
    }

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

  async function hover(tradeit,direct){
    let index,item,resp;
    if (!direct) {
       resp = await Channel.awaitMessages(mms =>
        mms.author.id === message.author.id &&
        !isNaN(Number(mms.content)) &&
        Number(mms.content) < tradeit.length &&
        Number(mms.content) >= 0, {
          maxMatches: 1,
          time: 20e3
        }
      )

      if (resp.size == 0) return;
      index = Math.abs(Math.floor(Number(resp.first().content)))
      item = tradeit[index]
    }else{
      item = tradeit[0]
    }
    let m1 = await message.reply(gear.emoji(ITBASE[item].emoji)+" **"+ITBASE[item].name+"**");
    let m2 = await message.channel.send("`ok`"+yep+" || `c`"+nop);

    const resp2 = await Channel.awaitMessages(mms=>
                          mms.author.id === message.author.id && (
                            mms.content=="ok"||
                            mms.content=="c"
                            ),{
                            maxMatches: 1,
                            time: 15e3
                          });

    if (resp2.size == 0) return message.reply("timeout");
    let response = resp2.first().content;

    if (response=="ok"){
      inventory.splice(inventory.indexOf(item),1)
      userDB.set(Author.id,{$set:{'modules.inventory':inventory}});
      userDB.set(Target.id,{$push:{'modules.inventory':item}});
try{

      resp2.first().delete().catch(e=>"die silent")
      resp.first().delete().catch(e=>"die silent")
      message.delete().catch(e=>"die silent")
      m1.delete().catch(e=>"die silent")
      m2.delete().catch(e=>"die silent")
      meny.delete().catch(e=>"die silent")
}catch(e){

}

      message.reply(yep).then(m=>m.delete(6000));

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
