const { RichEmbed, Collection } = require("discord.js");
const guildModel = require("../../models/guilds");
const onoff = new Collection().set("on", true).set("off", false).set(true, "on").set(false, "off");

module.exports =
{
    config:
    {
        name: "setup",
        description: "- Sets/gets the specified settings",
        usage: "setup (set|get) (setting)",
        category: "tools",
        accessableby: "Server Owner",
        permissions: ["SERVER_OWNER"]
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
                    if (message.author.id !== message.guild.owner.id) return message.channel.send("Only the server's owner can use this command!");

                    let settings =
                    {
                        prefix: model.prefix,
                        roles:
                        {
                            dj: model.roles.dj,
                            muted: model.roles.muted,
                            default: model.roles.default
                        },
                        channels:
                        {
                            welcome: model.channels.welcome,
                            leave: model.channels.leave,
                            logs: model.channels.logs,
                            giveaways: model.channels.giveaways,
                            bot: model.channels.bot,
                            musicText: model.channels.musicText,
                            musicVoice: model.channels.musicVoice
                        },
                        profanityfilter: model.profanityfilter,
                        currency: model.currency,
                        degreetype: model.degreetype,
                        botchannel: model.botchannel,
                        musiccommands: model.musiccommands,
                        musicvoice: model.musicvoice,
                        verification: model.verification,
                        dj: model.dj,
                        logs: model.logs
                    }

                    if (!args[0])
                    {
                        let embed = new RichEmbed()
                            .setColor("#344C5A")
                            .setAuthor("Setup", "https://www.freeiconspng.com/uploads/control-panel-icon-png-25.png")
                            .setDescription(`**Get a setting:** \`${settings.prefix}setup get [setting]\` \n**Set a setting:** \`${settings.prefix}setup set [setting] [value]\``)
                            .addField("**prefix**", `The bot's prefix\n **Usage**: \`${settings.prefix}setup [set|get] prefix (text)\``)
                            .addField("**profanityfilter**", `Turns on/off the profanity filter\n **Usage**: \`${settings.prefix}setup [set|get] profanityfilter (on|off)\``)
                            .addField("**verification**", `Turns on/off the verification system\n **Usage**: \`${settings.prefix}setup [set|get] verification (on|off)\``)
                            .addField("**botchannel**", `Turns on/off the bot channel\n **Usage**: \`${settings.prefix}setup [set|get] botchannel (on|off)\``)
                            .addField("**logs**", `Turns on/off the logging to the logs channel\n **Usage**: \`${settings.prefix}setup [set|get] logs (on|off)\``)
                            .addField("**dj**", `Turns on/off the DJ only music mode\n **Usage**: \`${settings.prefix}setup [set|get] dj (on|off)\``)
                            .addField("**musiccommands**", `Turns on/off the music commands channel\n **Usage**: \`${settings.prefix}setup [set|get] musiccommands (on|off)\``)
                            .addField("**musicvoice**", `Turns on/off the music voice channel\n **Usage**: \`${settings.prefix}setup [set|get] musicvoice (on|off)\``)
                            .addField("**currency**", `Sets the currency for the currency system\n **Usage**: \`${settings.prefix}setup [set|get] currency (text)\``)
                            .addField("**degreetype**", `Sets the degreetyp for the ${settings.prefix}weather command\n **Usage**: \`${settings.prefix}setup [set|get] degreetype (C|F)\``)
                            .addField("**roles.default**", `The role someone receives when joins the server\n **Usage**: \`${settings.prefix}setup [set|get] roles.default (@role)\``)
                            .addField("**roles.muted**", `The role someome receives with the mute\n **Usage**: \`${settings.prefix}setup [set|get] roles.muted (@role)\``)
                            .addField("**roles.dj**", `When the DJ only mode is on, only the members with this role will be able to control the music\n **Usage**: \`${settings.prefix}setup [set|get] roles.dj (@role)\``)
                            .addField("**channels.welcome**", `The welcome channel\n **Usage**: \`${settings.prefix}setup [set|get] channels.welcome (#channel)\``)
                            .addField("**channels.leave**", `The leave channel\n **Usage**: \`${settings.prefix}setup [set|get] channels.leave (#channel)\``)
                            .addField("**channels.music**", `The music commands channel\n **Usage**: \`${settings.prefix}setup [set|get] channels.music (#channel)\``)
                            .addField("**channels.logs**", `The channel where the bot sends moderation logs\n **Usage**: \`${settings.prefix}setup [set|get] channels.logs (#channel)\``)
                            .addField("**channels.bot**", `The channel where the members can use bot commands\n **Usage**: \`${settings.prefix}setup [set|get] channels.bot (#channel)\``)
                            .addField("**channels.giveaways**", `The channel where the bot sends the giveaways\n **Usage**: \`${settings.prefix}setup [set|get] channels.giveaways (#channel)\``)
                            .addField("**voice.music**", `The music voice channel\n **Usage**: \`${settings.prefix}setup [set|get] voice.music (voicechannel's ID)\``)
                            .setTimestamp();

                        return message.channel.send(embed);
                    }

                    if (!args[1])
                    {
                        if (["set", "get"].includes(args[0].toLowerCase())) return message.channel.send("Please specify the setting!");
                        else return message.channel.send("Please specify the setting, and specify correctly what you want to do with the setting (set|get)!");
                    }

                    let path = args[1].toLowerCase().split(".");

                    if (settings[path[0].toLowerCase()] === undefined && path[0] !== "voice")
                    {
                        if (["set", "get"].includes(args[0].toLowerCase())) return message.channel.send("Please specify correctly the setting!");
                        else return message.channel.send("Please specify correctly the setting, and what you want to do with it (set|get)!");
                    }

                    if (!["set", "get"].includes(args[0].toLowerCase())) return message.channel.send("Please specify correctly what you want to do with the setting (set|get)!");

                    if (args[0].toLowerCase() === "set")
                    {
                        let id;
                        let role;
                        switch (path[0].toLowerCase())
                        {
                            case "prefix":
                                if (!args[2]) return message.channel.send("Please specify the text that you want to be the prefix!");

                                await guildModel.findOneAndUpdate({ guildID: message.guild.id }, { prefix: args[2] });

                                message.channel.send(`Successfully set the prefix to \`${args[2]}\` !`);
                                break;

                            case "roles":
                                if (!path[1]) return message.channel.send("Please specify correctly the setting!");

                                switch (path[1])
                                {
                                    case "default":
                                        if (!args[2]) return message.channel.send("Please mention the role that you want to be the default role!");

                                        id = args[2].slice(3, args[2].length - 1);
                                        role = message.mentions.roles.first();

                                        if (!role || role.id !== id) return message.channel.send("Please mention correctly the role that you want to be the default role!");

                                        await guildModel.findOneAndUpdate({ guildID: message.guild.id }, { roles: { default: id, muted: settings.roles.muted, dj: settings.roles.dj } });

                                        message.channel.send(`Successfully set the default role to <@&${id}>!`);
                                        break;

                                    case "muted":
                                        if (!args[2]) return message.channel.send("Please mention the role that you want to be the muted role!");

                                        id = args[2].slice(3, args[2].length - 1);
                                        role = message.mentions.roles.first();

                                        if (!role || role.id !== id) return message.channel.send("Please mention correctly the role that you want to be the muted role!");

                                        await guildModel.findOneAndUpdate({ guildID: message.guild.id }, { roles: { default: settings.roles.default, muted: id, dj: settings.roles.dj } });

                                        message.channel.send(`Successfully set the muted role to <@&${id}>!`);
                                        break;

                                    case "dj":
                                        if (!args[2]) return message.channel.send("Please mention the role that you want to be the DJ role!");

                                        id = args[2].slice(3, args[2].length - 1);
                                        role = message.mentions.roles.first();

                                        if (!role || role.id !== id) return message.channel.send("Please mention correctly the role that you want to be the DJ role!");

                                        await guildModel.findOneAndUpdate({ guildID: message.guild.id }, { roles: { default: settings.roles.default, muted: settings.roles.muted, dj: id } });

                                        message.channel.send(`Successfully set the DJ role to <@&${id}>!`);
                                        break;

                                    default:
                                        message.channel.send("Please specify correctly the setting!");
                                        break;
                                }
                                break;

                            case "channels":
                                if (!path[1]) return message.channel.send("Please specify correctly the setting!");

                                switch (path[1])
                                {
                                    case "welcome":
                                        if (!args[2]) return message.channel.send("Please mention the channel that you want to be the welcome channel!");

                                        id = args[2].slice(2, args[2].length - 1);
                                        channel = message.mentions.channels.first();

                                        if (!channel || channel.id !== id) return message.channel.send("Please mention correctly the channel that you want to be the welcome channel!");

                                        await guildModel.findOneAndUpdate({ guildID: message.guild.id }, { channels: { welcome: id, leave: settings.channels.leave, logs: settings.channels.logs, bot: settings.channels.bot, giveaways: settings.channels.giveaways, musicText: settings.channels.musicText, musicVoice: settings.channels.musicVoice } });

                                        message.channel.send(`Successfully set the welcome channel to <#${id}>!`);
                                        break;

                                    case "leave":
                                        if (!args[2]) return message.channel.send("Please mention the channel that you want to be the leave channel!");

                                        id = args[2].slice(2, args[2].length - 1);
                                        channel = message.mentions.channels.first();

                                        if (!channel || channel.id !== id) return message.channel.send("Please mention correctly the channel that you want to be the leave channel!");

                                        await guildModel.findOneAndUpdate({ guildID: message.guild.id }, { channels: { welcome: settings.channels.welcome, leave: id, logs: settings.channels.logs, bot: settings.channels.bot, giveaways: settings.channels.giveaways, musicText: settings.channels.musicText, musicVoice: settings.channels.musicVoice } });

                                        message.channel.send(`Successfully set the leave channel to <#${id}>!`);
                                        break;

                                    case "logs":
                                        if (!args[2]) return message.channel.send("Please mention the channel that you want to be the logs channel!");

                                        id = args[2].slice(2, args[2].length - 1);
                                        channel = message.mentions.channels.first();

                                        if (!channel || channel.id !== id) return message.channel.send("Please mention correctly the channel that you want to be the logs channel!");

                                        await guildModel.findOneAndUpdate({ guildID: message.guild.id }, { channels: { welcome: settings.channels.welcome, leave: settings.channels.logs, logs: id, bot: settings.channels.bot, giveaways: settings.channels.giveaways, musicText: settings.channels.musicText, musicVoice: settings.channels.musicVoice } });

                                        message.channel.send(`Successfully set the logs channel to <#${id}>!`);
                                        break;

                                    case "bot":
                                        if (!args[2]) return message.channel.send("Please mention the channel that you want to be the bot channel!");

                                        id = args[2].slice(2, args[2].length - 1);
                                        channel = message.mentions.channels.first();

                                        if (!channel || channel.id !== id) return message.channel.send("Please mention correctly the channel that you want to be the bot channel!");

                                        await guildModel.findOneAndUpdate({ guildID: message.guild.id }, { channels: { welcome: settings.channels.welcome, leave: settings.channels.logs, logs: settings.channels.logs, bot: id, giveaways: settings.channels.giveaways, musicText: settings.channels.musicText, musicVoice: settings.channels.musicVoice } });

                                        message.channel.send(`Successfully set the bot channel to <#${id}>!`);
                                        break;

                                    case "giveaways":
                                        if (!args[2]) return message.channel.send("Please mention the channel that you want to be the giveaways channel!");

                                        id = args[2].slice(2, args[2].length - 1);
                                        channel = message.mentions.channels.first();

                                        if (!channel || channel.id !== id) return message.channel.send("Please mention correctly the channel that you want to be the giveaways channel!");

                                        await guildModel.findOneAndUpdate({ guildID: message.guild.id }, { channels: { welcome: settings.channels.welcome, leave: settings.channels.giveaways, logs: settings.channels.logs, bot: settings.channels.bot, giveaways: id, musicText: settings.channels.musicText, musicVoice: settings.channels.musicVoice } });

                                        message.channel.send(`Successfully set the giveaways channel to <#${id}>!`);
                                        break;

                                    case "music":
                                        if (!args[2]) return message.channel.send("Please mention the channel that you want to be the music channel!");

                                        id = args[2].slice(2, args[2].length - 1);
                                        channel = message.mentions.channels.first();

                                        if (!channel || channel.id !== id) return message.channel.send("Please mention correctly the channel that you want to be the music channel!");

                                        await guildModel.findOneAndUpdate({ guildID: message.guild.id }, { channels: { welcome: settings.channels.welcome, leave: settings.channels.giveaways, logs: settings.channels.logs, bot: settings.channels.bot, giveaways: settings.channels.giveaways, musicText: id, musicVoice: settings.channels.musicVoice } });

                                        message.channel.send(`Successfully set the music channel to <#${id}>!`);
                                        break;

                                    default:
                                        message.channel.send("Please specify correctly the setting!");
                                        break;
                                }
                                break;

                            case "voice":
                                if (!path[1]) return message.channel.send("Please specify correctly the setting!a");

                                switch (path[1])
                                {
                                    case "music":
                                        if (!args[2]) return message.channel.send("Please specify the ID of the voicechannel that you want to be the music voicechannel!");

                                        id = args[2];

                                        channel = message.guild.channels.get(id);

                                        if (!channel) return message.channel.send("Please specify correctly the ID of the voicechannel that you want to be the music voicechannel!");

                                        await guildModel.findOneAndUpdate({ guildID: message.guild.id }, { channels: { welcome: settings.channels.welcome, leave: settings.channels.leave, logs: settings.channels.logs, bot: settings.channels.bot, giveaways: settings.channels.giveaways, musicText: settings.channels.musicText, musicVoice: id } });

                                        message.channel.send(`Successfully set the music voicechannel to \`${message.guild.channels.get(id).name}\`!`);
                                        break;

                                    default:
                                        message.channel.send("Please specify correctly the setting!asd");
                                        break;
                                }
                                break;

                            case "profanityfilter":
                                if (!args[2]) return message.channel.send("Please specify whether you want to turn the profanity filter on or off!");
                                if (!["on", "off"].includes(args[2].toLowerCase())) return message.channel.send("Please specify correctly whether you want to turn the profanity filter on or off!");

                                await guildModel.findOneAndUpdate({ guildID: message.guild.id }, { profanityfilter: onoff.get(args[2].toLowerCase()) });

                                message.channel.send(`Successfully turned **${args[2].toLowerCase()}** the profanity filter!`);
                                break;

                            case "currency":
                                if (!args[2]) return message.channel.send("Please specify what you want to be the currency!");

                                await guildModel.findOneAndUpdate({ guildID: message.guild.id }, { currency: args.slice(2).join(" ") });

                                message.channel.send(`Successfully set the currency to **${args.slice(2).join(" ")}**!`);
                                break;

                            case "degreetype":
                                if (!args[2]) return message.channel.send("Please specify what type you want degrees (C|F)!");
                                if (!["f", "c"].includes(args[2].toLowerCase())) return message.channel.send("Please specify correctly what type you want degrees (C|F)!")

                                await guildModel.findOneAndUpdate({ guildID: message.guild.id }, { degreetype: args[2].toLowerCase() });

                                message.channel.send(`Successfully set the degree type to **°${args[2].toUpperCase()}**!`);
                                break;

                            case "botchannel":
                                if (!args[2]) return message.channel.send("Please specify whether you want to turn the bot channel on or off!");
                                if (!["on", "off"].includes(args[2].toLowerCase())) return message.channel.send("Please specify correctly whether you want to turn the bot channel on or off!");

                                await guildModel.findOneAndUpdate({ guildID: message.guild.id }, { botchannel: onoff.get(args[2].toLowerCase()) });

                                message.channel.send(`Successfully turned **${args[2].toLowerCase()}** the bot channel!`);
                                break;

                            case "musiccommands":
                                if (!args[2]) return message.channel.send("Please specify whether you want to turn the music commands channel on or off!");
                                if (!["on", "off"].includes(args[2].toLowerCase())) return message.channel.send("Please specify correctly whether you want to turn the music commands channel on or off!");

                                await guildModel.findOneAndUpdate({ guildID: message.guild.id }, { musiccommands: onoff.get(args[2].toLowerCase()) });

                                message.channel.send(`Successfully turned **${args[2].toLowerCase()}** the music commands channel!`);
                                break;

                            case "musicvoice":
                                if (!args[2]) return message.channel.send("Please specify whether you want to turn the music voice channel on or off!");
                                if (!["on", "off"].includes(args[2].toLowerCase())) return message.channel.send("Please specify correctly whether you want to turn the music voice channel on or off!");

                                await guildModel.findOneAndUpdate({ guildID: message.guild.id }, { musicvoice: onoff.get(args[2].toLowerCase()) });

                                message.channel.send(`Successfully turned **${args[2].toLowerCase()}** the music voice channel!`);
                                break;

                            case "dj":
                                if (!args[2]) return message.channel.send("Please specify whether you want to turn the DJ only music mode on or off!");
                                if (!["on", "off"].includes(args[2].toLowerCase())) return message.channel.send("Please specify correctly whether you want to turn the DJ only music mode on or off!");

                                await guildModel.findOneAndUpdate({ guildID: message.guild.id }, { dj: onoff.get(args[2].toLowerCase()) });

                                message.channel.send(`Successfully turned **${args[2].toLowerCase()}** the DJ only music mode!`);
                                break;

                            case "verification":
                                if (!args[2]) return message.channel.send("Please specify whether you want to turn the verification on or off!");
                                if (!["on", "off"].includes(args[2].toLowerCase())) return message.channel.send("Please specify correctly whether you want to turn the verification on or off!");

                                await guildModel.findOneAndUpdate({ guildID: message.guild.id }, { verification: onoff.get(args[2].toLowerCase()) });

                                message.channel.send(`Successfully turned **${args[2].toLowerCase()}** the verification!`);
                                break;


                            case "logs":
                                if (!args[2]) return message.channel.send("Please specify whether you want to turn the logs to the logs channel on or off!");
                                if (!["on", "off"].includes(args[2].toLowerCase())) return message.channel.send("Please specify correctly whether you want to turn the logs to the logs channel on or off!");

                                await guildModel.findOneAndUpdate({ guildID: message.guild.id }, { logs: onoff.get(args[2].toLowerCase()) });

                                message.channel.send(`Successfully turned **${args[2].toLowerCase()}** the logs to the logs channel!`);
                                break;

                        }
                    }

                    if (args[0].toLowerCase() === "get")
                    {
                        switch (path[0].toLowerCase())
                        {
                            case "prefix":
                                message.channel.send(`The current prefix is: \`${settings.prefix}\``);
                                break;

                            case "roles":
                                if (!path[1]) return message.channel.send("Please specify correctly the setting!");

                                switch (path[1])
                                {
                                    case "default":
                                        if (!settings.roles.default || !message.guild.roles.get(settings.roles.default)) return message.channel.send("The default role isn't set!");
                                        message.channel.send(`The current default role is: <@&${settings.roles.default}>`);
                                        break;

                                    case "muted":
                                        if (!settings.roles.muted || !message.guild.roles.get(settings.roles.muted)) return message.channel.send("The muted role isn't set!");
                                        message.channel.send(`The current muted role is: <@&${settings.roles.muted}>`);
                                        break;

                                    case "dj":
                                        if (!settings.roles.muted || !message.guild.roles.get(settings.roles.muted)) return message.channel.send("The DJ role isn't set!");
                                        message.channel.send(`The current DJ role is: <@&${settings.roles.muted}>`);
                                        break;

                                    default:
                                        message.channel.send("Please specify correctly the setting!");
                                        break;
                                }
                                break;

                            case "channels":
                                if (!path[1]) return message.channel.send("Please specify correctly the setting!");

                                switch (path[1])
                                {
                                    case "welcome":
                                        if (!settings.channels.welcome || !message.guild.channels.get(settings.channels.welcome)) return message.channel.send("The welcome channel isn't set!");
                                        message.channel.send(`The current welcome channel is: <#${settings.channels.welcome}>`);
                                        break;

                                    case "leave":
                                        if (!settings.channels.leave || !message.guild.channels.get(settings.channels.leave)) return message.channel.send("The leave channel isn't set!");
                                        message.channel.send(`The current leave channel is: <#${settings.channels.leave}>`);
                                        break;

                                    case "logs":
                                        if (!settings.channels.logs || !message.guild.channels.get(settings.channels.logs)) return message.channel.send("The logs channel isn't set!");
                                        message.channel.send(`The current logs channel is: <#${settings.channels.logs}>`);
                                        break;

                                    case "bot":
                                        if (!settings.channels.bot || !message.guild.channels.get(settings.channels.bot)) return message.channel.send("The bot channel isn't set!");
                                        message.channel.send(`The current bot channel is: <#${settings.channels.bot}>`);
                                        break;

                                    case "giveaways":
                                        if (!settings.channels.giveaways || !message.guild.channels.get(settings.channels.giveaways)) return message.channel.send("The giveaways channel isn't set!");
                                        message.channel.send(`The current giveaways channel is: <#${settings.channels.giveaways}>`);
                                        break;

                                    case "music":
                                        if (!settings.channels.musicText || !message.guild.channels.get(settings.channels.musicText)) return message.channel.send("The music channel isn't set!");
                                        message.channel.send(`The current music channel is: <#${settings.channels.musicText}>`);
                                        break;

                                    default:
                                        message.channel.send("Please specify correctly the setting!");
                                        break;
                                }
                                break;

                            case "voice":
                                if (!path[1]) return message.channel.send("Please specify correctly the setting!");

                                switch (path[1])
                                {
                                    case "music":
                                        if (!settings.channels.musicVoice || !message.guild.channels.get(settings.channels.musicVoice)) return message.channel.send("The music voicechannel isn't set!");
                                        message.channel.send(`The current music voicechannel is: \`${message.guild.channels.get(settings.channels.musicVoice).name}\``);
                                        break;

                                    default:
                                        message.channel.send("Please specify correctly the setting!");
                                        break;
                                }
                                break;

                            case "profanityfilter":
                                message.channel.send(`The profanity filter is turned **${onoff.get(settings.profanityfilter)}**`);
                                break;

                            case "currency":
                                message.channel.send(`The currency is: **${settings.currency}**`);
                                break;

                            case "degreetype":
                                message.channel.send(`The degree type is: **°${settings.degreetype.toUpperCase()}**!`);
                                break;

                            case "botchannel":
                                message.channel.send(`The bot channel is turned **${onoff.get(settings.botchannel)}**`);
                                break;

                            case "musiccommands":
                                message.channel.send(`The music commands channel is turned **${onoff.get(settings.musiccommands)}**`);
                                break;

                            case "musicvoice":
                                message.channel.send(`The music voice channel is turned **${onoff.get(settings.musicvoice)}**`);
                                break;

                            case "dj":
                                message.channel.send(`The DJ only music mode is turned **${onoff.get(settings.dj)}**`);
                                break;

                            case "verification":
                                message.channel.send(`The verification is turned **${onoff.get(settings.verification)}**`);
                                break;

                            case "logs":
                                message.channel.send(`The logs to the logs channel is turned **${onoff.get(settings.logs)}**`);
                                break;

                        }
                    }
                }
            });
        }
        catch (err)
        {
            console.log(err);
        }
    }
}