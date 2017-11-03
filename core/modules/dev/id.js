const cmd = 'tele';
const gear = require("../../gearbox.js");

const init = function (message,userDB,DB) {

message.channel.send(message.mentions.users.first().id)

}
 module.exports = {
    pub:true,
    cmd: cmd,
    perms: 3,
    init: init,
    cat: 'misc'
};
