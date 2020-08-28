const { RichEmbed } = require("discord.js");
const { readFileSync } = require("fs");
const ms = require("ms");
const sleep = require("../../util/functions/sleep");
const muteModel = require("../../models/mutes");
const guildModel = require("../../models/guilds");

module.exports =
{
    config:
    {
        name: "tempmute",
        description: "- Mutes the mentioned member for the specified time",
        usage: "mute [@member] [time] [reason]",
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
                    const bc = JSON.parse(readFileSync("./data/botconfig.json"));

                    if (!message.member.hasPermission("MUTE_MEMBERS")) return message.channel.send(bc.tempmute.permission);

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

                    let tempmuteEmbed;

                    let time = args[1];

                    let msec;
                    if (time) msec = ms(time);

                    let timeCorrect = true;
                    if (!msec) timeCorrect = false;

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
                        if (member.highestRole.position > message.member.highestRole.position) return message.channel.send("You can't mute a member with a higher role than yours!");
                        if (!message.guild.members.get(member.id)) return message.channel.send("The mentioned member is not in the server!");
                        if (member.id === bot.user.id) return message.channel.send("I can't mute myself!");
                    }

                    if (!mention || !time || !reason || !correct || !timeCorrect)
                    {
                        if (!mention) return message.channel.send("Please mention a member, and specify the reason!");
                        if (!time)
                        {
                            if (correct) return message.channel.send("Please specify the mute's time and the reason!");
                            else return message.channel.send("Please specify the mute's time and the reason, and mention correctly the member!");
                        }
                        if (!reason)
                        {
                            if (correct)
                            {
                                if (timeCorrect) return message.channel.send("Please specify the reason!");
                                else return message.channel.send("Please specify correctly the mute's time, and specify the reason!");
                            }
                            else
                            {
                                if (timeCorrect) return message.channel.send("Please mention correctly the member, and specify the reason!");
                                else return message.channel.send("Please mention correctly the member, specify correctly the mute's time, and specify the reason!");
                            }
                        }
                        if (!correct)
                        {
                            if (timeCorrect) return message.channel.send("Please mention correctly the member!");
                            else return message.channel.send("Please mention correctly the member, and specify correctly the mute's time!");
                        }
                        if (!timeCorrect) return message.channel.send("Please specify correctly the mute's time!");
                    }

                    if (member.id === message.author.id) return message.channel.send("You can't mute yourself!");
                    if (member.id === message.guild.owner.id) return message.channel.send("You can't mute the server's owner!");

                    let exist = true;
                    await muteModel.findOne({ guildID: message.guild.id, userID: member.id }, (err1, model1) =>
                    {
                        if (err1) console.log(err1);

                        console.log(model1);

                        if (model1 === null) exist = false;
                    });

                    await sleep(100);

                    if (exist) return message.channel.send("The mentioned member is already muted!");

                    let roleIDs = new Array();
                    member.roles.forEach(r =>
                    {
                        if (r.name !== "@everyone")
                        {
                            roleIDs.push(r.id);
                            member.removeRole(r);
                        }
                    });

                    member.addRole(mutedRole).catch(err =>{});

                    tempmuteEmbed = new RichEmbed()
                        .setColor("#b50000")
                        .setAuthor(`${bot.user.username}`, bot.user.avatarURL)
                        .setThumbnail("https://i.imgur.com/LdB87wb.png")
                        .setTitle("Tempmute")
                        .addField("Moderator", message.author.tag)
                        .addField("Member", member.user.tag)
                        .addField("Reason", reason)
                        .addField("Time", ms(msec, { long: true }))
                        .setTimestamp();

                    if (model.logs) logChannel.send(tempmuteEmbed);

                    member.send(tempmuteEmbed);

                    muteM = new muteModel(
                    {
                        guildID: message.guild.id,
                        userID: member.id,
                        roleIDs: roleIDs,
                        reason: reason
                    });
                    muteM.save();

                    setTimeout(() =>
                    {
                        muteModel.findOne({ guildID: message.guild.id, userID: member.id }, (err1, model1) =>
                        {
                            if (err1) console.log(err1);

                            if (model1 === null) return;

                            unmuteEmbed = new RichEmbed()
                                .setColor("#00ff00")
                                .setAuthor(`${bot.user.username}`, bot.user.avatarURL)
                                .setThumbnail("https://i.imgur.com/uZc9evz.png")
                                .setTitle("Unmute")
                                .addField("Moderator", message.author.tag)
                                .addField("Member", member.user.tag)
                                .addField("Reason", `Mute elapsed after ${ms(msec, { long: true })}`)
                                .setTimestamp();

                            member.removeRole(mutedRole).catch(err =>{});
                            model1.roleIDs.forEach(r => member.addRole(r).catch(err => {}));

                            logChannel.send(unmuteEmbed);

                            member.send(unmuteEmbed);

                            model1.remove();
                        });
                    }, msec);
                }
            });
        }
        catch(err)
        {
            console.log(err);
        }
    }
}