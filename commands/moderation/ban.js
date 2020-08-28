const { RichEmbed } = require("discord.js");
const banModel = require("../../models/bans");
const guildModel = require("../../models/guilds");

module.exports =
{
    config:
    {
        name: "ban",
        description: "- Bans the mentioned member",
        usage: "ban [@member] [reason]",
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

                    let banEmbed;
                    let reason;

                    args.forEach((msg, i) =>
                    {
                        if (i > 1) reason += msg + " ";
                        else if (i === 1) reason = msg + " ";
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

                    if (!mention || !reason || !correct)
                    {
                        if (!mention) return message.channel.send("Please mention a member, and specify the reason!");
                        if (!reason)
                        {
                            if (correct) return message.channel.send("Please specify the reason!");
                            else return message.channel.send("Please mention correctly the member, and specify the reason!");
                        }
                        if (!correct) return message.channel.send("Please mention correctly the member!");
                    }

                    if (member.id === message.author.id) return message.channel.send("You can't ban yourself!");
                    if (member.id === message.guild.owner.id) return message.channel.send("You can't ban the server's owner!");

                    banEmbed = new RichEmbed()
                        .setColor("#b50000")
                        .setAuthor(`${bot.user.username}`, bot.user.avatarURL)
                        .setThumbnail("https://i.imgur.com/O8Bpjqn.png")
                        .setTitle("Ban")
                        .addField("Moderator", message.author.tag)
                        .addField("Member", member.user.tag)
                        .addField("Reason", reason)
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