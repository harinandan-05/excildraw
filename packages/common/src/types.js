"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateRoomschema = exports.signinSchema = exports.Userschema = void 0;
const zod_1 = require("zod");
exports.Userschema = zod_1.z.object({
    username: zod_1.z.string(),
    password: zod_1.z.string(),
    name: zod_1.z.string()
});
exports.signinSchema = zod_1.z.object({
    username: zod_1.z.string().min(4).max(10),
    password: zod_1.z.string()
});
exports.CreateRoomschema = zod_1.z.object({
    name: zod_1.z.string().min(5).max(20)
});
