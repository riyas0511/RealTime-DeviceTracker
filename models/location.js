const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
    userId: String,  // Unique user identifier (socket ID)
    latitude: Number,
    longitude: Number,
    timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Location", locationSchema);
// The above code is a model for the location of the user. It is used to store the location of the user in the database.