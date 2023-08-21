import express from "express"
import bodyParser from "body-parser"

import hbs from "nodemailer-express-handlebars";

const PORT = 3030

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.engine(
    'hbs',
    hbs({
       extname: "hbs",
       defaultLayout: "",
       layoutsDir: "",
    })
 );

import controllers from "./app/controllers/index.js"
controllers(app)

app.listen(PORT)

export default app