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
    try{
        const projects = await Project.find().populate("user");
        
        console.log("oi");
        return res.send({projects});
    }catch(error){
        console.log(error);
        console.log("oi");
        return res.status(400).send({erro: "Error loading  project"})
    }
})

router.get("/:projectId", async (req, res) => {
    try{
        const projects = await Project.findById(req.params.projectId).populate("user");
        
        console.log("oi");
        return res.send({projects});
    }catch(error){
        console.log(error);
        console.log("oi");
        return res.status(400).send({erro: "Error loading  project"})
    }
})

router.post("/", async (req, res) => {
    const {title, description, tasks} = req.body;
    try{
        const project = 
            await Project.create(
                { title, description, user: req.userId}
            );

        tasks.map(task => {
            const projectTask = new Task({ ...task, project: project._id})

            projectTask.save().then(pTask => project.tasks.push(pTask))
        })

        await project.save();
        
        console.log("oi");
        return res.send({project, user: req.userId});
    }catch(error){
        console.log(error);
        console.log("oi");
        return res.status(400).send({erro: "Error creating new project"})
    }
})

router.put("/:projectId", async (req, res) => {
    console.log("oi")
    return res.send({user: req.userId})
})

router.delete("/:projectId", async (req, res) => {
    try{
        await Project.findByIdAndRemove(req.params.projectId);
        
        const projects = await Project.find().populate("user");
        
        console.log("oi");
        return res.send({projects});
    }catch(error){
        console.log(error);
        console.log("oi");
        return res.status(400).send({erro: "Error loading  project"})
    }
})

export default app => app.use("/projects", router);