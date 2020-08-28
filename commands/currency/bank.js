const userModel = require("../../models/users");
const guildModel = require("../../models/guilds");

module.exports =
{
    config:
    {
        name: "bank",
        description: "- Places the specified amount of money to the bank for the specified number of hours\n \u200b \u200b \u200b - With each passing hour, the money placed into the bank will be 5% more",
        usage: "bank [amount] [number of hours]",
        category: "currency",
        accessableby: "Member",
        permissions: ["NOTHING"]
    },
    run: async (bot, message, args) =>
    {
        try
        {
            let amount = args[0];
            let hours = args[1];
            let aCorrect = (amount) ? !isNaN(amount) : false;
            let hCorrect = (hours) ? !isNaN(hours) : false;

            if (!amount) return message.channel.send("Please specify the amount of money that you want to place into the bank, and specify how many hours you want to put your money in the bank for!");
            if (!hours)
            {
                if (aCorrect) return message.channel.send("Please specify how many hours you want to put your money in the bank for!");
                else return message.channel.send("Please specify correctly the amount of money that you want to place into the bank, and specify how many hours you want to put your money in the bank for!");
            }
            if (!aCorrect)
            {
                if (hCorrect) return message.channel.send("Please specify correctly how many hours you want to put your money in the bank for!");
                else return message.channel.send("Please specify correctly the amount of money that you want to place into the bank, and specify correctly how many hours you want to put your money in the bank for!");
            }
            if (!hCorrect) return message.channel.send("Please specify correctly how many hours you want to put your money in the bank for!");

            amount = parseInt(amount);
            hours = parseInt(hours);

            if (hours <= 0 || amount <= 0)
            {
                if (hours <= 0 || amount <= 0) return message.channel.send("Please specify correctly the amount of money that you want to place into the bank, and specify correctly how many hours you want to put your money in the bank for!");
                else if (hours <= 0) return message.channel.send("Please specify correctly how many hours you want to put your money in the bank for!");
                else return message.channel.send("Please specify correctly how many hours you want to put your money in the bank for!");
            }

            let origAmount = amount;
            let origHours = hours;

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
                            if (model1.money < amount) return message.channel.send("You can't place more money into the bank than you have in your wallet!");
                            if (model1.bank > 0) return message.channel.send(`You already put money into the bank! You can view your bank balance with the ${model.prefix}inventory command`);

                            model1.money -= amount;
                            model1.bank += amount;
                            model1.hours = hours;

                            message.channel.send(`<@${message.author.id}>, successfully put \`${amount} ${model.currency}\` to the bank for **${hours} ${(hours === 1) ? "hour" : "hours"}**!`);

                            await userModel.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { money: model1.money, bank: model1.bank, orighours: origHours, origamount: origAmount, starttime: Date.now(), hours: model1.hours });

                            let interval = setInterval(async () =>
                            {
                                model1.hours--;

                                if (model1.hours === 0)
                                {
                                    model1.money += model1.bank;

                                    message.member.send(`<@${message.author.id}>, you've got your money back from the bank! It went from \`${origAmount} ${model.currency}\` to \`${model1.bank} ${model.currency}\` in ${origHours} **${(origHours === 1) ? "hour" : "hours"}**!`)

                                    await userModel.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { money: model1.money, bank: 0, orighours: 0, origamount: 0, starttime: 0, hours: 0 });

                                    return clearInterval(interval);
                                }
                                else
                                {
                                    model1.bank += Math.round(model1.bank * 0.05);
                                    await userModel.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { money: model1.money, bank: model1.bank, hours: model1.hours });
                                }

                            }, 3600000);
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