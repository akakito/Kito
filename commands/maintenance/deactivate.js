const { readFileSync } = require("fs");

module.exports =
{
    config:
    {
        name: "deactivate",
        description: "- Deactivates the bot",
        usage: "deactivate",
        category: "maintenance",
        accessableby: "Bot owner",
        permissions: ["BOT_OWNER"]
    },
    run: (bot, message, args) =>
    {
        try
        {
            const { me } = JSON.parse(readFileSync("./data/botconfig.json"));

            if (message.author.id !== me) return message.channel.send("Only the bot's owner can use this command!");
            if (!bot.active) return message.channel.send("The bot is already deactivated!");

            bot.active = false;

            message.channel.send("Successfully deactivated the bot!");
        }
        catch(err)
        {
            console.log(err);
        }
    }
}