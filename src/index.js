import express from "express"
import bodyParser from "body-parser"

const PORT = 3030

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

import authController from "./controllers/authController.js";

authController(app)

app.listen(PORT)

// import router from "./controllers/authController"
// app.use("/auth", router)

export default app

// app.get("/",(req, res) => {
//     res.send("OK")
// })

// app.listen(PORT, _ => {
//     console.clear()
//     console.log(`////////////////////////\n\nRodando... ${PORT}\n\n////////////////////////`)
// })