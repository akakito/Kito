const { Collection } = require("discord.js");
const userModel = require("../../models/users");
const guildModel = require("../../models/guilds");
let format = new Collection().set("common", "c").set("uncommon", "u").set("rare", "r").set("epic", "e").set("legendary", "l");
let prices = new Collection().set("c", 75).set("u", 150).set("r", 375).set("e", 750).set("l", 1500);

module.exports =
{
    config:
    {
        name: "buy",
        description: "- Buys the specified amount of the items with the specified rarity\n \u200b \u200b \u200b - Use !prices if you want to know the prices\n \u200b \u200b \u200b - Items are good because they can't be robbed from you",
        usage: "buy [common|uncommon|rare|epic|legendary] (amount - if not specified, it'll be 1)",
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
                            let rarity = args[0];
                            if (rarity) rarity = rarity.toLowerCase();
                            let rCorrect = (rarity) ? ["common", "uncommon", "rare", "epic", "legendary"].includes(rarity) : false;
                            let amount = args[1];
                            let aCorrect = (amount) ? !isNaN(amount) : true;
                            if (!amount) amount = 1;

                            if (!rarity) return message.channel.send("Please specify the item's rarity (common|uncommon|rare|epic|legendary) and the amount that you want to buy!");
                            if (!rCorrect)
                            {
                                if (aCorrect) return message.channel.send("Please specify correctly the item's rarity (common|uncommon|rare|epic|legendary)!");
                                else return message.channel.send("Please specify correctly the item's rarity (common|uncommon|rare|epic|legendary) and the amount that you want to buy!");
                            }
                            if (!aCorrect) return message.channel.send("Please specify correctly the amount that you want to buy!");

                            let shortRarity = format.get(rarity);
                            amount = parseInt(amount);

                            if (prices.get(shortRarity) * amount > model1.money) return message.channel.send("You can't buy for more money than you have in your wallet!");
                            if (amount <= 0) return message.channel.send("Please specify a valid number as the amount!");

                            model1.inventory[shortRarity] += amount;

                            let price = prices.get(shortRarity) * amount;
                            model1.money -= price;

                            await userModel.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { inventory: model1.inventory, money: model1.money });

                            message.channel.send(`<@${message.author.id}>, successfully bought **${amount} ${rarity}** ${(amount === 1) ? "item" : "items"} for \`${price} ${model.currency}!\``);
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