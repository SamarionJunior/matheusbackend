import express from "express";
import User from "../model/user.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import authConfig from "../../config/auth.json" assert { type: "json" };
import crypto from "crypto";
import mailer from "../../modules/mailer.js"

const router = express.Router();

function generateToken(params = {}){
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 86400,
    })
}

router.post("/register", async (req, res) => {
    const {email} = req.body;
    try{
        if(await User.findOne({email}))
            return res.status(400).send({erro: "User already exists"})
        
        const user = await User.create(req.body);

        user.password = undefined

        res.send({
            user, 
            token: generateToken({id: user.id})
        })

    }catch(error){
        console.log(error)
        return res.status(400).send({erro: "Registration failed"})
    }
})

router.post("/authenticate", async (req, res) => {
    const {email, password} = req.body;
    try{

        const user = await User.findOne({email}).select("+password");

        if(!user)
            return res.status(400).send({error: "User not found"})

        if(!await bcryptjs.compare(password, user.password))
            return res.status(400).send({error: "Invalid Password"})
            
        user.password = undefined

        res.send({
            user, 
            token: generateToken({id: user.id})
        })
        
    }catch(error){
        console.log(error)
        return res.status(400).send({erro: "Authentication failed"})
    }
})

router.post("/forgot_password", async (req, res) => {
    const {email} = req.body;
    try{

        const user = await User.findOne({email});

        if(!user)
            return res.status(400).send({error: "User not found"})

        const token = crypto.randomBytes(20).toString('hex')

        const now = new Date();
        now.setHours(now.getHours() + 1);

        await User.findByIdAndUpdate(user.id, {
            "$set": {
                passwordResetToken: token,
                passwordResetExpires: now,
            }
        });

        mailer.sendMail({
            to: email,
            from: "samarion2@hotmail.com",
            template: 'auth/forgot_password',
            context: {token},
        }, (err) => {
            if(err){
                console.log(err)
                return res.status(400).send({erro: "Cannot send forgot password email"})
            }
            return res.send();
        })


        // res.send({
        //     now, 
        //     token: generateToken({id: user.id})
        // })
        
    }catch(error){
        console.log(error)
        return res.status(400).send({erro: "Erro on forgot passwoard, try again"})
    }
})

router.post("/resert_password", async (req, res) => {
    const {email, token, password} = req.body;
    try{

        const user = await User.findOne({email})
            .select("+passwordResetToken passwordResetExpires");

        if(!user)
            return res.status(400).send({error: "User not found"})

        // console.log(
        //     token,
        //     user.passwordResetToken,
        //     typeof(token),
        //     typeof(user.passwordResetExpires)
        // )
        
        if(token !== user.passwordResetToken)
            return res.status(400).send({erro: "Token invalid"});
        


        const now = new Date();

        if(now > user.passwordResetExpires)
            return res.status(400).send({error: "Token expired, generate a new one"})

        user.password = password;

        await user.save()

        res.send()

        // const token = crypto.randomBytes(20).toString('hex')

        // const now = new Date();
        // now.setHours(now.getHours() + 1);

        // await User.findByIdAndUpdate(user.id, {
        //     "$set": {
        //         passwordResetToken: token,
        //         passwordResetExpires: now,
        //     }
        // });

        // mailer.sendMail({
        //     to: email,
        //     from: "samarion2@hotmail.com",
        //     template: 'auth/forgot_password',
        //     context: {token},
        // }, (err) => {
        //     if(err){
        //         console.log(err)
        //         return res.status(400).send({erro: "Cannot send forgot password email"})
        //     }
        //     return res.send();
        // })


        // res.send({
        //     now, 
        //     token: generateToken({id: user.id})
        // })
        
    }catch(error){
        console.log(error)
        return res.status(400).send({erro: "Cannot reset password, try again"})
    }
})

export default app => app.use("/auth", router);