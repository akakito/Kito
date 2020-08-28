const { RichEmbed } = require("discord.js");
const weather = require("weather-js");
const guildModel = require("../../models/guilds");

module.exports =
{
    config:
    {
        name: "weather",
        description: "- Gets the current weather in the specified location in",
        usage: "weather [location]",
        category: "tools",
        accessableby: "Member",
        permissions: ["NOTHING"]
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
                    if (!args[0]) return message.channel.send("Please specify the location that you want to get the weather for!");

                    if (model.degreetype === "c")
                    {
                        weather.find({search: args.join(" "), degreeType: "C"}, (err, result) =>
                        {
                            if (err) console.log(err);

                            if (result.length === 0) return message.channel.send("Please enter a valid location!");

                            var current = result[0].current;

                            let embed = new RichEmbed()
                                .setDescription(`**${current.skytext}**`)
                                .setAuthor(`Weather for ${current.observationpoint}`, current.imageUrl)
                                .setThumbnail(current.imageUrl)
                                .setColor("#00FFFF")
                                .addField("Temperature",`${current.temperature}°C`)
                                .addField("Feels Like", `${current.feelslike}°C`)
                                .addField("Winds", current.winddisplay)
                                .addField("Humidity", `${current.humidity}%`);

                            message.channel.send(embed);
                        });
                    }
                    else
                    {
                        weather.find({search: args.join(" "), degreeType: "F"}, (err, result) =>
                        {
                            if (err) console.log(err);

                            if (result.length === 0) return message.channel.send("Please enter a valid location!");

                            var current = result[0].current;

                            let embed = new RichEmbed()
                                .setDescription(`**${current.skytext}**`)
                                .setAuthor(`Weather for ${current.observationpoint}`, current.imageUrl)
                                .setThumbnail(current.imageUrl)
                                .setColor("#00FFFF")
                                .addField("Temperature",`${current.temperature}°F`)
                                .addField("Feels Like", `${current.feelslike}°F`)
                                .addField("Winds", current.winddisplay)
                                .addField("Humidity", `${current.humidity}%`);

                            message.channel.send(embed);
                        });
                    }
                }
            });
        }
        catch (err)
        {
            console.log(err);
        }
    }
}