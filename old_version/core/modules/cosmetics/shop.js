

const arraySort = require('array-sort')
const fs = require("fs");
const gear = require('../../gearbox.js')
var paths = require("../../paths.js");
var locale = require('../../../utils/multilang_b');
var mm = locale.getT();

var cmd = 'shop';

var init = async function (message, userDB, DB) {


    var start = Date.now();

    var Server = message.guild;
    var Channel = message.channel;
    var Author = message.author;
    if (Author.bot) return;
    try{
        var Member = Server.member(Author);
    }catch(e){}

    var Target = message.mentions.users.first() || Author;
    var MSG = message.content;
    var bot = message.botUser
    var args = MSG.split(' ').slice(1)[0]

    var tint = (args || "0000FF")
    var LANG = message.lang;

    var nope = mm('CMD.noDM', {
        lngs: LANG
    });
    var gener = mm('builds.genProf', {
        lngs: LANG
    });
    var inf = mm('dict.infinite', {
        lngs: LANG
    });

    //-------MAGIC----------------
    if (message.channel.type === 'dm') {
      //  message.reply(nope)
       // return
    }

return message.reply("Temporarily Disabled for a Complete Rework!\n Meanwhile, get your Bgs and Medals at the Dashboard:\n**BGs**: <http://www.pollux.fun/bgshop>\n**Medals**: <http://www.pollux.fun/medalshop> ")
    //HELP TRIGGER
    let helpkey = mm("helpkey",{lngs:message.lang})
if (MSG.split(" ")[1]==helpkey || MSG.split(" ")[1]=="?"|| MSG.split(" ")[1]=="help"){
    return gear.usage(cmd,message,this.cat);
}

          var perms = {
          MNG_MESS: mm("permission.MNG_MESS", {
              lngs: LANG
          }),
          ADD_REA: mm("permission.ADD_REA", {
              lngs: LANG
          })
      }
 try{
      if (!message.guild.member(message.botUser.user)
          .permissionsIn(message.channel)
          .hasPermission("ADD_REACTIONS")) {
          return message.reply(

              mm("error.iNeedThesePerms", {
                  lngs: LANG,
                  PERMSLIST: `:small_orange_diamond: **${perms.MNG_MESS+"\n:small_orange_diamond: "+perms.ADD_REA }**`
              })

          );
      };

    }catch(e){}


var menu = [
                 [
                 ["Fruki Guaraná", "fruki", 953]
                 , ["Twitch", "twitch", 400]
                 , ["SNES Controller", "snes", 400]
                 , ["Hylian Shield", "hyruleshield", 600]
                 , ["Hamburger", "burger", 400]
                 , ["Gardevoir", "gardevoir", 520]
             ], [
                  ["Heroes of the Storm", "heroes", 500]
                  ,["League of Legends", "league", 800]
                  ,["Counter Strike", "counterstrike", 600]
                  ,["Pokéball", "pokeball", 1000]
                  ,["Overwatch", "overwatch", 850]
                  ,["Megaman: Sigma", "megamansigma", 1400]
              ], [
                  ["Osu!", "osu", 500]
                  ,["Nintendo 3DS", "n3ds", 800]
                  ,["Dark Magician Girl", "darkmagirl", 1000]
                  ,["Pikachu", "pikachu", 1700]
                  ,["Beyblade", "beyblade", 600]
                  ,["Pollux", "pollux", 50000]
             ], [

                  ["Starcraft II", "starcraft", 720],
                  ["Umbreon", "umbreon", 800],
                  ["Japan Flag", "japan", 1200]
                  ,["Germany Flag", "germany", 1000]
                  ,["Brazil Flag", "brazil", 1000]
                  ,["Portugal Flag", "portugal", 1000]
             ]
                        ]

// Finders
var nums = ['0⃣', '1⃣', '2⃣', '3⃣', '4⃣', '5⃣', '6⃣', '7⃣', '8⃣', '9⃣'];
var arr = {}

//Verbose
    var v = {
        whatShop        : mm("shop.whatShop",{lngs:LANG}),
        medalShop       : mm("shop.medalShop",{lngs:LANG}),
        bgShop          : mm("shop.bgShop",{lngs:LANG}),
        goodShop        : mm("shop.goodShop",{lngs:LANG}),
        useBelow        : mm("shop.useBelow",{lngs:LANG}),
        noFundsFormal   : mm("shop.noFundsFormal",{lngs:LANG}),
        noFundsResponse : mm("$.noFunds",{lngs:LANG}),
        processing      : mm("shop.processing",{lngs:LANG}),
        youSure         : mm("shop.youSure",{lngs:LANG}),
        confirmed       : mm("shop.confirmed",{lngs:LANG}),
        cancelled       : mm("shop.cancelled",{lngs:LANG}),
        timeout         : mm("shop.timeout",{lngs:LANG}),
        alreadyPosess   : mm("shop.alreadyPosess",{lngs:LANG})
    }

// Emojifest
const medalEmoj = "🎖";
const bkgEmoj = "🏔";
const toolsEmoj = "📦";
const check = bot.emojis.get("314349398811475968") || "✅";
const xmark = bot.emojis.get("314349398824058880") || "❌";

//Choose Shop
let emb = new gear.Discord.RichEmbed
emb.setColor("#5743c6")
emb.setTitle(v.whatShop)
emb.addField(v.bgShop, bkgEmoj, true)
emb.addField(v.medalShop, medalEmoj, true)
//emb.addField(v.goodShop, toolsEmoj, true)
emb.setFooter(v.useBelow)



//Machine
message.channel.send({
    embed: emb
}).then(async msg => {
    //Add Options
    await msg.react(bkgEmoj)
    await msg.react(medalEmoj)
    //await msg.react(toolsEmoj)
     msg.react(xmark)

    //Check Inputs
    return new Promise(async resolve => {


        const responses = await msg.awaitReactions(react =>
            react.users.has(Author.id), {
                maxEmojis: 1,
                time: 20000
            } // has no foolproof for custom added reactions yet
        ).catch(e=> {let a = (new Error); gear.errLog(e,__filename,a.stack.toString())});
        if (responses.size === 0) {
            msg.delete().catch(e=> {let a = (new Error); gear.errLog(e,__filename,a.stack.toString())});
            message.reply(v.timeout);
            message.delete().catch(e=> {let a = (new Error); gear.errLog(e,__filename,a.stack.toString())});
        } else {

            let rea = responses.first()

            // if X
            if (rea.emoji == xmark) {
                message.reply(xmark + v.cancelled)
                msg.delete().catch(e=> {let a = (new Error); gear.errLog(e,__filename,a.stack.toString())});
                message.delete().catch(e=> {let a = (new Error); gear.errLog(e,__filename,a.stack.toString())});
                return
            }
            //if Background
            if (rea.emoji == bkgEmoj) {
                msg.delete().catch(e=> {let a = (new Error); gear.errLog(e,__filename,a.stack.toString())});

                return message.reply("Use `+background`")
              //  return callA(0) // call s shop
            }
            //if Medal
            if (rea.emoji == medalEmoj) {
                msg.delete().catch(e=> {let a = (new Error); gear.errLog(e,__filename,a.stack.toString())});
                return callB(0) // call s shop
            }
            //if Goodies
            if (rea.emoji == toolsEmoj) {
                msg.delete().catch(e=> {let a = (new Error); gear.errLog(e,__filename,a.stack.toString())});
                return message.reply("Unavailable");
               // return callC(0) // call s shop
            }
        }




    })

})

function createpage(peeji) {


    var ary = {}
    for (i = 1; i < peeji.length + 1; i++) {

        ary[nums[i]] = {
            name: peeji[i - 1][0], // ????
            icon: peeji[i - 1][1],
            price: peeji[i - 1][2]
        }
    }

    return ary;

}
function buildPage(page) {

    console.log("FUNCTION: buildPage \n CURRPAGE: " + page)
    let currentPage = page || 0;
    let menuArr = menu[currentPage]; // MENU IS GLOBAL
    let pageObj = createpage(menu[currentPage]); // reaction pagination
    let emb = new gear.Discord.RichEmbed
    emb.setColor("#e12f55")
    emb.setTitle(medalEmoj + " "+v.medalShop.toUpperCase())
    for (i = 0; i < menuArr.length; i++) {


        let emojifile = menuArr[i][1];
       let namemede = menuArr[i][0];
       let pricet =  menuArr[i][2];

          let inv = Author.dDATA.modules.medalInventory

          var owned = false;
          for (a = 0; a < inv.length; a++) {
              var o = inv[a].includes(emojifile)
              if (o == true) {
                owned = true
              }
          }

            let pricetag = gear.emoji("rubine") + " **" + pricet + "** Rubines"
        if (owned){
            pricetag = ":label: Sold Out!"
        }else{
            let pricetag = gear.emoji("rubine") + " **" + pricet + "** Rubines"
        }

        /*

         let pricetaggie = gear.emoji("rubine") + " **" + menuArr[i][2] + "** Rubines"

        console.log(menuArr[i])

        checkOwnership(menuArr[i][1])


          if (){
              pricetaggie = ":label: **Sold Out**"
          }
        */


        // emb.addField("1","1",true)
        emb.addField(nums[i + 1], gear.emoji(emojifile) + " **" + namemede + "** \n" + pricetag, true)
    }

    return {
        embed: emb,
        menuArr: menuArr,
        reacts: pageObj
    }

}
function processCheckout(item, index, m) {

    let icon = gear.emoji(item[0])
    let medal_file = item[0]
    let price = item[1]
    let name = item[2]

    let funds = gear.checkGoods(price, Author)
    if (!funds) {
        Channel.send(v.noFundsResponse).then(m => m.delete(2500).catch(e=> {let a = (new Error); gear.errLog(e,__filename,a.stack.toString())}))
        return refresh(index, m, v.noFundsFormal)
    };
    let processing = new gear.Discord.RichEmbed;
    processing.setColor("#2bb955")
     m.clearReactions().catch(e=>{         message.reply("I need MANAGE MESSAGES and ADD REACTIONS Permissions to do this correctly, please contact the server administrator");            });
    processing.setTitle(v.processing)
    processing.setDescription(`${icon} ${name} :: ${gear.emoji("rubine")}**${price}**
${v.youSure}`)
    m.edit({
        embed: processing
    }).then(async m2 => {


        await m2.react(check)
        await m2.react(xmark)


        return new Promise(async resolve => {

            const responses = await m2.awaitReactions(react =>
                react.users.has(Author.id), {
                    maxEmojis: 1,
                    time: 20000
                }
            ).catch(e=> {let a = (new Error); gear.errLog(e,__filename,a.stack.toString())});

            if (responses.size === 0) {

            } else {

                let rea = responses.first()

                if (rea.emoji == check && rea.count > 1) {

                    let inv= Author.dDATA.modules.medalInventory
                    let myMedal = [medal_file,name]

               for (i=0;i<inv.length;i++){
                   var ownd = inv[i].includes(name)
                    if (ownd == true) break;
               }

                    if(ownd){

                        Channel.send(v.alreadyPosess).then(m => m.delete(2500).catch(e=> {let a = (new Error); gear.errLog(e,__filename,a.stack.toString())}))
                        return refresh(index, m, v.alreadyPosess)

                    }


                    m2.delete().catch(e=> {let a = (new Error); gear.errLog(e,__filename,a.stack.toString())})
                    message.reply(check + " "+v.confirmed)
                    message.delete().catch(e=> {let a = (new Error); gear.errLog(e,__filename,a.stack.toString())})
                    gear.paramIncrement(Author, "rubines", -price)
                    return gear.paramAdd(Author, "medalInventory", [medal_file,name])
                }
                if (rea.emoji == xmark && rea.count > 1) {
                    //m.delete()
                    return refresh(index, m)


                }
            } // await emmiter end

        })


    })


}

async function callB(index, recycle, messIn, optMsg) {

    console.log("FUNCTION: callB \n INDEX: " + index) //undefined?
    let current = index;
    var optMsg = optMsg || "";
    let menuPage = await buildPage(current)
    // console.log(menuPage)
    if (!recycle) {

        //TOSS
        return message.channel.sendEmbed(menuPage.embed).then(async m => pageResolve(m, menuPage, current))
    }
    return messIn.edit(optMsg, {
        embed: menuPage.embed
    }).then(async m => pageResolve(m, menuPage, current))
    //return await messIn.delete();
    // return await Channel.sendEmbed(menuPage.embed).then(async m => pageResolve(m, menuPage,current))
}
async function loadMedalShop(m, menuPage, index) {

    console.log("FUNCTION: loadMedalShop")
    for (i = 0; i < menuPage.menuArr.length; i++) {
        await m.react(nums[i + 1]);
    }
    await m.react(xmark)
    if (index !== 0) {
         m.react("◀");
    }
    if (index != menu.length - 1) {
         m.react("▶");
    }


}
async function pageResolve(m, menuPage, index) {

    var index = index || 0;


    console.log("FUNCTION: pageResolve \n INDEX: " + index)
    //generate list for this page
    loadMedalShop(m, menuPage, index)

    //reactmonitor
    return new Promise(async resolve => {

        const responses = await m.awaitReactions(react =>
            react.users.has(Author.id), {
                maxEmojis: 1,
                time: 20000

            }
        ).catch(e=> {let a = (new Error); gear.errLog(e,__filename,a.stack.toString())});

        if (responses.size === 0) {
            m.delete().catch(e=> {let a = (new Error); gear.errLog(e,__filename,a.stack.toString())});
            message.reply(v.timeout);
            message.delete().catch(e=> {let a = (new Error); gear.errLog(e,__filename,a.stack.toString())});
        } else {

            let rea = responses.first()
            let finder = menuPage.reacts[rea.emoji]

            if (rea.emoji == xmark) {

                message.reply(xmark + v.cancelled)
                m.delete().catch(e=> {let a = (new Error); gear.errLog(e,__filename,a.stack.toString())});
                message.delete().catch(e=> {let a = (new Error); gear.errLog(e,__filename,a.stack.toString())});
                return
            }
            //equals ARRitm
            if (finder && rea.count > 1) {
                //return message.reply("ok" + gear.emoji(finder.icon))

                let item = [finder.icon,
                finder.price,
                finder.name]

           if(checkOwnership(finder.icon)){
                 return refresh(index, m, v.alreadyPosess)
           }

            processCheckout(item, index, m)

            }
            //equalsARROW
            if (rea.emoji === "▶" && rea.count > 1) {
                console.log("index " + index)
                console.log("===========CALL B >>")
                return refresh(index + 1, m)

            } // arrow >> end
            if (rea.emoji === "◀" && rea.count > 1) {
                console.log("index " + index)
                console.log("===========CALL B <<")
                return refresh(index - 1, m) // << this call errors
            } // arrow >> end
        } // await emmiter end

    })

}

      function checkOwnership(item) {
          let inv = Author.dDATA.modules.medalInventory
try{


          for (i = 0; i < inv.length; i++) {
              var ownd = inv[i].includes(item)
              if (ownd == true) {
                  return true
                  break;
              }
          }
}catch(e){}
      }

async function refresh(index, m, optm) {
    await  m.clearReactions().catch(e=>{         message.reply("I need MANAGE MESSAGES and ADD REACTIONS Permissions to do this correctly, please contact the server administrator");             });;
    return callB(index, true, m, optm);
}

} // MODULE END

module.exports = {
    pub: true,
    cmd: cmd,
    perms: 3,
    init: init,
    cat: 'rubine'
};

