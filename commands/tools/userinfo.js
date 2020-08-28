const { RichEmbed } = require("discord.js");
const { utc } = require("moment");
const randomColor = require("randomcolor");
const guildModel = require("../../models/guilds");
const userModel = require("../../models/users");

module.exports =
{
    config:
    {
        name: "userinfo",
        description: "- Shows information about the mentioned member",
        usage: "userinfo [@member]",
        category: "tools",
        accessableby: "Member",
        permissions: ["NOTHING"]
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
                    if (!args[0]) return message.channel.send("Please mention the member whom you want to get information about!");

                    let id = args[0].slice(3, args[0].length - 1);
                    let member = message.mentions.members.first();

                    if (!member || member.id !== id) return message.channel.send("Please mention correctly the member whom you want to get information about!");

                    if (member.user.bot) return message.channel.send("You can't get a bot's information!");

                    await userModel.findOne({ guildID: message.guild.id, userID: id }, (err, model1) =>
                    {
                        if (err) console.log(err);

                        if (model1 !== null)
                        {
                            let status;
                            switch (member.presence.status)
                            {
                                case "offline":
                                    status = "\\❌Offline"
                                    break;

                                case "online":
                                    status = "\\🟢Online"
                                    break;

                                case "idle":
                                    status = "\\🟡Idle"
                                    break;

                                case "dnd":
                                    status = "\\🔴Do not disturb"
                                    break;

                                case "streaming":
                                    status = "\\🟣Streaming"
                                    break;
                            }

                            let embed = new RichEmbed()
                                .setColor(randomColor())
                                .setAuthor(member.user.tag, member.user.avatarURL)
                                .addField("**ID**", member.id)
                                .addField("**Status**", status)
                                .addField("**Joined at**", utc(member.joinedAt).format("dddd, MMMM Do, YYYY"))
                                .addField("**XP**", model1.xp)
                                .addField("**Level**", model1.lvl)
                                .addField("**Wallet**", `${model1.money} ${model.currency}`)
                                .addField("**Fights won**", model1.fightswon)
                                .addField("**Fights lost**", model1.fightslost)
                                .setTimestamp();

                            message.channel.send(embed);
                        }
                    });
                }
            });
        }
        catch(err)
        {
            console.log(err);
        }
    }
}