import mongoose from "mongoose";
const URI=process.env.MONGODB_URI;
if(!URI) throw new Error("MONGODB_URI .env.local faylida yo'q");
let cached=global.mongooseCache || (global.mongooseCache={conn:null,promise:null});
export default async function db(){if(cached.conn)return cached.conn;if(!cached.promise)cached.promise=mongoose.connect(URI).then(m=>m);cached.conn=await cached.promise;return cached.conn;}