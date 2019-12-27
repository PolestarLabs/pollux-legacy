const fs = require("fs");
const gear = require('../../gearbox.js')
const paths = require("../../paths.json");
const Pixly = require("pixel-util");
const Canvas = require("canvas");
//const locale = require('../../../utils/multilang_b');
//const mm = locale.getT();




const init= async function run(msg,userDB,DB) {

try{
    let b
    if (msg.content.includes("-benchmark")) b = true;

    let start = Date.now()

    bot = msg.botUser

    msg.channel.startTyping()

    if (msg.guild.members.size < 9) return msg.reply("Your server needs at least 9 members");

    const canvas = new Canvas.createCanvas(600, 600);
    const overlay = new Canvas.createCanvas(600, 600);
    const ctx = canvas.getContext('2d');
    const ovly = overlay.getContext('2d');


    async function getImage(path) {
      let neo = await new Canvas.Image;
      neo.src = await Pixly.createBuffer(path).then(b => {
        return b;
      });
      return neo;
    }



    let guys_main_list = msg.guild.members.filter(mem => {
      if (!mem.user.avatarURL) return false;
      let last = mem.lastMessage
      if (last == null) return false;
      if (mem.id == msg.author.id) return false;
      if ((Date.now() - last.createdTimestamp < 2500000 &&
          last.guild.id == msg.guild.id) &&
        mem.presence.status != 'offline'
      ) return true;
      else return false;
    })

    let mainlist_filter = Date.now()

    if (guys_main_list.size == 8) guys_main_list.set(bot.id, bot);

    let guys_side_list = msg.guild.members.filter(mem => {

      if (!mem.user.avatarURL) return false;
      if (mem.id == msg.author.id) return false;
      let last = mem.lastMessage
      if (mem.presence.status != 'offline') return true;
      else return false;
    })

    let sidelist_filter = Date.now()

    let wilpo = 0
    while (guys_main_list.size < 9 && wilpo < 8) {
      let rag = guys_side_list.random()
      if (!guys_main_list.has(rag.id)) {
        guys_main_list.set(rag.id, rag);
      }
      wilpo++
    }

    let whileloop = Date.now()

    let final_list = guys_main_list.array()
    final_list.push(msg.member);
    final_list = gear.shuffle(final_list)

    let ARR = final_list.map(x => {

      return [x.displayName, x.user.displayAvatarURL({format:'png',size:128})]
    })

    let array_map = Date.now()

    let aligs = [
    ["LAWFUL GOOD", "#4bceff"],
    ["NEUTRAL GOOD", "#6bd345"],
    ["CHAOTIC GOOD", "#f5d212"],

    ["LAWFUL NEUTRAL", "#1e55eb"],
    ["TRUE NEUTRAL", "#ebebeb"],
    ["CHAOTIC NEUTRAL", "#f8700c"],

    ["LAWFUL EVIL", "#8443b4"],
    ["NEUTRAL EVIL", "#0f0f0f"],
    ["CHAOTIC EVIL", "#d41717"],

  ]
    let loops = []


    await generateTable();


    async function generateTable() {
      for (y = 0; y < 3; y++) {
        await generateRow(0, y);
        await generateRow(3, y);
        await generateRow(6, y);
      }
    }


    async function generateRow(i, y) {

      let row = Math.floor(i / 3)

      let tag = await gear.tag(ctx, aligs[y + i][0], "900 20px Serif", aligs[i + y][1]);
      let wid = tag.width > 160 ? 160 : tag.width
      let c = wid / 2


      let pic = await gear.getCanvas(ARR[y + i][1]);

      let name = ARR[i][0]
      let d = 204 * y
      let xx = 180 * row
      await ctx.drawImage(pic, 38 + d, 71 + xx, 116, 116);
      await ovly.drawImage(tag.item, 12 + d + 80 - c, 200 + xx, wid, tag.height);

    }



    let endloop = Date.now()

    let title = await gear.tag(ctx, "Alignment Chart for " + msg.guild.name, "900 28px Whitney", "#fff");
    let pic = await gear.getCanvas(paths.BUILD + "alignchart.png");
    ctx.drawImage(pic, 0, 0)
    let wid = title.width > 550 ? 550 : title.width
    let center = 300 - wid / 2
    ctx.drawImage(title.item, center, 12, wid, title.height)
    ctx.drawImage(overlay, 0, 0)

    let endcanvas = Date.now()


    let benckmark = b ? `
**Main List**: ${mainlist_filter-start}ms
**Side List**: ${sidelist_filter-start}ms
**While**: ${whileloop-start}ms
**Array** Map: ${array_map-start}ms
**Loops**: ${loops[0]-start}ms ${loops[1]-start}ms ${loops[2]-start}ms
**End of Loops**: ${endloop-start}ms
**TOTAL**: ${endcanvas-start}ms
` : ""
    msg.channel.stopTyping()
    msg.channel.send({
      files: [{
        attachment: await canvas.toBuffer(),
        name: "align_chart.png"
                    }]
    })
  }catch(e){
    msg.channel.stopTyping()
    console.error(e)
    msg.channel.send("ERROR: - Too few members or not enough activity")

  }
  }







  module.exports = {
     pub:true,
     cmd: "alignment",
     perms: 3,
     init: init,
     cat: 'forFun',
     cool:2500
 };
