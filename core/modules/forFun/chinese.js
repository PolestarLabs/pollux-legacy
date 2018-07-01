const gear = require("../../gearbox.js");
const cmd = 'chinese';



const init = function (message, userDB, DB) {
//HELP TRIGGER

if (message.content.substr(message.prefix.length + cmd.length)<=2){
    return gear.usage(cmd,message,this.cat);
}
//------------


    let phrase = message.content.substr(message.prefix.length + cmd.length+1);
    let decomp = phrase.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toUpperCase();

    decomp = decomp.replace(/A/g, "丹")
    decomp = decomp.replace(/ /g, "   ")
    decomp = decomp.replace(/B/g, "书")
    decomp = decomp.replace(/C/g, "匚")
    decomp = decomp.replace(/D/g, "刀")
    decomp = decomp.replace(/E/g, "巳")
    decomp = decomp.replace(/F/g, "下")
    decomp = decomp.replace(/G/g, "呂")
    decomp = decomp.replace(/H/g, "廾")
    decomp = decomp.replace(/I/g, "工")
    decomp = decomp.replace(/J/g, "丿")
    decomp = decomp.replace(/K/g, "片")
    decomp = decomp.replace(/L/g, "乚")
    decomp = decomp.replace(/M/g, "爪")
    decomp = decomp.replace(/N/g, "冂")
    decomp = decomp.replace(/O/g, "口")
    decomp = decomp.replace(/P/g, "尸")
    decomp = decomp.replace(/R/g, "尺")
    decomp = decomp.replace(/S/g, "丂")
    decomp = decomp.replace(/T/g, "丁")
    decomp = decomp.replace(/U/g, "凵")
    decomp = decomp.replace(/W/g, "山")
    decomp = decomp.replace(/X/g, "乂")
    decomp = decomp.replace(/Z/g, "乙")

   message.reply(decomp)


};

module.exports = {
    cmd: cmd,
    perms: 5,
    init: init,
    cat: 'fun'
};
