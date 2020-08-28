const dotenv = require("dotenv").config();
const { Client, Collection } = require("discord.js");
const { connect } = require("mongoose");
const bot = new Client();

connect(process.env.MONGOOSE_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

bot.active = true;
bot.categories = ["Currency", "Custom command tools", "Fortnite", "Fun", "Giveaway", "Maintenance", "Moderation", "NSFW", "Reaction role", "Tools"];
["commandNames", "fight"].forEach(x => bot[x] = []);
["commands", "aliases", "events", "usages", "descriptions", "category", "accessableby", "permissions"].forEach(x => bot[x] = new Collection());

["commandHandler", "eventHandler"].forEach(h => require(`./util/handlers/${h}`)(bot));
bot.login();