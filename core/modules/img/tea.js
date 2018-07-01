var cmd = 'tea';
var gear = require("../../gearbox.js");
var fs = require("fs");

var paths = require("../../paths.json");
var locale = require('../../../utils/multilang_b');
var mm = locale.getT();

var init = function (message,userDB,DB) {
    var Server = message.guild;
    var Channel = message.channel;
    var LANG = message.lang;
    var MSG = message.content
    //-------MAGIC----------------

    let teas=[

    "Honey",
    "Honey Nut",
    "Green",
    "Oolong",
    "White Tea",
    "Pu-erh",
    "Yellow",
    "Mulberry",
    "Herbal",
    "Ceylon",
    "Mint ginger lemon",
    "Rooibos",
    "Lemon Rooibos",
    "Chamomile with lemongrass",
    "Honey bush",
    "Spearmint",
    "Peppermint",
    "Chamomile",
    "Yerba Mate",
    "Tulsi",
    "Mulberry",
    "Lemon with Ginger",
    "Hibiscus",
    "Jasmine"
    ]

  fs.readdir(paths.BUILD+"frenes/tea/", function (err, files) {
      let rand = gear.randomize(0,files.length-1);
      var filepath = paths.BUILD+"frenes/tea/"+files[rand]

      if(message.author.id=="281629327551102988"){
        let mmm =   `:tea: Enjoy your ${teas[gear.randomize(0,teas.length-1)]} Tea, lady ${message.member.displayName}~`
         message.channel.send(mmm,{files:[filepath]});
      }else{
        message.channel.send(":tea: Tea time!",{files:[filepath]});
      }

    })
  }

 module.exports = {pub:true,cmd: cmd, perms: 3, init: init, cat: 'donators', desc:"Anime Tea Time GIFs - Donator command for Nat#2901"};


