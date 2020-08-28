module.exports =
{
    config:
    {
        name: "clear",
        description: "- Deletes the specified amount of messages",
        usage: "clear [1-99]",
        category: "tools",
        accessableby: "Manage messages permission",
        permissions: ["MANAGE_MESSAGES"]
    },
    run: async (bot, message, args) =>
    {
        try
        {
            if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("You don't have permission to use this command!");

            if (!args[0]) return message.channel.send("Please specify how many messages do you want to delete!");

            if (isNaN(args[0])) return message.channel.send("Please specify a valid number for the amount!");

            if (parseInt(args[0]) > 99) return message.channel.send("You can delete maximum of 99 messages at one time!");

            if (args[0] <= 0) return message.channel.send("Please specify a valid number for the amount!");

            let log = `${args[0]} messages deleted!`;

            message.channel.bulkDelete(parseInt(args[0]) + 1).then(() =>
            {
                message.channel.send(log).then(m =>  m.delete(5000).catch(err => {}) );
            }).catch(err => { return message.channel.send("You can't delete messages that are older than 2 weeks!"); });
        }
        catch(err)
        {
            console.log(err);
        }
    }
}