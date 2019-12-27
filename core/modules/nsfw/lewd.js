var cmd = 'lewd';
var gear = require("../../gearbox.js");
var fs = require("fs");

var paths = require("../../paths.json");
var locale = require('../../../utils/multilang_b');
var mm = locale.getT();

var init = function (message,userDB,DB) {
    var Server = message.guild;
    var Channel = message.channel;
    var LANG = message.lang;
    var MSG = message.content
    var  args = message.content.split(/ +/).slice(1).join(' ')
    //-------MAGIC----------------

let curators = [
 {id:'156481129828843522',
 name:'PurpleCat',
  color:'#7D26CD'
 } ,

  {id:'180653744466296833',
 name:'Kurono',
  color:'#9e52ce'
 } ,
  {id:'174622753666629632',
 name:'Celeste',
  color:'#4286f4'
 } ,
  {id:'288495729088004096',
 name:'Shamisu',
  color:'#FFFF00'
 }
  ,
  {id:'88120564400553984',
 name:'Pollyanna',
  color:'#ff3894'
 } ,
  {id:'205842118273531905',
 name:'Yuki',
  color:'#d60606'
 },
  {id:'114115657871654920',
 name:'OrangeWan',
  color:'#ff3303'
 },
  {
    id:'206710860599525376'
    ,name:'???'
    ,color:'#2a8cd4'
  },
  {
    id:'315541510315573259'
    ,name:'Hana'
    ,color:'#e1f2ff'
  }

]

let     curatornames = curators.map(x=>x.name.toLowerCase())

//HELP TRIGGER
    let helpkey = mm("helpkey",{lngs:message.lang})
if (MSG.split(" ")[1]==helpkey || MSG.split(" ")[1]=="?"|| MSG.split(" ")[1]=="help"){
    return gear.usage(cmd,message,this.cat);
}
//------------

  message.channel.startTyping();

  fs.readdir(paths.LEWD, function (err, files) {

    try{
    if(args && curatornames.includes(args.toLowerCase())){
      let targ =  curators.find(cur=>cur.name.toLowerCase().includes(args.toLowerCase()));
      files = files.filter(x=>x.includes(targ.id))
    }

    }catch(e){console.log(e,"AREEEEEEEEEEEEEEEEE")}

    let rand = gear.randomize(0, files.length - 1);
    var filepath = paths.LEWD + files[rand]

    let embed = new gear.RichEmbed;
    let attax = require('discord.js').MessageAttachment ;
    let att = new attax(filepath,'lewdle.png')
    embed.attachFiles(att)
    embed.setImage("attachment://lewdle.png");


    try{
    let name = files[rand]
    let info = name.split('-')
    let curerecol =  curators.find(x=>x.id==info[0]).color
    let curere =  curators.find(x=>x.id==info[0]).name

    embed.setColor(curerecol||'#f74bd6')
    let ts = info[2].split('.')[0];
    embed.setFooter("Curated by ~"+curere+"  |  "+ts);
    embed.setTimestamp(new Date(Number(ts)))


}catch(e){
   message.channel.stopTyping();
  message.channel.send("Couldn't fetch the file.")
  console.error(e)
}


    message.channel.send({embed}).then(m => {


    }).catch(e=>{
      console.log("ERROR LEWD ts")
    message.channel.send({files:[att]}).catch(e=>"ok")
      
    })
  })

  message.channel.stopTyping();
return;

  }





 module.exports = {cool:10000,pub:true,cmd: cmd, perms: 3, init: init, cat: 'nsfw', botperms: ["ATTACH_FILES","EMBED_LINKS","SEND_MESSAGES"]};


