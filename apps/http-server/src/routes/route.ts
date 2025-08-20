import { Router } from 'express';
import express from 'express'
import jsonwebtoken from 'jsonwebtoken';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import {prismaClient} from '@repo/database/client'
import { usermiddleware } from './middleware';
import {JWT_SECRET} from '@repo/backend-envs/config'

const prisma =  prismaClient
const router:Router = express.Router();
router.post('/signup',async (req,res) => {
    try{
        
    const { email , password ,name } = req.body;
    if(!email || !password || !name){
        res.status(400).json({msg:"haloo"})
            return;
    }
    const existingUser = await prisma.user.findFirst({ //db logic
        where:{
            email:email,
            name:name
        }
    })

    if(existingUser){
        res.status(400).json({msg:"user already exist login with password"})
        return;
    }

    const saltround = 10;
    const hashedpass = await bcrypt.hash(password,saltround);

    const newuser = await prisma.user.create({  // db logic
       data:{
        email:email,
        password:hashedpass,
        name:name
       } 
    })

    if(newuser){
        res.status(200).json({msg:"user added"})
        return
    }
    else{
        res.status(200).json({msg:"user not  added"})
        return
    }   
    }catch(error){
         console.error(error);
    return res.status(500).json({ msg: "Internal server error" });
    }
})

router.post('/signin',async(req,res) => {
    const { name, password ,email } = req.body
    try{
    if(!email || !password || !name){
        res.status(400).json({msg:"fill all inputs"})
        return;
    }
    const Usercheck = await prisma.user.findFirst({
        where:{
            email:email   
        }
    })
    if(!Usercheck){
        res.status(400).json({msg:"no user exists"})
        return
    }

    const isMatch = await bcrypt.compare(password,Usercheck.password)
    if(!isMatch){
        res.status(400).json({msg:"password doesnt match"})
    }
    const token = jwt.sign({ id: Usercheck.id }, JWT_SECRET);

    res.status(200).json({msg:"signed in",token})
    return 

    }catch(error){
        console.log(error)
    }
})

router.post('/chat',usermiddleware,async(req,res) => {
    const userId = req.user;
    const {slug} = req.body
    try{
        if(!slug){
        res.status(400).json({msg:"no slugs"})
        return
        }
        if(!userId){
        res.status(400).json({msg:"no tokens present"})
        return
    }

    const room = await prisma.room.create({
        data:{
            slug:slug,
            adminId:req.user
        }
    })
    if(!room){
        res.status(200).json({msg:"room is not created"})
    }
    res.status(200).json({room: room.id})

    }
    catch(error){
        res.status(400).json({msg:"internal server error"})
        console.log(error)
    }
})


router.get("/chats/:roomId", async (req, res) => {
  const roomid = Number(req.params.roomId);
  const chats = await prismaClient.chat.findMany({
    where: { roomid }
  });

  res.json({ messages: chats }); 
});


router.post("/push", async (req, res) => {
  try {
    const { roomid, userId, message } = req.body;

    const pushed = await prismaClient.chat.create({
      data: {
        message,
        roomid,
        userId
      }
    });

    res.json(pushed);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;