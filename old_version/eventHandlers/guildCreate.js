
const polx = require("../pollux.js")
const fx = require("../core/functions.js")
const greeting = require('../utils/greeting');

module.exports = {
    run: function run(gear, DB, userDB, bot, guild) {

        // LOG INTO CASTLE
        var PolluxS = bot.guilds.get("277391723322408960")
        var rad = PolluxS.channels.get("332025773521371137")

        var emb = new gear.Discord.RichEmbed;
        emb.setThumbnail(guild.iconURL)
        emb.setDescription(`:inbox_tray: Added to **${guild.name}**`);
        emb.addField("Members", guild.members.size, true)
        emb.addField("Region", guild.region, true)
        emb.addField("Owner", guild.owner, true)
        emb.addField("Owner Tag", guild.owner.user.tag, true)
        emb.setColor("#255ec9");
        var ts = new Date
        emb.setTimestamp(ts)
        rad.send({
            embed: emb
        }).catch(e=> {let a = (new Error); gear.errLog(e,__filename,a.stack.toString())})

        if (guild.region === "brazil") {
            var greetings = greeting.ownPt
        } else {
            var greetings = greeting.own
        }
        var greetings = greetings.replace(/\{\{server\}\}/g, guild.name)
        guild.owner.send(greetings)

        fx.run("guildSetup",guild);

    }
}
