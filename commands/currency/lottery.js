const { RichEmbed } = require("discord.js");
const userModel = require("../../models/users");
const guildModel = require("../../models/guilds");

module.exports =
{
    config:
    {
        name: "lottery",
        description: "- Buys a lottery ticket for the specified price\n \u200b \u200b \u200b - There'll be 15% that you won 10 times the price\n \u200b \u200b \u200b - You can buy a lottery ticket in every hour",
        usage: "lottery [price]",
        category: "currency",
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
                            let amount = args[0];

                            if (!amount) return message.channel.send("Please specify the amount of money that you want to buy the lottery ticket for!");
                            if (isNaN(amount)) return message.channel.send("Please specify correctly the amount of money that you want to buy the lottery ticket for!");

                            amount = parseInt(amount);

                            if (amount <= 0) return message.channel.send("Please specify correctly the amount of money that you want to buy the lottery ticket for!");
                            if (amount > model1.money) return message.channel.send("You can’t pay more than you have in your wallet!");
                            if (model1. lastlottery && Date.now() - model1.lastlottery < 360000) return message.channel.send("You can only buy one lottery ticket in every hour!");

                            let chance = Math.floor(Math.random() * 99);
                            let won = false;

                            if (chance < 15) won = true;

                            if (won)
                            {
                                model1.money += amount * 10;
                                message.channel.send(`\\✅<@${message.author.id}>, you won! Your prize: \`${amount * 10} ${model.currency}\``);
                            }
                            else
                            {
                                model1.money -= amount;
                                message.channel.send(`\\❌<@${message.author.id}>, you lost!`);
                            }

                            await userModel.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { money: model1.money, lastlottery: Date.now() });
                        }
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