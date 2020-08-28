const { Collection } = require("discord.js");
const { readdirSync } = require("fs");
let commands = new Collection();
let aliases = new Collection();
let usages = new Collection();
let descriptions = new Collection();
let category = new Collection();
let accessableby = new Collection();
let permissions = new Collection();
let commandNames = [];

const load = dir =>
{
    const commandList = readdirSync(`./commands/${dir}/`).filter(f => f.endsWith(".js"));
    for (let file of commandList)
    {
        let pull = require(`../../commands/${dir}/${file}`);

        commands.set(pull.config.name, pull);
        if (pull.config.aliases) pull.config.aliases.forEach(a => aliases.set(a, pull.config.name))

        commandNames.push(pull.config.name);
        usages.set(pull.config.name, pull.config.usage);
        descriptions.set(pull.config.name, pull.config.description);
        category.set(pull.config.name, pull.config.category);
        accessableby.set(pull.config.name, pull.config.accessableby);
        permissions.set(pull.config.name, pull.config.permissions);
    };
};

["currency", "custom command tools", "fortnite", "fun", "giveaway", "maintenance", "moderation", "nsfw", "reaction role", "tools"].forEach(x => load(x));

module.exports = bot =>
{
    bot.commands = commands;
    bot.aliases = aliases;
    bot.commandNames = commandNames;
    bot.usages = usages;
    bot.descriptions = descriptions;
    bot.category = category;
    bot.accessableby = accessableby;
    bot.permissions = permissions;
}
