const mongoose = require('mongoose');
const Campground = require("../models/campground");
const cities = require("./cities")
const { descriptors, places } = require("./seedHelpers");

mongoose.connect('mongodb://localhost:27017/yelpCamp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

async function seedDB() {
    await Campground.deleteMany({});

    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 100) + 400

        const camp = new Campground({
            title: `${sample(descriptors)} ${sample(places)}`,
            image: "https://source.unsplash.com/collection/483251/",
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            description: "Lorem Fidsum, or example, the base of a tree and not a small side table. This place is terrible. So far my efforts have yielded nothing of value.",
            price
        });
        await camp.save();
    }

}

seedDB()
    .then(() => {
        mongoose.connection.close();
        console.log("Database closed");
    });