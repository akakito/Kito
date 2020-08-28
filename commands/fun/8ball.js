const randomColor = require("randomcolor");
const { RichEmbed, MessageCollector } = require("discord.js");
const guildModel = require("../../models/guilds");
const userModel = require("../../models/users");

module.exports =
{
    config:
    {
        name: "8ball",
        description: "- Generates a random number between 1 and 25 and you need to guess it with !tip [1-25]",
        usage: "8ball",
        category: "fun",
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
                    await userModel.findOne({ guildID: message.guild.id, userID: message.author.id }, async (err, model1) =>
                    {
                        if (err) console.log(err);

                        if (model1 !== null)
                        {
                            let prefix = model.prefix;

                            let num = Math.floor(Math.random() * 24) + 1;

                            let color = randomColor();

                            let embed1 = new RichEmbed()
                                .setAuthor(bot.user.username, bot.user.avatarURL)
                                .setColor(color)
                                .setTitle("I thought of a number.")
                                .setDescription(`Guess the number between 1 and 25 with the following command: \`${prefix}tip [number]\``)
                                .setTimestamp();

                            message.channel.send(embed1).then(msg =>
                            {
                                const collector = new MessageCollector(message.channel, m => m.author.id === message.author.id && (m.content.startsWith(`${prefix}tip`) ||  m.content === `${prefix}cancel`), { time: 20000 });

                                collector.on("collect", async m =>
                                {
                                    let mArray = m.content.split(" ").filter(str => { return /\S/.test(str); });
                                    if (m.content === `${prefix}cancel`) collector.stop("time");
                                    else if (!mArray[1]) collector.stop("undefined");
                                    else if (isNaN(mArray[1])) collector.stop("NaN");
                                    else
                                    {
                                        let tip = parseFloat(mArray[1]);
                                        if (tip > 0)
                                        {
                                            if (tip === num) collector.stop("correct");
                                            else collector.stop("incorrect");
                                        }
                                    }
                                });
                                collector.on("end", async (_, reason) =>
                                {
                                    if (reason === "time")
                                    {
                                        let embed2 = new RichEmbed()
                                            .setAuthor(bot.user.username, bot.user.avatarURL)
                                            .setColor(color)
                                            .setTitle("Canceled...")
                                            .setDescription("No one will ever know what was the correct number,...")
                                            .setTimestamp();

                                        message.channel.send(embed2);
                                    }
                                    if (reason === "undefined" || reason === "NaN")
                                    {
                                        let embed2 = new RichEmbed()
                                            .setAuthor(bot.user.username, bot.user.avatarURL)
                                            .setColor(color)
                                            .setTitle("You didn't write a number!")
                                            .setDescription("No one will ever know what was the correct number,...")
                                            .setTimestamp();

                                        message.channel.send(embed2);
                                    }
                                    if (reason === "correct")
                                    {
                                        await userModel.findOneAndUpdate({ userID: message.author.id }, { money: model1.money + 100 });

                                        let embed2 = new RichEmbed()
                                            .setAuthor(bot.user.username, bot.user.avatarURL)
                                            .setColor(color)
                                            .setTitle("You figure it out!")
                                            .setDescription(`The correct number was ${num}, and you figure it out! Your reward is: \`100 ${model.currency}\``)
                                            .setTimestamp();

                                        message.channel.send(embed2);
                                    }
                                    if (reason === "incorrect")
                                    {
                                        let embed2 = new RichEmbed()
                                            .setAuthor(bot.user.username, bot.user.avatarURL)
                                            .setColor(color)
                                            .setTitle("You didn't figure it out,...")
                                            .setDescription(`The correct number was ${num}, and you didn't figure it out,...`)
                                            .setTimestamp();

                                        message.channel.send(embed2);
                                    }
                                });
                            });
                        }
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