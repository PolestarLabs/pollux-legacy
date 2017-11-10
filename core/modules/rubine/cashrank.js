const arraySort = require('array-sort')
const fs = require("fs");
const gear = require('../../gearbox.js')
const paths = require('../../paths.json')
const locale = require('../../../utils/multilang_b');
const mm = locale.getT();
const cmd = 'cashrank';

const init = async function (message, userDB, DB) {

  const Server  = message.guild;
  const Channel = message.channel;
  const Author  = message.author;
  const MSG     = message.content;
  const bot     = message.botUser;
  const args    = MSG.split(/ +/).slice(1)[0]||"";
  const LANG    = message.lang;

    let P={lngs:LANG,prefix:message.prefix}
    if(gear.autoHelper([mm("helpkey",P)],{cmd,message,opt:this.cat}))return;


  let GOODMOJI = gear.emoji("rubine")
  let GOOD = 'Rubine'
  let emb = new gear.Discord.RichEmbed();

  let ranked = []

  Channel.startTyping();

  let dbminiarray
      if (['server','sv','guild','local',Server.name].includes(args.toLowerCase())) {
      dbminiarray = await userDB.find().sort({'modules.rubines': -1}).limit(50);
    }else{
      dbminiarray = await userDB.find().sort({'modules.rubines': -1}).limit(11);

    };


  Channel.stopTyping();

  dbminiarray.forEach(i => {

    if (i.name !== 'Pollux' && i.name !== undefined){
      let rankItem = {};
      rankItem.id = i.id;
      rankItem.name = i.name;
      rankItem.rubines = i.modules.rubines || 0;
      rankItem.level = i.modules.level;
      ranked.push(rankItem);
    }
  });
  arraySort(ranked, 'rubines', {
    reverse: true
  })
  console.log(ranked)
  let ids=ranked.map(x=>x.id)
   if (['server','sv','guild','local',Server.name].includes(args.toLowerCase())) {
  emb.title = mm('website.svLead',P)
     P.scope = 'global'
     P.srr = mm('website.globalrank',P)
  emb.setFooter(mm('forFun.usethisfor',P).replace('rank ','cashrank '));
    }else{
  emb.title = mm('website.globalrank',P)
     P.scope = 'server'
     P.srr = mm('website.svLead',P)
  emb.setFooter(mm('forFun.usethisfor',P).replace('rank ','cashrank '));
    }
  emb.setAuthor('Pollux ', bot.user.avatarURL, 'http://pollux.fun/leaderboards');

  var medals = [':first_place: 1st',
':second_place: 2nd',
':third_place: 3rd'
, ':medal: 4th'
, ':medal: 5th'
, ':medal: 6th'
, ':medal: 7th'
, ':medal: 8th'
, ':medal: 9th'
, ':medal: 10th'
]

console.log(ranked)
for (i=0;i<10;i++){
  if(ranked[i]){

      emb.addField(medals[i], ranked[i].name, true)
      emb.addField(GOOD + 's', ranked[i].rubines + "" + GOODMOJI, true)
  }
}

if(ids.indexOf(Author.id)+1>5){
      emb.addField(":small_red_triangle_down:  "+mm('forFun.position',P)+": #"+(ids.indexOf(Author.id)+1),mm('forFun.leadUnap',P), false)
}
  emb.setColor('#ea2424');

  emb.setThumbnail("https://rebornix.gallerycdn.vsassets.io/extensions/rebornix/ruby/0.15.0/1503328840286/Microsoft.VisualStudio.Services.Icons.Default")


  message.channel.send({
    embed: emb
  }).catch(e => {
    message.reply(mm("error.iNeedThesePerms", {
      lngs: LANG,
      PERMSLIST: "`SEND ATTACHMENTS`"
    }))
  });
}
 module.exports = {pub:true,cmd: cmd, perms: 3, init: init, cat: '$'};
