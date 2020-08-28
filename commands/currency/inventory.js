const { RichEmbed, Collection } = require("discord.js");
const userModel = require("../../models/users");
const guildModel = require("../../models/guilds");

module.exports =
{
    config:
    {
        name: "inventory",
        description: "- Shows your money in your wallet and in your bank, and shows your items",
        usage: "inventory",
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
                                .setAuthor(`${message.author.tag}`, message.author.avatarURL)
                                .setTitle("\\🎒Inventory")
                                .setDescription(`\\👛**Wallet:** \`${model1.money} ${model.currency}\`\n\\💹**Bank:** \`${model1.bank} ${model.currency}\`\n**Items**\n \u200b \u200b \u200b \\⚫**Common:** ${model1.inventory.c}\n \u200b \u200b \u200b \\🟢**Uncommon:** ${model1.inventory.u}\n \u200b \u200b \u200b \\🔴**Rare:** ${model1.inventory.r}\n \u200b \u200b \u200b \\🟣**Epic:** ${model1.inventory.e}\n \u200b \u200b \u200b \\🟠**Legendary:** ${model1.inventory.l}`)
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