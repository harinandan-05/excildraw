import express, { Request, Response, Router } from "express";   
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import {prismaClient} from '@repo/database/client'
import { usermiddleware } from './middleware';
import {JWT_SECRET} from '@repo/backend-envs/config'

const prisma =  prismaClient
const router = express.Router();
router.post('/signup',async (req:Request,res:Response) => {
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

router.post('/signin',async(req:Request,res:Response) => {
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
    if(!Usercheck?.password){
        res.status(400).json({msg:"no user password"})
        return
    }
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


router.post("/room", usermiddleware, async (req:Request,res:Response) => {
  try {
    const userId = req.user;
    const { slug } = req.body;
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    if (!slug) {
      return res.status(400).json({ msg: "Slug is required" });
    }
     if (!userId) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    if (!slug) {
      return res.status(400).json({ msg: "Slug is required" });
    }

    const room = await prisma.room.create({
      data: {
        slug,
        adminId: userId!
      },
      select: {
        id: true,
        slug: true,
        adminId: true,
        createdAt: true
      }
    });

    res.status(201).json(room.id); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal server error" });
  }
});


router.get("/room/:roomId", async (req: Request, res: Response) => {
  const { roomId } = req.params;

  if (!roomId) {
    return res.status(400).json({ error: "roomId is required" });
  }

  const parsedRoomId = Number(roomId);
  if (isNaN(parsedRoomId)) {
    return res.status(400).json({ error: "Invalid roomId" });
  }

  const chats = await prismaClient.chat.findMany({
    where: { roomid: parsedRoomId },
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


router.get("/dashboard", usermiddleware, async (req:Request,res:Response) => {
  try {

    const userId = req.user;
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    if (!userId) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    const rooms = await prisma.room.findMany({
      where: {
        adminId: userId
      },
      select: {
        id: true,
        slug: true,
        createdAt: true
      }
    });

    res.status(200).json({
      count: rooms.length,
      rooms
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal server error" });
  }
});


router.get("/room", usermiddleware, async (req:Request,res:Response) => {
  try {
    const userId = req.user;
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    const rooms = await prisma.room.findMany({
     where: { adminId: String(userId) },
      select: {
        id: true,
        slug: true,
        adminId: true,
        createdAt: true
      }
    });

    res.status(200).json({ rooms });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal server error" });
  }
});
;

export default router;