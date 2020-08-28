const { RichEmbed } = require("discord.js");
const ms = require("ms");
const banModel = require("../../models/bans");
const guildModel = require("../../models/guilds");

module.exports =
{
    config:
    {
        name: "tempban",
        description: "- Bans the mentioned member for the specified time",
        usage: "tempban [@member] [time] [reason]",
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

                    let mention = args[0];

                    let member = message.mentions.members.first();

                    let id;
                    if (mention) id = mention.slice(3).slice(0, -1);

                    let logChannel = message.guild.channels.get(model.channels.logs);

                    if (!logChannel)
                    {
                        message.channel.send("The logs channel isn't set!");
                        return message.guild.owner.send(`Please set the logs channel with the ${model.prefix}setup command!`);
                    }

                    let time = args[1];

                    let msec;
                    if (time) msec = ms(time);

                    let timeCorrect = true;
                    if (!msec) timeCorrect = false;

                    let banEmbed;
                    let reason;

                    args.forEach((msg, i) =>
                    {
                        if (i > 2) reason += msg + " ";
                        else if (i === 2) reason = msg + " ";
                        i++;
                    })
                    if (reason) reason = reason.trim();

                    let correct = false;
                    if (member)
                    {
                        if (member.id === id) correct = true;
                    }

                    if (correct && reason)
                    {
                        if (member.highestRole.position > message.member.highestRole.position) return message.channel.send("You can't ban a member with a higher role than yours!");
                        if (!message.guild.members.get(id)) return message.channel.send("The mentioned member is not in the server!");
                        if (member.id === bot.user.id) return message.channel.send("I can't ban myself!");
                    }

                    if (!mention || !time || !reason || !correct || !timeCorrect)
                    {
                        if (!mention) return message.channel.send("Please mention a member, and specify the reason!");
                        if (!time)
                        {
                            if (correct) return message.channel.send("Please specify the ban's time and the reason!");
                            else return message.channel.send("Please specify the ban's time and the reason, and mention correctly the member!");
                        }
                        if (!reason)
                        {
                            if (correct)
                            {
                                if (timeCorrect) return message.channel.send("Please specify the reason!");
                                else return message.channel.send("Please specify correctly the ban's time, and specify the reason!");
                            }
                            else
                            {
                                if (timeCorrect) return message.channel.send("Please mention correctly the member, and specify the reason!");
                                else return message.channel.send("Please mention correctly the member, specify correctly the ban's time, and specify the reason!");
                            }
                        }
                        if (!correct)
                        {
                            if (timeCorrect) return message.channel.send("Please mention correctly the member!");
                            else return message.channel.send("Please mention correctly the member, and specify correctly the ban's time!");
                        }
                        if (!timeCorrect) return message.channel.send("Please specify correctly the ban's time!");
                    }

                    if (member.id === message.author.id) return message.channel.send("You can't ban yourself!");
                    if (member.id === message.guild.owner.id) return message.channel.send("You can't ban the server's owner!");

                    let tag = member.user.tag;

                    setTimeout(() =>
                    {
                        banModel.findOne({ guildID: message.guild.id, tag: tag }, (err1, model1) =>
                        {
                            if (err1) console.log(err1);

                            if (model1 === null) return;

                            unbanEmbed = new RichEmbed()
                                .setColor("#00ff00")
                                .setAuthor(`${bot.user.username}`, bot.user.avatarURL)
                                .setThumbnail("https://i.imgur.com/d2fMOyt.png")
                                .setTitle("Unban")
                                .addField("Moderator", message.author.tag)
                                .addField("User", tag)
                                .addField("Reason", `Ban elapsed after ${ms(msec, { long: true })}`)
                                .setTimestamp();

                            logChannel.send(unbanEmbed);

                            message.guild.unban(id, `Ban elapsed after ${ms(msec, { long: true })}`);

                            model1.remove();
                        });

                    }, msec);

                    banEmbed = new RichEmbed()
                        .setColor("#b50000")
                        .setAuthor(`${bot.user.username}`, bot.user.avatarURL)
                        .setThumbnail("https://i.imgur.com/O8Bpjqn.png")
                        .setTitle("Tempban")
                        .addField("Moderator", message.author.tag)
                        .addField("Member", member.user.tag)
                        .addField("Reason", reason)
                        .addField("Time", ms(msec, { long: true }))
                        .setTimestamp();

                    if (model.logs) logChannel.send(banEmbed);

                    member.send(banEmbed).then(() => member.ban(reason));

                    const banM = new banModel(
                    {
                        guildID: message.guild.id,
                        tag: member.user.tag,
                        userID: member.id,
                        reason: reason
                    });
                    banM.save();
                }
            });
        }
        catch(err)
        {
            console.log(err);
        }
    }
}