const mongoose = require('mongoose');
mongoose.connect('mongodb://pollux:472899@localhost:27017/pollux-transfer', { useMongoClient: true });
mongoose.Promise = global.Promise;
const Promise = require("bluebird");
Promise.promisifyAll(require("mongoose"));

const Schema = mongoose.Schema

const Mixed = Schema.Types.Mixed;
//SERVER
const Server = new Schema({
  meta:Mixed,
  globalhandle:String,
        globalPrefix:{type:Boolean,default:true},
        respondDisabled:{type:Boolean,default:true},
        event:Mixed,
        eventReg:String,
        partner:{type:Boolean,default:false},
        partnerDetails:{
          owner:String,
          ownerID:String,
          nsfw:Boolean,
          disName:String,
          description:String,
          website:String,
          tags:String,
          feats:String,
          langs:String,
          langsA:Array,
          region:String,
          picture:String,
          invite:String,
          mini:String,
          color:String
        },
        utilityChannels:Mixed,
        id: {type:String,required: true,index:{unique:true}},
        name: String,
        logging: {type:Boolean, default:false},
        imgwelcome: {type:Boolean, default:false},
        splitLogs:{type:Boolean, default:false},
        modules: {
            BUSTER:{
              switches:{
                flood:{type:Boolean, default: false},
                links:{type:Boolean, default: false},
                invites:{type:Boolean, default: false},
                words:{type:Boolean, default: false},
                mentionSpam:{type:Boolean, default: false}
              },
              bypass:{
                flood:String,
                links:String,
                invites:String,
                words:String,
                mentionSpam:String,
                users:Array,
                roles:Array,
                channels:Array,
              },
              params:
              {
                flood: Number, //intensity
                links: Array, // whitelist
                invites: Array, // whitelist
                words: {type:Array,default:[]},
                mentionSpam: {type:Number,default:5},
              },
              action:{
                flood: String,
                links: String,
                invites: String,
                words: String,
                mentionSpam: String,
                default: {type:String,default:'none'},
              }
            },
          shitpostFeed:Mixed,
        GREET: {
                enabled:      {type:Boolean,default:false},
                text:         {type:String,default:"Welcome to the Server **%username%**!"},
                channel:  String,
                timer: {type:Number,default:0}
            },
            FWELL: {
                enabled:{type:Boolean,default:false},
                text:   {type:String,default:"%username% has left us!"},
                channel:  String,
                    timer: {type:Number,default:0}
            },
            LVUP:       {type:Boolean, default:true},
            DROPS:      {type:Boolean, default:true},
            ANNOUNCE:   {type:Boolean, default:true},
            PREFIX:     {type:String,  default:"+"},
            MODROLE:    {type:String, default:"Moderators"},
            LANGUAGE:   {type:String, default:"en"},
            DISABLED:   Array,
            MUTEDUSERS: Array,
            MUTEROLE:   String,
            SELFROLES:  Array,
            AUTOROLES:  Array,
            ROLEMARKET: Mixed,
            ACTLOG:String,
            MODLOG:String,
            ADVLOG:String,
            LOGCHANNEL:String,
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
            },

        putometro_last:{type: Number},
        putometro_max:{type: Number}
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
  meta:Mixed,
        name: String,
  server:String,
  guild:String,
  slowmode: Boolean,
slowmodeTimer:Number,
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
  meta:Mixed,
  spdaily:Mixed,
        name: String,
        personalhandle:String,
        tag:  String,
        eventGoodie:Number,
        cherries:Number,
        cherrySet:Mixed,
        eventDaily:Number,
        updated_at: { type: Date },
        id: {type:String,required: true,index:{unique:true}},
        blacklisted:String,
        married:Array,
        eventThing:Mixed,
        modules: {
            lovepoints:Number,
            PERMS: {type:Number,default:3},

            //LEVEL
            level: {type:Number,default:0,index:true},
            exp: {type:Number,default:0, min:0,index:true},

            //PROFILE
            persotext: {type:String, default:"I have no personal text because I'm too lazy to set one."},
            tagline:{type:String, default:"A fellow Pollux user"},
            rep:{type:Number,default:0},
            repdaily:{type:Number,default:0},

            favcolor: {type:String,default:"#ff1aed"},
            inventory: {type:Array,default:[]},
            bgID:{type:String,default:"5zhr3HWlQB4OmyCBFyHbFuoIhxrZY6l6"},
            sticker:String,
            bgInventory:{type:Array,default:["5zhr3HWlQB4OmyCBFyHbFuoIhxrZY6l6"]},
            skin: {type: String, default:'default'},
            skinsAvailable: Array,

            //FINANCES
            sapphires: {type:Number,default:0},
            rubines:  {type:Number,default:5, index:true},
            jades:  {type:Number,default:10, index:true},
            coins:  {type:Number,default:0},

            dyStreak:  {type:Number,default:0},
            dyStreakHard:  {type:Number,default:0},
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
        },
          partner:Boolean,
polluxmod:Boolean,
donator:String,
        limits:Mixed

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


const fanart = new Schema({
        id:String,
        src:String
        ,title:String
        ,description:String
        ,date:Date
        ,author:String
        ,author_ID:String
        ,publish:Boolean
},{ strict: false });


const Collectibles = Schema({
  id: String,
  name: String,
  tags: String,
  series: String,
  type: String,
  icon: String,
  code: String,
  rarity: String,
  event: String,
  droppable: Boolean,
  buyable: Boolean,
  howto:String,
  category:String,
  public:Boolean
},{ strict: false });

const Item = new Schema({
name:         String,
id:           {type:String,index:{unique:true}},
rarity:       {type:String,default:"C"},
icon:         {type:String,default:"item"},
emoji:        {type:String,default:":package:"},
price:        {type:Number,default:1000},
altEmoji:     {type:String,default:":package:"},
event:        String,
event_id:     Number,
type:         {type:String,default:'item'},
tradeable:    {type:Boolean,default:true},
buyable:      {type:Boolean,default:true},
destroyable:  {type:Boolean,default:true},
usefile:      {type:String,default:'notusable'},
code:         String,
misc:         Mixed,
series:       String,
crafted:       Boolean,
  materials: Array,
  gemcraft: {
    rubines: Number,
    jades: Number,
    sapphires :Number
  }

},{ strict: false });

module.exports={
  user    : mongoose.model('User', User, 'userdb'),
  server  : mongoose.model('Server', Server, 'serverdb'),
  channel : mongoose.model('Channel', Channel, 'channeldb'),
  global  : mongoose.model('Global', Globals, 'globals'),
  items  : mongoose.model('Item', Item, 'items'),
  fanart  : mongoose.model('fanart', fanart, 'fanart'),
  collectibles  : mongoose.model('collectibles', Collectibles, 'collectibles')
};
