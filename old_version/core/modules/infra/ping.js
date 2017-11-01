var cmd = 'ping';
var init = function (message) {



    var start = Date.now();
    message.channel.send("pong").then(sendedMessage => {
        var stop = Date.now();
        var diff = (stop - start);
        sendedMessage.edit(`pong \`${diff}ms\``);



    });
};
 module.exports = {cool:1000,pub:true,cmd: cmd, perms: 3, init: init, cat: 'infra'};
