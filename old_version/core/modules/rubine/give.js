var gear = require("../../gearbox.js");
var paths = require("../../paths.js");
var locale = require('../../../utils/multilang_b');
var mm = locale.getT();

var cmd = 'give';

var init = function (message,userDB,DB) {


        //HELP TRIGGER
    let helpkey = mm("helpkey",{lngs:message.lang})
if (message.content.split(/ +/)[1]==helpkey || message.content.split(/ +/)[1]=="?"|| message.content.split(/ +/)[1]=="help"){
    return gear.usage(cmd,message,this.cat);
}
//------------

    var Server = message.guild;
    var Channel = message.channel;
    var Author = message.author;
    if (Author.bot) return;
    var Member = Server.member(Author);
    var Target = message.mentions.users.first() || Author;
    var MSG = message.content;
    var bot = message.botUser
    var args = MSG.split(' ').slice(1)
    var LANG = message.lang;
    var userData = Author.dDATA.modules
    var tgtData = Target.dDATA.modules


    
    
try{
var emojya = bot.emojis.get('343314186765336576')
    let GOODMOJI = emojya
    let GOOD = 'Rubine'
    if (Server.dDATA.modules.GOODMOJI) {
        GOODMOJI = Server.dDATA.modules.GOODMOJI
    }
    if (Server.dDATA.modules.GOODNAME) {
        GOOD = Server.dDATA.modules.GOODNAME
    }


    var donate = parseInt(args[0])
  donate=Math.abs(donate)

    if (args.lenght < 2 || isNaN(donate) || message.mentions.size === 0){
        return gear.usage(cmd,message,this.cat)
    }

    if (gear.checkGoods(donate, Author) == true) {


        // message.guild.defaultChannel.send()
        gear.paramIncrement(Author, 'rubines', -donate)
        gear.paramIncrement(Author, 'expenses.trade', donate)
        gear.paramIncrement(Target, 'rubines', donate)
        gear.paramIncrement(Target, 'earnings.trade', donate)

       return  message.channel.send( mm('$.giveGoods' , {lngs:LANG, donate:donate, emoji:gear.emoji('rubine'), target:Target.username,author:Author.username })).then(function (c) {
            message.delete(5000).catch(e=> {let a = (new Error); gear.errLog(e,__filename,a.stack.toString())})
        })
       // gear.writePoints(points, caller)
    } else {
        message.reply(mm('$.noFundsGeneric',{lngs:LANG,goods:GOOD}))
        return;
    }



}catch(e){message.reply(e.stack)}}

 module.exports = {
    pub:true,
    cmd: cmd,
    perms: 3,
    init: init,
    cat: '$'
};
