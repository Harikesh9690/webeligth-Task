const express = require("express")
const app = express()
const mongoose = require("mongoose")
const route = require("./routes/route")


app.use(express.json())


mongoose.connect("mongodb+srv://projects94:E35tUpfux9D87GOj@cluster0.m1ousdd.mongodb.net/webeligth", {
    useNewUrlParser: true
})
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) )

app.use('/', route)

app.listen(3000, () => {console.log("app is running on port 3000")})
