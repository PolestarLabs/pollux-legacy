const gear = require('../../gearbox.js');
const locale = require('../../../utils/multilang_b');
const mm = locale.getT();

const cmd = 'key'

const init = async function(message,params){
  try{


let inventory = message.author.dDATA.modules.inventory;
let items = (await gear.items.find({id:{$in: inventory}})).filter(itm=>itm.type=='key');
function iqnt(item){
  console.log(item)
  console.log(message.author.dDATA.modules.inventory)
  return message.author.dDATA.modules.inventory.filter(it=>it==item).length;

}

  let embed = new gear.RichEmbed
  embed.setColor("#8c62a2")
  embed.setDescription(":card_box: **Key Items Iventory**")
  //embed.addBlankField()


  for (i=0;i<items.length;i++){
      let buyer = items[i].buyable? gear.emoji('buyable'): ''
  let breaker = items[i].destroyable? gear.emoji('breakable'): ''
  let trader = items[i].tradeable? gear.emoji('tradeable'): ''

    let itmquant = iqnt(items[i].id);
   embed.addField(items[i].emoji+" "+items[i].name+" **`x"+itmquant+"`**",buyer+breaker+trader+gear.emoji(items[i].rarity))
  }

 message.channel.send(embed)


  }catch(e){
    console.log(e)
  }
}

 module.exports = {
    pub:false,
    cmd: cmd,
    perms: 3,
    init: init,
    cat: 'inventory'
};
