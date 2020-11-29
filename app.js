const express = require("express");
const mustacheExpress = require("mustache-express");
const app = express();
const path = require('path');

app.engine('html', mustacheExpress());
app.set('view engine', 'html')

app.set('views', path.join(__dirname, "views"));

app.get('/', (req, res) => {
    res.render('home');
});

app.listen('3000', () => {
    console.log("Serving on port 3000");
})