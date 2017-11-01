const translate = require('google-translate-api');
var gear = require("../../gearbox.js");
var paths = require("../../paths.js");
const namely = require('name-this-color');
var locale = require('../../../utils/multilang_b');
var mm = locale.getT();
var cmd = 'favcolor';

var init = function (message, userDB, DB) {
    var Channel = message.channel;
    const MSG = message.content
    const Author = message.author
    var bot = message.botUser
    var args = message.content.split(' ').slice(1)[0]
    //  var input = args[0].toUpperCase()

    //  console.log(isNaN(parseInt(args.replace(/^#/, ''), 16)))
    var regExp = new RegExp(/[0-9A-Fa-f]{6}/g);

    const v = {}
    v.colorChanged = mm("misc.colorChange", {
        lngs: message.lang
    })
    v.colorError = mm("faile", {
        lngs: message.lang
    })

    try {
        //HELP TRIGGER
        let helpkey = mm("helpkey", {
            lngs: message.lang
        })
        if (!regExp.test(args) || !args || args === undefined || MSG.split(" ")[1] == helpkey || MSG.split(" ")[1] == "?" || MSG.split(" ")[1] == "help") {
            return gear.usage(cmd, message,this.cat);
        }
    } catch (e) {
        console.log(e)

        // gear.hook.send(e.error)
    }
    //------------

    var hex = parseInt((args + "FF").replace(/^#/, ''), 16);

    gear.paramDefine(Author, "favcolor", args)

    let emb = new gear.Discord.RichEmbed;
    emb.setColor("#" + args.replace(/^#/, ''))

    let lang = message.lang[0]
    if (lang === "dev") lang = "pt";

    console.log(namely(args)[0].title);
    translate(namely(args)[0].title, {
        to: lang
    }).then(colset => {


        emb.setAuthor(colset.text, "https://png.icons8.com/paint-brush/dusk/64")
        emb.description = gear.emoji("yep") + v.colorChanged

        message.channel.send({
            embed: emb
        })
    })

}
module.exports = {
    pub: true,
    cmd: cmd,
    perms: 3,
    init: init,
    cat: 'cosmetics'
};
