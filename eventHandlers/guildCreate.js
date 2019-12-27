const {serverDB} = require('../core/gearbox.js')


module.exports = {
  run: async function run(bot,guild) {
//if(bot.user.id === '578913818961248256' && sv_white && !sv_white.includes(guild.id)) return guild.leave();
//let setlogs = bot.channels.get("382413370579484694");
/*
var emb = new gear.RichEmbed;
emb.setThumbnail(guild.iconURL({format:'png'}))
emb.setDescription(`:love_letter: Added to **${guild.name}**`);
emb.addField("Members", guild.members.size, true)
emb.addField("Region", guild.region, true)
emb.addField("Owner", guild.owner, true)
emb.addField("Owner Tag", guild.owner.user.tag, true)
emb.setColor("#255ec9");

var ts = new Date
emb.setTimestamp(ts)
*/
//setlogs.send({embed: emb})
console.log(`ADDED to Server: ${guild.id} | ${guild.name}`.bgBlue)
console.log(`
Size:    ${guild.members.size}
Created: ${guild.createdAt}
Owner:   ${bot.users.get(guild.ownerID).tag}
`.blue)

await serverDB.new(guild);

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
