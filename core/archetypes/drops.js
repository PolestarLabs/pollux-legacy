const gear = require("../gearbox.js");
const paths = require("../paths.json");

const channelDB = gear.channelDB,
      userDB    = gear.userDB,
      DB        = gear.serverDB;



function eventChecks(svDATA){

  if (!svDATA.event) return 1;
  if (!svDATA.event.enabled) return 1;
  if (!svDATA.event.channel) return 1;
  if (!svDATA.event.iterations) return 1;

  let I = Math.round(svDATA.event.iterations)

  return I;

}



module.exports = {
  lootbox: async function loot(event) {



const locale = require('../../utils/multilang_b');
const mm = locale.getT();
    let date = new Date();
     if (event.content !== "--forcedroploot" && event.author.id!=="88120564400553984") {
     if (date.getSeconds() === 0)return;
     if (date.getSeconds() % 5 === 0)return;


     };

    if (event.guild.lootie) return console.log("lootie is ON");
    event.guild.lootie = false;
    const msg = event

    const MSG = event.content;
    const SVR = msg.guild;
    const CHN = msg.channel;
    const L = msg.lang

    let serverDATA= await gear.serverDB.findOne({id:SVR.id});

    if ((await channelDB.findOne({id:CHN.id})).modules.DROPS == false) return;

    let prerf = (await DB.findOne({id:msg.guild.id})).modules.PREFIX || "+";
    const P = {
      lngs: msg.lang
    }
    const v = {
      dropLoot: mm("loot.lootDrop." + (gear.randomize(1, 5)), P) + mm("loot.lootPick", P).replace(prerf, ""),
      disputing: mm("loot.contesting", P),
      oscarGoesTo: mm("loot.goesTo", P),
      gratz: mm("loot.congrats", P),
      morons: mm("loot.morons", P),
      eventDrop: mm("loot.eventDrop", P),
      suprareDrop: mm("loot.suprareDrop", P)+ mm("loot.lootPick", P),
      rareDrop: mm("loot.rareDrop", P)+ mm("loot.lootPick", P),
      ultraRareDrop: mm("loot.ultraRareDrop", P)+ mm("loot.lootPick", P)
    }

    try{
    await dropLoot(event, DB, userDB, MSG, SVR, CHN, L, v);
       event.guild.lootie = false
    }catch(e){
      console.log(e)
      event.guild.lootie = false
    };

    event.guild.lootie = false
    async function dropLoot(event) {
      return new Promise(async resolve => {

      let droprate = gear.randomize(1, 1000);


      event.botUser.ivetal = event.botUser.ivetal || 0
        event.botUser.ivetal++

      if (event.content === "--forcedroploot" && event.author.id==="88120564400553984") droprate=777;



    if (droprate === 777) {

      event.botUser.channels.get('382413370579484694').send("Lootbox Drop at **"+event.guild.name+"** | #"+event.channel.name+` after ${event.botUser.ivetal} messages`);
      event.botUser.ivetal = 0;


      let options = [
        [v.ultraRareDrop,"lootbox_UR_O"] , //10
        [v.suprareDrop,"lootbox_SR_O"],    //98
        [v.rareDrop,"lootbox_R_O"],        //765
        [v.dropLoot,"lootbox_U_O"]         //4321
        [v.dropLoot,"lootbox_C_O"]         //4321
      ];
      let cax;
      let rand = gear.randomize(0, 20)
      switch (rand) {
        case 20:
          cax = options[0]
          break;
        case 19:
        case 18:
          cax = options[1]
          break;
        case 17:
        case 16:
        case 15:
          cax = options[2]
          break;
        case 14:
        case 13:
        case 11:
        case 10:
          cax = options[3]
          break;
        default:
          cax = options[4]
          break;
      };
      let itemPic = "chest.png"

      function convertToEvent(){
          cax[1] = cax[1].replace("O", "event_2")
          cax[0] += "\n" + v.eventDrop
          itemPic = "xmas_chest.png"
        }
      let iterate= eventChecks(serverDATA);

      for (i=0;i<iterate;i++){
        let dropevent = gear.randomize(1, 5);
        if (dropevent >= 5)convertToEvent();
      };

          CHN.send(cax[0], {
              files: [paths.BUILD + itemPic]
            })
            .then(dropMsg => event.channel.send(v.disputing)
              .then(dispMsg => processDropChest(dropMsg, dispMsg, cax[1])))
            .catch(err => {
              CHN.send(cax[0])
                .then(dropMsg => event.channel.send(v.disputing)
                  .then(dispMsg => processDropChest(dropMsg, dispMsg, cax[1])))
                .catch(err => console.log(err))
            })
          }
        })
      }
    async function processDropChest(drop, disp,it) {
      try {
        if (!CHN.loot) {
          CHN.loot = true
        }
        return new Promise(async resolve => {
          let oldDropsly = CHN.DROPSLY;
          let pickers = new gear.Discord.Collection;
          let responses = await CHN.awaitMessages(async msg2 => {

            if (!pickers.has(msg2.author.id) && (msg2.content.toLowerCase().includes('pick'))) {
              pickers.set(msg2.author.id, msg2);
              console.log(pickers.has(msg2.author.id))
              await disp.edit(disp.content + "\n" + msg2.author.username).then(neue => {
                disp.content = neue.content;
                return true;
              })
            } else {
              return false
            }
          }, {time: 30000});

          if (pickers.size === 0) {
              drop.delete()
              disp.delete()
              CHN.send(v.morons)
            event.guild.lootie = false
            return resolve(false);
          } else {
            if (oldDropsly > CHN.DROPSLY) {
              drop.delete().catch(e => {});
              event.guild.lootie = false
              return resolve(true);
            };
            let drama = [],
                ments = [],
                ids   = [];
              pickers.forEach(ms => {
              drama.push(ms.guild.member(ms.author).displayName)
              ments.push(ms.author).toString()
              ids.push(ms.author.id)
            })

            let rnd = gear.randomize(0, ments.length - 1);

            console.log("----------- PICK by" + drama[rnd])
            await pickers.deleteAll();
            await drop.delete().catch(e => {});
            await disp.delete().catch(e => {});

            CHN.send(v.oscarGoesTo).then(goes => {
              CHN.send(drama).then(async dra => {
                setTimeout(async fn => {
                  drama[rnd] = ments[rnd]
                  await dra.edit(drama).then(async fin => {
                    console.log(ids[rnd],it,"A A A")
                     userDB.set(ids[rnd],{$push:{'modules.inventory':it}}).then(ok=>{

                    setTimeout(async fn => {
                      event.guild.lootie = false
                      fin.delete().catch(e => {event.guild.lootie = false})
                    }, 5000);
                     });
                  });
                }, 5000)
              });
              CHN.loot = false;
              event.guild.lootie = false;
              return resolve(true);
            });
          };
        });
      } catch (e) {
        let v = "Rubine Send Forbidden: " + drop.guild.name + " C: " + drop.channel.name
        gear.hook.send(e.error);
        hook.send(v)
      }
    }
  }
};
