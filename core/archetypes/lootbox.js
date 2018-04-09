const fs = require("fs");
const gear = require("../gearbox.js");


const COLORBASE = __dirname+"/../../resources/lists/colors.json"
const FLAIRBASE = __dirname+"/../../resources/lists/flairs.json"

const values ={C:1,U:2,R:3,SR:4,UR:5};

function getRandomRar(){
    let rand=gear.randomize(0,100);
    switch(true){
      case rand > 95:
        return "UR";
      case rand > 85:
        return "SR"
      case rand > 70:
        return "R"
      case rand > 50:
        return "U"
      default:
        return"C"
               }
  };

function getRandomType(R){

    let rand=gear.randomize(0,1000);
    switch(true){

      case rand == 1000 && R=="UR":
        return "SAPPHIRE";
      case rand > 850:
        return "STICKER";
      case rand > 750:
        return "BG"
      case rand > 650:
        return "MEDAL"
      case rand > 350:
        return "RUBINES"
      default:
        return"JADES"
               }
  };

async function getItem(R,E,T){

  const STAMPBASE = await gear.collectibles.stickers();
const BGBASE =    await gear.collectibles.bgs();
const MEDALBASE = await gear.collectibles.medals();

    R = R || getRandomRar();
    T = T || getRandomType(R);
    E = E || false;
    let N;
    let ID;
    let EBM;
    let power= values[R];

    let amountdrop= [50,250,500,1000,2000,2500][values[R]];
    let noise = gear.randomize(25,250);

    function raffle(BS){
      let l=BS.length;
      let rand_raf = gear.randomize(0,l-1);
      return BS[rand_raf];
    }

    if(T=="SAPPHIRE"){
      ID = 1
      EBM=T.replace+"_"+R
      N= ID//"Sapphire Chunk"
    }
    if(T=="RUBINES"){
      ID = amountdrop+noise
      EBM=T.replace("S","")+"_"+R
      N= ID//"Rubine Gems"
    }
    if(T=="JADES"){
      ID = (amountdrop+500-noise)*7
      EBM=T.replace("S","")+"_"+R
      N= ID//"Jade Shards"
    }

    let catalog;
    if(T=="BG"){
      catalog = BGBASE.filter(itm=>itm.rarity==R&&(itm.droppable===true||itm.droppable==true));
      if(E){
        catalog.concat(BGBASE.filter(itm=>itm.event==E&&itm.rarity==R&&(itm.droppable===true||itm.droppable==true)));
      }
      let IT = raffle(catalog);
      ID=IT.code;
      N=IT.name;
      EBM=T
    }
    if(T=="STICKER"){
      try{

      catalog = STAMPBASE.filter(itm=>itm.rarity==R);
      if(E){
        catalog.concat(await STAMPBASE.filter(itm=>itm.rarity==R&& itm .event==E));
      }
      let IT = raffle(catalog);
      ID=IT.id;
      N=IT.name;
      EBM="STAMP"
      } catch(e){
        console.log(e)
        T="MEDAL"
      }
    }


    if(T=="MEDAL"){
      catalog = MEDALBASE.filter(itm=>itm.rarity==R&&(itm.droppable===true||itm.droppable==true));
      if(E){
        catalog.concat(MEDALBASE.filter(itm=>itm.event==E&&itm.rarity==R&&(itm.droppable===true||itm.droppable==true)));
      }
      let IT = raffle(catalog);
      ID=IT.icon;
      N=IT.name;
      EBM=T
    }

    let item = {
      type: T,
      name: N,
      item: ID,
      rarity: R||"C",
      emblem:EBM
    }
    console.log(item)
    return item;

  };

async function Lootbox(rarity="C", size=3,event=false,type) {

    return  [
      await getItem(rarity,event),
      await getItem(undefined,event),
      await getItem(undefined,event)
    ]
  }

module.exports={Lootbox}
