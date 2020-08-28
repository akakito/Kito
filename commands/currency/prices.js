const { RichEmbed, Collection } = require("discord.js");
const userModel = require("../../models/users");
const guildModel = require("../../models/guilds");
let prices = new Collection().set("c", [75, 50]).set("u", [150, 100]).set("r", [375, 250]).set("e", [750, 500]).set("l", [1500, 1000]);
let lootboxPrices = new Collection().set("c", 300).set("u", 400).set("r", 850).set("e", 1700).set("l", 2200);

module.exports =
{
    config:
    {
        name: "prices",
        description: "- Shows the buying and selling prices for the items, and shows the buying prices for the lootboxes",
        usage: "prices",
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
                    await userModel.findOne({ guildID: message.guild.id, userID: message.author.id }, (err, model1) =>
                    {
                        if (err) console.log(err);

                        if (model1 !== null)
                        {
                            let embed = new RichEmbed()
                                .setColor("#F03A17")
                                .setTitle("\\💲Prices")
                                .setDescription(`__**Buying lootboxes**__\n \u200b \u200b \u200b \\⚫**Common:** \`${lootboxPrices.get("c")} ${model.currency}\`\n \u200b \u200b \u200b \\🟢**Uncommon:** \`${lootboxPrices.get("u")} ${model.currency}\`\n \u200b \u200b \u200b \\🔴**Rare:** \`${lootboxPrices.get("r")} ${model.currency}\`\n \u200b \u200b \u200b \\🟣**Epic:** \`${lootboxPrices.get("e")} ${model.currency}\`\n \u200b \u200b \u200b \\🟠**Legendary:** \`${lootboxPrices.get("l")} ${model.currency}\`\n\n__**Buying items**__\n \u200b \u200b \u200b \\⚫**Common:** \`${prices.get("c")[0]} ${model.currency}\`\n \u200b \u200b \u200b \\🟢**Uncommon:** \`${prices.get("u")[0]} ${model.currency}\`\n \u200b \u200b \u200b \\🔴**Rare:** \`${prices.get("r")[0]} ${model.currency}\`\n \u200b \u200b \u200b \\🟣**Epic:** \`${prices.get("e")[0]} ${model.currency}\`\n \u200b \u200b \u200b \\🟠**Legendary:** \`${prices.get("l")[0]} ${model.currency}\`\n\n__**Selling items**__\n \u200b \u200b \u200b \\⚫**Common:** \`${prices.get("c")[1]} ${model.currency}\`\n \u200b \u200b \u200b \\🟢**Uncommon:** \`${prices.get("u")[1]} ${model.currency}\`\n \u200b \u200b \u200b \\🔴**Rare:** \`${prices.get("r")[1]} ${model.currency}\`\n \u200b \u200b \u200b \\🟣**Epic:** \`${prices.get("e")[1]} ${model.currency}\`\n \u200b \u200b \u200b \\🟠**Legendary:** \`${prices.get("l")[1]} ${model.currency}\``)
                                .setTimestamp();

                            message.channel.send(embed);
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