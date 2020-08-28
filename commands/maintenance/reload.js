const { readFileSync } = require("fs");

module.exports =
{
    config:
    {
        name: "reload",
        description: "- Reloads the specified command",
        usage: "reload [command]",
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

            let command = args[0].toLowerCase();

            if (!command) return message.channel.send("Please specify the command that you want to reload!");
            if (!bot.commandNames.includes(command)) return message.channel.send("Please specify correctly the command that you want to reload!");

            try
            {
                delete require.cache[require.resolve(`../${bot.category.get(command)}/${command}.js`)];
                bot.commands.delete(command);
                let pull = require(`../${bot.category.get(command)}/${command}.js`);
                bot.commands.set(command, pull);
                message.channel.send(`Successfully reloaded the \`${command}\` command!`);
            }
            catch (err)
            {
                console.log(err);
                message.channel.send(`Couldn't reload the \`${command}\` command!`);
            }
        }
        catch(err)
        {
            console.log(err);
        }
    }
}