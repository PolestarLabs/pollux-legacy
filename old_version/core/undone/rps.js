var paths = require("../paths.js");
const fs = require("fs");

var pass = 0
exports.run = (bot, message, args, userData, caller, gear, points, skynet) => {
    console.log("------------RPS by" + caller)
    var stuff = message.content.split(' ')


    if (stugear.lenght < 2) {
       var donation = 0 //return message.reply("Precisa alguém pra desafiar e uma quantia pra apostar");
    }
    //if(isNaN(parseInt(stuff[1]))){
    //    return message.reply("Precisa alguém pra desafiar e uma quantia pra apostar (opcional)");
    //}
    let tgt = bot.user
       let tgtData = {
        "name": "Falk"
        , "points": 99999
        , "level": 99
        , "money": 500
        , "medals": {}
        , "flowers": 0
        , "rubines": 500
        }

    if(message.mentions.users.size === 0){
         tgt = bot.user
         tgtData = {
        "name": "Falk"
        , "points": 99999
        , "level": 99
        , "money": 500
        , "medals": {}
        , "flowers": 0
        , "rubines": 500
        }
        message.reply("Já que você não especificou um desafiado, eu vou jogar com você!");

    }else{
         tgt = message.mentions.users.first()
         tgtData = points[tgt.id];
    }


    if (parseInt(stuff[1])){
    var donate = parseInt(stuff[1])
    }else{
        var donate = 0
    }

    //let tgt = message.mentions.users.first()

    if (gear.checkRubines(donate, userData) == true) {

        if(gear.checkRubines(donate, tgtData) == true || tgt.bot == true){


        var challenger = message.author
        var challenged = tgt
        var me = 0
        var you = 0
        console.log(challenged.bot)
        if (challenged.bot == true){you=gear.randomize(1,3)}
        message.channel.send("rps envie :gem: :scissors: ou :page_facing_up: por PM").then(function (msg) {

                setTimeout(function () {
            if (challenged.bot == true){
                message.channel.send('Recebi a escolha do Jogador Desafiado: '+challenged.username)
            }
        }, 2000);
            bot.on('message', m => {
                console.log(m.channel.type)
                if (m.channel.type != 'dm') {
                    return;
                }
                if (m.author == challenger) {

                    message.channel.send('Recebi a escolha do Jogador Desafiante: '+challenger.username)
                    var mee = m.content.toLowerCase()
                    switch (mee) {
                    case '💎':
                    case 'r':
                    case 'pedra':
                        me = 1
                        break;
                    case '📄':
                    case 'p':
                    case 'papel':
                        me = 2
                        break;
                    case '✂️️':
                    case 's':
                    case 'tesoura':
                        me = 3
                        break;
                    }

                }
                if (m.author == challenged) {

                    message.reply('Recebi a escolha do Jogador Desafiado: '+challenged.username)

                    var mee = m.content.toLowerCase()
                    switch (mee) {
                      case '💎':
                    case 'r':
                    case 'pedra':
                        you = 1
                        break;
                    case '📄':
                    case 'p':
                    case 'papel':
                        you = 2
                        break;
                    case '✂️️':
                    case 's':
                    case 'tesoura':
                        you = 3
                        break;
                    }


                }
                 if (me > 0 && you > 0) {
                        if (me == 1) {
                            if (you == 1) {
                                message.channel.send(`
${message.author.username} jogou:  :gem:
${tgt.username} jogou:  :gem:
EMPATE`)
                            }
                            else if (you == 2) {
                                message.channel.send(`
${message.author.username} jogou:  :gem:
${tgt.username} jogou:  :page_facing_up:
${message.author.username} PERDEU`)
                            }
                            else if (you == 3) {
                                message.channel.send(`
${message.author.username} jogou:  :gem:
${tgt.username} jogou:  :scissors:
${message.author.username} VENCEU`)
                            }
                        }
                        else if (me == 3) {
                            if (you == 1) {
                                message.channel.send(`
${message.author.username} jogou:  :scissors:
${tgt.username} jogou:  :gem:
${message.author.username} PERDEU`)
                            }
                            else if (you == 2) {
                                message.channel.send(`
${message.author.username} jogou:  :scissors:
${tgt.username} jogou:  :page_facing_up:
${message.author.username} VENCEU`)
                            }
                            else if (you == 3) {
                                message.channel.send(`
${message.author.username} jogou:  :scissors:
${tgt.username} jogou:  :scissors:
 EMPATE`)
                            }
                        }
                        else if (me == 2) {
                            if (you == 1) {
                                message.channel.send(`
${message.author.username} jogou:  :page_facing_up:
${tgt.username} jogou:  :gem:
${message.author.username} VENCEU`)
                            }
                            else if (you == 2) {
                                message.channel.send(`
${message.author.username} jogou:  :page_facing_up:
${tgt.username} jogou:  :page_facing_up:
EMPATE`)
                            }
                            else if (you == 3) {
                                message.channel.send(`
${message.author.username} jogou:  :page_facing_up:
${tgt.username} jogou:  :scissors:
${message.author.username}  PERDEU`)
                            }

                            else {
                                message.reply('deu ruim')
                            }
                        }
                        else {
                            message.reply('fudeo')
                        }
                    }
            })
        })
    }

    }}
