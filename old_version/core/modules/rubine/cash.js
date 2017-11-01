const locale = require('../../../utils/multilang_b');
const mm = locale.getT();
const gear = require("../../gearbox.js")
const cmd = 'cash';

const init = function (message,userDB,DB) {
    const Server = message.guild;
    const Channel = message.channel;
    const Author = message.author;
    if (Author.bot) return;
    const Member = message.member;
    var Target = message.mentions.users.first() || Author;
    const MTarget = message.mentions.members.first() || message.mentions.users.first()  || message.member;
    const MSG = message.content;
    const bot = message.botUser
    let args = MSG.split(' ').slice(1)
    const LANG = message.lang;

    //-------MAGIC----------------

//HELP TRIGGER
    let helpkey = mm("helpkey",{lngs:message.lang})
if (MSG.split(" ")[1]==helpkey || MSG.split(" ")[1]=="?"|| MSG.split(" ")[1]=="help"){
    return gear.usage(cmd,message,this.cat);
}
//------------

var emoj = bot.emojis.get('343314186765336576')

     let GOODMOJI = Server.dDATA.modules.GOODMOJI || emoj
     let GOOD = Server.dDATA.modules.GOODNAME || 'Rubine'


    if (Server.dDATA.modules) {
        GOODMOJI = Server.dDATA.modules
    }
    if (Server.dDATA.modules) {
        GOOD = Server.dDATA.modules.GOODNAME
    }


    var vocab = {
        c1: mm("$.cash10", {
            lngs: LANG
        }),
        c2: mm("$.cash100", {
            lngs: LANG
        }),
        c3: mm("$.cash500", {
            lngs: LANG
        }),
        c4: mm("$.cash1000", {
            lngs: LANG
        }),
        c5: mm("$.cash5000", {
            lngs: LANG
        }),
        c6: mm("$.cash10000", {
            lngs: LANG
        }),
        c7: mm("$.cashInfinite", {
            lngs: LANG
        }),
        heHas: gear.emoji("rubine")+`**${MTarget.displayName}**`+mm("$.hasAmount", {
            lngs: LANG,
            goodname: GOOD,
            goods: "**"+gear.miliarize(Target.dDATA.modules.rubines,"strict")+"**"
        }),
        youHave: gear.emoji("rubine")+`**${MTarget.displayName}**`+mm("$.youAmount", {
            lngs: LANG,
            goodname: GOOD,
            goods: "**"+gear.miliarize(Author.dDATA.modules.rubines,"strict")+"**"
        })

    }
    vocab.c1

    if (message.mentions.users.size === 0) {
        var r = Target.dDATA.modules.rubines
        var fam = ''
        switch (true) {
            case (r < 500):
                fam = vocab.c1
                break;
            case (r < 1000):
                fam = vocab.c2
                break;
            case (r < 2500):
                fam = vocab.c3
                break;
            case (r < 5000):
                fam = vocab.c4
                break;
            case (r < 1000):
                fam = vocab.c5
                break;
            case (r < 19999):
                fam = vocab.c6
                break;
            case (r > 20000):
                fam = vocab.c7
                break;

        }
        return message.reply(vocab.youHave + fam)

    }

    return message.channel.send(vocab.heHas)
}

 module.exports = {
    pub:true,
    cmd: cmd,
    perms: 3,
    init: init,
    cat: '$'
};
