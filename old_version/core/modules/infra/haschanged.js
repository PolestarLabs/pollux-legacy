var gear = require("../../gearbox.js");
var cmd = 'hasChanged';

var init = function (message,userDB,DB) {



 message.channel.send("This command, like many others, has changed! Check out the newest features and improvements of the latest rework of Pollux!")

}
 module.exports = {
    pub:true,
    cmd: cmd,
    perms: 3,
    init: init,
    cat: 'infra'
};
