const giphy = require("giphy-api")(process.env.GIPHY_API_KEY);

module.exports =
{
    config:
    {
        name: "gif",
        description: "- Sends a random gif",
        usage: "gif",
        category: "fun",
        accessableby: "Member",
        permissions: ["NOTHING"]
    },
    run: (bot, message, args) =>
    {
        try
        {
            giphy.random("", (err, res) =>
            {
                if (err) console.log(err);

                message.channel.send(res.data.url);
            });
        }
        catch (err)
        {
            console.log(err);
        }
    }
}