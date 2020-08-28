const { RichEmbed, Collection } = require("discord.js");
const sleep = require("../../util/functions/sleep");
const userModel = require("../../models/users");
const guildModel = require("../../models/guilds");
let rarities = new Collection().set("c", ["Common", "\\⚫"]).set("u", ["Uncommon", "\\🟢"]).set("r", ["Rare", "\\🔴"]).set("e", ["Epic", "\\🟣"]).set("l", ["Legendary", "\\🟠"]);
let rarityColors = new Collection().set("c", "#A6A6A6").set("u", "#00FF00").set("r", "#F23A3A").set("e", "#713AF2").set("l", "#F2963A");
let prices = new Collection().set("c", 50).set("u", 100).set("r", 250).set("e", 500).set("l", 1000);
let chances = new Collection().set("r", 21).set("e", 11);

module.exports =
{
    config:
    {
        name: "weekly",
        description: "- Opens your weekly item\n \u200b \u200b \u200b - It will be at least a rare item\n \u200b \u200b \u200b - You can open it in every 7 days",
        usage: "weekly",
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
                            if (model1.lastweekly && Date.now() - model1.lastweekly < 604800000) return message.channel.send("You can only open your weekly item every 7 days!");

                            let chance = Math.floor(Math.random() * 99) + 1;
                            let rarity = (chance < chances.get("r")) ? ((chance < chances.get("e")) ? "l" : "e") : "r";

                            let embed = new RichEmbed()
                                .setColor("#FFB900")
                                .setAuthor(`${message.author.tag}`, message.author.avatarURL)
                                .setTitle("\\🎁Opening")
                                .setTimestamp();

                            model1.inventory[rarity]++;

                            await userModel.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { inventory: model1.inventory, lastweekly: Date.now() });

                            message.channel.send(embed).then(async msg =>
                            {
                                await sleep(1000);

                                embed.setTitle("\\🎁Opening.");
                                msg.edit(embed).catch(err => {});

                                await sleep(1000);

                                embed.setTitle("\\🎁Opening..");
                                msg.edit(embed).catch(err => {});

                                await sleep(1000);

                                embed.setTitle("\\🎁Opening...");
                                msg.edit(embed).catch(err => {});

                                await sleep(1000)

                                embed.setColor(rarityColors.get(rarity));
                                embed.setTitle("\\🎁Here's your weekly item!");
                                embed.setDescription(`**Rarity:** ${rarities.get(rarity)[1] + rarities.get(rarity)[0]}\n**Value:** \`${prices.get(rarity)} ${model.currency}\``);

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