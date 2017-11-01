var gear = require("../gearbox.js");
var paths = require("../paths.js");
var locale = require('../../utils/multilang_b');
var mm = locale.getT();


module.exports = {

  runb: async function loot(event, DB, userDB) {
    
    
    let date = new Date();
     if (event.content !== "--forcedroploot" && event.author.id!=="88120564400553984") {
       
     if (date.getSeconds() === 0)return;
     if (date.getSeconds() % 5 === 0)return;
     if (date.getSeconds() % 3 === 0)return;
     if (date.getSeconds() % 8 === 0)return;
     }
      
   // if (event.author.id!="88120564400553984")return;
    if (event.guild.lootie) return console.log("lootie is ON");
    event.guild.lootie = false
      //setTimeout(()=>event.guild.lootie = false,80000)
    const msg = event
    const message = event

    const MSG = event.content;
    const SVR = msg.guild;
    const CHN = msg.channel;
    const L = msg.lang

    
    
    if ((await DB.findOne({_id:SVR.id})).channels[CHN.id].modules.DROPS == false) return;
    
    
    let prerf = (await DB.findOne({_id:msg.guild.id})).modules.PREFIX || "+";
    const P = {
      lngs: msg.lang,
      prefix: prerf
    }
    
    const v = {
      dropLoot: mm("loot.lootDrop." + (gear.randomize(1, 5)), P) + mm("loot.lootPick", P).replace(prerf, ""),
      disputing: mm("loot.contesting", P),
      oscarGoesTo: mm("loot.goesTo", P),
      gratz: mm("loot.congrats", P),
      morons: mm("loot.morons", P),
      
      eventDrop: mm("loot.eventDrop", P),
      suprareDrop: mm("loot.suprareDrop", P)+ mm("loot.lootPick", P).replace(prerf, ""),
      rareDrop: mm("loot.rareDrop", P)+ mm("loot.lootPick", P).replace(prerf, ""),
      ultraRareDrop: mm("loot.ultraRareDrop", P)+ mm("loot.lootPick", P).replace(prerf, "")

    }

    
    try{
    
    await dropLoot(event, DB, userDB, MSG, SVR, CHN, L, v);
       event.guild.lootie = false

    }catch(e){
      console.log(e)
      event.guild.lootie = false
    }
event.guild.lootie = false
  async function dropLoot(event) {
    return new Promise(async resolve => {

      //if (SVR.name === "Discord Bots") return;
      var droprate = gear.randomize(1, 3000)
      
        
      
      if (event.content === "--forcedroploot" && event.author.id==="88120564400553984") droprate=777;
    if (droprate === 777) {

      
     // gear.tweetPic("A lootbox dropped somewhere. More specifically at \""+event.guild.name+"\" Server! Who's going to pick?",'./resources/imgres/build/chest.png')
      
          console.log(`



===============================================
|]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]|
|                                             |
|        ######    ######     ####    ######  |  
|       ##   ##   ##   ##   ##  ##   ##   ##  |
|      ##    ##  ##   ##  ##    ##  ##   ##   |
|     ##    ##  ##  ##   ##    ##  ##  ###    |
|    ##    ##  #####    ##    ##  #####       |
|   ##   ##   ##   ##   ##  ##   ##           |MMMMM/MMdoomMMMd:sMMMMMMMMMMNmdhhys+dMMMMMMMMMMMMMMMM
|  ######    ##    ##   ####    ##            |MMMMydMMMMNyoyNMMhsNMMMMMMMMMmMMMMMM+mMMMMMMMMMMMMMMM
|                                             |MMMN+MMMMMMMMmyydMMmmMMMMMMMMMdNMMMMm+MMMMMMMMMMMMMMM
|]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]|MMMydMMMMMMMMMMNmyhmmdMMMMMMMMMhMMMMModMMMMMMMMMMMMMM
===============================================MMNoMMMMMMMMMMMMMMMNddyNMMMMMMMNhMMMMhsMMMMMMMMMMMMMM
|                                              MMomMMMMMMMMMMMMMMMMMMNhhMMMMMMMmdMMMm+MMMMMMMMMMMMMM
|    SERVER: ${event.guild.name}
|                                              N:syddmNNMMMMMMMMMMMdMMMMNyhMMMMMNyMMMM+mMMMMMMMMMMMM
===============================================ymNmmddhyyhddmmMMMMNommMMMMooNMMMMoyMMMm/MMMMMMMMMMMM
sooo:oooooos+dMMMNMMMMMMMMMMMMMMMMMMMmhMMMMMMMyNMMMMMMMMMMMMMMMMMMMmNMMMMMM+oMMMMy´+mMModMMMMMMMMMMM
MMMhmMMMMMdsmMNNMMMMMMMMMMMMMMMMMMMdsdNMMMMMNymMMMMMMMMMMMMMMMMMMMMMMMMMMMMNsmMMMh  -hMm+MMMMMMMMMMM
MMdhMMMMMhyNNdmMMMMMMMMMMMMMMMMMMds/yNMMMMMNomMMMNNNMNNNNNMMMMMMMMMMMMMMMMMMmhMMMm´  ´+N+mMMMMMMMMMM
MNoMMMMMhsNddMMMMMMMMMMMMMMMMMNhydssNMMMMMmodNd/sdmNMNNMNNMMMMMMMMdNMMMMMNdsmsdNMMo.   ./oMMMMMMMMMM
MysdMMMdsmhNMMMMMMMMMMMMMMMMmhydMysNMMMMMdydNmyhMMMMMMMMMMMMMNNmy+´ohys//--hmdyhmm/+.    -MMMMMMMMMM
hs+NMMm+ydMMMMMMMMMMMMMMMNmshmMMh+NMMMMNhdMMMdNMMMMMMMMMNNNmmhs:´  ´.´´    ´.--s-+h//´   ´NMMMMMMMMM
NoNMMM/omMMMMMMMMMMMMMMNhydNMMMhsNMMMMdymMMMMMMMMMMMMmdmNmho-´ ´.-::::--..--´  o+mMd-:´  ´MMMMMMMMMN
/dMMMhsNMMMMMMMMMMMMNd+/sdmNMMdsMMMMNyhMMMMMMMMMMMMMMdNmo-´ .:oydmNNMMMNNmds  .sMMMdm.-. ´MMMMMMmhos
.NMMhhMMMMMMMMMMMMmhyo:hdhhdhyyMMMNddNMMMMMMMMMMMMMMNmo:.-+++yhhhhhsohNMMMM+´:dyNMMdMd´-/´MMNdoshdyd
/MMhdMMMMMMMMMMNdyhNmmMMMMMMdyMMNhyNMMmNNMMMMMMMMMMmy+-+hN++NdddddhdNs:mMm+´-yNoNMmNMMo´+´do-´ dMMyN
/NddMMMMMMMMMNy-yMMMMNNNNNMyyMNdhdMMMMddmMMMMMMMMNdo+smMMM-Nhmy//hdyhd+oo:./sdNsMNdMMMm´o´´    NMMoM
+sdMMMMMMMMmhss:MMMmdyydmmshNhdNMNdNMMMMMMMMMMMMMd+sNMMMMm:yyoy++yoymy+/o+yydmNsNhMMMMM-/-    ´MMdsM
dsMMMMMMMmdhNM+dMMNNMMMMNymhhNMMMMMmmMMMMMMMMMMMMhNMMMMmdy/:+/:.´-.:ys/ssysyddsshMMMMMM:´/    .MN+NM
+NMMMMMmmmdMMN/MNMMMhNNdsyhNMMMMMMMMNdMMMMMMMMMMMMMMMNdyddddmNddd:  ´ ´´´    .-hMMMMMMM..:    -N/mMM
dMMMMMdmmNMMMy/oyys+.´.´´-::::+shmNMMMmMMMMNMNNNNMMNmdNmdydmdhdddo´´          ´sMMMMMMd :´    /:.MMM
MMMMMhdmMMMNN/:      ´´´-://./.-o++oddNmNNNmhdmmdddhdddhhhhhhyhdyys/-´´.´ ´     -dMMMM/´/     + .MMM
MMMMsoso::.-+    +y/omm+dsodsh//ysdddddhddhhddmddhhhdhhdmddhhyyyhhhdyss+/:+/     ´hMMN´-´    -- .MMM
MMMydMMMNmy+   ´´/s/sNmo--.:+hdmmddddhhyhyyhdmmddddddmmNmNmNmdmmNNmmmmmys++oo´    ´sM/ /     +  /MMM
MMhdMMMMMh-  ´:s+-o:.:+sy+hmddddddhdhhdhddhmNddmNMmNMMNMMMMMMMyooyyysyydNMMNso-     /:./    -: -NMMM
MdhMMMNd+    o´-Nho+ooyhhdhhhhhdmdhhdhdmNNyNMNNMMMMMMMMMMMMMMMMMmhhhdddddddddo/:     -+´   ´o´-NMMMd
NyMMmhhNs   :. ´yddhdhdmdhhhddmhhhhssdMMMMhNMMMMMMMMMMMMMMMMMMMMMMMMMMMNNy/ohdh::     ./-  :::mNmdy+
smdhdNMM+   ´.  /dmdssosooooo/-´´´´´./MMNmNmMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMNmdd-/+     ´-/´-/NNNMMMy
/hNMMMMM+   ´s  ´dy´          ´´.:-.+NMMMNNddMMMMMMMMMMMMMMMMMMMMMMMMMhNNMMMMNy.-´        : :MMMMMmM
NMMMMMMMN.   :-  +´   .:-´´´´´´´´-+dMMMMMMMMNMMMMMMMMMMMMMMMMMMMMMMMMmdmMMMMd::+          -´hMMMmmMM
MMMMMMMMM+    :´ .    --´´ ´.:+sdNMMMMMMMMMMMMMMMMMMMMMMMMMMMMMmNMMMMMNMMMMs´´o´          ´hMMMdmMMM
MMMMMMMNhm:   ´:-.    - ohdmNMMMMMMMMMMMMMMMMMMMMMMMMNmdddNss+:´sMMMMMMMMN+´ -.          ´-MMNhmMMMM
MMMMMMdhNMy    -:    :´:MMMMMMMMMMMMMMMMMMMMMMNNMNMmmmNmy+d´.. ´dMMMMMMMm/   /          .syMmhNMMMMM
MMMMNdmMMMd   ´/.   -- yMMMMMMMMMMMMMMmyhhy+/sdmNNNmhy+-´ syhh.:MMMMMMMho.  ´-         .yymymMMMMNNm
MMmhhdhyyhy   .´   ´/  .yMMMMMMMMMMMMMNy-    -:+oo+/-´´´´:hNdd/mMMMMMMy:´   :         .shhsNMMMmmmNM
dyoshddddy- -/     -/  ´:+mMmhNNMMMMMMMMNo´ :hdmmmdddyy/sddmdh+MMMMMNy´     :        ´odhhMMNmdmMMMM
dNMMMMMMMMm :.      +.  ys/odhmMMMMMMMMMMMd/+dNNNmmmNdhhmdddh+dMMMNh:´    ´/´    ´.-odNmMMmhdNMMMMMM
MMMMNMMMMMM+-´      ´/. ´sNh+ohNMMMMMMMMMMMMdysyhhddmmmNmdhyohMMNh-     ´--.  ´:ohmMMmdMmyhNMMMMMMMM
MMMMydMMMMMN/        ..´  /mMd/:/hmNMMMMMMMMMMMNmhysyhyssoodNMMh:       /- ./ymMMMMMmdd+yMMMMMMMMMMM
MMMMNMMMMMMMm-         -.  .yNN:.../+sdmMMMMMMMMdMNmmdddNMMMMN+´        ./yNMMMMMMMhy+/dMMMMMMMMMMMM
MMMMMMMMMMMMMd´        ´o.   /ydNs.´+hhssydNMMMMdMhMMMMMMMMMN:       ´:yNMMMMMMMMMh/:+MMMMMMMMMNMMMM
MMMMMMMMMMMMMMy         ´+.   ´yMmyodNMMMy-hhhmMdNyNMMMMMMMM+      ´:yMMMMMMMMMMMdsm-mMMMMMMMMNdNNMM
MMMMMMMMMMMMMMM-          /.   ´h-/o-:hNMMmMMN//shmMMMMMMMm+     ´/yNMMMMMMMMMMMmyMN/MMMMMMMMMomhMMM
MMMMMMMMNNmNMMMs           /´   -y     -dmdMdo/   ./oyhhs+o+    ´ydNMMMMMMMMMMMNyMMNNMMMMMMMMMhhMMMM
MMmdmmdsohhyyMMN.          ´:    y´  +syy/sdms:´ ´      :dN.   .mdNMMMMMMMMMMMN+NMNdMMMMMMMMMMMMMMMM
MdNMMMMdMMMMoMMMs           :    /:  :NMhhdddmddod+´ -+yMd-    hMdMMMMMMMMMMMMs:MMhdMMMMMMMMMMMMMMMM
MdMMMMMMMMMhdMMMN.          ´:   -o   --+NMMd+hddMMd+NMMysh-  ´NmNMMMMMMMMMMMd´:MMsdMMMMMMMMMMMMMMMM
MdNMMMMMMmhmMMMMMs           +   -o      -hdmNNy-MMMMss+yMM+  .MhNMMMMMMMMMMM- .Mm+mMMMMMMMMMMMMMMMM

`)

      
      
      
      let options = [
        
        [v.ultraRareDrop,"lootbox_UR_O"] , //10
        [v.suprareDrop,"lootbox_SR_O"],    //98
        [v.rareDrop,"lootbox_R_O"],        //765
        [v.dropLoot,"lootbox_C_O"]        //43210
      
      ]
      let cax
      let rand = gear.randomize(0,10)
          switch(rand){
            case 10:
              cax = options[0]
              break;
            case 9:
            case 8:
              cax = options[1]
              break;
            case 7:
            case 6:
            case 5:
              cax = options[2]
              break;
            default:
              cax = options[3]
              break;
              
                     }
          
        let itemPic="chest.png"
        
      if(gear.randomize(0,3)==3){
        
      cax[1].replace("O","event_1")
      cax[0]+="\n"+v.eventDrop
        itemPic="halloween_chest.png"
      }
      
      //halloween_chest
      
        CHN.send(cax[0], {
            files: [paths.BUILD + itemPic]
          })
          .then(dropMsg => event.channel.send(v.disputing)
            .then(dispMsg => processDropChest(dropMsg, dispMsg,cax[1])))
          .catch(err => {
            CHN.send(cax[0])
              .then(dropMsg => event.channel.send(v.disputing)
                .then(dispMsg => processDropChest(dropMsg, dispMsg,cax[1])))
              .catch(err => gear.hook.send("**DROP REFUSES** \n" + err.error))
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

          var oldDropsly = CHN.DROPSLY

          let pickers = new gear.Discord.Collection
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

          }, {
        
            time: 35000
          });
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
            }



            let drama = []
            let ments = []
            let ids = []
            pickers.forEach(ms => {
              drama.push(ms.guild.member(ms.author).displayName)
              ments.push(ms.author).toString()
              ids.push(ms.author.id)
            })

            let rnd = gear.randomize(0, ments.length - 1);


            //   console.log("----------- SUCCESSFUL PICK by" + Picker.username)



            await pickers.deleteAll();
            await drop.delete().catch(e => {});
            await disp.delete().catch(e => {});
            
     
            
            CHN.send(v.oscarGoesTo).then(goes => {


              CHN.send(drama).then(async dra => {
                setTimeout(async fn => {
                  drama[rnd] = ments[rnd]
                  await dra.edit(drama).then(async fin => {
                      
                    await userDB.findOneAndUpdate({_id:ids[rnd]},{$push:{'inventory':it}})

                    setTimeout(async fn => {
                      event.guild.lootie = false
                      fin.delete().catch(e => {event.guild.lootie = false})
                    
                    }, 5000)

                  })
                  // CHN.send("fini")
                }, 5000)
              })



              CHN.loot = false
              event.guild.lootie = false
              return resolve(true);

            })
          }
        })
      } catch (e) {
        let v = "Rubine Send Forbidden: " + drop.guild.name + " C: " + drop.channel.name
        gear.hook.send(e.error);
        hook.send(v)
      }

    }

  }
}