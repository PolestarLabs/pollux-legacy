const fs = require("fs");
const gear = require("../../gearbox.js");
const paths = require("../../paths.json");
const locale = require('../../../utils/multilang_b');
const mm = locale.getT();

const cmd = 'prefixSet';

const init = async function (message,userDB,DB) {
const args = message.content.split(/ +/).slice(1)[0]
    let Server = message.guild;
    let LANG = message.lang;
    let bot = message.botUser
    const MSG = message.content

    let P={
        lngs: LANG,
        prefix: args
    }
    //HELP TRIGGER
    let helpkey = mm("helpkey",{lngs:message.lang})
    if (!args ||MSG.split(/ +/)[1]==helpkey || MSG.split(/ +/)[1]=="?"|| MSG.split(/ +/)[1]=="help"){
    return gear.usage(cmd,message,this.cat);
}
//------------

    const modPass = await gear.hasPerms(message.member,gear.serverDB);
    if (!modPass)return message.reply(mm('CMD.moderationNeeded',P)).catch(e=>console.warn);

    gear.serverDB.set(Server.id, {$set:{'modules.PREFIX':args}});

    message.reply(mm('CMD.prefixChng', P));
}

 module.exports = {
    cmd: cmd,
    perms: 2,
    init: init,
    cat: 'mod'
};
