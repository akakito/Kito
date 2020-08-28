const ms = require("ms");
const randomColor = require("randomcolor");
const mongodb = require("mongodb");
const { RichEmbed} = require("discord.js");
const sleep = require("../../util/functions/sleep");
const formatTime = require("../../util/functions/formatTime");
const guildModel = require("../../models/guilds");

module.exports =
{
    config:
    {
        name: "giveaway",
        description: "- Starts a giveaway with the specified prize",
        usage: "giveaway [prize (it can be multiple words)] ; [time (e.g. 1d)] ; (winner amount)",
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
                    mongodb.connect(process.env.MONGODB_URI, { useUnifiedTopology: true }, async (err, mongoClient) =>
                    {
                        if (err) console.log(err);

                        const db = mongoClient.db("krisyt-utility-bot");
                        let col = db.collection("giveaways");

                        let data = {};
                        let embeds = {};
                        col.findOne({ guildID: message.guild.id }, (err, res) =>
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

                            let author = message.author;
                            let guild = message.guild;

                            for (i = 0; i < 100; i++)
                            {
                                if (!data[i]) break;
                                if (data[i] && i === 99) return message.channel.send("You can only run 99 giveaways at one time!");
                            }
                            let id = Math.floor(Math.random() * 100);
                            while (data[id])
                            {
                                id = Math.floor(Math.random() * 100);
                            }

                            let prizes = "";
                            let lengthIndex;
                            if (args.length > 0)
                            {
                                for (i = 0; i < args.length; i++)
                                {
                                    let a = args[i];

                                    if (a === ";")
                                    {
                                        lengthIndex = i + 1;
                                        break;
                                    }
                                    if (a[a.length - 1] === ";")
                                    {
                                        prizes += ` ${a.slice(0, -1)}`;
                                        lengthIndex = i + 1;
                                        break;
                                    }
                                    prizes += ` ${a}`;
                                }
                            }

                            let length = "";
                            let amountIndex;
                            if (args.length > lengthIndex)
                            {
                                for (i = lengthIndex; i < args.length; i++)
                                {
                                    let a = args[i];
                                    if (a === ";")
                                    {
                                        amountIndex = i + 1;
                                        break;
                                    }
                                    if (a[a.length - 1] === ";")
                                    {
                                        length += ` ${a.slice(0, -1)}`;
                                        amountIndex = i + 1;
                                        break;
                                    }
                                    length += ` ${a}`;
                                }
                            }
                            length = length.slice(1);

                            let lengthCorrect = true;
                            if (length) lengthCorrect = (ms(length)) ? true : false;

                            let amount = args[amountIndex];
                            let amountCorrect;
                            if (!amount)
                            {
                                amountCorrect = true;
                                amount = 1;
                            }
                            else amountCorrect = (isNaN(amount)) ? false : true;

                            if (!prizes) return message.channel.send("Please specify the giveaway's prizes and the giveaway's length!");
                            if (!length) return message.channel.send("Please specify the giveaway's length!");
                            if (!lengthCorrect)
                            {
                                if (amountCorrect) return message.channel.send("Please specify correctly the giveaway's length!");
                                else return message.channel.send("Please specify correctly the giveaway's length and the winner amount!");
                            }
                            if (!amountCorrect) return message.channel.send("Please specify correctly the winner amount!");
                            if (ms(length) > 2147483647) return message.channel.send("The giveaway's length is too long!");
                            if (ms(length) < 10000) return message.channel.send("The giveaway's length needs to be at least 10 seconds!");
                            if (amount <= 0) return message.channel.send("Please specify correctly the winner amount!");

                            let remaining = formatTime(ms(length));

                            let embed = new RichEmbed()
                                .setColor(randomColor())
                                .setAuthor(bot.user.username, bot.user.avatarURL)
                                .setTitle("Giveaway")
                                .setDescription("To participate in this giveaway, react with  ✅")
                                .addField("**Prizes:**", prizes)
                                .addField("**Remaining time:**", remaining)
                                .addField("**Winners:**", amount)
                                .setFooter(`ID: ${id}`)
                                .setTimestamp();

                            ch.send(embed).then(msg =>
                            {
                                msg.react("✅");
                                embeds[id] = msg.id;
                                col.updateOne({ guildID: message.guild.id }, { $set: { "embeds": embeds }, $currentDate: { lastModified: true } });
                            });

                            data[id] =
                            {
                                lastDraw: Date.now(),
                                authorID: author.id,
                                length: length,
                                remaining: ms(length) - 5000,
                                prizes: prizes,
                                entries: [],
                                winners: [],
                                amount: amount,
                                ended: false,
                            }

                            col.updateOne({ guildID: message.guild.id }, { $set: { "data": data }, $currentDate: { lastModified: true } });

                            bot.on("messageReactionAdd", (reaction, user) =>
                            {
                                if (reaction.message.id !== embeds[id]) return;
                                if (data[id].entries.includes(user.id)) return;
                                if (reaction.emoji.name !== "✅") return;
                                if (user === bot.user) return;

                                data[id].entries.push(user.id);
                                col.updateOne({ guildID: message.guild.id }, { $set: { "data": data }, $currentDate: { lastModified: true } });
                            });

                            let interval = setInterval(() =>
                            {
                                col.findOne({ guildID: message.guild.id }, async (err, res) =>
                                {
                                    if (err) console.log(err);

                                    data = res.data;

                                    if (!data) return clearInterval(interval);

                                    if (data[id].remaining === 0 || data[id].ended)
                                    {
                                        let info = data[id];

                                        if (info.ended) return clearInterval(interval);

                                        let winners = new Array;
                                        let winnersTxt = "";
                                        let enoughEntry = true;

                                        if (info.entries.length > info.amount)
                                        {
                                            for (i = 0; i < info.amount; i++)
                                            {
                                                let userID = info.entries[Math.floor(Math.random() * (info.entries.length - 1))];
                                                while (winners.includes(userID)) userID = info.entries[Math.floor(Math.random() * (info.entries.length - 1))];

                                                winnersTxt += `<@${userID}>\n`;
                                                winnersTxt.trim();
                                                await winners.push(userID);
                                            }
                                        }
                                        else
                                        {
                                            enoughEntry = false;
                                            for (i = 0; i < info.entries.length; i++)
                                            {
                                                winnersTxt += `<@${info.entries[i]}>\n`;
                                                winnersTxt.trim();
                                                await winners.push(info.entries[i]);
                                            }
                                        }

                                        if (winnersTxt === "") winnersTxt = "Nobody";

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

                                            if (info.amount === 1) congratEmbed.setDescription(`You are the winner of the giveaway! You won: ${prizes}`);
                                            else congratEmbed.setDescription(`You are one of the ${info.amount} winners of the giveaway! You won: ${prizes}`);

                                            member.send(congratEmbed);
                                        });


                                        if (enoughEntry)
                                        {
                                            embed = new RichEmbed()
                                                .setColor(randomColor())
                                                .setAuthor(bot.user.username, bot.user.avatarURL)
                                                .setTitle("Giveaway ended")
                                                .setDescription(`This giveaway ended after ${ms(ms(length), { long: true})}`)
                                                .addField("**Prizes:**", prizes)
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
                                                    .setDescription(`This giveaway ended after ${ms(ms(length), { long: true})}`)
                                                    .addField("**Prizes:**", prizes)
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
                                                    .setDescription(`This giveaway ended after ${ms(ms(length), { long: true})}`)
                                                    .addField("**Prizes:**", prizes)
                                                    .addField("**Winners:**", winnersTxt)
                                                    .addField("**Issue:**", "The entries weren't enough.")
                                                    .setFooter(`ID: ${id}`)
                                                    .setTimestamp();
                                            }
                                        }

                                        let msgID;
                                        await ch.fetchMessage(embeds[id]).then(async msg =>
                                        {
                                            await ch.send(embed).then(msgB => msgID = msgB.id);
                                            msg.delete();
                                        }).catch(async err => await ch.send(embed).then(msgB => msgID = msgB.id));

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


                                        if (guild.members.get(author.id)) guild.members.get(author.id).send(listEmbed);

                                        setTimeout(() =>
                                        {
                                            delete data[id];
                                            col.updateOne({ guildID: message.guild.id }, { $set: { "data": data }, $currentDate: { lastModified: true } });

                                        }, 86400000);

                                        return clearInterval(interval);
                                    }

                                    if (data[id].remaining % 5000 >= 1000)
                                    {
                                        data[id].remaining -= data[id].remaining % 5000;
                                        sleep(data[id].remaining % 5000);
                                    }

                                    remaining = formatTime(data[id].remaining);

                                    embed.fields.find(f => f.name === "**Remaining time:**").value = remaining;
                                    ch.fetchMessage(embeds[id]).then(msg =>
                                    {
                                        if (msg) msg.edit(embed).catch(err => {});
                                    }).catch(err => { return clearInterval(interval) });

                                    data[id].remaining -= 5000;

                                    col.updateOne({ guildID: message.guild.id }, { $set: { "data": data }, $currentDate: { lastModified: true } });
                                });

                            }, 5000);
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