const arraySort = require('array-sort')
const fs = require("fs");
const async = require("async");
const gear = require('../../gearbox.js')
var paths = require("../../paths.js");
var locale = require('../../../utils/multilang_b');
var mm = locale.getT();

var cmd = 'shop';

var init = async function (message, userDB, DB) {

    const start = Date.now();
    const Server = message.guild;
    const Channel = message.channel;
    const DM = message.channel.type === "dm";
    const Author = message.author;
    if (Author.bot) return;
    const Target = message.mentions.users.first() || Author;
    const MSG = message.content;
    const bot = message.botUser
    try {
        var canManage = Server.member(bot.user).hasPermission("MANAGE_MESSAGES") || Server.member(bot.user).hasPermission("ADD_REACTIONS");
    } catch (err) {
        var canManage = false
    }
    const args = MSG.split(/\s/).slice(1)[0];
    const LANG = message.lang;


return message.reply("Under Re-Work; Equip Medals at <http://www.pollux.fun/dashboard#/profile> ~")
    //-------MAGIC----------------


    //HELP TRIGGER
    const helpkey = mm("helpkey", {
        lngs: message.lang
    })
    if (MSG.split(" ")[1] == helpkey || MSG.split(" ")[1] == "?" || MSG.split(" ")[1] == "help") {
        return gear.usage(cmd, message,this.cat);
    }


    var perms = {
        MNG_MESS: mm("permission.MNG_MESS", {
            lngs: LANG
        }),
        ADD_REA: mm("permission.ADD_REA", {
            lngs: LANG
        })
    }


    try {
        if (!message.guild.member(message.botUser.user)
            .permissionsIn(message.channel)
            .hasPermission("ADD_REACTIONS")) {

            canManage = false

            //return
            /*
             message.reply(

                mm("error.iNeedThesePerms", {
                    lngs: LANG,
                    PERMSLIST: `:small_orange_diamond: **${perms.MNG_MESS+"\n:small_orange_diamond: "+perms.ADD_REA }**`
                })

            );*/
        };
    } catch (e) {}


    const exitWord = "exit"

    // Finders
    var arr = {}
    //Verbose
    const v = {
        equipMenu: mm("equip.equip", {
            lngs: LANG
        }),
        success: mm("equip.success", {
            lngs: LANG
        }),
        choose: mm("equip.choose", {
            lngs: LANG
        }),
        youSure: mm("equip.youSure", {
            lngs: LANG
        }),
        youSureDM: "**" + mm("equip.youSure", {
            lngs: LANG
        }) + "**\n `ok` = Confirm | `c` = Cancel",
        confirmed: mm("equip.confirmed", {
            lngs: LANG
        }),
        cancelled: mm("equip.cancelled", {
            lngs: LANG
        }),
        timeout: mm("equip.timeout", {
            lngs: LANG
        }),
        pleaseWaitReas: mm("equip.pleaseWaitReas", {
            lngs: LANG
        }),

        unequipSuccess: mm("equip.unequipSuccess", {
            lngs: LANG
        }),
        unequipChoose: mm("equip.unequipChoose", {
            lngs: LANG
        }),
        unequipConfirm: mm("equip.unequipConfirm", {
            lngs: LANG
        }),
        equipTwice: mm("equip.equipTwice", {
            lngs: LANG
        }),
        isEmpty: mm("equip.isEmpty", {
            lngs: LANG
        }),
        instru: mm("equip.instru", {
            lngs: LANG
        }),
        footext: mm("equip.footext", {
            lngs: LANG
        }),
        i: mm("dict.inst", {
            lngs: LANG
        })
    }

    // Emojifest

    const warn = gear.emoji("warn") || ":warning: ";
    const check = bot.emojis.get("314349398811475968") || "✅";
    const xmark = bot.emojis.get("314349398824058880") || "❌";
    const nums = ['0⃣', '1⃣', '2⃣', '3⃣', '4⃣', '5⃣', '6⃣', '7⃣', '8⃣', '9⃣'];
    const reindex = {
        '0⃣': 0,
        '1⃣': 1,
        '2⃣': 2,
        '3⃣': 3,
        '4⃣': 4,
        '5⃣': 5,
        '6⃣': 6,
        '7⃣': 7,
        '8⃣': 8,
        '9⃣': 9
    };

    const inventory = message.author.dDATA.modules.medalInventory
    const equipped = message.author.dDATA.modules.medals

    if (inventory == undefined) {
        gear.paramDefine(Author, "medalInventory", [])
        inventory = message.author.dDATA.modules.medalInventory
    }

    if (inventory.length == 0) return Channel.send("No Medals to Equip");
    // console.log(inventory)

    const equipArray = getEquips(message.author.dDATA.modules.medals)
    var menu = []
    for (i = 0; i < inventory.length; i += 5) {
        menu.push(inventory.slice(i, i + 5))
    }

    //Machine

    if (Author.equipping) {
        return Channel.send("nope")
    } else {
        Author.equipping = true
        setTimeout(() => {
            Author.equipping = false
        }, 60000)
        callB(0)
    }




    //-----------------------------------------------> > > > > >


    async function callB(index, recycle, messIn, optMsg, neoEmb) {
        return new Promise(async resolve => {
            console.log("FUNCTION: callB \n INDEX: " + index) //undefined?
            let current = index;
            var optMsg = optMsg || "";
            let menuPage = await buildPage(current);
            // console.log(menuPage)
            if (!recycle) {

                //TOSS
                if (messIn) deleteIfPossible(messIn);
                return message.channel.send({embed:menuPage.embed}).then(async newMenu => {
                  pageResolve(newMenu, menuPage, current)
                    pageResolveReact(newMenu, menuPage, current)
                })
            }

            if (neoEmb) {
                let item = menuPage.menuArr
                return processCheckout(item, index, messIn, !canManage)
            }

            return messIn.delete().then(messIn=> Channel.send(optMsg, {
                embed: menuPage.embed
            }).then(async editMenu => {
                   pageResolve(newMenu, menuPage, current)
                pageResolveReact(newMenu, menuPage, current)
                }))
            //return await deleteIfPossible(messIn);
            // return await Channel.sendEmbed(menuPage.embed).then(async m => pageResolve(m, menuPage,current))
        })
    }

    function buildPage(page) {

        console.log("FUNCTION: buildPage \n CURRPAGE: " + page)
        let currentPage = page || 0;
        let menuArr = menu[currentPage]; // MENU IS GLOBAL
        let pageObj = createpage(menu[currentPage]); // reaction pagination
        let emb = new gear.Discord.RichEmbed
        emb.setColor("#e18f2f")

        emb.setTitle(":diamond_shape_with_a_dot_inside:" + v.equipMenu)
        emb.setDescription(v.choose)
        for (i = 0; i < menuArr.length; i++) {

            emb.addField(nums[i + 1], gear.emoji(menuArr[i][0]) + " **" + menuArr[i][1] + "**", true)
        }
        emb.addField(":negative_squared_cross_mark:", "UNEQUIP", true)
       emb.addBlankField()
        emb.addField(v.i,v.instru,false)
        return {
            embed: emb,
            menuArr: menuArr,
            reacts: pageObj
        }

    } //RETURNS OBJECT

    function createpage(peeji) {
        //NAVIGATION
        var ary = {}
        for (i = 1; i < peeji.length + 1; i++) {

            ary[nums[i]] = {
                name: peeji[i - 1], // ????
                icon: peeji[i - 1],
                price: 0
            }
        }
        return ary;
    } //RETURNS ARRAY

    async function pageResolve(embedMenu, menuPage, index) {
        var index = index || 0;
        loadMedalShop(embedMenu, menuPage, index)

        return new Promise(async resolve => {

            const responses = await Channel.awaitMessages(responseMsg =>
                responseMsg.content === "x" ||
                responseMsg.content === "c" ||
                (!isNaN(parseInt(responseMsg.content)) && (
                    parseInt(responseMsg.content) >= 1 &&
                    parseInt(responseMsg.content) <= 5
                )), {
                    max: 1,
                    time: 20000
                }
            ).catch(e => {
                let a = (new Error);
                gear.errLog(e, __filename, a.stack.toString())
            });


            if (responses.size === 0) {
              //  deleteIfPossible(embedMenu);
              //  message.reply(v.timeout);
                 Author.equipping = false
            } else {

                let responseSTR = responses.first().content
                let responseINT = parseInt(responses.first().content)

                if (canManage) embedMenu.clearReactions();
                deleteIfPossible(responses.first())

                if (responseSTR == "c") {
                    return terminate(embedMenu)
                }

                if (!isNaN(responseINT)) {

                    let item = menuPage.menuArr[responseINT - 1]
                    let ownd;
                    for (i = 0; i < equipped.length; i++) {

                        if (item[0] === 0) break;
                        ownd = equipped[i][0] === item[0] && item[0] !== 0;
                        if (ownd == true) break;
                    }
                    if (ownd) {
                        return Channel.send(warn + v.equipTwice).then(warn => {
                            warn.delete(5000)
                            deleteIfPossible(embedMenu)
                            return callB(index)
                        })
                    }
                    return processCheckout(item, index, embedMenu, !canManage)
                }

                if (responseSTR === "x") {
                    let item = [0, 0]
                    return processCheckout(item, index, embedMenu, !canManage);
                }


                if (responseSTR === ">" ) {
                    return refresh(index + 1, embedMenu)
                } // arrow >> end
                if (responseSTR === "<" ) {
                    return refresh(index - 1, embedMenu)
                } // arrow >> end
            } // await emmiter end




        })

    }
    async function pageResolveReact(embedMenu, menuPage, index) {
        var index = index || 0;
        loadMedalShop(embedMenu, menuPage, index)

        return new Promise(async resolve => {

            const reactions = await embedMenu.awaitReactions(react =>
                react.users.has(Author.id), {
                    maxEmojis: 1,
                    time: 20000
                }
            ).catch(e => {
                let a = (new Error);
                gear.errLog(e, __filename, a.stack.toString())
            });

            if (reactions.size === 0) {
               // deleteIfPossible(embedMenu);
                //message.reply(v.timeout);
                 Author.equipping = false
            } else {



                let rea = reactions.first()
                let finder = reindex[rea.emoji]

               // if (canManage) embedMenu.clearReactions();

                if (finder && rea.count > 0) {

                    let item = menuPage.menuArr[finder - 1]
                    let ownd;
                    for (i = 0; i < equipped.length; i++) {

                        if (item[0] === 0) break;
                        ownd = equipped[i][0] === item[0] && item[0] !== 0;
                        if (ownd == true) break;
                    }
                    if (ownd) {
                        return Channel.send(warn + v.equipTwice).then(warn => {
                            warn.delete(5000)
                            deleteIfPossible(embedMenu)
                            return callB(index)
                        })
                    }
                    await processCheckoutReactions(item, index, embedMenu, !canManage)
                }


                if (rea.emoji.name === "❎") {
                    let item = [0, 0]
                    await processCheckoutReactions(item, index, embedMenu, !canManage);
                }
                if (rea.emoji == xmark) {
                    return terminate(embedMenu)
                }
                //equalsARROW
                if (rea.emoji.name === "▶") {
                    return refresh(index + 1, embedMenu)
                } // arrow >> end
                if (rea.emoji.name === "◀") {
                    return refresh(index - 1, embedMenu)
                } // arrow >> end
            } // await emmiter end




        })

    }

    //----------------------------------------------------------------

    function terminate(m) {
        message.reply(xmark + v.cancelled)
        deleteIfPossible(m);
        return Author.equipping = false
    }

    //----------------------------------------------------------------

    function getEquips(equipped) {
        let equips = []
        for (i = 0; i < equipped.length; i++) {
            if (equipped[i][0]) {
                equips.push(gear.emoji(equipped[i][0]));
            } else {
                equips.push(nums[i + 1]);
            }
        }
        equips = equips.toString().replace(/,/g, " ")
        return equips
    }

    async function processCheckout(item, index, embedMenu, restrained) {

        let icon = gear.emoji(item[0])
        let medal_file = item
        let name = item[1]

        let processing = new gear.Discord.RichEmbed;
        processing.setColor("#2bb955")

        if (canManage) {
            embedMenu.clearReactions().catch(e => {
                let a = (new Error);
                gear.errLog(e, __filename, a.stack.toString())
            });
        }


        if (medal_file[0] === 0) processing.setTitle(v.unequipChoose);
        else processing.setTitle(v.equip);

        await processing.setDescription(equipArray);
        processing.setFooter(v.footext)
        console.log(restrained)

        deleteIfPossible(embedMenu)
        Channel.send({
            embed: processing
        }).then(async embedSlots => {
            return processSlotPos(index, embedSlots, restrained, medal_file, processing)

        })




    }

    async function processCheckoutReactions(item, index, embedMenu, restrained) {

        let icon = gear.emoji(item[0])
        let medal_file = item
        let name = item[1]

        let processing = new gear.Discord.RichEmbed;
        processing.setColor("#2bb955")

        if (canManage) {
            embedMenu.clearReactions().catch(e => {
                let a = (new Error);
                gear.errLog(e, __filename, a.stack.toString())
            });
        }

        if (medal_file[0] === 0) processing.setTitle(v.unequipChoose);
        else processing.setTitle(v.equip);

        await processing.setDescription(equipArray);
        processing.setFooter(v.footext)
        console.log(restrained)

        embedMenu.delete()
        Channel.send({
            embed: processing
        }).then(async embedSlots => {
            if (canManage) {
                for (i = 0; i < 8; i++) {
                    await embedSlots.react(nums[i + 1]);
                }
                processSlotPosReactions(index, embedSlots, restrained, medal_file, processing);
            }
        })



    }

    function processSlotPos(inx, embedSlots, recycle, medal_file, processing) {
        return new Promise(async resolve => {

            const responses = await Channel.awaitMessages(res =>
                !isNaN(parseInt(res.content)) && (
                    parseInt(res.content) >= 1 &&
                    parseInt(res.content) <= 8
                ) || res.content === "c", {
                    max: 1,
                    time: 20000
                }
            ).catch(e => {
                let a = (new Error);
                gear.errLog(e, __filename, a.stack.toString())
            });

            if (responses.size === 0) {
                return Author.equipping = false
            } else {

                let responseINT = parseInt(responses.first().content)
                let reaNaN = responses.first().content


                //equals ARRitm
                if (!isNaN(responseINT)) {
                    let pseudoequip = message.author.dDATA.modules.medals;
                    let empty = false;
                    if ((pseudoequip[responseINT - 1][0] === undefined || pseudoequip[responseINT - 1][0] === 0) && medal_file[0] === 0) {
                        console.log("aeho")
                        empty = true;
                    }

                    if (empty) {
                        return Channel.send(warn + v.isEmpty).then(warn => {
                            warn.delete(5000)
                            let m3 = embedSlots;
                            deleteIfPossible(embedSlots);
                            resolve(true)
                            return processCheckout(medal_file, inx, m3, recycle)
                        })
                    }

                    pseudoequip[responseINT - 1] = medal_file;

                    processing.setDescription(getEquips(pseudoequip))


                    deleteIfPossible(responses.first())

                    if (medal_file[0] === 0) processing.setTitle(v.unequipConfirm);
                    else processing.setTitle(v.youSure);
                    deleteIfPossible(embedSlots)
                    Channel.send({
                        embed: processing
                    }).then(async embedConfirmation => {
                        finalConfirm(embedConfirmation, medal_file, responseINT, processing)

                    })
                }

                //CANCEL

                if (reaNaN === "c") {
                    let x = embedSlots
                    deleteIfPossible(embedSlots)
                    return refresh(0, x, false)
                }
            } // await emmiter end

        })
    }

    function processSlotPosReactions(inx, embedSlots, recycle, medal_file, processing) {
        return new Promise(async resolve => {

            const responses = await embedSlots.awaitReactions(react =>
                react.users.has(Author.id), {
                    maxEmojis: 1,
                    time: 20000
                }
            ).catch(e => {
                let a = (new Error);
                gear.errLog(e, __filename, a.stack.toString())
            });

            if (responses.size === 0) {
                return Author.equipping = false
            } else {
                let reaMoji = responses.first()
                let responseINT = reindex[reaMoji.emoji]
                deleteIfPossible(responses.first())

                //equals ARRitm
                if (responseINT && reaMoji.count > 0) {

                    let pseudoequip = message.author.dDATA.modules.medals;
                    let empty = false;
                    if (pseudoequip[responseINT - 1][0] === undefined || pseudoequip[responseINT - 1][0] === 0 && medal_file[0] === 0) {
                        empty = true;
                    }

                    if (empty) {
                        return Channel.send(warn + v.isEmpty).then(warn => {
                            warn.delete(5000)
                            let m3 = embedSlots;
                            deleteIfPossible(embedSlots);
                            resolve(true)
                            return processCheckout(medal_file, inx, m3, recycle)
                        })
                    }

                    pseudoequip[responseINT - 1] = medal_file;

                    processing.setDescription(getEquips(pseudoequip))
                    embedSlots.delete().catch()
                    Channel.send(v.youSure, {
                        embed: processing
                    }).then(async embedConfirmation => {

                        if (medal_file[0] === 0) processing.setTitle(v.unequipConfirm);
                        else processing.setTitle(v.youSure);

                        if (canManage) {
                            await embedConfirmation.react(check)
                            await embedConfirmation.react("↩")
                            await embedConfirmation.react(xmark)
                            return finalConfirmReaction(embedConfirmation, medal_file, responseINT, processing)
                        }

                    })

                }

                if (reaMoji === xmark) {
                    deleteIfPossible(embedSlots)
                    resolve(true)
                    return refresh(0, embedSlots, true)
                }
            } // await emmiter end

        })
    }

    async function finalConfirm(yesOrNo, medal_file, rea, p) {

        return new Promise(async resolve => {
            const responses = await Channel.awaitMessages(react =>
                react.content.toLowerCase() === "ok" ||
                react.content.toLowerCase() === "c", {
                    max: 1,
                    time: 20000
                }
            ).catch(e => {
                let a = (new Error);
                gear.errLog(e, __filename, a.stack.toString())
            });
            if (responses.size === 0) {
                return Author.equipping = false

            } else {
                let reata = responses.first().content
                deleteIfPossible(responses.first())

                if (reata === "ok") {

                    let u = message.author.dDATA;
                    u.modules.medals[rea - 1] = medal_file
                    userDB.set(Author.id, u)
                    deleteIfPossible(yesOrNo);
                    deleteIfPossible(responses.first());

                    message.reply(check + v.success)
                    return Author.equipping = false


                }
                if (reata === "c") {

                    return Channel.send(xmark + v.cancelled).then(warn => {
                        warn.delete(5000)
                        let m3 = yesOrNo;
                        deleteIfPossible(yesOrNo);
                        resolve(false)
                        return processCheckout(medal_file, 0, m3, !canManage)
                    })
                }
                if (reata === exitWord) {

                    Channel.send(xmark + v.cancelled).then(warn => {
                        warn.delete(5000)
                        deleteIfPossible(yesOrNo);
                        return Author.equipping = false

                    })
                }
            }
        })
    }

    async function finalConfirmReaction(yesOrNo, medal_file, rea, p) {

        return new Promise(async resolve => {
            const responses = await yesOrNo.awaitReactions(react =>
                react.users.has(Author.id), {
                    maxEmojis: 1,
                    time: 20000
                }
            ).catch(e => {
                let a = (new Error);
                gear.errLog(e, __filename, a.stack.toString())
            });
            if (responses.size === 0) {
                return Author.equipping = false
            } else {

                let rea = responses.first()
                if (rea.emoji == check && rea.count > 0) {

                    let u = message.author.dDATA;
                    u.modules.medals[rea - 1] = medal_file
                    userDB.set(Author.id, u)
                    deleteIfPossible(yesOrNo);
                    deleteIfPossible(responses.first());
                    return message.reply(check + v.success)

                }
                if (rea.emoji == "↩" && rea.count > 0) {

                    return Channel.send(xmark + v.cancelled).then(warn => {
                        warn.delete(5000)
                        return processCheckout(medal_file, 0, yesOrNo, !canManage)
                    })
                }
                if (rea.emoji == xmark && rea.count > 0) {

                    return Channel.send(xmark + v.cancelled).then(warn => {
                        warn.delete(5000)
                        deleteIfPossible(yesOrNo)
                        return resolve(false)
                    })
                }
            }
        })
    }

    async function refresh(index, msg, reset = true, optionalMsg) {
        if (canManage) {
            await msg.clearReactions().catch(e => {
                //  message.reply(mm("error.iNeedThesePerms", {
                //    lngs: LANG,
                //         PERMSLIST: `**${perms.MNG_MESS}**`
                //     }));
            });
        }

        return callB(index, reset, msg, optionalMsg);
    }

    async function loadMedalShop(m, menuPage, index) {

        console.log("FUNCTION: loadMedalShop")


        if (canManage) {
            for (i = 0; i < menuPage.menuArr.length; i++) {
                await m.react(nums[i + 1]).catch(e => {
                    let a = (new Error);
                    gear.errLog(e, __filename, a.stack.toString())
                });
            }
            await m.react("❎").catch(e => {
                let a = (new Error);
                gear.errLog(e, __filename, a.stack.toString())
            });

            if (index !== 0) {
                await m.react("◀").catch(e => {
                    let a = (new Error);
                    gear.errLog(e, __filename, a.stack.toString())
                });
            }
            if (index != menu.length - 1) {
                await m.react("▶").catch(e => {
                    let a = (new Error);
                    gear.errLog(e, __filename, a.stack.toString())
                });
            }
            await m.react(xmark).catch(e => {
                let a = (new Error);
                gear.errLog(e, __filename, a.stack.toString())
            })
        }

    }

    function deleteIfPossible(the_message) {

        try {
            the_message.delete().catch(e => {
                // let a = (new Error);
                //  gear.errLog(e, __filename, a.stack.toString())
            })

        } catch (err) {}
    }


} // MODULE END

module.exports = {
    pub: true,
    cmd: cmd,
    perms: 3,
    init: init,
    cat: 'cosmetics'
};
