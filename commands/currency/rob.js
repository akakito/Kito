const userModel = require("../../models/users");
const guildModel = require("../../models/guilds");

module.exports =
{
    config:
    {
        name: "rob",
        description: "- Robs the specified amount of money from the mentioned member\n \u200b \u200b \u200b - There's 50% chance that you'll be successful\n \u200b \u200b \u200b - You can't rob items\n \u200b \u200b \u200b - You can rob in every 15 minutes",
        usage: "rob [@member] [amount]",
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
                    let id = (args[0]) ? args[0].slice(3, args[0].length -1) : undefined;
                    let member = message.mentions.members.first();
                    let amount = args[1];
                    let aCorrect = (amount) ? !isNaN(amount) : false;
                    let mCorrect = (member) ? member.id === id: false;

                    if (!id) return message.channel.send("Please mention the member whom you want to rob money from, and specify the money amount!");
                    if (!amount)
                    {
                        if (mCorrect) return message.channel.send("Please specify the money amount!");
                        else return message.channel.send("Please mention correctly the member whom you want to rob money from, and specify the money amount!");
                    }
                    if (!mCorrect)
                    {
                        if (aCorrect) return message.channel.send("Please mention correctly the member whom you want to rob money from!");
                        else return message.channel.send("Please mention correctly the member whom you want to rob money from, and specify correctly the money amount!");
                    }
                    if (!aCorrect) return message.channel.send("Please specify correctly the money amount!");

                    amount = parseInt(amount);

                    if (amount <= 0) return message.channel.send("Please specify correctly the money amount!");

                    if (id === message.author.id) return message.channel.send("You can't rob from yourself!");
                    if (id === bot.user.id) return message.channel.send("You can't rob from me!");

                    await userModel.findOne({ guildID: message.guild.id, userID: message.author.id }, async (err, model1) =>
                    {
                        if (err) console.log(err);

                        if (model1 !== null)
                        {
                            if (model1.lastrobbed && Date.now() - model1.lastrobbed < 900000) return message.channel.send("You can only rob every 15 minutes!");


                            await userModel.findOne({ guildID: message.guild.id, userID: id }, async (err1, model2) =>
                            {
                                if (err1) console.log(err1);

                                if (model2 !== null)
                                {
                                    if (model2.money < amount) return message.channel.send("You can't rob more money than the amount that the mentioned member have in his/her wallet!");
                                    if (model1.money < amount) return message.channel.send(`You need at least \`${amount} ${model.currency}\` to rob, in case you get caught!`);

                                    let rand = Math.floor(Math.random() * 99) + 1;

                                    if (rand < 51)
                                    {
                                        model2.money -= amount;
                                        model1.money += amount;
                                        message.channel.send(`\\✅<@${message.author.id}>, your robbing was successfull! You robbed \`${amount} ${model.currency}\`!`);
                                        member.send(`**${message.author.tag}** robbed \`${amount} ${model.currency}\` from you in the \`${message.guild.name}\` server!`);
                                    }
                                    else
                                    {
                                        model1.money -= amount;
                                        model2.money += amount;
                                        message.channel.send(`\\❌<@${message.author.id}>, you got caught! You needed to pay a \`${amount} ${model.currency}\` penalty!`);
                                        member.send(`**${message.author.tag}** tried to rob from you in the \`${message.guild.name}\` server, but he/she revealed! **${message.author.tag}** paid \`${amount} ${model.currency}\` to you as the penalty!`);
                                    }

                                    await userModel.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { money: model1.money, lastrobbed: Date.now() });
                                    await userModel.findOneAndUpdate({ guildID: message.guild.id, userID: id }, { money: model2.money });
                                }
                            });
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