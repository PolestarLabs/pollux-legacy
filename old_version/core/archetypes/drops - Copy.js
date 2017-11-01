
var gear = require("../gearbox.js");
var paths = require("../paths.js");
var locale = require('../../utils/multilang_b');


module.exports = {
    runb: function dropGoodies(event, DB, userDB) {

        var mm = locale.getT();


if(event.content!="kéo")return;


        var hook = gear.hook
        var message = event
        var Server = event.guild


        var CHN = event.channel
        if (Server.dDATA.channels[CHN.id].modules.DROPS == false) return;
        var GLD = event.guild
        var LANG = event.lang;
        let GOODMOJI = gear.emoji("rubine")
        let GOOD = 'Rubine'
        if (Server.dDATA.modules) {
            GOODMOJI = Server.dDATA.modules.GOODMOJI
        }
        if (Server.dDATA.modules) {
            GOOD = Server.dDATA.modules.GOODNAME
        }
        if (typeof CHN.DROPSLY != 'number') {
            CHN.DROPSLY = 0
        }
        var droprate = gear.randomize(1, 10000)
        if (GLD.name === "Discord Bots") return;
        console.log(droprate)
        if (droprate > 1234 ||
            droprate == 2525 ||
            droprate == 8714 ||
            droprate == 8586 ||
            droprate == 3223 ||
            droprate == 4321) {
            console.log('DROP')
            var pack;
            var prefie = Server.dDATA.modules.PREFIX || "+"

            CHN.send(mm('$.goodDrop', {
                lngs: LANG,
                good: GOOD,
                emoji: GOODMOJI,
                prefix: prefie
            }).replace(/\&lt;/g, "<").replace(/\&gt;/g, ">"), {
                files: [paths.BUILD + 'rubine.png']
            }).catch(e => {
                CHN.send(mm('$.goodDrop', {
                    lngs: LANG,
                    good: GOOD,
                    emoji: GOODMOJI,
                    prefix: prefie
                }).replace(/\&lt;/g, "<").replace(/\&gt;/g, ">")).then(m => processDrop(m)).catch(e=>console.log("--unauthorized drop--"))

            }).then(m => processDrop(m))
        }



        if (droprate === 777) {

            event.channel.send(mm('$.rareDrop', {
                lngs: LANG,
                good: GOOD,
                emoji: GOODMOJI,
                prefix: Server.dDATA.modules.PREFIX
            }).replace(/\&lt;/g, "<").replace(/\&gt;/g, ">"), {
                files: [paths.BUILD + 'rubinepot.png']
            }).then(m => processDropRare(m)).catch(e => {
                event.channel.send(mm('$.rareDrop', {
                    lngs: LANG,
                    good: GOOD,
                    emoji: GOODMOJI,
                    prefix: Server.dDATA.modules.PREFIX
                }).replace(/\&lt;/g, "<").replace(/\&gt;/g, ">")).then(m => processDropRare(m)).catch(e => gear.hook.send("**DROP REFUSES** \n"+e.error))
            })
        }



        async function processDropRare(r) {
            try {
                if (isNaN(CHN.DROPSLY)) {
                    CHN.DROPSLY = 500
                } else {
                    CHN.DROPSLY += 500

                }
                console.log("------------=========== ::: NATURAL RARE DROP ::: ===".bgGreen.yellow.bold)

                return new Promise(async resolve => {

                    var oldDropsly = CHN.DROPSLY
                    const responses = await CHN.awaitMessages(msg2 =>
                        msg2.author.id === message.author.id && (msg2.includes'pick', {
                            maxMatches: 1
                        }
                    );
                    if (responses.size === 0) {} else {
                        if (oldDropsly > CHN.DROPSLY) {
                            r.delete().catch(e=> {let a = (new Error); gear.errLog(e,__filename,a.stack.toString())});
                            return resolve(true);
                        }
                        let Picker = responses.first().author


                        console.log("----------- SUCCESSFUL PICK by" + Picker.username)
                        message.channel.send(mm('$.pick', {
                            lngs: LANG,
                            good: GOOD,
                            user: Picker.username,
                            count: CHN.DROPSLY,
                            emoji: ""
                        }) + " " + gear.emoji("rubine")).then(function (c) {
                            message.delete().catch(e => {
                                let v = "Couldnt Delete Message at 377"
                                console.log(v);
                                hook.send(v)
                            });
                            c.delete(500000).catch(e => {
                                let v = "Couldnt Delete R at 382"
                                console.log(v);
                                hook.send(v)
                            });
                        }).catch(e => {
                            let v = "Couldnt Send PickPot at 388"
                            console.log(v);
                            hook.send(v)
                        });

                        gear.paramIncrement(Picker, 'rubines', CHN.DROPSLY)
                        gear.paramIncrement(Picker, 'earnings.drops', CHN.DROPSLY)
                        CHN.DROPSLY = 0
                        r.delete().catch(e => {
                            let v = "Couldnt Delete R at 396"
                            console.log(v);
                            hook.send(v)
                        });
                        return resolve(true);


                    }
                })
            } catch (e) {
                let v = "Rubine Send Forbidden: " + r.guild.name + " C: " + r.channel.name
                gear.hook.send(e.error);
                hook.send(v)
            }
        }


        async function processDrop(r) {

            try {
                if (isNaN(CHN.DROPSLY)) {
                    CHN.DROPSLY = 10
                } else {
                    CHN.DROPSLY += 10
                }
                console.log("------------=========== ::: NATURAL DROP".bgGreen.white)

                return new Promise(async resolve => {

                    var oldDropsly = CHN.DROPSLY
                    const responses = await CHN.awaitMessages(msg2 =>
                        msg2.author.id === message.author.id && (msg2.content === message.prefix + 'pick'||msg2.content === DB.get(msg2.guild.id).modules.PREFIX + 'pick'), {
                            maxMatches: 1
                        }
                    );

                    if (responses.size === 0) {} else {
                        if (oldDropsly > CHN.DROPSLY) {
                            r.delete().catch(e => {
                                let v = "Couldnt Delete R at 295"
                                console.log(v);
                                hook.send(v)
                            });
                            return resolve(true);
                        }
                        let Picker = responses.first().author

                        console.log("----------- SUCCESSFUL PICK by" + Picker.username)
                        message.channel.send(mm('$.pick', {
                            lngs: LANG,
                            good: GOOD,
                            user: Picker.username,
                            count: CHN.DROPSLY,
                            emoji: ""
                        }) + " " + gear.emoji("rubine")).then(function (c) {
                            message.delete()
                            c.delete(500000).catch(e=> {let a = (new Error); gear.errLog(e,__filename,a.stack.toString())})
                        }).catch(e=> {let a = (new Error); gear.errLog(e,__filename,a.stack.toString())}).catch(e=> {let a = (new Error); gear.errLog(e,__filename,a.stack.toString())});

                        gear.paramIncrement(Picker, 'rubines', CHN.DROPSLY)
                        gear.paramIncrement(Picker, 'earnings.drops', CHN.DROPSLY)
                        CHN.DROPSLY = 0

                        r.delete().catch(e => {
                            let v = "Couldnt Delete R at 322"
                            console.log(v);
                            hook.send(v)
                        });
                        return resolve(true);
                    }
                })
            } catch (e) {
                let v = "Rubine Send Forbidden: " + r.guild.name + " C: " + r.channel.name
                gear.hook.send(e.error);
                hook.send(v)
            }
        }



    }


}
