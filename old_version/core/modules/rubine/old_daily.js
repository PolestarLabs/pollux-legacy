 String.prototype.toHHMMSS = function () {
     var sec_num = parseInt(this, 10); // don't forget the second param
     var hours = Math.floor(sec_num / 3600);
     var days = Math.floor(hours / 24);

     var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
     var seconds = sec_num - (hours * 3600) - (minutes * 60);

     if (hours < 10) {
         hours = "0" + hours;
     }
     if (minutes < 10) {
         minutes = "0" + minutes;
     }
     if (seconds < 10) {
         seconds = "0" + seconds;
     }
     var time = hours + 'h ' + minutes + 'm ' + seconds + 's';
     days > 1 ? time = days + " D " : time = time
     return time;
 }

 var gear = require("../../gearbox.js");
 var paths = require("../../paths.js");
 var locale = require('../../../utils/multilang_b');
 var mm = locale.getT();
const eko = require("../../archetypes/ekonomist.js")

 var cmd = 'daily';
 

 var init = async function (message,userDB,DB) {
   

     
   
     var Server = message.guild;
     var Channel = message.channel;
     var Author = message.author;
     if (Author.bot) return;
     var Member = Server.member(Author);
     var Target = message.mentions.users.first() || Author;
     var MSG = message.content;
     var bot = message.botUser
     var args = MSG.split(' ').slice(1)[0]
     var LANG = message.lang;

   
const embed=new gear.Discord.RichEmbed
embed.setColor("#d83668")

   
let creation = Author.createdAt.getTime()
let noww = Date.now()
if (noww-creation < 86400000) return message.reply(":warning: New Accounts can't daily")


  let b=""

var emoj = gear.emoji("rubine")
var emblem;


     let GOOD = Server.dDATA.modules.GOODNAME || 'Rubine'

     if (!bot.dDATA.dailyEpoch ||isNaN(bot.dDATA.dailyEpoch)) {
         await gear.superDefine(bot.user, "dailyEpoch", 1500271200000);
        bot.dDATA = await userDB.findOne({_id:bot.user.id});
     }
     if (!bot.dDATA.epochStamp||isNaN(bot.dDATA.epochStamp)) {
         await gear.superDefine(bot.user, "epochStamp", new Date(1500271200000));
        bot.dDATA = await userDB.findOne({_id:bot.user.id});
     }
     if (!Author.dDATA.modules.daily||isNaN(Author.dDATA.modules.daily)) {
         await gear.paramDefine(Author, "daily", 1500271199999);
        Author.dDATA = await userDB.findOne({_id:Author.id});
     }


   
   let semibanned = 5
   let penalised  = 50
   let regular    = 100
   let iridium    = 132
   let palladium  = 178
   let uranium    = 250
   
   
   const myDaily = function (){
     try{
     let thisguy = bot.guilds.get("277391723322408960").member(Author)   

     if(thisguy.roles.find("name","Uranium")){
       emblem="uranium"
       return uranium;
     }
     if(thisguy.roles.find("name","Palladium")){
       
       emblem="palladium"

       return palladium;
     }
     if(thisguy.roles.find("name","Iridium")){
       emblem="iridium"
       return iridium;
       
     }
     }catch(e){
    
       
     }
     
     return regular;
     
   }
   
   myDaily()
   if(emblem){
     
       embed.attachFile(paths.BUILD+emblem+".png")  
       embed.setThumbnail("attachment://"+emblem+".png")
   }

     let now = new Date().getTime();
     let day = 86400000
     let userEpoch = Author.dDATA.modules.daily
     let streak = Author.dDATA.modules.dyStreak
     let globalEpoch =  bot.dDATA.dailyEpoch
     
     message.reply(globalEpoch)
     
     let daysince = Math.floor(Math.floor(Math.floor(parseInt(Math.abs(globalEpoch-now), 10) / 3600) / 24)/1000)
     
     let next = globalEpoch+(daysince*day+day)



          if (args === "help" || args === "?" || args === "reset" || args === "epoch"){
         let e = new gear.Discord.RichEmbed

          var r = next
          //var R = -();

          
         var remain = (Math.abs((now-next)/1000)+ "").toHHMMSS();
            
         e.setTitle(gear.emoji("rubine")+" Last Global Dailies Refresh")
         e.setDescription(remain)
         e.setFooter("LAST RESET")
         e.setTimestamp(bot.dDATA.epochStamp)
         e.setColor("#d13d54")
         return Channel.send({embed:e}).catch(e=>gear.hook.send(e.error))
     }



     if (userEpoch < globalEpoch) {

       
         if (((userEpoch - globalEpoch) / 86400000) <= 2) {
             gear.paramIncrement(Author, 'dyStreak', 1)
         } else {
             gear.paramDefine(Author, 'dyStreak', 0)
         }

         //CONFIRM DAILY
         var dailyGet = mm('$.dailyGet', {
             lngs: LANG,
             emoji: '',
             goods: GOOD
         }).replace("100","**"+myDaily()+"**")
         
         embed.setDescription(".\n"+emoj+dailyGet)
       
       let bar = "|▁▁▁▁▁▁▁▁▁▁|"
       
       for (i=0;i<streak+1;i++){
         bar = bar.replace("▁","▇")
       }
       
        embed.setFooter("Streak "+streak+"/10"+bar)
       
         if (streak >= 10) {
             var dailyStreak = mm('$.dailyStreak', {
                 lngs: LANG,
                 emoji: ''

             })
             
             
             
             
             gear.paramDefine(Author, 'dyStreak', 0)
            gear.paramIncrement(Author, 'exp', 80)
             
             embed.description+="\n"+(gear.emoji('ticket')+dailyStreak)
              await eko.receive(myDaily()*5,Author, {type: 'dailies'});
               //gear.paramIncrement(Author, 'rubines', 500)
         }
          
         message.reply({embed})
         await eko.receive(myDaily(),Author, {type: 'dailies'});
         //gear.paramIncrement(Author, 'rubines', 100)
         await gear.paramDefine(Author, 'daily', globalEpoch);
       


   if(!thisSVdly || Math.abs(thisSVdly-now)>=day ){



     } else {

         var r = Math.abs(now-next);
         var remain = (r / 1000 + "").toHHMMSS();
         var dailyNope = mm('$.dailyNope', {
             lngs: LANG,
             emoji: '',
             remaining: remain
         })
         gear.paramIncrement(Author, 'exp', -20)
         message.reply(emoj+dailyNope)
     }


 }
  module.exports = {
     pub:true,
     cmd: cmd,
     perms: 3,
     init: init,
     cat: 'rubines',
     exp:15,
    cool:5000
 };
