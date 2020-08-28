const { RichEmbed } = require("discord.js");
const guildModel = require("../../models/guilds");

module.exports =
{
    config:
    {
        name: "sendverification",
        description: "- Sends the verification message\n \u200b \u200b \u200b - When somebody reacts with the ✅ emoji to the message, he/she'll receive the default role",
        usage: "sendverification",
        category: "tools",
        accessableby: "Administrator permission",
        permissions: ["ADMINISTRATOR"]
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
                    const embed = new RichEmbed()
                        .setColor("#16C60C")
                        .setAuthor("\✅Verification")
                        .setDescription("Please react to this message with the ✅ emoji to prove that you're not a bot!");

                    await message.channel.send(embed).then(async msg =>
                    {
                        await guildModel.findOneAndUpdate({ guildID: message.guild.id }, { verificationmessage: msg.id });
                        msg.react("✅");
                    });

                    message.delete();
                }
            });
        }
        catch(err)
        {
            console.log(err);
        }
    }
}