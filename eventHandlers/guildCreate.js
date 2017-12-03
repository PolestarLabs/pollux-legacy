const gear = require('../core/gearbox.js'),
  DB = gear.serverDB,
  channelDB = gear.channelDB,
  userDB = gear.userDB,
  async = require('async');

module.exports = {
  run: async function run(bot,guild) {

let setlogs = bot.channels.get("382413370579484694");

var emb = new gear.Discord.RichEmbed;
emb.setThumbnail(guild.iconURL)
emb.setDescription(`:love_letter: Added to **${guild.name}**`);
emb.addField("Members", guild.members.size, true)
emb.addField("Region", guild.region, true)
emb.addField("Owner", guild.owner, true)
emb.addField("Owner Tag", guild.owner.user.tag, true)
emb.setColor("#255ec9");

var ts = new Date
emb.setTimestamp(ts)

setlogs.send({embed: emb})
await gear.serverDB.new(guild);

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
