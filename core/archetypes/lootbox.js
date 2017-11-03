const fs = require("fs");
const gear = require("../gearbox.js");

const STAMPBASE = __dirname+"/../../resources/lists/stamps.json"
const BGBASE = __dirname+"/../../resources/lists/backgrounds.json"
const MEDALBASE = __dirname+"/../../resources/lists/medals.json"
const COLORBASE = __dirname+"/../../resources/lists/colors.json"
const FLAIRBASE = __dirname+"/../../resources/lists/flairs.json"

const values ={C:1,U:2,R:3,SR:4,UR:5};

class Lootbox {
  constructor(rarity, size,event) {
    this.rarity = rarity ||"C";
    this.size = size || 3;
    this.content = []
    this.stakes = 0
    this.event = event
    this.eventide = false
    this.prizes = {
        medals: [],
        bgs: [],
        stamps:[],
        rubines:[],
        jades:[],
        items:[],
        colors:[]
    }
  };

    reroll(){
        this.stakes++
        this.prizes = {
        medals: [],
        bgs: [],
        stamps:[],
        rubines:[],
        jades:[],
        items:[],
        colors:[]
    }
        this.open()

    }

  // JADES  ================================
    getJades(rarity) {
        let rar= values[rarity]
        let rr = gear.randomize(8,10)
        this.prizes.jades.push([rarity,Math.floor(rar*(gear.randomize(80,100))*18/10)])
    }


  // STICKERS ================================
      getStamps(rarity, e) {

      let base = JSON.parse(fs.readFileSync(STAMPBASE))
      let filter = base.filter(stk => stk.rarity === rarity && stk.droppable == "TRUE")
      let prize = filter[gear.randomize(0, filter.length - 1)]

      //----------------------
      if (e && typeof e == 'string') {
        let afilter = base.filter(stk => {
          return stk.rarity === rarity &&  stk.event == e
        })

        if (afilter.length == 0) afilter = base.filter(stk => stk.event == e);
        if (afilter.length == 0) afilter = filter;

        let rdm=gear.randomize(0, afilter.length - 1)
        prize = afilter[rdm]
        rarity = afilter[rdm].rarity
      }
      //----------------------

      this.prizes.stamps.push([rarity, prize])
    }

  // BACKGROUNDS ================================

    getBG(rarity, e) {
      let base = JSON.parse(fs.readFileSync(BGBASE))
      let filter = base.filter(bg => bg.rarity === rarity && bg.droppable == "TRUE")
      let prize = filter[gear.randomize(0, filter.length - 1)]

      //----------------------
      if (e && typeof e == 'string') {
        let afilter = base.filter(bg => {
          return bg.rarity === rarity &&  bg.event == e
        })

        if (afilter.length == 0) afilter = base.filter(bg => bg.event == e);
        if (afilter.length == 0) afilter = filter;

        let rdm=gear.randomize(0, afilter.length - 1)
        prize = afilter[rdm]
        rarity = afilter[rdm].rarity
      }
      //----------------------
      this.prizes.bgs.push([rarity, prize])
    }


  // MEDALS ================================
    getMedal(rarity,e) {

        let base = JSON.parse(fs.readFileSync(MEDALBASE))
        let filter = base.filter(med=>med.rarity===rarity && med.droppable=="TRUE" )
        let prize = filter[gear.randomize(0, filter.length-1)]

      //----------------------
      if (e && typeof e == 'string') {

        let afilter = base.filter(mdl => mdl.rarity === rarity && mdl.event == e)
        if (afilter.length == 0) afilter = filter;

        let rdm=gear.randomize(0, afilter.length - 1)
        prize = afilter[rdm]
        rarity = afilter[rdm].rarity
      }
      //----------------------

        this.prizes.medals.push([rarity,prize])
    }


  // RUBINES ================================
    getRubines(rarity) {
        let rar= values[rarity]
        let rr = gear.randomize(80,100)
        //console.log("RAR:  "+rar +" * "+rr)
        this.prizes.rubines.push([rarity,Math.floor(rar*(rr)/4)])
    }

    rarityCheck() {
        let a = Math.floor(Math.random() * (2500 - 1 + 1) + 1);
        switch (true) {
            case a <= 10:
                return "UR"
                break;
            case a <= 120:
                return "SR"
                break;
            case a <= 580:
                return "R"
                break;
            case a <= 1350:
                return "U"
                break;
            default:
                return "C"
                break;
        }
    }

    checkout(USER) {
        let p = this.prizes
        /*
        for (i=0;i<p.medals.length;++i)gear.paramAdd(USER,"medalInventory",p.medals[i]);
        for (i=0;i<p.stamps.length;++i)gear.paramAdd(USER,"mstampInventory",p.stamps[i]);
        for (i=0;i<p.bgs.length;++i)gear.paramAdd(USER,"bgInventory",p.bgs[i]);
        for (i=0;i<p.colors.length;++i)gear.paramAdd(USER,"colorInventory",p.colors[i]);
        for (i=0;i<p.items.length;++i)gear.paramAdd(USER,"INVENTORY",p.items[i]);
        for (i=0;i<p.jades.length;++i)gear.paramIncrement(USER,"rubines",p.rubines[i])
        for (i=0;i<p.rubines.length;++i) gear.paramIncrement(USER,"jades",p.jades[i])
    */
    }

        getPrize(finder, rarity, e) {

            if (e) {
              let ff = gear.randomize(0, 8)
              if (this.eventide) ff -= 10;
              switch (true) {
                case finder+ff >= 16:
                  this.eventide = true
                  return this.getMedal(rarity, e)
                  break;
                case finder+ff >= 11:
                  this.eventide = true
                  return this.getBG(rarity, e)
                  break;
                default:
                  break;
              }
            }

        switch (true) {

            case finder <= 2:
                return this.getRubines(rarity)
                break;
            case finder <= 4:
                return this.getRubines(rarity)
                break;
            case finder <= 9:
                return this.getJades(rarity)
                break;
            case finder <= 13:
                return this.getMedal(rarity,e)
                break;
            case finder <= 16:
                return this.getBG(rarity,e)
                break;
            //case finder <= 16:
                //return this.getStamps(rarity)
                //break;
            default:
                return this.getRubines(rarity)
                break;
        }
    }

        open(event) {

          if(event && typeof event =='string'){
            event = event.replace(/ +/g,"")
          }
        return new Promise(async resolve => {

            let ff = gear.randomize(0, 17)
            this.getPrize(ff, this.rarity,event)

            for (i = 1; i < this.size; ++i) {
            let f = gear.randomize(0, 17)
                let r = this.rarityCheck()
                await this.getPrize(f, r,event);
            }
            return resolve(this.prizes)
        })
    }
}

module.exports={Lootbox}
