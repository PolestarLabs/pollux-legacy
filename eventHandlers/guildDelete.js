const gear = require('../core/gearbox.js'),
  DB = gear.serverDB,
  channelDB = gear.channelDB,
  userDB = gear.userDB,
  async = require('async');

module.exports = {
  run: async function run(bot,guild) {
    console.log(`REMOVED from Server: ${guild.id} | ${guild.name}`.bgRed)
    console.log(`
Size:    ${guild.members.size}
Created: ${guild.createdAt}
Owner:   ${bot.users.get(guild.ownerID).tag}
`.red)
//let setlogs = bot.channels.get("382413370579484694");

var emb = new gear.RichEmbed;
emb.setThumbnail(guild.iconURL({format:'png'}))
emb.setDescription(`:broken_heart: Removed from **${guild.name}**`);
emb.addField("Members", guild.members.size, true)
emb.addField("Region", guild.region, true)
emb.addField("Owner", guild.owner, true)
emb.addField("Owner Tag", guild.owner.user.tag, true)
emb.setColor("#c92525");

var ts = new Date
emb.setTimestamp(ts)

//setlogs.send({embed: emb});
//await gear.serverDB.remove({id:guild.id});

    /*
        if (guild.region === "brazil") {
            var greetings = greeting.ownPt
        } else {
            var greetings = greeting.own
        }
        var greetings = greetings.replace(/\{\{server\}\}/g, guild.name)
        guild.owner.send(greetings)

        fx.run("guildSetup",guild);
*/
    }
}



