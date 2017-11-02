
const arraySort = require('array-sort')
const gear = require("../../gearbox.js");
const eko = require("../../archetypes/ekonomist.js")
const fs = require("fs");
var paths = require("../../paths.js");
var cmd = 'balance';

var locale = require('../../../utils/multilang_b');
var mm = locale.getT();




var init = async function (message,userDB,DB) {
    var Server = message.guild;
    var Channel = message.channel;
    var Author = message.author;
    var Target = message.mentions.users.first() || message.mentions.users.first() ||message.author;
    var MSG = message.content;
    var bot = message.botUser
    if (Author.bot) return;
    var LANG = message.lang;
    emb = new gear.Discord.RichEmbed();

  
  
//HELP TRIGGER
    let helpkey = mm("helpkey",{lngs:message.lang})
if (MSG.split(/ +/)[1]==helpkey || MSG.split(/ +/)[1]=="?"|| MSG.split(/ +/)[1]=="help"){
    return gear.usage(cmd,message,this.cat);
}
//------------

  
    var bal =  mm('$.balance',{lngs:LANG});
    var put =  mm('$.lewdery',{lngs:LANG});
    var jog =  mm('$.gambling',{lngs:LANG});
    var dro =  mm('$.drops',{lngs:LANG});
    var tra =  mm('$.trades',{lngs:LANG});
    var gas =  mm('$.expenses',{lngs:LANG});
    var gan =  mm('$.earnings',{lngs:LANG});
    var tot =  mm('$.total',{lngs:LANG});
    var exg =  mm('$.exchange',{lngs:LANG});
    var don =  mm('$.donation',{lngs:LANG});
    var cra =  mm('$.crafts',{lngs:LANG});
    var nope =  mm('CMD.noDM',{lngs:LANG});

  
  
  
  
  
 await eko.normalize(Target.id)
let  balc = Target.dDATA.modules.audits
  console.log(balc)
let  $R = Target.dDATA.modules.rubines   || 0
let  $J = Target.dDATA.modules.jades     || 0
let  $S = Target.dDATA.modules.sapphires || 0 



     emb.setColor('#ffd156')
  emb.setTitle(gear.emoji("chart")+bal)
  emb.setDescription(`
**${Target.displayName}** has 

${gear.emoji('rubine') + gear.miliarize($R,true)} Rubines  |  ${gear.emoji('jade') + gear.miliarize($J,true)} Jades  |  ${gear.emoji('sapphire') + gear.miliarize($S,true)} Sapphires

**Audit:**
`)
  
    let unit=['main','side','premium']
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
