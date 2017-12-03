const gear = require("../../gearbox.js");
const paths = require("../../paths.json");
const locale = require('../../../utils/multilang_b');
const mm = locale.getT();

const cmd = 'saltlevel';

const init = function (message, userDB, DB) {
  let Target = message.mentions.users.first()||message.author
let MSG=message.content
    var args = MSG.split(/ +/).slice(1)
    var LANG = message.lang;
    //HELP TRIGGER
    let helpkey = mm("helpKeyword", {lngs: LANG})
    if (MSG.split(" ")[1] == helpkey || MSG.split(" ")[1] == "?" || MSG.split(" ")[1] == "help") {
        return gear.usage(cmd, message, this.cat);
    }

    //-------MAGIC----------------

    let saltmoji = "<:salty:277280624900046849>"
    //let target = message.mentions.users.first();
    var multiplier = 1
    try {
        if (message.mentions.users.first().id === "248435798179971072") {
            multiplier = 23
        }
    } catch (err) {}
    try {
        if (message.mentions.users.first().username === "Ranii") {
            multiplier = 2373
        }
    } catch (err) {}
    try {
        if (message.mentions.users.first().username.toLowerCase().includes("sona")) {
            multiplier = 0.23
        }
    } catch (err) {}
    r = gear.randomize(1, 100)
    var vocab = mm('forFun.saltLVL', {
        lngs: LANG,
        target: Target.username,
        amount: Math.floor(r * multiplier),
        emoji: saltmoji,
        interpolation: {
            'escapeValue': false
        }
    })
    message.channel.send(vocab)
}

module.exports = {
    pub: false,
    cmd: cmd,
    perms: 3,
    init: init,
    cat: 'fun',
    skynet: true
};
