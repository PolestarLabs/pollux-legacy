const gear = require("../../gearbox.js");
const paths = require("../../paths.json");
const Canvas = require("canvas");
const GIFEncoder = require('gif-encoder');
const fs = require("fs");
const cmd = 'boosterpack';
const locale = require('../../../utils/multilang_b');
const mm = locale.getT();

function getRandomCard(db,rarbias){
  let rarit = "C"
  let rand=gear.randomize(0,128);
  rand=rand - (rarbias||0)
    switch(true){
      case rand < 2:
        rarit = "UR";
        break;
      case rand < 10:
        rarit = "SR"
        break;
      case rand < 20:
        rarit = "R"
        break;
      case rand < 40:
        rarit = "U"
        break;
      default:
        rarit ="C"
               }
  let dbd= db.filter(x=>x.rarity==rarit);
  let rand_i = gear.randomize(0,dbd.length-1);
  let rand_ii = gear.randomize(0,dbd.length-1);
  let rand_iii = gear.randomize(0,db.length-1);
  
  return dbd[rand_i]|| dbd[rand_ii]|| db[rand_iii];
}

const init = async function (message) {
  

  const args = message.content.split(/ +/).slice(1)[0];
message.react("⌛")
  
  try {
    //HELP TRIGGER
    let helpkey = mm("helpkey", {lngs: message.lang})
    if ( !args || args === undefined || MSG.split(/ +/)[1] == helpkey || MSG.split(/ +/)[1] == "?" || MSG.split(/ +/)[1] == "help") {return gear.usage(cmd, message,this.cat);}
  } catch (e) {console.error};
    
  //new Canvas.createCanvas(800, 600);

  message.channel.startTyping(1)
  
  const stickerpak = args
  const boosterinfo = (await gear.items.findOne({type:"boosterpack",id:stickerpak+"_booster"}))||{
    id: stickerpak,
    color: "#db2e98",
    rarity: "C"
  };
 
  
  
  const stickerbase= await gear.cosmetics.stickers({series_id:stickerpak});
  //let STICKER_DRAW = getRandomCard(stickerbase)
  //let stickerlist = stickerbase.map(x=> x.name)
  
  let nopes = gear.emoji("nope") + "There's no such pack in your inventory"

  const userData =  await gear.userDB.findOne({id:message.author.id});
  if(!userData.modules.inventory.includes(stickerpak+"_booster")){
     message.channel.stopTyping(2)
    return message.channel.send(nopes);
  }

  const canvas = new Canvas.createCanvas(350, 250);
  const ctx = canvas.getContext('2d');

  var GifEncoder = require('gif-encoder');
  var gif = new GifEncoder(350, 250);
  gif.writeHeader();
  gif.setRepeat(-1); 
  gif.highWaterMark = 800000
  gif.setTransparent(0xFF00FF);
  gif.setFrameRate(32)

  function pad(num, size) {
    var s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
  }
  let emb = new gear.RichEmbed;
  
  function endproc(){
    
  }
  
  const buffers = [];
  gif.on('data', data => buffers.push(data));

  
  const _stickerA = getRandomCard(stickerbase);
  const _stickerB = getRandomCard(stickerbase,15);


  if(!userData.modules.stickerInventory.includes(_stickerA.id))_stickerA.new = true;
  if(!userData.modules.stickerInventory.includes(_stickerB.id))_stickerB.new = true;
  
  
  const stickerA   = await gear.getCanvas(paths.BUILD+"stickers/"+_stickerA.id+".png");

  const stickerB   = await gear.getCanvas(paths.BUILD+"stickers/"+_stickerB.id+".png");
  const box={
   "UR": "ULTRA RARE |"
  ,"SR": "SUPER RARE |"
  ,"R":  "      RARE |"
  ,"U":  "  UNCOMMON |"
  ,"C":  "    COMMON |"
};
    
  emb.title = ":package: ["+_stickerA.series+"] Sticker Booster Contents"
  emb.setThumbnail("https://pollux.fun/build/boosters/showcase/"+_stickerA.series_id+".png")
  ///emb.description = "```ml"+`
  emb.description =`
------------------------------------------------
${_stickerA.new?":new:":":record_button:"} ${gear.emoji(_stickerA.rarity)}  ${_stickerA.name}
${_stickerB.new?":new:":":record_button:"} ${gear.emoji(_stickerB.rarity)}  ${_stickerB.name}
`+"------------------------------------------------\n"+
    "Check and equip your stickers at the [Dashboard](https://pollux.fun/dashboard#/stickers)"
  emb.setFooter(message.author.tag,message.author.avatarURL)
  emb.setColor(boosterinfo.color);

  
  
  const stickerA_rar = await gear.getCanvas(paths.BUILD+"LOOT/rarity/"+_stickerA.rarity+".png");
  const stickerB_rar = await gear.getCanvas(paths.BUILD+"LOOT/rarity/"+_stickerB.rarity+".png");
  
  const bosterBack = await gear.getCanvas(paths.BUILD+"boosters/"+_stickerB.series_id+".png");
  const newe       = await gear.getCanvas(paths.BUILD+"new_i.png");
  const back       = await gear.getCanvas(paths.BUILD+"/boosters/bg_.png");
  const forefore   = await gear.getCanvas(paths.BUILD+"/boosters/mnframe_.png");
  const fore  = await gear.getCanvas(paths.BUILD+"/boosters/mnframe_dwn.png");
  //const bosterBack = await gear.getCanvas(paths.BUILD+"stickers/backs/"+stickerpak);

    var transX = canvas.width * 0.5,
        transY = canvas.height * 0.5;
    let SPEED = 15
    let S = 250
    let metaSize = S
    let FACTOR = S / SPEED * 100
    
    let cutframe;
    let displ=0;
    
let  MAX = 40

    const fs = require('fs')
    if (fs.existsSync("cache/" + _stickerA.id + (_stickerA.new ? "new" : "") + _stickerB.id + (_stickerA.new ? "new" : "") + '.gif')) {
      let prizes = [_stickerA.id, _stickerB.id];
      await breakit(stickerpak + "_booster", prizes);
      message.channel.send({
        embed: emb,
        files: [{
          attachment: "cache/" + _stickerA.id + (_stickerA.new ? "new" : "") + _stickerB.id + (_stickerA.new ? "new" : "") + '.gif',
          name: "booster.gif"
                    }]
      }).then(m => {
        message.channel.stopTyping(2)
      })
      return;
    }else{


  for (let frame = 0; frame < MAX; frame++) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  //ctx.fillStyle = "#999bAd"
  //ctx.fillRect(0,0,350,250);
  //ctx.fillStyle = "#2637d1"
  //ctx.fillRect(0,55,250+frame*2,150);
    ctx.save();
    //fra = await gear.tag(ctx,frame+"");
    //ctx.translate(transX, transY);
    //ctx.drawImage(fra.item,0,0)
    ctx.drawImage(back,0,0)
    ctx.drawImage(fore,0,0)
    
    
    if(frame == 0){
      ctx.drawImage(bosterBack, 0, 0, S, S);
    } else if(frame < 5) {
       displ? displ++ : displ=1;
      let displace = displ * 25
      ctx.drawImage(bosterBack, 0+displace, 0, S-(displace*2), S);
    } else if(frame < 9) {
      if (frame == 5 )displ = 1;
       displ? displ++ : displ=1;
      let displace = displ * 25
      ctx.drawImage(bosterBack, 125+displace, 0, 0-(displace*2), S);
    } else if(frame < 50) {
        if (frame == 9 )displ = 1;
       displ? displ++ : displ=1;
      let displace = displ * 25 > 150 ? 150 : displ * 25;
      let displace2 = displ * 25 
    
      if (frame > 9 ){
        ctx.drawImage(stickerA, 25+Math.sqrt(displace2*45,3)-90, 25, 150, 150);
        ctx.drawImage(stickerA_rar, 25+Math.sqrt(displace2*45,3)-90+20, 25+100, 32, 32);
        if(_stickerA.new) ctx.drawImage(newe, 25+Math.sqrt(displace2*45,3)-90+20, 25+20, 50, 50);
        
      }
      if (frame > 10 ){
        ctx.drawImage(stickerB, 25+Math.sqrt(displace2*25,3)+20, 80, 150, 150);
        ctx.drawImage(stickerB_rar, 25+Math.sqrt(displace2*25,3)+20+20, 80+100, 32, 32);
        if(_stickerB.new) ctx.drawImage(newe, 25+Math.sqrt(displace2*25,3)+20+20, 80+20, 50, 50);
        
      }
      
   ctx.drawImage(bosterBack, 250-displace/2, 0, -S, S);
   
    } 
    
    ctx.drawImage(fore,0,0)
     gif.addFrame(ctx.getImageData(0, 0, 350, 250).data);
    
  if(frame == MAX-1) gif.finish();
  }
  


  gif.once('end', async() => {
    let xD = Buffer.concat(buffers)
    
    let prizes = [_stickerA.id,_stickerB.id];
    await breakit(stickerpak+"_booster",prizes);
    

    
   fs.writeFile("cache/" + _stickerA.id + (_stickerA.new ? "new" : "") + _stickerB.id + (_stickerA.new ? "new" : "") + '.gif', xD,function(){
     "ok"
   })
    
    message.channel.send({
      embed: emb,
      files: [{
        attachment: xD,
        name: "booster.gif"
                    }]
    }).then(m => {
      message.channel.stopTyping(2)
    })
  });
  
  };
  
  async function breakit(itemaher,prize){
    console.log(prize)
       gear.userDB.findOneAndUpdate({
        'id':message.author.id,
        'modules.inventory':itemaher
      },{$set:{'modules.inventory.$':'DRAGGE'}}).then(async x=>{
      await gear.userDB.findOneAndUpdate({'id':message.author.id},{
        $pull:{'modules.inventory':'DRAGGE'},
        $addToSet: {'modules.stickerInventory':{$each:prize}}
      });
    });
};
  
  
  
  
  
  
  
  
  
  //message.channel.send("```"+STICKER_DRAW);
  
  };

module.exports = {
  pub: false,
  cmd: cmd,
  perms: 3,
  init: init,
  cat: 'cosmetics'
};
