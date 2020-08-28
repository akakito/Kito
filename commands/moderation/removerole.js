module.exports =
{
    config:
    {
        name: "removerole",
        description: "- Takes away the mentioned role from the mentioned member",
        usage: "removerole [@member] [@role]",
        category: "moderation",
        accessableby: "Manage roles permission",
        permissions: ["MANAGE_ROLES"]
    },
    run: (bot, message, args) =>
    {
        try
        {
            if (!message.member.hasPermission("MANAGE_ROLES")) return message.channel.send("You don't have permission to use this command!");

            let mention = args[0];

            let id;
            if (mention)
            {
                id = args[0].slice(3).slice(0, -1);
            }

            let member = message.mentions.members.first();

            let roleName = args[1];
            let roleID;
            if (roleName) roleID = roleName.slice(3, roleName.length - 1);

            let guildRole = message.guild.roles.get(roleID);

            let correct = false;
            if (member)
            {
                if (member.id === id) correct = true;
            }

            if (guildRole && correct)
            {
                if (guildRole.position >= message.member.highestRole.position) return message.channel.send("You can't take away a role that's higher than your role!");

                if (!message.guild.members.get(member.id)) return message.channel.send("The mentioned member is not in the server!");
            }

            if (!mention || !guildRole || !correct)
            {
                if (!mention) return message.channel.send("Please mention the member from whom you want to take away the role, and mention the role that you want to take away to from the member!");
                if (!roleName)
                {
                    if (correct) return message.channel.send("Please mention the role that you want to take away from the member!");
                    else return message.channel.send("Please mention the role that you want to take away from the member, and mention correctly the member from whom you want to take away the role!");
                }
                if (!correct)
                {
                    if (guildRole) return message.channel.send("Please mention correctly the member from whom you want to take away the role!");
                    else return message.channel.send("Please mention correctly the member from whom you want to take away the role, and mention correctly the role that you want to take away from the member!");
                }
                if (!guildRole) return message.channel.send("Please mention correctly the role that you want to take away from the member!");
            }

            member.removeRole(guildRole).catch(err =>{});

            message.channel.send(`Successfully took away the <@&${roleID}> role to <@${id}>!`);
        }
        catch(err)
        {
            console.log(err);
        }
    }
}