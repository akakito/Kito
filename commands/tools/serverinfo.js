const { RichEmbed } = require("discord.js");
const { utc } = require("moment");
const randomColor = require("randomcolor");

module.exports =
{
    config:
    {
        name: "serverinfo",
        description: "- Shows info about the server",
        usage: "servernfo",
        category: "tools",
        accessableby: "Member",
        permissions: ["NOTHING"]
    },
    run: async (bot, message, args) =>
    {
        try
        {
            let members = 0;
            let bots = 0;

            await message.guild.members.forEach(m =>
            {
                if (!m.user.bot) members++;
                else bots++;
            });

            let embed = new RichEmbed()
                .setAuthor(message.guild.name, message.guild.iconURL)
                .setColor(randomColor())
                .addField("**Owner**", message.guild.owner.user.tag, true)
                .addField("**ID**", message.guild.id, true)
                .addField("**Members**", members, true)
                .addField("**Bots**", bots, true)
                .addField("**Channels**", message.guild.channels.size, true)
                .addField("**Roles**", message.guild.roles.size, true)
                .addField("**Creation date**", utc(message.guild.createdAt).format("dddd, MMMM Do, YYYY"), true)
                .addField("\\❌**Offline**", message.guild.members.filter(m => m.presence.status === "offline").size, true)
                .addField("\\🟢**Online**", message.guild.members.filter(m => m.presence.status === "online").size, true)
                .addField("\\🟡**Idle**", message.guild.members.filter(m => m.presence.status === "idle").size, true)
                .addField("\\🔴**Do not disturb**", message.guild.members.filter(m => m.presence.status === "dnd").size, true)
                .addField("\\🟣**Streaming**", message.guild.members.filter(m => m.presence.status === "streaming").size, true)
                .setThumbnail(message.guild.iconURL)
                .setTimestamp();

            message.channel.send(embed);
        }
        catch(err)
        {
            console.log(err);
        }
    }
}