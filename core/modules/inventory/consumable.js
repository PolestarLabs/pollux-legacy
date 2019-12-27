const gear = require('../../gearbox.js');
//const locale = require('../../../utils/multilang_b');
//const mm = locale.getT();

const cmd = 'consumable'

const init = async function(message,params){
  try{


let inventory = message.author.dDATA.modules.inventory;
let items = (await gear.items.find({id:{$in: inventory}})).filter(itm=>itm.type=='consumable');
function iqnt(item){
  return message.author.dDATA.modules.inventory.filter(it=>it==item).length;

}

  let embed = new gear.RichEmbed
  embed.setColor("#be599f")
  embed.setDescription(gear.emoji('consumable')+" **Consumable Items Inventory**"+`
These items stay in your inventory until you or other item uses them.
\u200b
`)
if(items.length>0){


  for (i=0;i<items.length;i++){
      let buyer = items[i].buyable? gear.emoji('buyable'): ''
  let breaker = items[i].destroyable? gear.emoji('breakable'): ''
  let trader = items[i].tradeable? gear.emoji('tradeable'): ''
  let usage = items[i].usefile.length>0?  "`"+message.prefix+'item use '+items[i].usefile+"`": ''

    let itmquant = iqnt(items[i].id);
   embed.addField(gear.emoji(items[i].rarity)+" :: "+items[i].emoji+" "+items[i].name+" [**`x"+itmquant+"`**] \u2003",buyer+breaker+trader+usage)
  }

  embed.addBlankField()
    embed.addField('\u200b\nLegend',`
${gear.emoji('buyable')} **Buyable** : *This item can be bought at shops* \`${message.prefix}item shop [ITEM]\`
${gear.emoji('breakable')} **Breakable** : *This item can be shattered into materials* \`${message.prefix}item break [ITEM]\`
${gear.emoji('tradeable')} **Tradeable** : *This item can be traded with other users* \`${message.prefix}item trade [ITEM]\`
`)
}else{
   embed.addField('\u200b',gear.emoji('nope')+" You have no items in this category")
}

 message.channel.send(embed)


  }catch(e){
    console.error(e)
  }
}

 module.exports = {
    pub:false,
    cmd: cmd,
    perms: 3,
    init: init,
    cat: 'inventory'
};
