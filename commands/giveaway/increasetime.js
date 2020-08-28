const ms = require("ms");
const mongodb = require("mongodb");

module.exports =
{
    config:
    {
        name: "increasetime",
        description: "- Increases a giveaway's length with the specified time",
        usage: "increasetime [ID] [length]",
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

                    if (!id) return message.channel.send("Please specify the giveaway's ID and the time you want to increase with!");
                    if (!length)
                    {
                        if (data[id]) return message.channel.send("Please specify the time you want to increase with!");
                        else return message.channel.send("Please specify the time you want to increase with, and specify correctly the giveaway's ID!");
                    }
                    if (!ms(length))
                    {
                        if (data[id]) return message.channel.send("Please specify correctly the time you want to increase with!");
                        else return message.channel.send("Please specify correctly the time you want to increase with and the giveaway's ID!");
                    }
                    if (!data[id]) return message.channel.send(`The giveaway with ID ${id} doesn't exist!`);
                    if (data[id].remaining + ms(length) > 2147483647) return message.channel.send("The time you want to increase with is too much!");
                    if (data[id].ended) return message.channel.send("The giveaway has been ended!");
                    if (length <= 0) return message.channel.send("Please specify correctly the time you want to increase with!");


                    data[id].remaining += ms(length);
                    col.updateOne({ guildID: message.guild.id }, { $set: { "data": data }, $currentDate: { lastModified: true } });
                    message.channel.send(`Succesfully increased the giveaway with ID ${id} with ${ms(ms(length), { long: true })}!`);
                });
            });
        }
        catch (err)
        {
            console.log(err);
        }
    }
}