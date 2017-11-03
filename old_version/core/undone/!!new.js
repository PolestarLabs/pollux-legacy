var gear = require("../gearbox.js");
var paths = require("../paths.json");
var locale = require('../../utils/multilang_b');
var mm = locale.getT();


var cmd = 'name';

var init = function (message,userDB,DB) {
    var Server = message.guild;
    var Channel = message.channel;
    var Author = message.author;
    if (Author.bot) return;
    var Member = Server.member(Author);
    var Target = message.mentions.users.first() || Author;
    var MSG = message.content;
    var bot = message.botUser
    var args = MSG.split(' ').slice(1)
    var LANG = message.lang;

    //-------MAGIC----------------------------------------------------------------------------------------------------

    var noperms     =   mm('CMD.moderationNeeded', {lngs:LANG})
    var noPermsMe   =   mm('CMD.unperm', {lngs:LANG})
    var justasec    =   mm('CMD.jas', {lngs:LANG})



    if (Server.dDATA.modules.MODROLE && Server.dDATA.modules.MODROLE.size >= 1){
        modPass = Member.roles.has(Server.dDATA.modules.MODROLE);
    }else if(Member.hasPermission("MANAGE_SERVER")||Member.hasPermission("ADMINISTRATOR")){
        modPass = true;
    };
if (!modPass) return message.reply(noperms);

    if (message.mentions.users.size === 0) {
        return message.reply(whokik).catch(console.error);
    }
    let kickMember = Server.member(Target);
    let kik = Target
    if (!kickMember) {
        return message.reply(nope);
    }








    //-------FINNI----------------------------------------------------------------------------------------------------

};

 module.exports = {
    cmd: cmd,
    perms: 3,
    init: init,
    cat: 'misc'
};



