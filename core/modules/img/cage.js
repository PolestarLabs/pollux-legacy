const gear = require("../../gearbox.js");
const cmd = 'cage';
const locale = require('../../../utils/multilang_b');
const mm = locale.getT();


const init = function (message) {

//    if (message.author.id != '88120564400553984') return message.reply('Only my master can send me direct orders. now begone!');
    //HELP TRIGGER
    let helpkey = mm("helpkey",{lngs:message.lang})
if (message.content.split(/ +/)[1]==helpkey || message.content.split(/ +/)[1]=="?"|| message.content.split(/ +/)[1]=="help"){
    return gear.usage(cmd,message,this.cat);
}
//------------


    var imgsrc =[
        "/300.jpg",

    ]


var  cage=gear.randomize(10,30);
var  cage2=gear.randomize(10,30);

// message.channel.send()
 message.channel.send({files:[{attachment:"http://www.placecage.com/"+(cage+300)+"/"+(cage2+300)+".png",name:"cage.jpg"}]})

}
 module.exports = {
    pub:true,
    cmd: cmd,
    perms: 3,
    init: init,
    cat: 'img'
};
