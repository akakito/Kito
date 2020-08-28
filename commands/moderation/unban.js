const { RichEmbed } = require("discord.js");
const banModel = require("../../models/bans");
const guildModel = require("../../models/guilds");

module.exports =
{
    config:
    {
        name: "unban",
        description: "- Removes the ban from the user with the specified tag",
        usage: "unban [tag] [reason]",
        category: "moderation",
        accessableby: "Ban members permission",
        permissions: ["BAN_MEMBERS"]
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
                    if (!message.member.hasPermission("BAN_MEMBERS")) return message.channel.send("You don't have permission to use this command!");

                    let lastIndex = 0;
                    let hashtag = false;

                    args.forEach(m =>
                    {
                        if (m.includes("#")) hashtag = true;
                    });

                    let tag;
                    if (hashtag)
                    {
                        for (i = 0; i < args.length; i++)
                        {
                            lastIndex = i;
                            if (i > 0)
                            {
                                if (args[i].includes("#"))
                                {
                                    lastIndex++;
                                    tag += args[i];
                                    break;
                                }
                                else tag += `${args[i]} `;
                            }
                            else if (i === 0)
                            {
                                if (args[i].includes("#"))
                                {
                                    tag = args[i];
                                    lastIndex++;
                                    break;
                                }
                                else tag = `${args[i]} `;
                            }
                        }
                    }
                    else
                    {
                        if (args.length >= 1)
                        {
                            tag = args[0];
                            lastIndex = 0;
                        }
                    }

                    banModel.findOne({ guildID: message.guild.id, tag: tag }, (err1, model1) =>
                    {
                        if (err1) console.log(err1);

                        let banInfo = {};

                        if (model1 !== null)
                        {
                            banInfo.id = model1.userID;
                            banInfo.tag = model1.tag;
                            banInfo.reason = model1.reason;
                        }

                        if (!banInfo.id) banInfo = undefined;

                        let logChannel = message.guild.channels.get(model.channels.logs);

                        if (!logChannel)
                        {
                            message.channel.send("The logs channel isn't set!");
                            return message.guild.owner.send(`Please set the logs channel with the ${model.prefix}setup command!`);
                        }

                        let unbanEmbed;
                        let reason;

                        if (reason) reason = reason.trim();
                        if (hashtag)
                        {
                            if (args.length > lastIndex)
                            {
                                args.forEach((msg,i) =>
                                {
                                    if (i > lastIndex) reason += msg + " ";
                                    else if (i === lastIndex) reason = msg + " ";
                                });
                            }
                        }
                        else
                        {
                            lastIndex++;
                            if (args.length > lastIndex)
                            {
                                args.forEach((msg,i) =>
                                {
                                    if (i > lastIndex) reason += msg + " ";
                                    else if (i === lastIndex) reason = msg + " ";
                                });
                            }
                        }

                        if (!tag || !reason || !banInfo)
                        {
                            if (!tag) return message.channel.send("Please specify the user's tag whom you want to unban, and specify the reason!");
                            if (!reason)
                            {
                                if (banInfo) return message.channel.send("Please specify the reason!");
                                else
                                {
                                    if (hashtag) return message.channel.send("The specified user isn't banned, and please specify the reason!");
                                    else return message.channel.send("Please specify correctly the user's tag whom you want to unban, and specify the reason!");
                                }
                            }
                            if (!banInfo)
                            {
                                if (hashtag) return message.channel.send("The specified user isn't banned!");
                                else return message.channel.send("Please specify correctly the user's tag whom you want to unban!");
                            }
                        }

                        if (member.id === message.author.id) return message.channel.send("You can't unban yourself!");
                        if (member.id === message.guild.owner.id) return message.channel.send("You can't unban the server's owner!");

                        unbanEmbed = new RichEmbed()
                            .setColor("#00ff00")
                            .setAuthor(`${bot.user.username}`, bot.user.avatarURL)
                            .setThumbnail("https://i.imgur.com/d2fMOyt.png")
                            .setTitle("Unban")
                            .addField("Moderator", message.author.tag)
                            .addField("User", tag)
                            .addField("Reason", reason)
                            .setTimestamp();

                        if (model.logs) logChannel.send(unbanEmbed);

                        message.guild.unban(banInfo.id, reason);

                        model1.remove();
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