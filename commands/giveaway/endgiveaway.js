const ms = require("ms");
const randomColor = require("randomcolor");
const mongodb = require("mongodb");
const { RichEmbed } = require("discord.js");
const guildModel = require("../../models/guilds");

module.exports =
{
    config:
    {
        name: "endgiveaway",
        description: "- Ends a giveaway with the specified ID",
        usage: "endgiveaway [ID]",
        category: "giveaway",
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
                    mongodb.connect(process.env.MONGODB_URI, { useUnifiedTopology: true }, (err, mongoClient) =>
                    {
                        if (err) console.log(err);

                        const db = mongoClient.db("krisyt-utility-bot");
                        let col = db.collection("giveaways");

                        let data = {};
                        let embeds = {};
                        col.findOne({ guildID: message.guild.id }, async (err, res) =>
                        {
                            if (err) console.log(err);

                            if (res === null)
                            {
                                col.insertOne({
                                    guildID: message.guild.id,
                                    data: {},
                                    embeds: {}
                                });
                            }
                            else
                            {
                                data = res.data;
                                embeds = res.embeds;
                            }

                            let ch = message.guild.channels.get(model.channels.giveaways);

                            if (!ch)
                            {
                                message.channel.send("The giveaways channel isn't set!");
                                return message.guild.owner.send(`Please set the giveaways channel with the ${model.prefix}setup command!`);
                            }

                            if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("You don't have permission to use this command!");
                            let guild = message.guild;

                            let id = args[0];

                            if (!id) return message.channel.send("Please specify the giveaway's ID!");

                            if (isNaN(id)) return message.channel.send("Please specify correctly the giveaway's ID!");

                            let info = data[parseInt(id)];

                            if (!info || info.ended) return message.channel.send(`The giveaway with ID ${id} doesn't exist!`);

                            let winners = new Array;
                            let winnersTxt = "";
                            let enoughEntry = true;

                            if (info.entries.length > info.amount)
                            {
                                for (i = 0; i < info.amount; i++)
                                {
                                    let userID = info.entries[Math.floor(Math.random() * (info.entries.length - 1))];
                                    while (winners.includes(userID)) userID = info.entries[Math.floor(Math.random() * (info.entries.length - 1))];

                                    winnersTxt += `<@${userID}> \n`;
                                    winnersTxt.trim();
                                    await winners.push(userID);
                                }
                            }
                            else
                            {
                                enoughEntry = false;
                                for (i = 0; i < info.entries.length; i++)
                                {
                                    winnersTxt += `<@${info.entries[i]}> \n`;
                                    winnersTxt.trim();
                                    await winners.push(info.entries[i]);
                                }
                            }

                            winners.forEach(w =>
                            {
                                let member = guild.members.get(w);

                                if (!member)
                                {
                                    let userID = info.entries[Math.floor(Math.random() * (info.entries.length - 1))];
                                    while (winners.includes(userID)) userID = info.entries[Math.floor(Math.random() * (info.entries.length - 1))];

                                    member = guild.members.get(userID);
                                    winnersTxt.replace(w, userID);
                                }

                                congratEmbed = new RichEmbed()
                                    .setAuthor(bot.user.username, bot.user.avatarURL)
                                    .setColor(randomColor())
                                    .setTitle("Congratulations!");

                                if (info.amount === 1) congratEmbed.setDescription(`You are the winner of the giveaway! You won: ${info.prizes}`);
                                else congratEmbed.setDescription(`You are one of the ${info.amount} winners of the giveaway! You won: ${info.prizes}`);

                                member.send(congratEmbed);
                            });

                            let embed;
                            if (enoughEntry)
                            {
                                embed = new RichEmbed()
                                    .setColor(randomColor())
                                    .setAuthor(bot.user.username, bot.user.avatarURL)
                                    .setTitle("Giveaway ended")
                                    .setDescription(`This giveaway ended after ${ms(ms(info.length), { long: true})}`)
                                    .addField("**Prizes:**", info.prizes)
                                    .addField("**Winners:**", winnersTxt)
                                    .setFooter(`ID: ${id}`)
                                    .setTimestamp();
                            }
                            else
                            {
                                if (info.entries.length === 0)
                                {
                                    embed = new RichEmbed()
                                        .setColor(randomColor())
                                        .setAuthor(bot.user.username, bot.user.avatarURL)
                                        .setTitle("Giveaway ended")
                                        .setDescription(`This giveaway ended after ${ms(ms(info.length), { long: true})}`)
                                        .addField("**Prizes:**", info.prizes)
                                        .addField("**Issue:**", "There were no entries to the giveaway.")
                                        .setFooter(`ID: ${id}`)
                                        .setTimestamp();
                                }
                                else
                                {
                                    embed = new RichEmbed()
                                        .setColor(randomColor())
                                        .setAuthor(bot.user.username, bot.user.avatarURL)
                                        .setTitle("Giveaway ended")
                                        .setDescription(`This giveaway ended after ${ms(ms(info.length), { long: true})}`)
                                        .addField("**Prizes:**", info.prizes)
                                        .addField("**Winners:**", winnersTxt)
                                        .addField("**Issue:**", "The entries weren't enough.")
                                        .setFooter(`ID: ${id}`)
                                        .setTimestamp();
                                }
                            }

                            let msgID;

                            await ch.fetchMessage(embeds[parseInt(id)]).then(async msg =>
                            {
                                await ch.send(embed).then(msgB => msgID = msgB.id).catch(err => console.log(err));
                                if (msg) msg.delete();
                            }).catch(err => ch.send(embed).then(msgB => msgID = msgB.id).catch(err => console.log(err)));

                            data[id].msgID = msgID;
                            data[id].winners = winners;
                            data[id].ended = true;
                            data[id].embed = embed;
                            col.updateOne({ guildID: message.guild.id }, { $set: { "data": data }, $currentDate: { lastModified: true } });

                            let listEmbed;

                            winnersTxt = "";
                            winners.forEach(w => winnersTxt += `${guild.members.get(w).user.tag}\n`);

                            if (enoughEntry)
                            {
                                listEmbed = new RichEmbed()
                                    .setColor(randomColor())
                                    .setAuthor(bot.user.username, bot.user.avatarURL)
                                    .setTitle("Your giveaway ended")
                                    .addField("**Winners:**", winnersTxt)
                                    .setFooter(`ID: ${id}`)
                                    .setTimestamp();
                            }
                            else
                            {
                                if (info.entries.length === 0)
                                {
                                    listEmbed = new RichEmbed()
                                        .setColor(randomColor())
                                        .setAuthor(bot.user.username, bot.user.avatarURL)
                                        .setTitle("Your giveaway ended")
                                        .addField("**Issue:**", "There were no entries to the giveaway.")
                                        .setFooter(`ID: ${id}`)
                                        .setTimestamp();
                                }
                                else
                                {
                                    listEmbed = new RichEmbed()
                                        .setColor(randomColor())
                                        .setAuthor(bot.user.username, bot.user.avatarURL)
                                        .setTitle("Your giveaway ended")
                                        .addField("**Winners:**", winnersTxt)
                                        .addField("**Issue:**", "The entries weren't enough.")
                                        .setFooter(`ID: ${id}`)
                                        .setTimestamp();
                                }
                            }


                            if (guild.members.get(info.authorID)) guild.members.get(info.authorID).send(listEmbed);

                            setTimeout(() =>
                            {
                                delete data[id];
                                col.updateOne({ guildID: message.guild.id }, { $set: { "data": data }, $currentDate: { lastModified: true } });

                            }, 1800000);
                        });
                    });
                }
            });
        }
        catch (err)
        {
            console.log(err);
        }
    }
}