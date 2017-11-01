



module.exports = {


    normalizeG: function normalizeG(guild,DB){
        return;
        let dataitem = DB.get(guild.id)
            dataitem.name = guild.name
            dataitem.ID = guild.id

        for (i in this.gdfal.modules) {
          if (!dataitem.modules[i] || dataitem.modules[i] === "") {

            dataitem.modules[i] = this.gdfal.modules[i]
          }
        }
        DB.set(guild.id,dataitem)
    },

    gdfal: {
        name:           "",
        ID:             "",
        modules: {
            GREET: {
                hi:         false,
                joinText:   "Welcome to the Server **%username%**!",
                greetChan:  ""
            },
            FWELL: {
                hi:         false,
                joinText:   "%username% has left us!",
                greetChan:  ""
            },
            NSFW:       true,
            GOODIES:    true,
            LEVELS:     true,
            LVUP:       true,
            DROPS:      false,
            GOODMOJI:   "<:rubine:343314186765336576> ",
            GOODNAME:   'Rubine',
            ANNOUNCE:   false,
            PREFIX:     "+",
            MODROLE:    {},
            LANGUAGE:   'en',
            DISABLED:   [],
            AUTOROLES:  [],
            BANK:{
              rubines:        0,
              jades:          0,
              localCurrency:  0,
              items:          [],
              medals:         [],
              bgs:            [],
              stamps:         [],
            },
            SAFE:{
              rubines:        0,
              jades:          0,
              localCurrency:  0,
              items:          [],
              medals:         [],
              bgs:            [],
              stamps:         [],
              capacity:{
                  rubines:        2500,
                  jades:          15000,
                  localCurrency:  10000,
                  items:          5,
                  medals:         5,
                  bgs:            5,
                  stamps:         5,
              }
            },

            customMedals:{},
            legendaryFish:"",
            pondSize:1,

            background:"none",
            bgInventory:[],
            badges:[],
            badgesInventory:[],
            flairs:[],
            flairsInventory:[],


            statistics: {
                commandsUsed: {},
                rubineHistory: 0
            }

        },
        logs: this.logItems,
        channels: {}
    },

    //CHANS
    cdfal: {
        name: "",
        LANGUAGE:undefined,
        ID: "",
        modules: {
            DROPSLY: 0,

            NSFW:     false,
            GOODIES:  true,
            LEVELS:   true,
            LVUP:     true,
            DROPS:    true,
            DISABLED: []
        }
    },

    //USRS
    udefal: {
        name: "",
        ID: "",
        modules: {
            PERMS: 3,

            //LEVEL
            level: 0,
            exp: 0,
            loclevel:{},
            locxp:{},

            //PROFILE
            persotext: "I have no personal text because I'm too lazy to set one.",
            rep:0,
            favcolor: "#2b2b2b",
            bgID:"5zhr3HWlQB4OmyCBFyHbFuoIhxrZY6l6",
            bgInventory:["5zhr3HWlQB4OmyCBFyHbFuoIhxrZY6l6"],
            skin: 'default',
            skinsAvailable: [],

            //FINANCES
            rubines: 0,
            jades: 0,
            rubines: 0,
            coins: 0,
            localCurrency: {},
            expenses: {
                shop: 0,
                putaria: 0,
                jogatina: 0,
                drops: 0,
                market: 0,
                trade: 0
            },
            earnings: {
                dailies: 0,
                putaria: 0,
                jogatina: 0,
                market: 0,
                drops: 0,
                trade: 0
            },
            dyStreak: 0,
            daily: 1486595162497,


            //COLLECTIBLES

                 //----MEDALS
                    medals: [0,0,0,0,0,0,0,0],
                    medalInventory: [],

                 //----CARDS
                    cards: [],
                    cardInventory: [],
                    cardCollection: [],

                 //----STAMPS
                    stampInventory: [],
                    stampCollection: [],

                 //----STICKERS
                    stickers: [],
                    stickerInventory: [],
                    stickerCollection: [],

                 //----FISHES
                    fishes: [],
                    fishCollection: [],

                 //----ELEMENTS
                    elements: [],
                    elementCollection: [],

                 //----FLOWERS
                    flowers: [],
                    flowerCollection: [],

            //-------------------------------

            // MISC

            build: {
                STR: 10,
                DEX: 10,
                CON: 10,
                INT: 10,
                WIS: 10,
                CHA: 10,
                weaponA: "none",
                weaponB: "none",
                shield: "none",
                armor: "none",
                invent: [],
                skills: [],
                HP: 100,
                MP: 50
            },
            fun: {
                waifu: undefined,
                shiprate: {}
            },
            statistics: {
                commandsUsed: {}

            }
        }
    },

  logItems: {

    act:{
    userJoin: true,
    userLeave: true,
    messDel: false,
    messEdit: false,
    },

    mod:{
    usrBan: true,
    usrKick: true,
    usrMute: true,
    usrUnmute: true,
    },

    adv:{
    newChan: false,
    newRole: false,
    permsEdit: false,
    revokeBan: true,
    uptRole: false,
    delChan: false,
    usrNick: true,
    usrPhoto: false,
    usrRoles: false,
    }
  }

}
