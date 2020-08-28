const mongoose = require("mongoose");

const schema = mongoose.Schema(
{
    guildID: String,
    userID: String,
    roleIDs: Array,
    reason: String
}, { minimize: false });

module.exports = mongoose.model("mutes", schema);