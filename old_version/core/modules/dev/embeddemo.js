const translate = require('google-translate-api');
var gear = require("../../gearbox.js");
var paths = require("../../paths.js");
const namely = require('name-this-color');
var locale = require('../../../utils/multilang_b');
var mm = locale.getT();
var cmd = 'favcolor';

var init = function (message, userDB, DB) {
    var Channel = message.channel;
    var bot = message.botUser
    var args = message.content.split(' ').slice(1).join(" ")
    //  var input = args[0].toUpperCase()

    //  console.log(isNaN(parseInt(args.replace(/^#/, ''), 16)))


    const v = {}
    v.colorChanged = mm("misc.colorChange", {
        lngs: message.lang
    })
    v.colorError = mm("faile", {
        lngs: message.lang
    })



    let emb = new gear.Discord.RichEmbed;
    emb.setColor("#c72d2d")
emb.title = "Picture Embed"

 emb.setThumbnail("https://png.icons8.com/"+args+"/dusk/40")

        message.channel.send({
            embed: emb
        })


}
module.exports = {
    pub: true,
    cmd: cmd,
    perms: 3,
    init: init,
    cat: 'dev'
};
