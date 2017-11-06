const gear = require("../../gearbox.js");
const eko = require("../../archetypes/ekonomist.js")
const fs = require("fs");
const paths = require("../../paths.json");
const cmd = 'balance';

const locale = require('../../../utils/multilang_b');
const mm = locale.getT();

const init = async function (message) {
const userDB = gear.userDB
const DB = gear.serverDB
    const Server = message.guild;
    const Channel = message.channel;
    const Target = message.mentions.users.first() || message.mentions.users.first() ||message.author;
    const MSG = message.content;
    const bot = message.botUser
    const emb = new gear.Discord.RichEmbed();

    let P={lngs:message.lang}
    if(gear.autoHelper([mm("helpkey",P)],{cmd,message,opt:this.cat}))return;

    const bal =  mm('$.balance',P);
    const put =  mm('$.lewdery',P);
    const jog =  mm('$.gambling',P);
    const dro =  mm('$.drops',P);
    const tra =  mm('$.trades',P);
    const gas =  mm('$.expenses',P);
    const gan =  mm('$.earnings',P);
    const tot =  mm('$.total',P);
    const exg =  mm('$.exchange',P);
    const don =  mm('$.donation',P);
    const cra =  mm('$.crafts',P);
    const nope = mm('CMD.noDM',P);

  await eko.normalize(Target.id)
  if(!Target.dDATA)Target.dDATA = await userDB.findOne({id:Target.id});
  let  balc = Target.dDATA.modules.audits||eko.auditTemplate
  console.log(balc);
let  $R = Target.dDATA.modules.rubines   || 0
let  $J = Target.dDATA.modules.jades     || 0
let  $S = Target.dDATA.modules.sapphires || 0


emb.setColor('#ffd156')
emb.setTitle(gear.emoji("chart")+bal)
emb.setDescription(`
**${Server.member(Target).displayName}**

${gear.emoji('rubine') + gear.miliarize($R,true)} Rubines  |  ${gear.emoji('jade') + gear.miliarize($J,true)} Jades  |  ${gear.emoji('sapphire') + gear.miliarize($S,true)} Sapphires

**Audit:**
`)

    let unit=['rubines','jades','sapphires']
    let fa=[gear.emoji('rubine')+"**Rubines** |",gear.emoji('jade')+"**Jades** |",gear.emoji('sapphire')+"**Sapphires** |"]



let A=  `
**${tra}** ${balc[unit[0]].expenses.trades ||0}
**${dro}** ${balc[unit[0]].expenses.drops ||0}
**${exg}** ${balc[unit[0]].expenses.exchange ||0}
**${jog}** ${balc[unit[0]].expenses.gambling ||0}
**${put}** ${balc[unit[0]].expenses.lewd ||0}


`


let B=  `
**${tra}** ${balc[unit[0]].earnings.trades ||0}
**${dro}** ${balc[unit[0]].earnings.drops ||0}
**${exg}** ${balc[unit[0]].earnings.exchange ||0}
**${jog}** ${balc[unit[0]].earnings.gambling ||0}
**Dailies** ${balc[unit[0]].earnings.dailies ||0}

`






  let jA=  `
**${tra}** ${balc[unit[1]].expenses.trades ||0}
**${dro}** ${balc[unit[1]].expenses.drops ||0}
**${cra}** ${balc[unit[1]].expenses.crafts ||0}

`


let jB=  `
**${tra}** ${balc[unit[1]].earnings.trades ||0}
**${dro}** ${balc[unit[1]].earnings.drops ||0}
**${cra}** ${balc[unit[1]].earnings.crafts ||0}
`









  let SA=  `
**${tra}** ${balc[unit[2]].expenses.trades ||0}
**${cra}** ${balc[unit[2]].expenses.crafts ||0}

`

let SB=  `
**${tra}** ${balc[unit[2]].earnings.trades ||0}
**${cra}** ${balc[unit[2]].earnings.crafts ||0}
**${don}** ${balc[unit[2]].earnings.cash ||0}
`


  emb.addField(fa[0]+gas,A,true)
  emb.addField(fa[1]+gas,jA,true)
  emb.addField(fa[2]+gas,SA,true)
  emb.addField(fa[0]+gan,B,true)

  emb.addField(fa[1]+gan,jB,true)

  emb.addField(fa[2]+gan,SB,true)

  let C = `
${fa[0]} ${balc[unit[0]].expenses.shop ||0}\t\t   ${fa[1]} ${balc[unit[1]].expenses.shop ||0}\t\t   ${fa[2]} ${balc[unit[2]].expenses.shop ||0}
`
  emb.addField('Market Expenses',C,true)



    let im = Target.avatarURL||Target.defaultAvatarURL
  // emb.setThumbnail(im)
  message.channel.send({embed:emb})






}
 module.exports = {
    pub:true,
    cmd: cmd,
    perms: 3,
    init: init,
    cat: '$'
};
