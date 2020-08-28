const { RichEmbed, Collection } = require("discord.js");
const { readFileSync } = require("fs");
const randomColor = require("randomcolor");
const guildModel = require("../../models/guilds");

module.exports =
{
    config:
    {
        name: "help",
        description: "- Writes out all commands",
        usage: "help",
        category: "tools",
        accessableby: "Member",
        permissions: ["NOTHING"]
    },
    run: async (bot, message, args) =>
    {
        try
        {
            const { me } = JSON.parse(readFileSync("./data/botconfig.json"));

            await guildModel.findOne({ guildID: message.guild.id }, (err, model) =>
            {
                if (err) console.log(err);

                if (model !== null)
                {
                    let prefix = model.prefix;

                    let command = args [0];

                    if (!command)
                    {
                        let categories = new Collection();
                        bot.categories.forEach(c =>
                        {
                            let array = [];
                            bot.commandNames.forEach(cmd =>
                            {
                                let category = bot.category.get(cmd);
                                if (category === c.toLowerCase())
                                {
                                    let hasPermission = false;
                                    bot.permissions.get(cmd).forEach(p =>
                                    {
                                        if (p === "NOTHING") hasPermission = true;
                                        else if (p === "BOT_OWNER" && message.author.id === me) hasPermission = true;
                                        else if (p === "SERVER_OWNER" && message.author.id === message.guild.owner.id) hasPermission = true;
                                        else if (["MANAGE_MESSAGES", "MUTE_MEMBERS", "BAN_MEMBERS", "KICK_MEMBERS", "MANAGE_ROLES"].includes(p) && message.member.hasPermission(p)) hasPermission = true;
                                    });

                                    if (hasPermission) array.push(cmd.charAt(0).toUpperCase() + cmd.slice(1));
                                }
                            });

                            categories.set(c, array.sort());
                        });

                        let embed = new RichEmbed()
                            .setColor(randomColor())
                            .setTitle("**Help**")
                            .setDescription(`Send \`${prefix}help [command name]\` to the \`${message.guild.name}\` server for more information about a command`).setTimestamp();

                        if (model.commands[0])
                        {
                            model.commands.forEach(cmd => cmd = cmd.charAt(0).toUpperCase() + cmd.slice(1));
                            embed.addField("**Custom commands**", model.commands.join(", "));
                        }

                        bot.categories.forEach(c =>
                        {
                            let cmds = categories.get(c);

                            if (cmds.length >= 1) embed.addField(`**${c}**`, cmds.join(", "));
                        });

                        embed.addBlankField();
                        embed.addField("**Parameter formats**", "**[ ]** - mandatory\n**( )** - optional")

                        message.member.send(embed);
                    }
                    else
                    {
                        if (!bot.commandNames.includes(command) && !model.commands.includes(command)) return message.channel.send(`There's no command named \`${command}\` !`);

                        let hasPermission = false;
                        bot.permissions.get(command).forEach(p =>
                        {
                            if (p === "NOTHING") hasPermission = true;
                            else if (p === "BOT_OWNER" && message.author.id === me) hasPermission = true;
                            else if (p === "SERVER_OWNER" && message.author.id === message.guild.owner.id) hasPermission = true;
                            else if (["MANAGE_MESSAGES", "MUTE_MEMBERS", "BAN_MEMBERS", "KICK_MEMBERS", "MANAGE_ROLES"].includes(p) && message.member.hasPermission(p)) hasPermission = true;
                        });

                        if (!hasPermission) return message.channel.send("You don't have permission to use this command!");

                        if (bot.commandNames.includes(command))
                        {
                            let embed = new RichEmbed()
                                .setColor(randomColor())
                                .setTitle(`**${prefix}${command}**`)
                                .setDescription(`**Usage:** ${prefix + bot.usages.get(command)}\n**Description:**\n \u200b \u200b \u200b ${bot.descriptions.get(command)}\n**Category:** ${bot.category.get(command)[0].toUpperCase() + bot.category.get(command).slice(1)}\n**Accessable by:** ${bot.accessableby.get(command)}${(model.disabled.includes(command)) ? "\n\n __**DISABLED**__" : ""}`).setTimestamp();

                            message.member.send(embed);
                        }
                        else
                        {
                            let embed = new RichEmbed()
                                .setColor(randomColor())
                                .setTitle(`**${prefix}${command}**`)
                                .setDescription(`**Usage:** ${prefix + command}\n**Description:**\n \u200b \u200b \u200b - Custom command\n**Category:** Custom commands\n**Accessable by:** Member`).setTimestamp();

                            message.member.send(embed);
                        }
                    }

                    message.channel.send("I sent the help to DM!");
                }
            });
        }
        catch (err)
        {
            console.log(err);
        }
    }
}