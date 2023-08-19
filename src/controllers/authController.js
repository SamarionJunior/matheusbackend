import express from "express";
import User from "../model/user.js";

const router = express.Router();

router.post("/register", async (req, res) => {
    const {email} = req.body;
    try{
        if(await User.findOne({email}))
            return res.status(400).send({erro: "User already exists"})
        
        const user = await User.create(req.body);

        user.password = undefined

        return res.send({user})
    }catch(error){
        console.log(error)
        return res.status(400).send({erro: "Registration failed"})
    }
})

// const authController = app => app.use("/auth", router);

export default app => app.use("/auth", router);