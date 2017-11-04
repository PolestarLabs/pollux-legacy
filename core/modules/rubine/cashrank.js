const arraySort = require('array-sort')
const fs = require("fs");
const gear = require('../../gearbox.js')
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


    let P={lngs:message.lang}
    if(gear.autoHelper([mm("helpkey",P)],{cmd,message,opt:this.cat}))return;


  let GOODMOJI = gear.emoji("rubine")
  let GOOD = 'Rubine'
  let emb = new gear.Discord.RichEmbed();

  let ranked = []

  Channel.startTyping();
  let dbminiarray = await userDB.find({'modules.rubines':{$gt:0}});
  Channel.stopTyping();

  dbminiarray.forEach(i => {
    if (['server','sv','guild','local',Server.name].includes(args.toLowerCase())) {
      if (!Server.members.has(i.id)) return;
    };

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
  let ids=ranked.map(x=>x.id)
  emb.setColor('#e22449')
  emb.title = "WEALTH RANK"
  emb.setAuthor('Pollux', bot.user.avatarURL, 'https://github.com/Flicksie/polluxbot');
  emb.setThumbnail("https://rebornix.gallerycdn.vsassets.io/extensions/rebornix/ruby/0.15.0/1503328840286/Microsoft.VisualStudio.Services.Icons.Default")

  var medals = [':first_place: 1st',
':second_place: 2nd',
':third_place: 3rd'
, ':medal: 4th'
, ':medal: 5th'
]
  for (i = 0; i < 5; i++) {
      emb.addField(medals[i], ranked[i].name, true)
      emb.addField(GOOD + 's', ranked[i].rubines + "" + GOODMOJI, true)
      emb.addBlankField
  }

  emb.setFooter('pos='+(ids.indexOf(Author.id)+1))

  message.channel.send({
    embed: emb
  }).catch(e => {
    message.reply(mm("error.iNeedThesePerms", {
      lngs: LANG,
      PERMSLIST: "`SEND ATTACHMENTS`"
    }))
  });
}

module.exports = {
  pub: true,
  cmd: cmd,
  perms: 5,
  init: init,
  cat: '$'
};
