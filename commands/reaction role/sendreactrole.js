const { RichEmbed } = require("discord.js");
const sleep = require("../../util/functions/sleep");
const guildModel = require("../../models/guilds");

module.exports =
{
    config:
    {
        name: "sendreactrole",
        description: "- Sends the reaction role message\n \u200b \u200b \u200b - If a member reacts to this message with an emote, he/she'll receive the role that is with the emote\n \u200b \u200b \u200b - This message will refresh if you add or remove an emote with a role",
        usage: "sendreactrole",
        category: "reaction role",
        accessableby: "Administrator permission",
        permissions: ["ADMINISTRATOR"]
    },
    run: async (bot, message, args) =>
    {
        try
        {
            await guildModel.findOne({ guildID: message.guild.id }, async (err, model) =>
            {
                if (err) console.log(err);

                if (model !== null)
                {
                    let description = "";

                    model.reactroleemotes.forEach((e, i) =>
                    {
                        let r = message.guild.roles.get(model.reactroleroles[i]);

                        if (!isNaN(e)) e = message.guild.emojis.get(e);

                        if (r && e) description += `${e} - ${r}\n`;
                    });

                    let embed = new RichEmbed()
                        .setColor("#23A9F2")
                        .setTitle("**To get a role, react with an emote!**\n**To get rid of a role, take off a reaction!**")
                        .setDescription(description);

                    let emotes = model.reactroleemotes;

                    message.channel.send(embed).then(async msg =>
                    {
                        await guildModel.findOneAndUpdate({ guildID: message.guild.id }, { reactrolemessage: msg.id, reactrolechannel: msg.channel.id });
                        model.reactroleemotes.forEach(async e => await msg.react(e));

                        setInterval(async () =>
                        {
                            await guildModel.findOne({ guildID: message.guild.id }, async (err1, model1) =>
                            {
                                if (err1) console.log(err1);

                                if (model1 !== null)
                                {
                                    let equals = true;

                                    await emotes.forEach((e, i) => { if (model1.reactroleemotes[i] !== e) equals = false; });
                                    await model1.reactroleemotes.forEach((e, i) => { if (emotes[i] !== e) equals = false; });

                                    if (equals) return;

                                    description = "";

                                    model1.reactroleemotes.forEach((e, i) =>
                                    {
                                        let r = message.guild.roles.get(model1.reactroleroles[i]);

                                        if (!isNaN(e)) e = message.guild.emojis.get(e);

                                        if (r && e) description += `${e} - ${r}\n`;
                                    });

                                    embed.setDescription(description);

                                    msg.edit(embed).catch(err => {});
                                    msg.clearReactions().catch(err => {});
                                    model1.reactroleemotes.forEach(async e => await msg.react(e).catch(err => {}));

                                    emotes = model1.reactroleemotes;
                                }
                            });

                        }, 5000);
                    });

                    message.delete();
                }
            });
        }
        catch(err)
        {
            console.log(err);
        }
    }
}