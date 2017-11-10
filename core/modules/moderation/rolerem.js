const gear = require("../../gearbox.js");
const paths = require("../../paths.json");
const locale = require('../../../utils/multilang_b');
const mm = locale.getT();

const cmd = 'rolerem';

const init = function (message) {
        const Server = message.guild;
        const Channel = message.channel;
        const Member = message.member;
        const Target = message.mentions.members.first() || Member;
        const MSG = message.content;
        const bot = message.botUser;
        const args = MSG.split(/ +/).slice(1)
        const LANG = message.lang;


//HELP TRIGGER
const P = {lngs:message.lang};
if(gear.autoHelper([mm("helpkey",P),'noargs',''],{cmd,message,opt:this.cat}))return;
if(args.length<2||args[1].includes("<"))return gear.autoHelper('force',{cmd,message,opt:this.cat});
//------------

 const modPass = gear.hasPerms(Member);
    if (!modPass) {
        return message.reply(mm('CMD.moderationNeeded', {
            lngs: LANG
        })).catch(console.error);
    }

            const On = gear.emoji("yep")
            const Off = gear.emoji("nope")

            const rolenotfound = mm('CMD.nosuchrole', P);
            const noPermsMe = mm('CMD.unperm', P);

            return fR(args[1], Server.member(Target))

            function fR(role, memb) {


                let a = memb.roles.find(rol=>rol.name.toLowerCase()==role.toLowerCase()||rol.name.toLowerCase().includes(role.toLowerCase()));
                if (message.mentions.roles.size>0){
                  a = message.mentions.roles.first()
                }
                if(!a){
                  return message.reply(rolenotfound)
                }

                const rolerem_confirm = On + mm('CMD.superRolermCom', {
                    lngs: LANG,
                    user: memb.displayName,
                    group: a.name
                });
                 const superRoleNope = On + mm('CMD.superRoleNope', {
                    lngs: LANG,
                    user: memb.displayName,
                    group: a.name
                });
               // message.reply(role)
                if (a == undefined) return message.reply(superRoleNope);
                memb.removeRole(a).then(a => message.channel.send(rolerem_confirm)).then(e => {
                  e.delete(120000);
                  message.delete().catch();
                }).catch(e => message.channel.send(noPermsMe))
            }

        }

        module.exports = {
          pub: false,
          cmd: cmd,
          perms: 3,
          init: init,
          cat: 'mod'
        };
