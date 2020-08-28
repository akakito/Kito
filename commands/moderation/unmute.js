const { RichEmbed } = require("discord.js");
const muteModel = require("../../models/mutes");
const guildModel = require("../../models/guilds");

module.exports =
{
    config:
    {
        name: "unmute",
        description: "- Removes the mute from the mentioned member",
        usage: "unmute [@member] [reason]",
        category: "moderation",
        accessableby: "Mute members permission",
        permissions: ["MUTE_MEMBERS"]
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
                    let mention = args[0];

                    let member = message.mentions.members.first();

                    let id;
                    if (mention) id = mention.slice(3).slice(0, -1);

                    let logChannel = message.guild.channels.get(model.channels.logs);
                    let mutedRole = message.guild.roles.get(model.roles.muted);

                    if (!logChannel || !mutedRole)
                    {
                        if (!logChannel && !mutedRole)
                        {
                            message.channel.send("The logs channel and the muted role isn't set!");
                            return message.guild.owner.send(`Please set the logs channel and the muted role with the ${model.prefix}setup command!`);
                        }
                        else if (!logChannel)
                        {
                            message.channel.send("The logs channel isn't set!");
                            return message.guild.owner.send(`Please set the logs channel with the ${model.prefix}setup command!`);
                        }
                        else
                        {
                            message.channel.send("The muted role isn't set!");
                            return message.guild.owner.send(`Please set the muted role with the ${model.prefix}setup command!`);
                        }
                    }

                    let unmuteEmbed;

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

                    let lowRole = false;
                    if (correct)
                    {
                        muteModel.findOne({ guildID: message.guild.id, userID: member.id }, (err1, model1) =>
                        {
                            if (err1) console.log(err1);
                            if (model1 !== null) model1.roleIDs.forEach(rID => { if (message.guild.roles.find(r => r.id === rID).position > message.member.highestRole.position) lowRole = true; });
                        });
                    }

                    if (!message.member.hasPermission("MUTE_MEMBERS")) return message.channel.send("You don't have permission to use this command!");

                    if (correct && reason)
                    {
                        if (lowRole) return message.channel.send("You can't unmute a member with a higher role than yours!");

                        if (!message.guild.members.get(member.id)) return message.channel.send("The mentioned member is not in the server!");

                        if (member.id === bot.user.id) return message.channel.send("I can't unmute myself!");
                    }

                    if (!mention || !reason || !correct)
                    {
                        if (!mention) return message.channel.send("Please mention a member and specify the reason!");

                        if (!reason)
                        {
                            if (correct) return message.channel.send("Please specify the reason!");
                            else return message.channel.send("Please mention correctly the member and specify the reason!");
                        }
                        if (!correct) return message.channel.send("Please mention correctly the member!");
                    }

                    if (member.id === message.author.id) return message.channel.send("You can't unmute yourself!");
                    if (member.id === message.guild.owner.id) return message.channel.send("You can't unmute the server's owner!");

                    muteModel.findOne({ guildID: message.guild.id, userID: member.id }, (err1, model1) =>
                    {
                        if (err1) console.log(err1);

                        if (model1 === null) return message.channel.send("The mentioned member isn't muted!");

                        unmuteEmbed = new RichEmbed()
                            .setColor("#00ff00")
                            .setAuthor(`${bot.user.username}`, bot.user.avatarURL)
                            .setThumbnail("https://i.imgur.com/uZc9evz.png")
                            .setTitle("Unmute")
                            .addField("Moderator", message.author.tag)
                            .addField("Member", member.user.tag)
                            .addField("Reason", reason)
                            .setTimestamp();

                        member.removeRole(mutedRole).catch(err =>{});
                        model1.roleIDs.forEach(r => member.addRole(r).catch(err =>{}));

                        if (model.logs) logChannel.send(unmuteEmbed);

                        member.send(unmuteEmbed);

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