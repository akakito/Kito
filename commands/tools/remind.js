const ms = require("ms");

module.exports =
{
    config:
    {
        name: "remind",
        description: "- Sets a reminder for you that will remind you after the specified time",
        usage: "remind [time] [the thing that you want me to remind you of (it can be multiple words)]",
        category: "tools",
        accessableby: "Member",
        permissions: ["NOTHING"]
    },
    run: async (bot, message, args) =>
    {
        try
        {
            let time = args[0];

            if (!args[0]) return message.channel.send("Please specify the time after which you will want the reminder, and specify the thing that you want me to remind you of!");

            time = ms(time);

            if (!args[1])
            {
                if (correct) return message.channel.send("Please specify the thing that you want me to remind you of!");
                else return message.channel.send("Please specify correctly the time after which you will want the reminder, and specify the thing that you want me to remind you of!");
            }

            message.channel.send("Successfully set the reminder!");

            let str = `Just a reminder:\`\`\`${args.slice(1).join(" ")}\`\`\``;
            setTimeout(() => message.member.send(str), time);
        }
        catch(err)
        {
            console.log(err);
        }
    }
}