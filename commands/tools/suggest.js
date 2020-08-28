module.exports =
{
    config:
    {
        name: "suggest",
        description: "- Sends your suggestion to the server's owner",
        usage: "suggest [suggestion (it can be multiple words)]",
        category: "tools",
        accessableby: "Member",
        permissions: ["NOTHING"]
    },
    run: (bot, message, args) =>
    {
        try
        {
            if (!args[0]) return message.channel.send("Please specify your suggestion!");

            let suggestion = args.join(" ");

            message.guild.owner.send(`**${message.author.tag}** suggested this:\`\`\`${suggestion}\`\`\``);
            message.channel.send("Your suggestion has been sent to the server's owner!");
        }
        catch(err)
        {
            console.log(err);
        }
    }
}