const userModel = require("../../models/users");
const guildModel = require("../../models/guilds");

module.exports =
{
    config:
    {
        name: "send",
        description: "- Sends the specified amount of money from your wallet to the mentioned member",
        usage: "send [@member] [amount]",
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
                    if (!args[0]) return message.channel.send("Please mention the member whom you want to send money, and specify the money amount!");

                    let id = args[0].slice(3, args[0].length -1);
                    let member = message.mentions.members.first();
                    let amount = args[1];
                    let mCorrect = (member) ? member.id === id : false;
                    let aCorrect = (amount) ? !isNaN(amount) : false ;

                    if (!mCorrect)
                    {
                        if (!amount) return message.channel.send("Please mention correctly the member whom you want to send money, and specify the money amount!");
                        else
                        {
                            if (!aCorrect) return message.channel.send("Please mention the member whom you want to send money, and specify correctly the money amount!");
                            else return message.channel.send("Please mention the member whom you want to send money!");
                        }
                    }
                    if (!amount) return message.channel.send("Please and specify the money amount!");
                    if (!aCorrect) return message.channel.send("Please specify correctly the money amount!");

                    amount = parseInt(amount);

                    if (amount <= 0) return message.channel.send("Please specify correctly the money amount!");
                    if (id === message.author.id) return message.channel.send("You can't send money to yourself!");
                    if (id === bot.user.id) return message.channel.send("You can't send money to me!");

                    await userModel.findOne({ guildID: message.guild.id, userID: message.author.id }, async (err, model1) =>
                    {
                        if (err) console.log(err);

                        if (model1 !== null)
                        {
                            await userModel.findOne({ guildID: message.guild.id, userID: id }, async (err1, model2) =>
                            {
                                if (err1) console.log(err1);

                                if (model2 !== null)
                                {
                                    if (model1.money < amount) return message.channel.send("You can't send more money than the amount that you have in your wallet!");

                                    model1.money -= amount;
                                    model2.money += amount;

                                    await userModel.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { money: model1.money });
                                    await userModel.findOneAndUpdate({ guildID: message.guild.id, userID: id }, { money: model2.money });

                                    message.channel.send(`<@${message.author.id}>,  successfully sent \`${amount} ${model.currency}\` to <@${id}>!`);
                                    member.send(`You received \`${amount} ${model.currency}\` from **${message.author.tag}** in the \`${message.guild.name}\` server!`);
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