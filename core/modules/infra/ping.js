var cmd = 'ping';
var gear = require("../../gearbox.js");
var fs = require("fs");
var paths = require("../../paths.json");
var locale = require('../../../utils/multilang_b');
var mm = locale.getT();

    const init = function (message) {
      const start = Date.now();
      message.channel.send("pong").then(sendedMessage => {
        const stop = Date.now();
        const diff = (stop - start);

        fs.readdir(paths.BUILD + "frenes/pong/", function (err, files) {
          let rand = gear.randomize(0, files.length - 1);
          var filepath = paths.BUILD + "frenes/pong/" + files[rand]
          sendedMessage.edit(`pong \`${diff}ms\``).then(m=>{            
            message.channel.send({
              files: [filepath]
            })
          });
        })
      });
    }


    module.exports = {
      cool: 1000,
      pub: true,
      cmd: cmd,
      perms: 3,
      init: init,
      cat: 'infra'
    };