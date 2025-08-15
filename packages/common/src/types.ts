import {z} from 'zod'

export const Userschema = z.object({
    username: z.string(),
    password:z.string(),
    name:z.string()
})

export const signinSchema = z.object({
    username: z.string().min(4).max(10),
    password:z.string()
})

export const CreateRoomschema = z.object({
    name:z.string().min(5).max(20)
})