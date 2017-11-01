var paths = require("../paths.js");
var gear = require("../gearbox.js");
var modules = require("../modules.json");
const fs = require('fs')


exports.run = (bot, message, args, userData, caller, gear, points, skynet) => {
    emb = new gear.Discord.RichEmbed();
    emb.title = "Status dos Módulos"
    emb.description = `Módulos habilitados para o canal #${message.channel.name} no server **${message.guild.name}**
`

 emb.setFooter('Para habilitar ou desabilitar módulos use +enable/+disable <módulo> [channel/server]')


    emb.setAuthor('Pollux', bot.user.avatarURL, 'https://github.com/LucasFlicky/polluxbot')
    emb.setColor('#e23449')
    emb.setThumbnail(message.guild.iconURL)
    var ind = 0
    for (var y in modules[message.guild.id].channels[message.channel.id]) {
        ind++
        modules[message.guild.id].channels[message.channel.id][y] ? a = ':white_check_mark:' : a = ':no_entry:' ;
        emb.addField(y, a ,true)

    }
    modules[message.guild.id].announcements ? a = ':white_check_mark:' : a = ':no_entry:' ;
     emb.addField('BOT ANNOUNCEMENTS', a ,true)
    message.channel.send({embed:emb})
}
