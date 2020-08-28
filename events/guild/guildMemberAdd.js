const guildModel = require("../../models/guilds");
const userModel = require("../../models/users");
const banModel = require("../../models/bans");

module.exports = bot =>
{
    bot.on("guildMemberAdd", async member =>
    {
        try
        {
            await banModel.findOne({ guildID: member.guild.id, userID: member.id }, async (err, model) =>
            {
                if (err) console.log(err);

                if (model !== null) return model.remove();

                await guildModel.findOne({ guildID: member.guild.id }, (err1, gModel) =>
                {
                    if (err1) console.log(err1);

                    if (gModel !== null)
                    {
                        let message = `Welcome <@${member.id}> in the ${member.guild.name}!`

                        let welcomeChannel = member.guild.channels.get(gModel.channels.welcome);

                        if (welcomeChannel) welcomeChannel.send(message);

                        member.send(message);

                        let userM = new userModel(
                        {
                            guildID: member.guild.id,
                            userID: member.id,
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
        catch(err)
        {
            console.log(err);
        }
    });
}