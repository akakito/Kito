const { Collection } = require("discord.js");
const userModel = require("../../models/users");
const guildModel = require("../../models/guilds");
let format = new Collection().set("common", "c").set("uncommon", "u").set("rare", "r").set("epic", "e").set("legendary", "l");
let prices = new Collection().set("c", 50).set("u", 100).set("r", 250).set("e", 500).set("l", 1000);

module.exports =
{
    config:
    {
        name: "sell",
        description: "- Sells the specified amount of the items with the specified rarity",
        usage: "sell [common|uncommon|rare|epic|legendary|all] (amount - if not specified, it'll be 1)",
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
                            let rCorrect = (rarity) ? ["common", "uncommon", "rare", "epic", "legendary", "all"].includes(rarity) : false;
                            let amount = args[1];
                            let aCorrect = (amount) ? !isNaN(amount) : true;
                            if (!amount) amount = 1;

                            if (!rarity) return message.channel.send("Please specify the item's rarity (common|uncommon|rare|epic|legendary) and the amount that you want to sell!");
                            if (!rCorrect)
                            {
                                if (aCorrect) return message.channel.send("Please specify correctly the item's rarity (common|uncommon|rare|epic|legendary)!");
                                else return message.channel.send("Please specify correctly the item's rarity (common|uncommon|rare|epic|legendary) and the amount that you want to sell!");
                            }
                            if (!aCorrect) return message.channel.send("Please specify correctly the amount that you want to sell!");

                            amount = parseInt(amount);

                            if (rarity === "all")
                            {
                                let price = 0;

                                ["c", "u", "r", "e", "l"].forEach(r =>
                                {
                                    amount = model1.inventory[r];
                                    model1.inventory[r] = 0;

                                    price += prices.get(r) * amount;
                                });

                                if (price === 0) return message.channel.send("You don't have any items in your inventory!")

                                model1.money += price;

                                await userModel.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { inventory: model1.inventory, money: model1.money });

                                message.channel.send(`<@${message.author.id}>, successfully sold **all** items for \`${price} ${model.currency}\`!`);
                            }
                            else
                            {
                                let shortRarity = format.get(rarity);

                                if (amount > model1.inventory[shortRarity]) return message.channel.send("You can't sell more items than you have in your inventory!");
                                if (amount <= 0) return message.channel.send("Please specify a valid number as the amount!");

                                model1.inventory[shortRarity] -= amount;

                                let price = prices.get(shortRarity) * amount;
                                model1.money += price;

                                await userModel.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { inventory: model1.inventory, money: model1.money });

                                message.channel.send(`<@${message.author.id}>, successfully sold **${amount} ${rarity}** ${(amount === 1) ? "item" : "items"} for \`${price} ${model.currency}\`!`);
                            }
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