const gear = require('../../gearbox.js');
const init = async function (message) {

let arg = message.content.split(/ +/).slice(1).join(' ');

let MEMBER = message.member.displayName;
let stuff = [
'a pen',
'a shoe',
'a used Tissue Paper',
'girls sandals',
'a Pop Tart',
'1GB of RAM',
'a pan',
'helicopter rotorblades',
'a spining ceiling fan',
'a FALCON SLAP',
'a Power Glove',
'a suitcase',
'an IBM PC',
"a piece of evidence",
'an ACER T180 MODEL Computer',
'a KFC mega bucket',
'jesus',
'a ban stick',
'flip flops',
'a Samosa Tray',
"Trump's wig",
'a Barracuda',
'mysel-- HEY WHAT ARE YOU DOING???',
'a space monkey',
'a Vampire Killer',
'a pointy stick',
'a pointier stick',
'a magical sound shower',
'a way pointier stick',
'the pointiest stick',
'his dicc',
'the Mexican border',
'a Gardevoir dakimakura',
'**B**ig **F**\*ckin **G**un',
'a rubber chicken',
'a Hatsune Miku Ultra Rare Collector\'s Edition Figma',
'teh virus',
'Jackie Chan Legs',
'the queen of England',
'a Pufferfish',
'a tea Cup',
'a Used Tooth Brush',
'the New Zealand Flag',
'the Kazoo',
'a spork',
'love',
'a Roman Eagle Standard',
' chaos',
'absolutely nothing',
'a Toilet Cleaner Broom',
'a Kangaroo',
'kindness',
'a candy apple',
'a candleless candlestick',
"Pollux's apron",
'the Frostmourne',
'a hammar and a sickle',
'drum sticks',
'his portable DVD player',
'neko paws',
'a magic wand',
'Michael Jackson\'s hat',
'a fishing rod',
'two fishing rods',
'three fishing rods',
'himself',
'a Polandball',
'a Tooth Pin',
'a dakimakura',
'a Casey Bat',
'his waifu',
'your waifu',
'Willy Wonka\'s hat',
'a Nokia 3310',
'a sonic screwdriver',
'a vodoo doll',
'Kung Lao\'s hat',
'ye flaske'
]

  let rand = gear.randomize(0, stuff.length - 1);
  let thing =stuff[rand] // message.author.id === "169551262981816321" ? : 'a wet trout'
  let m;
  let victim = message.guild.member(await gear.getTarget(message));
  if (message.mentions.members.size !== 0) {
    m = `**${MEMBER}** slaps **${victim.displayName}** around a bit with ${thing}.`
  } else if(arg) {
    m = `**${MEMBER}** slaps **${arg}** around a bit with ${thing}.`
  } else{
    m = `**${MEMBER}** slaps around a bit with ${thing}.`
  }

  if(rand == 3 && victim.id =='459261674998988811' ){
  message.channel.send(m,{files:['https://cdn.discordapp.com/attachments/481551001057492994/498583862407069697/unknown.png']})
     
     }else{
  message.channel.send(m)
       
     }

};
module.exports = {
  cool: 100,
  pub: false,
  cmd: 'slap',
  perms: 3,
  init: init,
  cat: 'donators'
};
