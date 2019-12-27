const {randomize,userDB,shuffle,cosmetics,items} = require("../gearbox.js");

let DROPPABLE_BGS;
let DROPPABLE_MEDALS;
let DROPPABLE_BOOSTERS;

const VALUES ={C:1,U:2,R:3,SR:4,UR:5};

//GET LIST OF PUBLIC cosmetics
async function getCatalogs(){
  return Promise.all([
    DROPPABLE_BGS       = await cosmetics.find({
      event:{$exists:false},
      type:"background",
      droppable:true,
      public:true
    }),
    DROPPABLE_MEDALS    = await cosmetics.find({
      event:{$exists:false},
      type:"medal",
      droppable:true,
      public:true
    }),
    DROPPABLE_BOOSTERS  = await items.find({
      event:{$exists:false},
      type:"boosterpack",
      droppable:true,
      //public:true
    })
  ]);
};

//GET LIST OF EVENT cosmetics
async function getEventCatalogs(E){
  return Promise.all([
    DROPPABLE_BGS      = await cosmetics.find({
      event:E,
      type:"background",
      droppable:true,
      public:true
    }),
    DROPPABLE_MEDALS   = await cosmetics.find({
      event:E,
      type:"medal",
      droppable:true,
      public:true
    }),
    DROPPABLE_BOOSTERS = await items.find({
      //event:E,
      type:"boosterpack",
      //droppable:true,
      //public:true
    })
  ]);
};

//GET RANDOM RARITY
function getRandomRar(){
  let rand=randomize(0,1000);
  switch(true){
    case rand > 920:
      return "UR";
    case rand > 800:
      return "SR"
    case rand > 650:
      return "R"
    case rand > 400:
      return "U"
    default:
      return"C"
  }
};

//GET RANDOM DROP TYPE
function getRandomType(R) {
  let rand = randomize(0, 1000);
  switch (true) {
    case rand == 1000 && R == "UR":
      return "SAPPHIRE";
    case rand > 850:
      return "BOOSTER";
    case rand > 700:
      return "BG"
    case rand > 500:
      return "MEDAL"
    case rand > 350:
      return "RUBINES"
    default:
      return "JADES"
  }
};

//RAFFLING FROM CATALOG
function raffle(catalog){
  let l=catalog.length;
  let rand_raf = randomize(0,l-1);
  let res = catalog[rand_raf];
  if (!res) res = catalog[0];
  return res;
};

function getBackground(options,catalog){  
  //console.error({catalog})
  let catalogFilter = catalog.filter(it=>it.rarity == options.rarity);
  //console.error({catalogFilter})
  let item_info = raffle(catalogFilter); 
  if(!item_info)throw (catalogFilter);
  let res  = {
    item    : item_info.code,
    rarity  : item_info.rarity,
    emblem  : options.type,
    name    : item_info.name,
  }
  return res;
}
function getMedal(options,catalog){  
  let catalogFilter = catalog.filter(it=>it.rarity == options.rarity);
  
  options
  
  let item_info = raffle(catalogFilter); 
  if(!item_info) item_info = raffle(catalog); 
  
  let res  = {
    item    : item_info.icon,
    rarity  : item_info.rarity,
    emblem  : options.type,
    name    : item_info.name,
  }
  return res;
}
function getBooster(options,catalog){  
  let catalogFilter = catalog.filter(it=>it.rarity == options.rarity);
  //console.error({catalog})
  let item_info = raffle(catalogFilter); 
  let res  = {
    item    : item_info.id,
    SSS     : item_info.icon,
    rarity  : item_info.rarity,
    emblem  : "STAMP",
    name    : item_info.name,
  }
  return res;
}

//====================================================
//         GET LOOT ITEM
//====================================================

async function getItem(options){
  
  options = options || {};
  let   _FILTER = options.filter || false;
  let   _EVENT  = options.event  || false;
  const _RARITY = options.rarity || "C";
  let  _TYPE   = options.type   || getRandomType(_RARITY);
  
  if(typeof _FILTER === 'string' && _FILTER =="false") _FILTER = false;
  if(typeof _EVENT  === 'string' && _EVENT  =="false") _EVENT  = false;
  
  await getCatalogs();
  if (_EVENT) await getEventCatalogs(_EVENT);
  
  if (_EVENT && _FILTER) {
    DROPPABLE_BGS      = DROPPABLE_BGS.filter(bg=> bg.filter === _FILTER);
    DROPPABLE_MEDALS   = DROPPABLE_MEDALS//.filter(md=> md.filter === _FILTER);
    //DROPPABLE_BOOSTERS = DROPPABLE_BOOSTERS.filter(bt=> bt.filter === _FILTER);
  };

  let finalItem = {};  
   
  // GEM DROPS ----->  

  let amountdrop= [100,200,400,700,1000,1250][VALUES[_RARITY]];
  let noise = randomize(25,125);

  if(_TYPE=="SAPPHIRE"){
    finalItem.item   = 1
    finalItem.emblem = _TYPE.replace+"_"+_RARITY
    finalItem.name   = 1
  }
  if(_TYPE=="RUBINES"){
    finalItem.item   = amountdrop+noise
    finalItem.emblem = _TYPE.replace("S","")+"_"+_RARITY
    finalItem.name   = amountdrop+noise
  }
  if(_TYPE=="JADES"){
    finalItem.item   = (amountdrop+200-noise)*7
    finalItem.emblem = _TYPE.replace("S","")+"_"+_RARITY
    finalItem.name   = (amountdrop+200-noise)*7
  }
  
  // COSMETIC DROPS ----->  
  
  options
  
  if (_TYPE == "BG")      finalItem = getBackground(options,DROPPABLE_BGS);
  if (_TYPE == "BOOSTER") finalItem = getBooster(options,DROPPABLE_BOOSTERS);
  if (_TYPE == "MEDAL")   finalItem = getMedal(options,DROPPABLE_MEDALS);  
  
  finalItem.type   = _TYPE;
  finalItem.rarity = _RARITY;
  
  return finalItem;
  
}

async function Lootbox(options) {

  let result = []
  options = options || {};
  options.rarity = options.rarity || "C";
  options.event  = options.event  || false;
  options.size   = options.size   || 3;
  options.filter = options.filter || false;
  
  let refined_options = {    
    rarity : getRandomRar(),
    event  : false,
    filter : false,
    type   : getRandomType(options.rarity)
  }
  

  //RARITY MANDATORY
      refined_options.rarity = options.rarity
      refined_options.type   = getRandomType(options.rarity);
      result.push(await getItem(refined_options));
  //EVENT  MANDATORY
      refined_options.type   = getRandomType(options.rarity);
      refined_options.rarity = getRandomRar();
    if (options.event) {
      refined_options.event = options.event
      refined_options.filter = options.filter
      
      result.push(await getItem(refined_options));
    }else{
      refined_options.type   = getRandomType(options.rarity);
      refined_options.rarity = getRandomRar();
      result.push(await getItem(refined_options));
    }
  //LAST
  refined_options.type   = getRandomType(options.rarity);
  refined_options.rarity = getRandomRar();
  result.push(await getItem(refined_options));

  return shuffle(result);
}

module.exports={Lootbox}