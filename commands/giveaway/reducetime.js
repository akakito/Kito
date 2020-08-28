const ms = require("ms");
const mongodb = require("mongodb");

module.exports =
{
    config:
    {
        name: "reducetime",
        description: "- Reduces a giveaway's length with the specified time",
        usage: "reducetime [ID] [length]",
        category: "giveaway",
        accessableby: "Administrator permission",
        permissions: ["ADMINISTRATOR"]
    },
    run: (bot, message, args) =>
    {
        try
        {
            mongodb.connect(process.env.MONGODB_URI, { useUnifiedTopology: true }, (err, mongoClient) =>
            {
                if (err) console.log(err);

                const db = mongoClient.db("krisyt-utility-bot");
                let col = db.collection("giveaways");

                let data = {};
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
                    }

                    if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("You don't have permission to use this command!");

                    let id = args[0];
                    let length = args[1];

                    if (!id) return message.channel.send("Please specify the giveaway's ID and the time you want to reduce with!");
                    if (!length)
                    {
                        if (data[id]) return message.channel.send("Please specify the time you want to reduce with!");
                        else return message.channel.send("Please specify the time you want to reduce with, and specify correctly the giveaway's ID!");
                    }
                    if (!ms(length))
                    {
                        if (data[id]) return message.channel.send("Please specify correctly the time you want to reduce with!");
                        else return message.channel.send("Please specify correctly the giveaway's ID and the time you want to reduce with!");
                    }
                    if (ms(length) && !data[id]) return message.channel.send(`The giveaway with ID ${id} doesn't exist!`);
                    if (ms(length) > data[id].remaining - 5000) return message.channel.send("The time you want to reduce with is too much!");
                    if (data[id].ended) return message.channel.send("The giveaway has been ended!");
                    if (length <= 0) return message.channel.send("Please specify correctly the time you want to reduce with!");

                    data[id].remaining -= ms(length);
                    col.updateOne({ guildID: message.guild.id }, { $set: { "data": data }, $currentDate: { lastModified: true } });
                    message.channel.send(`Succesfully reduced ${ms(ms(length), { long: true })} from the giveaway with ID ${id}!`);
                });
            });
        }
        catch (err)
        {
            console.log(err);
        }
    }
}