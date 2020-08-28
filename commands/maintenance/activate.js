const { readFileSync } = require("fs");

module.exports =
{
    config:
    {
        name: "activate",
        description: "- Activates the bot",
        usage: "activate",
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
            if (bot.active) return message.channel.send("The bot is already activated!");

            bot.active = true;

            message.channel.send("Successfully activated the bot!");
        }
        catch(err)
        {
            console.log(err);
        }
    }
}