const locale = require('../../../utils/multilang_b');
const mm = locale.getT();
const gear = require("../../gearbox.js")
const cmd = 'cash';

const init = function (message,userDB,DB) {
    const Author = message.author;
    const Target = message.target;
    const MTarget = message.mentions.members.first() || message.member;
    const MSG = message.content;
    const LANG = message.lang;
    const P={lngs:LANG}


  if(gear.autoHelper([mm("helpkey",P)],{cmd,message,opt:this.cat}))return;


    const vocab = {
        c1: mm("$.cash10", P),
        c2: mm("$.cash100", P),
        c3: mm("$.cash500", P),
        c4: mm("$.cash1000", P),
        c5: mm("$.cash5000", P),
        c6: mm("$.cash10000", P),
        c7: mm("$.cashInfinite", P),
        heHas: whoHas('has'),
        youHave: whoHas('you'),
    }
function whoHas(who){
  return gear.emoji("rubine")+`**${MTarget.displayName}**`+mm("$."+who+"Amount", {
            lngs: LANG,
            goods: "**"+gear.miliarize(Target.dDATA.modules.rubines,"strict")+"**"
        })
};
    if (message.mentions.users.size === 0) {
        let r = Target.dDATA.modules.rubines
        let fam = ''
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
        return message.reply(vocab.youHave + fam);
    };
    return message.channel.send(vocab.heHas);
};

 module.exports = {
    pub:true,
    cmd: cmd,
    perms: 3,
    init: init,
    cat: '$'
};
