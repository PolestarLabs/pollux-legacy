const cmd = 'ping';
const init = function (message) {
    const start = Date.now();
    message.channel.send("pong").then(sendedMessage => {
        const stop = Date.now();
        const diff = (stop - start);
        sendedMessage.edit(`pong \`${diff}ms\``);
    });
};
module.exports = {cool:1000,pub:true,cmd: cmd, perms: 3, init: init, cat: 'infra'};
