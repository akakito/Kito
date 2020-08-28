const { RichEmbed, Collection } = require("discord.js");
const sleep = require("../../util/functions/sleep");
const userModel = require("../../models/users");
const guildModel = require("../../models/guilds");
let format = new Collection().set("common", "c").set("uncommon", "u").set("rare", "r").set("epic", "e").set("legendary", "l");
let rarities = new Collection().set("c", ["Common", "\\⚫"]).set("u", ["Uncommon", "\\🟢"]).set("r", ["Rare", "\\🔴"]).set("e", ["Epic", "\\🟣"]).set("l", ["Legendary", "\\🟠"]);
let rarityColors = new Collection().set("c", "#A6A6A6").set("u", "#00FF00").set("r", "#F23A3A").set("e", "#713AF2").set("l", "#F2963A");
let prices = new Collection().set("c", 300).set("u", 400).set("r", 850).set("e", 1700).set("l", 2200);
let itemPrices = new Collection().set("c", 50).set("u", 100).set("r", 250).set("e", 500).set("l", 1000);
let chances = new Collection().set("c", [51, 61, 71, 81, 91]).set("u", [26, 26, 36, 46, 56]).set("r", [14, 14, 14, 24, 34]).set("e", [6, 6, 6, 6, 16]);

function randomItem(chance, i)
{
    return (chance < chances.get("c")[i]) ? ((chance < chances.get("u")[i]) ? ((chance < chances.get("r")[i]) ? ((chance < chances.get("e")[i]) ? "l" : "e") : "r") : "u") : "c";
}

module.exports =
{
    config:
    {
        name: "lootbox",
        description: "- Buys a lootbox with the specified rarity and opens it\n \u200b \u200b \u200b - Every lootbox contains 5 items\n \u200b \u200b \u200b - The higher the lootbox's rarity is, the higher chance to get higher rarity items\n \u200b \u200b \u200b - An uncommon lootbox includes at least 1 uncommon, a rare lootbox includes at least 1 rare, etc.",
        usage: "lootbox (common|uncommon|rare|epic|legendary)",
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

                            if (!rarity) return message.channel.send("Please specify the lootbox's rarity (common|uncommon|rare|epic|legendary)!");
                            if (!rCorrect) return message.channel.send("Please specify correctly the lootbox's rarity (common|uncommon|rare|epic|legendary)!");

                            let origRarity = rarity;
                            rarity = format.get(rarity);
                            let i = ["c", "u", "r", "e", "l"].indexOf(rarity);

                            if (model1.money < prices.get(rarity)) return message.channel.send(`You need at least \`${prices.get(rarity)} ${model.currency}\` to buy a${(rarity === "u") ? "n" : ""} ${origRarity} lootbox!`)

                            if (Date.now() - model1.lastloot < 1800000) return message.channel.send("You can only open a lootbox every 30 minutes!");

                            let loot = [rarity, randomItem(Math.floor(Math.random() * 99) + 1, i), randomItem(Math.floor(Math.random() * 99) + 1, i), randomItem(Math.floor(Math.random() * 99) + 1, i), randomItem(Math.floor(Math.random() * 99) + 1, i)]

                            let description = "";
                            loot.forEach(l =>
                            {
                                model1.inventory[l]++;
                                description += `${rarities.get(l)[1]}**${rarities.get(l)[0]}** - \`${itemPrices.get(l)} ${model.currency}\`\n`
                            });

                            model1.money -= prices.get(rarity);

                            await userModel.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { money: model1.money, inventory: model1.inventory, lastloot: Date.now() });

                            let embed = new RichEmbed()
                                .setColor("#946800")
                                .setAuthor(`${message.author.tag}`, message.author.avatarURL)
                                .setTitle("\\📦Opening")
                                .setTimestamp();

                            message.channel.send(embed).then(async msg =>
                            {
                                await sleep(1000);

                                embed.setTitle("\\📦Opening.");
                                msg.edit(embed).catch(err => {});

                                await sleep(1000);

                                embed.setTitle("\\📦Opening..");
                                msg.edit(embed).catch(err => {});

                                await sleep(1000);

                                embed.setTitle("\\📦Opening...");
                                msg.edit(embed).catch(err => {});

                                await sleep(1000)

                                embed.setColor(rarityColors.get(rarity));
                                embed.setTitle("\\📦You got:");
                                embed.setDescription(description);

                                msg.edit(embed).catch(err => {});
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