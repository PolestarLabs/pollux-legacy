var paths = require("../paths.js");
var gear = require("../gearbox.js");
const fs = require("fs");

exports.run = (bot, message, args, userData, caller, gear, points, skynet) => {
    message.reply("Blackjack está temporariamente suspenso")
    return

let RUBYMOJI = message.guild.emojis.find('name','rubine')
if (RUBYMOJI === null){RUBYMOJI = ':octagonal_sign: '}
    try {

        if (typeof ongoing === 'undefined' || ongoing === null) {
            var ongoing = true
        } else {
            message.reply("você já está jogando comigo. Primeiro termine esse.")
            return;
        };
        var stuff = message.content.toLowerCase().split(' ');
        if (isNaN(parseInt(stuff[1], 10)) || stuff[1] == -1) {
            message.reply("Você precisa apostar alguma coisa, chuchu~")
            return;
        };
        if (gear.checkRubines(stuff[1], userData) == false) {
            message.reply("Oxe, você não tem rubines suficientes pra cobrir essa aposta...")
            return;
        };
        var bet = stuff[1];
        userData.rubines -= parseInt(bet);
        ongoing = true;
        let endgame = undefined;
        var naipes = ['H/', 'D/', 'S/', 'C/'];
        var naipesB = [':hearts:', ':diamonds:', ':spades:', ':clubs:'];
        var cards = ['A', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K'];
        let deck = [];

        for (i = 0; i < 4; i++) {
            for (x = 0; x < 13; x++) {
                x < 10 ? val = x + 1 : val = 10;
                var card = {
                    card: naipes[i] + cards[x],
                    value: val,
                    icon: "**" + cards[x] + "**" + naipesB[i]
                }
                deck.push(card)
            }
        };
        var pile = gear.shuffle(deck);



        let player = {
            hand: [pile[1], pile[3], pile[5], pile[7], pile[9]],
            sum: function psum(s) {
                var x = 0
                for (i = 0; i < this.round + 1; i++) {
                    try {
                        x += this.hand[i].value
                    } catch (err) {
                        x += 0
                    }
                }
                return x;
            },
            round: 1,
            keepgo: true,

        };
        message.channel.send("Ok, vamos jogar Blackjack. Estilo vegas! Você puxa as suas até parar e depois eu puxo.");
        let dealer = {
            hand: [pile[0], pile[2], pile[4], pile[6], pile[8]],
            sum: function dsum(s) {
                var x = 0
                for (i = 0; i < this.round + 1; i++) {
                    try {
                        x += this.hand[i].value
                    } catch (err) {
                        x += 0
                    }
                }
                return x;
            },
            round: 0,
            keepgo: true,

        };

        ongoing = true;

        gear.draw(player.hand, caller);
        gear.draw(dealer.hand, 'banc');

        function drawCards(a = 50, b = 100) {

            setTimeout(function () {
                message.channel.sendFile(`${paths.BUILD}/cards/${caller+player.round}_bj.png`, "card.png", "Essas são suas cartas. Somando " + player.sum())
                setTimeout(function () {
                    message.channel.sendFile(`${paths.BUILD}/cards/${'banc'+dealer.round}_bj.png`, "card.png", "Minhas cartas são estas. Somando " + dealer.sum())
                }, a)
            }, b)

            //HIT STAND #1
        };

        function conclusion(end) {
            switch (end) {
                case 'victory':
                    message.channel.send("Certo, toma aqui teus " + parseInt(bet * 2.4) + " "+RUBYMOJI+" Rubines de prêmio");
                    userData.rubines += parseInt(bet * 2.4);
                    break;
                case 'defeat':
                    message.channel.send("Boa sorte da próxima vez.");

                    break;
                case 'tie':
                    message.channel.send("Bom, pega seus " + parseInt(bet * 2.4) + " "+RUBYMOJI+" rubines");
                    userData.rubines += parseInt(bet * 2.4);
                    break;
            }
            return ongoing = false;


        }

        /*function hitStand() {
        if (player.keepgo != true || ongoing != true) {
            return console.log('===================================')
        };
        setTimeout(function () {
            message.channel.send(`:one: Hit
:two: Stand`)
        }, 2000)
    };*/

        function checkOut() {
            if (ongoing == false) return;

          //  setTimeout(function () {
                switch (true) {
                    case (player.sum() == 21):
                        endgame = 'victory'
                        message.reply('Você fez 21, parabéns!').then(function (m) {
                            conclusion(endgame)

                        player.keepgo = false
                        ongoing = false
                        })
                        return
                        break;
                    case (player.sum() > 21):
                        endgame = 'defeat'
                        message.reply('Você estourou os pontos, eu venci. ').then(function (m) {
                            conclusion(endgame)


                        player.keepgo = false
                        ongoing = false
                         })
                        return
                        break;
                }
          //  }, 500)

        };

        function enough() {
            //-------------------------------------------
            if ((dealer.sum() >= player.sum()) && (dealer.sum() <= 21)) {
                message.channel.send('Eu paro...')
            } else {
                message.channel.send('Ow porra...')
            }


            if ((player.sum() == 21) && (dealer.sum() != 21)) {

                endgame = 'victory'
                message.reply('21! Você venceu!').then(function (m) {
                    conclusion(endgame)
                ongoing = false
                console.log('A')
return
                })
            } else if (
                (21 > player.sum()) &&
                (player.sum() == dealer.sum()) &&
                (dealer.round > player.round)
            ) {
                endgame = 'victory'
                message.reply('Empatamos, mas como você tem menos cartas você vence!').then(function (m) {
                    conclusion(endgame)
                ongoing = false
                console.log('B')
return
                })
            } else if (
                (21 > player.sum()) &&
                (player.sum() == dealer.sum()) &&
                (dealer.round > player.round)
            ) {

                endgame = 'victory'
                message.reply('Empatamos, mas como tenho menos cartas eu venci!').then(function (m) {
                    conclusion(endgame)
                ongoing = false
                console.log('C')
return
                })
            } else if (player.sum() > 21) {

                endgame = 'defeat'
                message.reply('Você estourou os pontos, eu venci.').then(function (m) {
                    conclusion(endgame)

                ongoing = false
                console.log('D')
return
                })
            } else if ((21 >= dealer.sum()) && (dealer.sum() > player.sum())) {

                endgame = 'defeat'
                message.reply('Fiz mais pontos, venci!').then(function (m) {
                    conclusion(endgame)
                ongoing = false
                console.log('E')
return
                })
            } else if (dealer.sum() > 21) {

                endgame = 'victory'
                message.reply('Estourei o limite, Você venceu').then(function (m) {
                    conclusion(endgame)
                ongoing = false
                console.log('F')
return
                })
            } else {
                endgame = 'tie'
                message.reply('Esse jogo foi doido... mas você venceu!').then(function (m) {

                    conclusion(endgame)
                ongoing = false
                console.log('AAAAAAAA')
                return
                })
            }
            // dealer.keepgo = false


            setTimeout(function () {
                message.channel.sendFile(`${paths.BUILD}/cards/${caller+player.round}_bj.png`, "card.png", "Essas são suas cartas. Somando " + player.sum())
                setTimeout(function () {
                    message.channel.sendFile(`${paths.BUILD}/cards/${'banc'+dealer.round}_bj.png`, "card.png", " E essas são as minhas, Somando " + dealer.sum())

                    ongoing = false
                    player.keepgo = false
                    return

                }, 10)

            }, 280)

        }

        function gotoEnd() {
            if (ongoing !== true) return;
            ongoing = false

            console.log('player KeepGo END')

            message.channel.send('Ok, minha vez').then(function (c) {



                setTimeout(function () {
                    for (i = 0; i < 5; i++) {

                        if (dealer.sum() >= 18 || dealer.sum() >= player.sum()) {
                            console.log('ok chega')
                            enough()
                            return;
                        }

                        dealer.round++
                            console.log('keepgo dealer')

                        message.channel.send(dealer.hand[dealer.round].icon)


                    }
                }, 100)

            }); //--------------- SEND OK MY TURN




        };
        //=====================================================================================//
        //                                                                                     //
        //                                      START GAME                                     //
        //                                                                                     //
        //=====================================================================================//




        if (ongoing == true) {
             drawCards(300,800);
            setTimeout(function () {
                message.channel.send(`:one: Hit
:two: Stand`).then(function (m) {


                        bot.on('message', newmsg => {
                            if (newmsg.channel != message.channel) return;
                            if (newmsg.author != message.author) return;

                            if (endgame != undefined) {
                                ongoing = false
                                return;
                            } else {
                                if (newmsg.author == message.author && newmsg.content === "1") {
                                    player.keepgo = true
                                    player.round = 2

                                   drawCards();
                                    checkOut();

                                    setTimeout(function () {
                                        if (ongoing === true && player.keepgo === true) {
                                            message.channel.send(`:one: Hit
:two: Stand`).then(function (mm) {


                                                    bot.on('message', newmsgB => {
                                                        if (newmsg.channel != message.channel) return;
                                                        if (newmsgB.author != message.author) return;
                                                        if (endgame != undefined) {
                                                            ongoing = false
                                                            return;
                                                        } else {
                                                            if (newmsgB.author == message.author && newmsgB.content === "1") {

                                                                player.round = 3


                                                                drawCards();

                                                                checkOut();


                                                                setTimeout(function () {
                                                                    if (ongoing === true && player.keepgo === true) {
                                                                        message.channel.send(`:one: Hit
:two: Stand
Turn 4`).then(function (mmm) {



                                                                                bot.on('message', newmsgC => {
                                                                                    if (newmsg.channel != message.channel) return;
                                                                                    if (newmsgC.author != message.author) return;
                                                                                    if (endgame != undefined) {
                                                                                        ongoing = false
                                                                                        return;
                                                                                    } else {
                                                                                        if (newmsgC.author == message.author && newmsgC.content === "1") {
                                                                                            player.keepgo = true
                                                                                            player.round = 4


                                                                                     drawCards(100, 200);
                                                                                            checkOut();


                                                                                            if (ongoing) {
                                                                                                gotoEnd()
                                                                                            }


                                                                                        } else if (newmsgC.author == message.author && newmsgC.content === "2") {
                                                                                            gotoEnd();
                                                                                        }
                                                                                    }


                                                                                    return



                                                                                })
                                                                                newmsg.delete(10000)
                                                                            }) // -------------POS HITSTAND 3
                                                                    }
                                                                }, 1000)

                                                            } else if (newmsgB.author == message.author && newmsgB.content === "2") {
                                                                gotoEnd();
                                                                return
                                                            }
                                                        }


                                                        return


                                                    })
                                                    newmsg.delete(10000)
                                                }) // -------------POS HITSTAND 2
                                        }
                                    }, 1500)

                                } else if (newmsg.author == message.author && newmsg.content === "2") {
                                    gotoEnd();
                                }
                            }

                            return



                        })
                        newmsg.delete(10000).catch(e=> {let a = (new Error); gear.errLog(e,__filename,a.stack.toString())});
                    }) // -------------POS HITSTAND 1
            }, 2000)
        }
    } catch (err) {
        message.reply('eita, deu algo meio errado aqui. tô devolvendo teus rubine')
        userData.rubines += bet
    }
}
