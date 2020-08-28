const randomColor = require("randomcolor");
const mongodb = require("mongodb");
const { RichEmbed } = require("discord.js");
const guildModel = require("../../models/guilds");

module.exports =
{
    config:
    {
        name: "reroll",
        description: "- Rerolls a giveaway's winners",
        usage: "reroll [ID]",
        category: "giveaway",
        accessableby: "Administrator permission",
        permissions: ["ADMINISTRATOR"],
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
                            }

                            let ch = message.guild.channels.get(model.channels.giveaways);

                            if (!ch)
                            {
                                message.channel.send("The giveaways channel isn't set!");
                                return message.guild.owner.send(`Please set the giveaways channel with the ${model.prefix}setup command!`);
                            }

                            if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("You don't have permission to use this command!");

                            let id = args[0];

                            if (!id) return message.channel.send("Please specify the giveaway's ID!");
                            if (!data[id]) return message.channel.send(`The giveaway with ID ${id} doesn't exist!`);
                            if (!data[id].ended) return message.channel.send(`The giveaway with ID ${id} haven't ended yet!`);

                            if (Date.now() - parseInt(data[id].lastDraw) < 30000) return message.channel.send("You can reroll only in every 30 seconds!");

                            let winnersTxt = "";
                            let oldWinners = data[id].winners;

                            oldWinners.forEach(w =>
                            {
                                let oldWinner = message.guild.members.get(w);

                                if (oldWinner)
                                {
                                    let sorryEmbed = new RichEmbed()
                                        .setAuthor(bot.user.username, bot.user.avatarURL)
                                        .setColor(randomColor())
                                        .setTitle("Sorry!")
                                        .setDescription("The giveaway has been drawn again and you haven't won!")
                                        .setTimestamp();

                                    oldWinner.send(sorryEmbed);
                                }
                            });

                            data[id].winners = new Array;

                            for (i = 0; i < data[id].amount; i++)
                            {
                                let entries = data[id].entries;
                                entries = entries.filter(x =>
                                {
                                    return oldWinners.indexOf(x) < 0;
                                });
                                let newID = entries[Math.floor(Math.random() * (entries.length - 1))];
                                let newWinner = message.guild.members.get(newID);

                                data[id].winners.push(newID);

                                let congratEmbed = new RichEmbed()
                                    .setAuthor(bot.user.username, bot.user.avatarURL)
                                    .setColor(randomColor())
                                    .setTitle("Congratulations!").setTimestamp();

                                if (data[id].amount === 1) congratEmbed.setDescription(`The giveaway has been drawn again and you are the winner of the giveaway!\nYou won: ${data[id].prizes}`);
                                else congratEmbed.setDescription(`The giveaway has been drawn again and you are one of the ${data[id].amount} winners of the giveaway!\nYou won: ${data[id].prizes}`);

                                newWinner.send(congratEmbed);
                            }

                            data[id].lastDraw = Date.now();
                            col.updateOne({ guildID: message.guild.id }, { $set: { "data": data }, $currentDate: { lastModified: true } });

                            data[id].winners.forEach(w =>
                            {
                                winnersTxt += `<@${w}>\n`;
                            });

                            let embed = new RichEmbed(data[id].embed);
                            embed.fields.find(f => f.name === "**Winners:**").value = winnersTxt;

                            await ch.fetchMessage(data[id].msgID).then(async msg =>
                            {
                                msg.edit(embed).catch(err => {});
                            }).catch(err => {});
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