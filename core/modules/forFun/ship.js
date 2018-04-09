var gear = require("../../gearbox.js");
var cmd = 'ship';

var init = function (message,userDB,DB) {

//    if (message.author.id != '88120564400553984') return message.reply('Only my master can send me direct orders. now begone!');
//if (!message.guild.name.includes("POLLUX"))return;
if (message.mentions.users.size <2){
   return message.reply("I need two people to ship!")
}
    if (message.mentions.users.size >2){
   return message.reply("I can only ship two people! This is not a gang bang.")
}
   let  eit=[ message.guild.member(message.mentions.users.first()).displayName
    , message.guild.member(message.mentions.users.last()).displayName]
    gear.shuffle(eit)

   let  verbose = [
        ["","... what a Lovely Ship!"],
        ["I guess "," is a strong candidate for ship of the year!"],
        ["I don't know what to say about ",", they really don't seem to match..."],
        ["What do we have here? ",", this is literally the worse ship ever..."],
        ["Well... "," it is? Not sure if "+eit[1]+" seems to like it..."],
        ["Oh boy"," is the sweetest ship i've ever seen!"],
        ["This "," ship seems that will last for no longer than an attosecond."],
        ["I guess i'm gonna call you ","!"],
        ["Long live to ","!"],
        ["Damn, ",", really?"],
        ["The way "," sounds is indeed ridiculous."],
        ["Awww, "," they're really OTP."],
        ["","! How cute."],
        ["Look at this ","! The cutest!"]
    ]
    try{

gear.shuffle(verbose)
   let v= verbose[0]


    let aa = eit[0].substr(Math.floor(eit[0].length/2-0.2))
    let bb = eit[1].slice(0,-Math.floor(eit[1].length/2-0.2))

 message.channel.send(v[0]+bb+aa+v[1])
    }catch(e){gear.hook.send(e.error)}

}
 module.exports = {
    pub:true,
    cmd: cmd,
    perms: 3,
    init: init,
    cat: 'forFun'
};
