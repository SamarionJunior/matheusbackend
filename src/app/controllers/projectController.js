import express from "express";
// import User from "../model/user.js";
// import bcryptjs from "bcryptjs";
// import jwt from "jsonwebtoken";
// import authConfig from "../config/auth.json" assert { type: "json" };
import authMiddlewares from "../middlewares/auth.js";

import Project from "../model/project.js"
import Task from "../model/task.js"

const router = express.Router();

router.use(authMiddlewares);

router.get("/", async (req, res) => {
    res.send({user: req.userId})
})

router.get("/:projectId", async (req, res) => {
    res.send({user: req.userId})
})

router.post("/", async (req, res) => {
    res.send({user: req.userId})
})

router.put("/:projectId", async (req, res) => {
    res.send({user: req.userId})
})

router.delete("/:projectId", async (req, res) => {
    res.send({user: req.userId})
})

// router.post("/register", async (req, res) => {
//     const {email} = req.body;
//     try{
//         if(await User.findOne({email}))
//             return res.status(400).send({erro: "User already exists"})
        
//         const user = await User.create(req.body);

//         user.password = undefined

//         res.send({
//             user, 
//             token: generateToken({id: user.id})
//         })

//     }catch(error){
//         console.log(error)
//         return res.status(400).send({erro: "Registration failed"})
//     }
// })



// router.post("/authenticate", async (req, res) => {
//     const {email, password} = req.body;
//     try{

//         const user = await User.findOne({email}).select("+password");

//         if(!user)
//             return res.status(400).send({error: "User not found"})

//         if(!await bcryptjs.compare(password, user.password))
//             return res.status(400).send({error: "Invalid Password"})
            
//         user.password = undefined

//         res.send({
//             user, 
//             token: generateToken({id: user.id})
//         })
        
//     }catch(error){
//         console.log(error)
//         return res.status(400).send({erro: "Registration failed"})
//     }
// })

export default app => app.use("/projects", router);