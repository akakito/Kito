const { readdirSync } = require("fs");

module.exports = bot =>
{
    const load = dir =>
    {
        const eventList = readdirSync(`./events/${dir}/`).filter(f => f.endsWith(".js"));
        for (let file of eventList) require(`../../events/${dir}/${file}`)(bot);
    };

    ["client", "guild"].forEach(x => load(x));
}
