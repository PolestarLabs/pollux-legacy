const fs = require("fs");
const gear = require("../../gearbox.js");
const paths = require("../../paths.json");
const locale = require('../../../utils/multilang_b');
const mm = locale.getT();

const cmd = 'prefixSet';

const init = function (message,userDB,DB) {
const args = message.content.split(' ').slice(1)
    let Server = message.guild;
    let LANG = message.lang;
    let bot = message.botUser

    gear.paramDefine(Server, 'PREFIX', args[0].toString());
    Server.dDATA.modules.PREFIX =  args[0].toString();
    message.reply(mm('CMD.prefixChng', {
        lngs: LANG,
        prefix: Server.dDATA.modules.PREFIX
    }));
}

 module.exports = {
    cmd: cmd,
    perms: 2,
    init: init,
    cat: 'master'
};
