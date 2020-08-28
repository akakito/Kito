const guildModel = require("../../models/guilds");
const userModel = require("../../models/users");
const { readFileSync } = require("fs");

module.exports = bot =>
{
    try
    {
        const { prefix, currency } = JSON.parse(readFileSync("./data/botconfig.json"));

        bot.on("guildCreate", async guild =>
        {
            guild.owner.send("Thanks for inviting me to your server!\nPlease drag my role to the top of the list, or else I can't operate on this server!\nPlease write k!setup in the server's any text channel, and set every setting! If you don't set a setting, then the features or commands that require the setting won't work!");

            let guildM = new guildModel(
            {
                guildID: guild.id,
                guildName: guild.name,
                prefix: prefix,
                roles:
                {
                    muted: null,
                    default: null
                },
                channels:
                {
                    welcome: null,
                    leave: null,
                    logs: null,
                    giveaways: null,
                    bot: null,
                    musicText: null,
                    musicVoice: null
                },
                profanityfilter: true,
                currency: currency,
                commands: [],
                reactions: [],
                shop: {},
                disabled: [],
                degreetype: "c",
                botchannel: false,
                musiccommands: false,
                musicvoice: false,
                verification: false,
                reactrole: [],
                dj: false,
                logs: false
            });

            guildM.save();

            guild.members.forEach(m =>
            {
                if (!m.user.bot)
                {
                    let userM = new userModel(
                    {
                        guildID: guild.id,
                        userID: m.id,
                        xp: 0,
                        lvl: 1,
                        money: 0,
                        bank: 0,
                        hours: 0,
                        orighours: 0,
                        origamount: 0,
                        starttime: 0,
                        inventory:
                        {
                            c: 0,
                            u: 0,
                            r: 0,
                            e: 0,
                            l: 0
                        },
                        lastrobbed: null,
                        lastdug: null,
                        lastlottery: null,
                        lastdaily: null,
                        lastweekly: null,
                        lastloot: null,
                        fightswon: 0,
                        fightslost: 0,
                        timer: null
                    });

                    userM.save();
                }
            });
        });
    }
    catch (err)
    {
        console.log(err);
    }
}