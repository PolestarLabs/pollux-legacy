const fs = require("fs");
const gear = require("../../gearbox.js");
const paths = require("../../paths.json");
const locale = require('../../../utils/multilang_b');
const mm = locale.getT();

const cmd = 'prefixSet';

const init = function (message,userDB,DB) {
const args = message.content.split(/ +/).slice(1)[0]
    let Server = message.guild;
    let LANG = message.lang;
    let bot = message.botUser

    gear.serverDB.set(Server.id, {$set:{'modules.PREFIX':args}});

    message.reply(mm('CMD.prefixChng', {
        lngs: LANG,
        prefix: args
    }));
}

 module.exports = {
    cmd: cmd,
    perms: 2,
    init: init,
    cat: 'mod'
};
