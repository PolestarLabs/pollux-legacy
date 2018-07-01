var gear = require("../../gearbox.js");
var cmd = 'say';
var locale = require('../../../utils/multilang_b');
var mm = locale.getT();


var init = function (message,userDB,DB) {

//    if (message.author.id != '88120564400553984') return message.reply('Only my master can send me direct orders. now begone!');
    //HELP TRIGGER
    let helpkey = mm("helpkey",{lngs:message.lang})
if (message.content.split(/ +/)[1]==helpkey || message.content.split(/ +/)[1]=="?"|| message.content.split(/ +/)[1]=="help"){
    return gear.usage(cmd,message,this.cat);
}
//------------


    var imgsrc =[
        "http://bp.i.uol.com.br/arquivo/legacy/camera/pasquale01.jpg",
        "http://geradormemes.com/media/created/uvtx54.jpg",
        "http://i1.kym-cdn.com/photos/images/original/000/111/556/130196763525.jpg",
        "https://www.meme4fun.com/images/2a4b72d9-d239-48b5-95c5-0cfd314ff1f0.jpg",
        "https://7em1.files.wordpress.com/2012/08/pasquale.jpg"
    ]


var  pasq=imgsrc[gear.randomize(0,imgsrc.length)]
// message.channel.send()
 message.channel.send({files:[pasq]})

}
 module.exports = {
    pub:true,
    cmd: cmd,
    perms: 3,
    init: init,
    cat: 'img'
};
