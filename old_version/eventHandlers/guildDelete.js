
const polx = require("../pollux.js")
const fx = require("../core/functions.js")

module.exports = {
    run: function run(gear, DB, userDB, bot, guild) {

        var PolluxS = bot.guilds.get("277391723322408960")
        var rad = PolluxS.channels.get("332025773521371137")

        var emb = new gear.Discord.RichEmbed;

        emb.setThumbnail(guild.iconURL)
        emb.setDescription(`:outbox_tray: Removed from **${guild.name}**`);
        emb.addField("Members", guild.members.size, false)
        emb.addField("Owner", guild.owner, true)
        emb.addField("Owner Tag", guild.owner.username + "#" + guild.owner.discriminator, true)
        emb.setColor("#c92525");
        var ts = new Date
        emb.setTimestamp(ts)
        rad.send({
            embed: emb
        }).catch(e=> {let a = (new Error); gear.errLog(e,__filename,a.stack.toString())})

        DB.delete(guild.id)
    }
}
