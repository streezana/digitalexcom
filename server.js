const express = require('express')
const app = express()
require('dotenv').config()
const mongoose = require("mongoose")
const port = process.env.PORT || 8000
const mongouri = process.env.MONGO_URL || ""

const books = require('./routes/books')
const users = require('./routes/users')
const audioFiles = require('./routes/audiofiles')
mongoose.set("strictQuery", false)

async function start() {
    try {
        await mongoose.connect(mongouri,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }
        );
        app.listen(port, () => {
            console.log(
                `mongoose.connect + Сервер запущен! -  http://localhost:${port}`
            );
        });
    } catch (err) {
        console.log(err)
    }
}("strictQuery", false)
start()

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use("/static", express.static(__dirname + "/assets"))
app.use("/api/books", books)
app.use("/api/users", users)
app.use("/api/audiofiles", audioFiles)
