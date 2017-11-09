const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/pollux-transfer', { useMongoClient: true });
mongoose.Promise = global.Promise;
const Promise = require("bluebird");
Promise.promisifyAll(require("mongoose"));

const Schema = mongoose.Schema

const Mixed = Schema.Types.Mixed;
//SERVER
const Server = new Schema({
        id: {type:String,required: true,index:{unique:true}},
        name: String,
        logging: false,
        modules: {
        GREET: {
                enabled:      {type:Boolean,default:false},
                text:         {type:String,default:"Welcome to the Server **%username%**!"},
                channel:  String,
            },
            FWELL: {
                enabled:{type:Boolean,default:false},
                text:   {type:String,default:"%username% has left us!"},
                channel:  String
            },
            LVUP:       {type:Boolean, default:true},
            DROPS:      {type:Boolean, default:true},
            ANNOUNCE:   {type:Boolean, default:true},
            PREFIX:     {type:String,  default:"+"},
            MODROLE:    {type:String, default:"Moderators"},
            LANGUAGE:   {type:String, default:"en"},
            DISABLED:   Array,
            SELFROLES:  Array,
            AUTOROLE:  String,
            ROLEMARKET: Mixed,
            BANK:{
              rubines:        { type: Number,default:0, min: 0, index: true },
              jades:          { type: Number,default:0, min: 0 },
              localCurrency:  { type: Number,default:0, min: 0, index: true },
              items:          Array,
              medals:         Array,
              bgs:            Array,
              stamps:         Array,
            },
            SAFE:{
              rubines:        { type: Number,default:0, min: 0, index: true },
              jades:          { type: Number,default:0, min: 0 },
              localCurrency:  { type: Number,default:0, min: 0, index: true },
              items:          Array,
              medals:         Array,
              bgs:            Array,
              stamps:         Array,
              capacity:{
                  rubines:        { type: Number,default:2500,  min: 0},
                  jades:          { type: Number,default:15000, min: 0},
                  localCurrency:  { type: Number,default:10000, min: 0},
                  items:          { type: Number,default:5,     min: 0},
                  medals:         { type: Number,default:5,     min: 0},
                  bgs:            { type: Number,default:5,     min: 0},
                  stamps:         { type: Number,default:5,     min: 0}
              }
            },

            customMedals:Mixed,
            legendaryFish:String,
            pondSize: { type: Number,default:1,min: 1},

            background:String,
            bgInventory:  Array,
            badges: Array,
            badgesInventory:  Array,
            UPFACTOR:{type: Number,default:0.1},
            LOCALRANK:Mixed,

            statistics: {
                commandsUsed: Mixed,
                rubineHistory: { type: Number,default:0}
            }

        },
        logs: {

            act:{
              userJoin:   {type:Boolean,default:true},
              userLeave:  {type:Boolean,default:true},
              messDel:    {type:Boolean,default:false},
              messEdit:   {type:Boolean,default:false}
            },

            mod:{
              usrBan:     {type:Boolean,default:true},
              usrKick:    {type:Boolean,default:true},
              usrMute:    {type:Boolean,default:true},
              usrUnmute:  {type:Boolean,default:true}
            },

            adv:{
              newChan:    {type:Boolean,default:false},
              newRole:    {type:Boolean,default:false},
              permsEdit:  {type:Boolean,default:false},
              revokeBan:  {type:Boolean,default:true},
              uptRole:    {type:Boolean,default:false},
              delChan:    {type:Boolean,default:false},
              usrNick:    {type:Boolean,default:true},
              usrPhoto:   {type:Boolean,default:false},
              usrRoles:   {type:Boolean,default:false}
            }
          },
        channels: Mixed
    },{ strict: false });

//CHANS



const Channel = new Schema({
        name: String,
        LANGUAGE:String,
        id: {type:String,required: true,index:{unique:true}},
        modules: {
            BUSTER:   Mixed,
            DROPSLY: {type:Number,default:0},
            EXP:     {type:Boolean,default:true},
            LVUP:    {type:Boolean,default:true},
            DROPS:   {type:Boolean,default:true},
            DISABLED: Array
        }
    },{ strict: false });

