
var gear = require("../../gearbox.js");
var cmd = 'emoji';

var init = function (message,userDB,DB) {

    var args = message.content.split(' ').slice(1);



var output="";
    for (i=0; i<args.length;i++){

  output += gear.emoji(args[i])

    }

    message.channel.send(output)



};

 module.exports = {
    cmd: cmd,
    perms: 5,
    init: init,
    cat: 'infra'
};



