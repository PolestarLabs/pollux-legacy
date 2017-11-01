var gear = require("../gearbox.js");
const arraySort = require('array-sort')

const fs = require("fs");
var paths = require("../paths.js");

exports.run = (bot, message) => {

  console.log('Illegal - Start');
  
  
    let textHolder = new gear.Jimp(128, 100, function (err, image) {});

    var A = message.content

    gear.Jimp.read(`${paths.BUILD}illegal.jpg`).then(function (illegal) {
       
        gear.Jimp.loadFont(paths.FONTS + 'arial_narrow.fnt').then(function (sub) {
            //textHolder.print(sub, 0, 0, A);
            textHolder.print(sub, 0, 0, A, 128);
            textHolder.rotate(7);
 console.log(3);
            illegal.composite(textHolder, 320, 135);
            illegal.getBuffer(gear.Jimp.MIME_PNG, function (err, image) {
                message.channel.send({files:[{attachment:image,name:"file.png"}]})
            })

            console.log('Illegal - Done');
        })
    })
}
