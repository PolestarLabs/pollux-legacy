const gear = require("../../gearbox.js");
const locale = require('../../../utils/multilang_b');
const mm = locale.getT();

const cmd = 'marry';

const init = async function (message, userDB, DB) {
  try{
  const e = gear.emoji
  const Channel = message.channel;
  const Author = message.author;
  const Member = message.member;
  const TargetData = message.target;
  const MSG = message.content;
  const LANG = message.lang;
  const userData = Author.dDATA
  const args = MSG.split(/ +/).slice(1).join(' ');

  const person = args.split(' ')[0]
  const ring   = args.split(' ')[1]
  const Target = message.mentions.members.first() || message.guild.members.find(mb=>mb.displayName.includes(person)||mb.username.includes(person)||mb.id == person);

  //HELP TRIGGER
    let P={lngs:message.lang,}
    if(gear.autoHelper([mm("helpkey",P),'noargs'],{cmd,message,opt:this.cat}))return;
  //------------

  const ITEMBASE = await gear.items.getAll();
  const INVENTORY = Author.dDATA.modules.inventory.filter(itm=>(ITEMBASE.find(i=>i.id==itm)||{id:'none'}).id.includes('complete_ring'));



  const v={}
  v.needRing1      = "**You need a Ring to propose, where are your manners?**\n"
  v.needRing_noRing     = `*Currently you have no wedding rings to be used.*

To get a Ring, you need to craft one.
For that you have to buy a **Plain Ring** at the [**Crafting Workshop**](http://pollux.fun/crafting "Pollux Item Shop!") and spend either Rubines, Jades, or Sapphires to make a Jewel for it.
You can also spend all three to make the ultimate wedding ring!

Craft rings with the \`${message.prefix}craft complete_ring_[jade|rubine|sapphire|stardust]\` command.`
  v.ringTTP    = mm('dict.usage',P)+` \`${message.prefix}marry @Person [jade|rubine|sapphire|stardust]\``

  let rings={}
  for (let i=0;i<INVENTORY.length;i++){
    rings[INVENTORY[i]] ? rings[INVENTORY[i]]++ : rings[INVENTORY[i]] = 1;
  };
  v.notThatRing    = `Theres no such ring on your Inventory. Available rings are:

${rings.complete_ring_jade ? `:ring: \`${rings.complete_ring_jade||"0"}\` × **Splendorous Jade Ring**\n`:''}${rings.complete_ring_rubine ? `:ring: \`${rings.complete_ring_rubine||"0"}\` × **Magnificent Rubine Ring**\n`:''}${rings.complete_ring_sapphire ? `:ring: \`${rings.complete_ring_sapphire||"0"}\` × **Luxurious Sapphire Ring**\n`:''}${rings.complete_ring_stardust ? `:ring: \`${rings.complete_ring_stardust||"0"}\` × **Opulent Stardust Ring**\n`:''}

`


  if (ring && INVENTORY.includes('complete_ring_'+ring)) v.proposal    = `${Member.displayName} has proposed to **${Target.displayName}** with the **${ITEMBASE.find(itm=>itm.id=='complete_ring_'+ring).name}**`;
  v.acceptDecline = `${Target}, do you accept ${Member.displayName}'s proposal?`
  v.acceptDecline_me = `Wait, you want to marry **me**?`

  v.sayyes = ":heartpulse: "+`**${Target.displayName} said YES!**`
  v.sayno = ":broken_heart: "+`**${Target.displayName} said no...** `
  v.thonk = "<:polluxthonk:363008720189521921> "+`Looks like ${Target.displayName} needs more time to decide...`
  v.dasstar = "Oh! Is that a **Stardust Ring**? How cute, I think we can get along then!"
  v.nostar = "Sorry darling, you gonna need a better ring to marry a classy lady like me!"


  ///===================================================================
  ///===================================================================
  ///===================================================================
  ///===================================================================
  ///===================================================================



let YA = {r:":yep:339398829050953728",id:'339398829050953728'}
let NA = {r:":nope:339398829088571402",id:'339398829088571402'}



  const embed = new gear.RichEmbed;
  embed.setColor("#f0418b");

    embed.setDescription(":love_letter:  "+v.proposal);

    if(!ring)embed.setDescription(e('nope')+v.needRing1+v.ringTTP);
    if (!INVENTORY.length)embed.setDescription(e('nope')+v.needRing1+v.needRing_noRing);
    if (ring && !INVENTORY.includes('complete_ring_'+ring))embed.setDescription(e('nope')+v.notThatRing);

    await Channel.send(embed);
    if (ring && INVENTORY.includes('complete_ring_'+ring)){

      let acpt;
      if(Target.id !== "271394014358405121"){
        acpt = v.acceptDecline;
      }
      else {
        await gear.wait(1);
        acpt = v.acceptDecline_me;
      }

      Channel.send(acpt).then(async msg=>{

        if(Target.id !== "271394014358405121"){
          await msg.react(YA.r);
          msg.react(NA.r);
        }else{
          if(ring=='stardust'){
            await gear.wait(2);
            Channel.send(v.dasstar)
            return contrairOsLacosDoMatrimonio(Author,Target,ring);
          }else {
            Channel.send(v.nostar)
            return //contrairOsLacosDoMatrimonio(Author,Target,ring);
          }
        };

        const res = await msg.awaitReactions(rea=>rea.users.has(Target.id),{time:15000,max:1});

         if (res.size === 1&&res.first().emoji.id==YA.id) {


           contrairOsLacosDoMatrimonio(Author,Target,ring)

           Channel.send(v.sayyes)
         }else if(res.size === 1&&res.first().emoji.id==NA.id){
           Channel.send(v.sayno)
         }else{
           Channel.send(v.thonk,{files:["https://uploads.disquscdn.com/images/a7e8a3f8c38932ef0c44dbd590bc104caf65ddff53ee5f6c23da4d4325e432fc.gif"]})
         }

      })
    }






    if (!INVENTORY.length){

    }


  }catch(e){
    console.log(e)
  }
}

async function contrairOsLacosDoMatrimonio(loverA,loverB,ring_pic){
  try{

  let ts = Date.now();



  let LADATA = {
    pix: loverA.avatarURL,
    id:loverA.id,
    tag:loverA.tag,
    shipname:"",
    featured:false,
    initiative:true,
    ring:ring_pic,
    since:ts
  }

  let LBDATA = {
    pix: loverB.user.avatarURL,
    id:loverB.id,
    tag:loverB.user.tag,
    shipname:"",
    featured:false,
    initiative:false,
    ring:ring_pic,
    since:ts
  }

  breakit('complete_ring_'+ring_pic,{author:loverA})
  await gear.userDB.set(loverA.id,{$push:{'married':LBDATA}});
  await gear.userDB.set(loverB.id,{$push:{'married':LADATA}});

  }catch(e){
    console.log(e)
  }

}
    async function breakit(item,message){
      gear.userDB.findOneAndUpdate({
      'id':message.author.id,
      'modules.inventory':item
      },{$set:{'modules.inventory.$':'DRAGGE'}}).then(async x=>{
        await gear.userDB.findOneAndUpdate({'id':message.author.id},{$pull:{'modules.inventory':'DRAGGE'}});
      })
    };

module.exports = {
  pub: true,
  cmd: cmd,
  perms: 3,
  init: init,
  cat: 'social'
};