//USRS
const User = new Schema({
        name: String,
        tag:  String,
        updated_at: { type: Date },
        id: {type:String,required: true,index:{unique:true}},
        modules: {
            PERMS: {type:Number,default:3},

            //LEVEL
            level: {type:Number,default:0,index:true},
            exp: {type:Number,default:0, min:0,index:true},

            //PROFILE
            persotext: {type:String, default:"I have no personal text because I'm too lazy to set one."},
            rep:{type:Number,default:0},
            repdaily:{type:Number,default:0},

            favcolor: {type:String,default:"#ff1aed"},
            inventory: [],
            bgID:{type:String,default:"5zhr3HWlQB4OmyCBFyHbFuoIhxrZY6l6"},
            bgInventory:{type:Array,default:["5zhr3HWlQB4OmyCBFyHbFuoIhxrZY6l6"]},
            skin: {type: String, default:'default'},
            skinsAvailable: Array,

            //FINANCES
            rubines:  {type:Number,default:50, index:true},
            jades:  {type:Number,default:1000, index:true},
            coins:  {type:Number,default:0},

            dyStreak:  {type:Number,default:0},
            daily:  {type:Number,default:1486595162497},

                        flairTop: { type: String ,default:'default'},
            flairDown: { type: String ,default:'default'},
            flairArray: { type: Array ,default:[]},
            flairsInventory:  Array,


            //COLLECTIBLES

                 //----MEDALS
                    medals: {type:Array,default:[0,0,0,0,0,0,0,0,0]},
                    medalInventory: Array,

                 //----CARDS
                    cards: Array,
                    cardInventory: Array,
                    cardCollection: Array,

                 //----STAMPS
                    stampInventory: Array,
                    stampCollection: Array,

                 //----STICKERS
                    stickers: Array,
                    stickerInventory: Array,
                    stickerCollection: Array,

                 //----FISHES
                    fishes: Array,
                    fishCollection: Array,

                 //----ELEMENTS
                    elements: Array,
                    elementCollection: Array,

                 //----FLOWERS
                    flowers: Array,
                    flowerCollection: Array,

            //-------------------------------

            // MISC
            audits:{
               rubines:{
        expenses: {
        trades:{type:Number,default:0}
        ,shop:{type:Number,default:0}
        ,drops:{type:Number,default:0}
        ,exchange:{type:Number,default:0}
        ,lewd:{type:Number,default:0}
        ,gambling:{type:Number,default:0}
        ,crafts:{type:Number,default:0}
      },
      earnings: {
        trades:{type:Number,default:0}
        ,shop:{type:Number,default:0}
        ,drops:{type:Number,default:0}
        ,exchange:{type:Number,default:0}
        ,lewd:{type:Number,default:0}
        ,gambling:{type:Number,default:0}
        ,crafts:{type:Number,default:0}
        ,dailies:{type:Number,default:0}
      }
},
                jades:{
        expenses: {
        trades:{type:Number,default:0}
        ,shop:{type:Number,default:0}
        ,drops:{type:Number,default:0}
        ,exchange:{type:Number,default:0}
        ,lewd:{type:Number,default:0}
        ,gambling:{type:Number,default:0}
        ,crafts:{type:Number,default:0}
      },
      earnings: {
        trades:{type:Number,default:0}
        ,shop:{type:Number,default:0}
        ,drops:{type:Number,default:0}
        ,exchange:{type:Number,default:0}
        ,lewd:{type:Number,default:0}
        ,gambling:{type:Number,default:0}
        ,crafts:{type:Number,default:0}
        ,dailies:{type:Number,default:0}
      }
},
                sapphires:{
        expenses: {
        trades:{type:Number,default:0}
        ,shop:{type:Number,default:0}
        ,drops:{type:Number,default:0}
        ,exchange:{type:Number,default:0}
        ,lewd:{type:Number,default:0}
        ,gambling:{type:Number,default:0}
        ,crafts:{type:Number,default:0}
      },
      earnings: {
        trades:{type:Number,default:0}
        ,shop:{type:Number,default:0}
        ,drops:{type:Number,default:0}
        ,exchange:{type:Number,default:0}
        ,lewd:{type:Number,default:0}
        ,gambling:{type:Number,default:0}
        ,crafts:{type:Number,default:0}
        ,dailies:{type:Number,default:0}
      }
}
                },

            build: {
                STR: {type:Number,default:10},
                DEX: {type:Number,default:10},
                CON: {type:Number,default:10},
                INT: {type:Number,default:10},
                WIS: {type:Number,default:10},
                CHA: {type:Number,default:10},
                weaponA: {type:String,default:'none'},
                weaponB: {type:String,default:'none'},
                shield: {type:String,default:'none'},
                armor: {type:String,default:'none'},
                invent: Array,
                skills: Array,
                HP: {type:Number,default:100},
                MP:{type:Number,default:100}
            },
            fun: {
                waifu: Mixed,
                lovers: Mixed,
                shiprate: Mixed
            },
            statistics: {
                commandsUsed: Mixed

            }
        }
    },{ strict: false });

User.pre('update', function(next) {
  this.updated_at = Date.now();
  next();
},{ strict: false });

const Globals = new Schema({
  id:{type:Number,default:0,unique:true},
  data:Mixed
})
//MARKET
const Background = new Schema({
  name:String,
  id:{type:String,index:{unique:true}},
  rarity:{type:String,index:true},
  tags:{type:String,index:true}
},{ strict: false });

module.exports={
  user    : mongoose.model('User', User, 'userdb'),
  server  : mongoose.model('Server', Server, 'serverdb'),
  channel : mongoose.model('Channel', Channel, 'channeldb'),
  global  : mongoose.model('Global', Globals, 'globals')
};
