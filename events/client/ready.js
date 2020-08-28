const { RichEmbed } = require("discord.js");
const { readFileSync } = require("fs");
const guildModel = require("../../models/guilds");
const userModel = require("../../models/users");

module.exports = bot =>
{
    bot.on("ready", async () =>
    {
        try
        {
            const { activities } = JSON.parse(readFileSync("./data/botconfig.json"));

            console.log(`${bot.user.username} became active!`);

            if (activities[0].name.includes("<guilds.size>")) activities[0].name = activities[0].name.replace("<guilds.size>", bot.guilds.size);
            if (activities[0].url) bot.user.setActivity(activities[0].name, {type: activities[0].type, url: activities[0].url});
            else bot.user.setActivity(activities[0].name, {type: activities[0].type});

            i = 1;
            setInterval(() =>
            {
                if (i > activities.length - 1) i = 0;

                let activity = activities[i];

                if (activity.name.includes("<guilds.size>")) activity.name = activity.name.replace("<guilds.size>", bot.guilds.size);
                if (activity.url) bot.user.setActivity(activity.name, {type: activity.type, url: activity.url});
                else bot.user.setActivity(activity.name, {type: activity.type});

                i++;

            }, 5000);


            await userModel.find({}, async (err, models) =>
            {
                if (err) console.log(err);

                if (models !== null)
                {
                    models.forEach(async m =>
                    {
                        if (m.bank !== 0)
                        {
                            let now = Date.now();
                            let minutesLeft = Math.floor(((m.starttime + (m.hours * 3600000)) - now) % 3600000 / 60000);
                            let i = minutesLeft;

                            await userModel.findOneAndUpdate({ guildID: m.guildID, userID: m.userID }, { money: m.money + m.bank, bank: 0, orighours: 0, origamount: 0, starttime: 0, hours: 0 });
                        }
                    });
                }
            });

            await guildModel.find({}, async (err, models) =>
            {
                if (err) console.log(err);

                if (models !== null)
                {
                    models.forEach(async m =>
                    {
                        let guild = bot.guilds.get(m.guildID);
                        let ch = guild.channels.get(m.reactrolechannel);
                        let msg;

                        if (ch) await ch.fetchMessage(m.reactrolemessage).then(message => msg = message);

                        if (msg)
                        {
                            let emotes = m.reactroleemotes;
                            let embed = new RichEmbed()
                                .setColor("#23A9F2")
                                .setTitle("**To get a role, react with an emote!**\n**To get rid of a role, take off a reaction!**");

                            setInterval(async () =>
                            {
                                await guildModel.findOne({ guildID: guild.id }, async (err1, model) =>
                                {
                                    if (err1) console.log(err1);

                                    if (model !== null)
                                    {
                                        let equals = true;

                                        await emotes.forEach((e, i) => { if (model.reactroleemotes[i] !== e) equals = false; });
                                        await model.reactroleemotes.forEach((e, i) => { if (emotes[i] !== e) equals = false; });

                                        if (equals) return;

                                        description = "";

                                        model.reactroleemotes.forEach((e, i) =>
                                        {
                                            let r = guild.roles.get(model.reactroleroles[i]);

                                            if (!isNaN(e)) e = guild.emojis.get(e);

                                            if (r && e) description += `${e} - ${r}\n`;
                                        });

                                        embed.setDescription(description);

                                        msg.edit(embed).catch(err => {});
                                        msg.clearReactions().catch(err => {});
                                        model.reactroleemotes.forEach(async e => await msg.react(e).catch(err => {}));

                                        emotes = model.reactroleemotes;
                                    }
                                });

                            }, 5000);
                        }
                    });
                }
            })
        }
        catch(err)
        {
            console.log(err);
        }
    });
}