const fx = require("../core/functions.js")
module.exports = {
    run: function run(gear, DB, userDB, bot, mem, nemem) {

      let params = ["displayName", "avatarURL"]

      let avi1;
      let avi2;
      try {
        avi1 = mem.user.avatarURL.split('?')[0]
      }catch (e) {
          avi2 = mem.user.defaultAvatarURL.split('?')[0]
        }

        let log = function log(alt, ty) {
          try {
            if (ty == "displayName") return gear.sendLog("usrNick", "adv", mem.guild, DB, mem.user, alt, {
              tag: mem.user.tag,
              user: {
                img: (avi1 || avi2),
                men: mem.user.toString()
              }
            });

          } catch (e) {
            console.log(e)
          }
        }

        fx.run("exposeLogs", params, {
          changes: log,
          old: mem,
          new: nemem
        })

      }
    }