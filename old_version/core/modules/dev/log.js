const Discord = require("discord.js");
var gear = require("../../gearbox.js");
var locale = require('../../../utils/multilang_b');
var mm = locale.getT();
var cmd = 'NOT_DISABLEABLE';
const cfg = require('../../../config.js');
var init = function (evento, logtype, Server, DB, extras, alt, arg, nise) {
  var LANG = DB.modules.LANGUAGE;

  //-------MAGIC----------------

  /*
   console.log(".\n\n")
   console.log("\n\n")
   console.log("|log.js| - Start")
   console.log("Extras:")
   console.log(extras)
   console.log("Argument:")
   console.log(arg)
   console.log("ALT:")
   console.log(alt)
   console.log("EVE:")
   console.log(evento)
   console.log("-----------------\n\n")
   console.log("\n .\n")
  */

  try {

    let neoma = ""
    if (!arg) {
      var arg = {
        user: {
          men: ""
        }
      }
    }
    try {


      neoma = arg.user.imgn || alt[1].a
    } catch (e) {
      neoma = " "
    }

    try {
      let P = {
        lngs: [LANG, "en"]
      }



      let chanpoint = false;
      let logchan = DB.modules.LOGCHANNEL
      let advchan = DB.modules.ADVLOG
      let actchan = DB.modules.ACTLOG
      let modchan = DB.modules.MODLOG


      switch (true) {
        case logchan && Server.channels.has(logchan):
          chanpoint = Server.channels.get(logchan);

          break;
        case logtype == "act" && actchan && Server.channels.has(actchan):
          chanpoint = Server.channels.get(actchan);
          break;
        case advchan && logtype == "adv" && Server.channels.has(advchan):
          chanpoint = Server.channels.get(advchan);
          break;
        case logtype == "mod" && modchan && Server.channels.has(modchan):
          chanpoint = Server.channels.get(modchan);
          break;
        default:
          chanpoint = false;
      }

      function createLog(icon, title, flavor, event, footer, color, image, full) {

        const ember = new Discord.RichEmbed;

        if (title) ember.setTitle(title);
        if (flavor) ember.setDescription(icon + " " + flavor);
        if (event && footer) ember.setFooter(event, footer);
        if (event && !footer) ember.setFooter(event);
        if (image) ember.setThumbnail(image);
        
        if (full && full.includes('http://')) ember.setImage(full ||neoma|| arg.user.imgn || "");
        ember.setColor((color || "#4c63e2"));
        var ts = new Date
        ember.setTimestamp(ts)
        return ember

      }

      //%1 user %2 channel %3 server %4 role


      const logItems = {


        userJoin: {
          icon: ":heart:",
          title: undefined,
          flavor: mm("logs.userJoin", P),
          event: mm("website.userJoin", P),
          footer: arg.user.img,
          color: "#36b244",
          image: undefined
        },

        userLeave: {
          icon: ":broken_heart:",
          title: undefined,
          flavor: mm("logs.userLeave", P),
          event: mm("website.userLeave", P),
          footer: arg.user.img,
          color: "#e32222",
          image: undefined
        },
        messDel: {
          icon: gear.emoji("nope"),
          title: undefined,
          flavor: mm("logs.messDel", P),
          event: mm("website.messDel", P),
          footer: arg.user.img,
          color: "#e82525",
          image: undefined
        },
        messEdit: {
          icon: " ",
          title: undefined,
          flavor: mm("logs.messEdit", P),
          event: mm("website.messEdit", P),
          footer: arg.user.img,
          color: "#edc726",
          image: undefined
        },



        usrBan: {
          icon: ":hammer:",
          title: undefined,
          flavor: mm("logs.userJoin", P),
          event: mm("website.userJoin", P),
          footer: undefined,
          color: "#36b244",
          image: arg.user.img,
        },
        usrKick: {
          icon: ":boot:",
          title: undefined,
          flavor: mm("logs.userJoin", P),
          event: mm("website.userJoin", P),
          footer: undefined,
          color: "#36b244",
          image: arg.user.img,
        },
        usrMute: {
          icon: ":mute:",
          title: undefined,
          flavor: mm("logs.usrMute", P),
          event: mm("website.usrMute", P),
          footer: undefined,
          color: "#3640b2",
          image: arg.user.img,
        },
        usrUnmute: {
          icon: ":loud_sound:",
          title: undefined,
          flavor: mm("logs.usrUnmute", P),
          event: mm("website.usrUnmute", P),
          footer: undefined,
          color: "#3640b2",
          image: arg.user.img,
        },

        newChan: {
          icon: ":hash:",
          title: undefined,
          flavor: mm("logs.newChan", P),
          event: mm("website.newChan", P),
          footer: undefined,
          color: "#4e6def",
          image: undefined
        },
        newRole: {
          icon: ":package:",
          title: undefined,
          flavor: mm("logs.newRole", P),
          event: mm("website.newRole", P),
          footer: undefined,
          color: "#4e6def",
          image: undefined
        },
        permsEdit: {
          icon: ":",
          title: undefined,
          flavor: mm("logs.permsEdit", P),
          event: mm("website.permsEdit", P),
          footer: undefined,
          color: undefined,
          image: undefined
        },
        revokeBan: {
          icon: ":",
          title: undefined,
          flavor: mm("logs.revokeBan", P),
          event: mm("website.revokeBan", P),
          footer: undefined,
          color: undefined,
          image: undefined
        },
        uptRole: {
          icon: ":package:",
          title: undefined,
          flavor: mm("logs.uptRole", P),
          event: mm("website.uptRolen", P),
          footer: undefined,
          color: undefined,
          image: undefined
        },
        delChan: {
          icon: ":hash:",
          title: undefined,
          flavor: mm("logs.delChan", P),
          event: mm("website.delChan", P),
          footer: undefined,
          color: undefined,
          image: undefined
        },
        updtChan: {
          icon: ":hash:",
          title: undefined,
          flavor: mm("logs.updtChan", P),
          event: mm("website.updtChan", P),
          footer: undefined,
          color: undefined,
          image: undefined
        },
        usrNick: {
          icon: ":pencil: ",
          title: undefined,
          flavor: mm("logs.usrNick", P),
          event: mm("website.usrNick", P),
          footer: undefined,
          color: undefined,
          image: undefined
        },
        usrPhoto: {
          icon: ":frame_photo:",
          title: undefined,
          flavor: mm("logs.usrPhoto", P),
          event: mm("website.usrPhoto", P),
          footer: undefined,
          color: "#36b29a",
          image: arg.user.imgn

        },
        usrRoles: {
          icon: ":package:",
          title: undefined,
          flavor: mm("logs.usrRoles", P),
          event: mm("website.usrRoles", P),
          footer: undefined,
          color: undefined,
          image: undefined
        }
      }


      if (chanpoint) {
        let namely = arg.tag || arg.user.name || arg.user.men || extras
        let a = logItems[evento]
        let igg = arg.user.imgn||neoma
        let emb = createLog(a.icon, a.title, (a.flavor)
          .replace("%2%", extras)
          .replace("%11%", neoma)
          .replace("%1%", namely),
          a.event, a.footer, a.color, a.image, igg)

        
        
        
        
        
        if (alt) {
          if (alt.constructor == Array) {

            if (alt[0].a == "displayName") return;
            if (typeof alt[0] == "string") {
              emb.addField(gear.emoji("nope"), "```" + alt[0] + "```", false)
              emb.addField(gear.emoji("yep"), "```" + alt[1] + "```", false)

            } else {


              emb.addField(alt[0].e, ":small_red_triangle_down: " + alt[0].a, true)
              emb.addField("*", ":small_red_triangle: " + alt[1].a, true)
            }
          } else if (typeof alt == "string") {
            //console.log(alt)
            emb.addField(arg.user.men, "```" + alt + "```")


          } else {

            let stata = alt.a.toString().replace("true", gear.emoji("yep")).replace("false", gear.emoji("nope"))
            emb.addField(alt.e, stata)
          }
        }


        chanpoint.send({
          embed: emb
        }).catch(e => {
         // console.log(e)
        })

      }

    } catch (err) {
      //console.log(err)
    }


  } catch (err) {
    //console.log(err)
  }
}

module.exports = {
  pub: true,
  cmd: cmd,
  perms: 3,
  init: init,
  cat: 'dev'
};